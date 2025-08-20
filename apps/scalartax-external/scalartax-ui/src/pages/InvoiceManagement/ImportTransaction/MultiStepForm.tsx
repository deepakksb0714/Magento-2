import React, { useState, useRef, useEffect } from 'react';

import Progress from './Progress';
import { MultiStepFormRenderer } from './Screens/Util';
import { Step, Data } from './types';
import './MultiStepForm.css';
import { Link } from 'react-router-dom';
import { importTransaction as onImportTransaction } from '../../../slices/thunk';
import { useDispatch } from 'react-redux';
import { Form, Col } from 'react-bootstrap';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// Define the structure of the form ref
interface FormRefs {
  submit: () => Promise<any>; // The submit function must return a Promise
}

function Multi() {
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<Data>({});
  const [initialValues, setInitialValues] = useState<Data>({});
  const [file, setFile] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [showTemplateInput, setShowTemplateInput] = useState(false);
  const [transactionFile, setTransactionFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      template: false,
      templateName: '',
    },
    onSubmit: (values: any) => { },
  });
  // Initialize formRef with a default submit function
  const formRef = useRef<FormRefs>({
    submit: async () => true,
  });

  const updateFormData = (data: Partial<Data>) => {
    setFormData((prevData) => ({ ...prevData, ...data }));
  };

  const updateTemplate = (template: string) => {
    setFile(template);
  };

  const updateInitialValues = (values: Partial<Data>) => {
    setInitialValues((prevValues) => ({ ...prevValues, ...values }));
  };

  const updateFile = (file: File) => {
    const fileData = file || null;
    setTransactionFile(fileData);
  };

  const totalSteps = 6;

  const handleNext = async () => {
    if (formRef.current.submit) {
      try {
        const isValid = await formRef.current.submit();
        if (isValid) {
          // Check if the file is "savedTemplate" to jump directly to step 6
          if (file === 'savedTemplate') {
            setStep(6);
          } else {
            setStep((prev) =>
              prev < totalSteps ? ((prev + 1) as Step) : prev
            );
          }
        }
      } catch (error) {
        // Handle error if needed
      }
    } else {
      setStep((prev) => (prev < totalSteps ? ((prev + 1) as Step) : prev));
    }
  };

  const previousStep = () =>
    setStep((prev) => (prev > 1 ? ((prev - 1) as Step) : prev));

  const transformFormData = (formData: any) => {
    const { importSettings, requiredColumns, attributes, optionalColumns } =
      formData;

    // Transform each required column entry
    const transformedData = requiredColumns.map((item: any, index: number) => {
      // Get corresponding import settings by index
      const importSetting = importSettings[index];

      // Start with import settings
      let transformedObject: { [key: string]: any } = {
        templateName: formik.values.templateName,
        // Import settings - explicitly add these first
        entityCode: importSetting.entityCode,
        type: importSetting.type,
        processCode: importSetting.processCode,
        EntityUseCode: importSetting.entityUseCode,
        // Required columns
        'document code': item['document code'],
        date: item.date,
        'customer code': item['customer code'],
        'certificate code': item['certificate code'],
        'line number': item['line number'],
        'line amount': item['line amount'],
        'item code': item['item code'],
        originLocationCode: item.originLocationCode,
        destinationLocationCode: item.destinationLocationCode,
        // Coordinates
        originCoordinates: item.originCoordinates || {},
        destinationCoordinates: item.destinationCoordinates || {},

        // Addresses
        originAddress: {
          ...(item.originAddress || {}),
        },
        destinationAddress: {
          ...(item.destinationAddress || {}),
        },

        // Initialize attributes array with empty object
        attributes: [{}],
      };

      // Add any matching attributes
      if (attributes?.[index]) {
        // Spread all attributes dynamically
        Object.entries(attributes[index]).forEach(([key, value]) => {
          (transformedObject as any)[key] = value;
        });
      }

      // Add any matching optional columns
      if (optionalColumns?.[index]) {
        // Spread all optional columns dynamically
        Object.entries(optionalColumns[index]).forEach(([key, value]) => {
          (transformedObject as any)[key] = value;
        });
      }

      return transformedObject;
    });

    return transformedData;
  };
  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = event.target;
    setShowTemplateInput(checked);
    formik.setFieldValue('template', checked);
  };

  const transformData = (initialValues: any) => {
    const { importSettings, requiredColumns, attributes, optionalColumns } =
      initialValues;

    // Transform importSettings
    const newImportSettings = importSettings.columnMappings || importSettings;

    // Transform requiredColumns
    const newRequiredColumns = {
      requiredFields: requiredColumns.requiredFields,
      originAddress: requiredColumns.originAddress,
      originCoordinates: requiredColumns.originCoordinates,
      origin: requiredColumns.origin,
      originOption: requiredColumns.originOption,
      destinationAddress: requiredColumns.destinationAddress,
      destinationCoordinates: requiredColumns.destinationCoordinates,
    };

    // Transform attributes
    const newAttributes = attributes.values.attributesColumns;

    // Transform optionalColumns
    const newOptionalColumns = optionalColumns.values.optionalColumns;

    // Return the transformed object
    return {
      importSettings: newImportSettings,
      requiredColumns: newRequiredColumns,
      attributes: newAttributes,
      optionalColumns: newOptionalColumns,
    };
  };

  const handleSaveTemplate = async () => {
    const mappedColumns = transformData(initialValues);
    const templateData = {
      template_name: formik.values.templateName, // Dynamic template name
      mapped_columns: JSON.stringify(mappedColumns),
    };
    const formData = new FormData();
    formData.append('template[template_name]', templateData.template_name);
    formData.append('template[mapped_columns]', templateData.mapped_columns);
    if (transactionFile) {
      formData.append('template[transaction_file]', transactionFile); // Correctly append the file
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/scalarhubio/scalartax/templates',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
    } catch (err) { }
  };

  const handleSubmit = () => {
    const transformedData = transformFormData(formData);
    dispatch(onImportTransaction(transformedData));
    if (formik.values.templateName) {
      handleSaveTemplate();
    }
    navigate('/transaction-list');
  };

  return (
    <div className="container">
      <div className="progress_container">
        <Progress step={step} totalSteps={totalSteps} />
        {Array.from({ length: totalSteps }, (_, i) => (
          <div
            key={i}
            className={`${step >= i + 1 ? 'circle active' : 'circle'}`}
          >
            {i + 1}
            <span>
              {
                [
                  'Upload',
                  'Import settings',
                  'Required columns',
                  'Attributes',
                  'Optional columns',
                  'Review & save',
                ][i]
              }
            </span>
          </div>
        ))}
      </div>
      <div className="content">
        <hr />
        <MultiStepFormRenderer
          step={step}
          formData={formData}
          initialValues={initialValues}
          updateFormData={updateFormData}
          updateInitialValues={updateInitialValues}
          formRef={formRef}
          updateTemplateData={updateTemplate}
          updateFile={updateFile}
        />
      </div>
      <Form onSubmit={formik.handleSubmit}>
        <Col lg={6}>
          {step === totalSteps && file !== 'savedTemplate' && (
            <div>
              <h3 className="mt-4">Save as Template</h3>
              <p className="mt-2 custom-paragraph">
                This makes it faster the next time you import transactions using
                this file.
              </p>
              <Form.Group controlId="template">
                <Form.Check
                  type="checkbox"
                  label="Save this mapping as a template"
                  onChange={handleCheckboxChange}
                  checked={formik.values.template}
                />
              </Form.Group>
              {showTemplateInput && (
                <Col lg={4}>
                  <Form.Group controlId="templateName" className="mt-3">
                    <Form.Label>Template Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="templateName"
                      placeholder="Enter template name"
                      value={formik.values.templateName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        !!formik.errors.templateName &&
                        formik.touched.templateName
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.templateName}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              )}
            </div>
          )}
        </Col>
        <div className="btns">
          <div>
            <Link to="/transaction-list">
              <button className="btn btn-light"
                style={{ width: '100px' }}>
                <span>Cancel</span>
              </button>
            </Link>
          </div>
          <div>
            {step !== 1 &&
              (file !== 'savedTemplate' || step !== totalSteps) && (
                <button
                  className="btn btn-light"
                  onClick={previousStep}
                  style={{ width: '100px' }}
                >
                  Prev
                </button>
              )}

            {step < totalSteps ? (
              <button
                className="btn btn-primary"
                onClick={handleNext}
                style={{ width: '100px' }}
              >
                Next
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                style={{ width: '100px' }}
              >
                Submit
              </button>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
}

export default function MultiStepForm() {
  return <Multi />;
}