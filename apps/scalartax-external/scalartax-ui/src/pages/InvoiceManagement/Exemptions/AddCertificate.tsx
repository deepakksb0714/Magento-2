import React, { useState, useCallback, useEffect } from 'react';
import { Col, Container, Row, Form, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useFormik } from 'formik';
import { useDropzone } from 'react-dropzone';
import { countryStateData } from '../../../Common/data/countryState';
import { getCustomerList as onGetCustomerList } from '../../../slices/thunk';
import { getAccount as onGetAccount } from '../../../slices/thunk';
import { addExemptionCertificates as onAddExemptionCertificate } from '../../../slices/thunk';
import { addCustomers as onAddCustomer } from '../../../slices/thunk';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import Select from 'react-select';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';
import {  exemption_reasonOptions } from './exemptionReasons';
import { certificateLabelOptions } from './certificateLabelOptions';
import {business_typeOptions,statesRequiringBusinessType} from './business_type'
import { values } from 'lodash';

// Define types
interface Customer {
  id: string;
  customer_name: string;
  entity_id: string;
}

interface PrimaryEntity {
  id: string;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}

interface CustomerOption {
  value: string;
  label: string;
  entity_id: string;
}

interface RegionOption {
  value: string;
  label: string;
}
interface RegionField {
  tax_type?: string;
  tax_type_id?: string;
  expiration_date?: string;
}

interface RegionFields {
  [region: string]: RegionField;
}

const regionOptions: { [country: string]: RegionOption[] } = Object.keys(countryStateData).reduce((acc, country) => {
  acc[country] = countryStateData[country].map((region: any) => ({
    value: region.code,
    label: region.name,
  }));
  return acc;
}, {} as { [country: string]: RegionOption[] });


const AddCertificate = () => {
  document.title = 'Certificate | Dashboard';

  const [showPurchaseOrder, setShowPurchaseOrder] = useState(false);
  const [showOtherCustom, setShowOtherCustom] = useState(false);
  const [showBusinessType, setShowBusinessType] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showIdFields, setShowIdFields] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [isCustomerPreSelected, setIsCustomerPreSelected] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const location = useLocation();
  const { customerId, customerName } = location.state || {};
  const { customerData } = location.state || {};
  const isNewCustomer = !!customerData;
  const [accountId, setAccountId] = useState('');
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [regionFields, setRegionFields] = useState<RegionFields>({});
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const selectCustomerList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      customerList: invoices.customerList,
    })
  );

  const { customerList } = useSelector(selectCustomerList);

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);
  // Set the primary entity based on the entities list
  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find(
        (entity: any) => entity.is_default
      );
      if (defaultEntity) {
        setPrimaryEntity(defaultEntity);
      } else {
        setPrimaryEntity(entitiesList[0]);
      }
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

  // Filter customers based on the primary entity
  useEffect(() => {
    if (customerList && primaryEntity) {
      setCustomers(customerList);
      setIsLoading(false);
    } else {
      setCustomers([]);
      setIsLoading(false);
    }
  }, [customerList, primaryEntity]);

  // Fetch the account api data
  useEffect(() => {
    dispatch(onGetAccount() as any).then((accountResponse: any) => {
      const accountData = accountResponse.payload[0];
      setAccountId(accountData.id);
      formik.setFieldValue('account_id', accountData.id);
    });
  }, [dispatch]);

  useEffect(() => {
    if (customerId && customerName) {
      formik.setFieldValue('certificate_customer_name', customerName);
      setSelectedCustomerId(customerId);
      setIsCustomerPreSelected(true);
    }
  }, [customerId, customerName]);

  useEffect(() => {
    dispatch(onGetCustomerList() as any);
  }, [dispatch]);

  const [customerOptions, setCustomerOptions] = useState<CustomerOption[]>([]);
  useEffect(() => {
    if (customers.length > 0) {
      const options = customers.map((customer: Customer) => ({
        value: customer.id,
        label: customer.customer_name,
        entity_id: customer.entity_id,
      }));
      setCustomerOptions(options);
    }
  }, [customers]);

  const formik = useFormik({
    initialValues: {
      certificate_customer_name: '',
      code: '',
      entity_id: (primaryEntity && primaryEntity.id) || '',
      customer_id: '',
      account_id: '',
      file: null,
      description: '',
      tax_type: '',
      tax_type_id: '',
      comment: '',
      is_valid: 'valid',
      effective_date: '',
      expiration_date: '',
      exemption_reason: '',
      certificate_labels: [],
      exemption_limit: false,
      state: [],
      purchase_order_number: '',
      business_type: '',
    },
    validationSchema: Yup.object({
      certificate_customer_name: Yup.string().required(
        'Customer name is required'
      ),
      code: Yup.string().required(
        'Certificate code is required'
      ),
      file: Yup.mixed().required('Certificate file is required'),
      effective_date: Yup.string().required('Effective date is required')
    }),

    onSubmit: (values: any) => {    
      const exemption_certificate = new FormData();
      exemption_certificate.append(
        'exemption_certificate[certificate_customer_name]',
        values.certificate_customer_name
      );
      exemption_certificate.append(
        'exemption_certificate[code]',
        values.code
      );
      exemption_certificate.append(
        'exemption_certificate[description]',
        values.description
      );
      exemption_certificate.append(
        'exemption_certificate[business_type]',
        values.business_type
      );
      exemption_certificate.append(
        'exemption_certificate[tax_type]',
        values.tax_type
      );
      exemption_certificate.append(
        'exemption_certificate[entity_id]',
        values.entity_id
      );
      exemption_certificate.append(
        'exemption_certificate[account_id]',
        accountId
      );
      if (values.file) {
        exemption_certificate.append(
          'exemption_certificate[file][file]',
          values.file.file
        );
        exemption_certificate.append(
          'exemption_certificate[file][name]',
          values.file.name
        );
        exemption_certificate.append(
          'exemption_certificate[file][size]',
          values.file.size
        );
        exemption_certificate.append(
          'exemption_certificate[file][type]',
          values.file.type
        );
        exemption_certificate.append(
          'exemption_certificate[file][content]',
          values.file.content
        );
      }
      exemption_certificate.append(
        'exemption_certificate[tax_type_id]',
        values.tax_type_id
      );
      exemption_certificate.append(
        'exemption_certificate[comment]',
        values.comment
      );
      exemption_certificate.append(
        'exemption_certificate[is_valid]',
        values.is_valid
      );
      exemption_certificate.append(
        'exemption_certificate[certificate_labels]',
        values.certificate_labels.map((label: any) => label.value).join(',')
      );
      exemption_certificate.append(
        'exemption_certificate[purchase_order_number]',
        values.purchase_order_number
      );
      exemption_certificate.append(
        'exemption_certificate[exemption_limit]',
        values.exemption_limit
      );
      exemption_certificate.append(
        'exemption_certificate[expiration_date]',
        values.expiration_date
      );
      exemption_certificate.append(
        'exemption_certificate[customer_id]',
        selectedCustomerId
      );
      exemption_certificate.append(
        'exemption_certificate[effective_date]',
        values.effective_date
      );
      exemption_certificate.append(
        'exemption_certificate[exemption_reason]',
        values.exemption_reason
      );
      exemption_certificate.append(
        'exemption_certificate[regions]',
        values.state.join(',')
      );
      dispatch(onAddExemptionCertificate(exemption_certificate));
      navigate('/certificates', { state: { activeTab: 'Certificate List' } });
      formik.resetForm();
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        const { name, size, type } = file;

        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result?.toString().split(',')[1];
          const fileData = {
            file,
            name,
            size,
            type,
            content: base64Data, // Add the base64 content here
          };
          formik.setFieldValue('file', fileData);
          setPreviewUrl(reader.result as string); // For previewing images
        };
        reader.readAsDataURL(file);
      }
    },
    [formik]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
  });

  const handleRemoveFile = () => {
    formik.setFieldValue('file', null);
    setPreviewUrl(null);
  };

  // Function to create both customer and certificate
  const createCustomerAndCertificate = async (certificateData: any, isValid: boolean) => {
    try {
      let customerId;

      // If we have customerData, create the customer first
      if (isNewCustomer) {
        const customerResponse = await dispatch(onAddCustomer({ customer: customerData }) as any);
        if (customerResponse.payload) {
          customerId = customerResponse.payload.id;
        } else {
          throw new Error('Failed to create customer');
        }
      } else {
        // Use existing customer ID if not creating new customer
        customerId = selectedCustomerId;
      }

         // Add regionsData object here
      const regionsData: Record<string, RegionField> = {};

      Object.keys(regionFields).forEach(region => {
        if (formik.values.state.includes(region)) {
          regionsData[region] = regionFields[region];
        }
      });

      // Prepare certificate data with the customer ID
      const exemption_certificate = new FormData();
      exemption_certificate.append('exemption_certificate[certificate_customer_name]', certificateData.certificate_customer_name);
      exemption_certificate.append('exemption_certificate[code]', certificateData.code);
      exemption_certificate.append('exemption_certificate[description]', certificateData.description);
      exemption_certificate.append('exemption_certificate[business_type]', certificateData.business_type);
      exemption_certificate.append('exemption_certificate[entity_id]', certificateData.entity_id);
      exemption_certificate.append('exemption_certificate[account_id]', accountId);

      if (certificateData.file) {
        exemption_certificate.append('exemption_certificate[file][file]', certificateData.file.file);
        exemption_certificate.append('exemption_certificate[file][name]', certificateData.file.name);
        exemption_certificate.append('exemption_certificate[file][size]', certificateData.file.size.toString());
        exemption_certificate.append('exemption_certificate[file][type]', certificateData.file.type);
        exemption_certificate.append('exemption_certificate[file][content]', certificateData.file.content);
      }
      exemption_certificate.append('exemption_certificate[regions_data]', JSON.stringify(regionsData));
      exemption_certificate.append('exemption_certificate[comment]', certificateData.comment);

      exemption_certificate.append(
        'exemption_certificate[certificate_labels]',
        certificateData.certificate_labels.map((label: any) => label.value).join(',')
      );

      exemption_certificate.append('exemption_certificate[purchase_order_number]', certificateData.purchase_order_number);
      exemption_certificate.append('exemption_certificate[exemption_limit]', certificateData.exemption_limit.toString());
      exemption_certificate.append(
        'exemption_certificate[customer_id]',
        selectedCustomerId
      );
      exemption_certificate.append('exemption_certificate[effective_date]', certificateData.effective_date);
      exemption_certificate.append('exemption_certificate[exemption_reason]', certificateData.exemption_reason);
      exemption_certificate.append('exemption_certificate[regions]', certificateData.state.join(','));

      exemption_certificate.append('exemption_certificate[customer_id]', customerId);
      exemption_certificate.append('exemption_certificate[is_valid]', isValid ? 'valid' : 'invalid');

      // Create the certificate
      await dispatch(onAddExemptionCertificate(exemption_certificate) as any);    
        navigate('/certificates', { state: { activeTab: 'Certificate List' } });
    } catch (error) {
      console.error('Error creating customer and certificate:', error);
      // Handle error appropriately
    }
  };

  // Update form submission handlers
  const handleSaveValid = () => {
    if (formik.isValid) {
      createCustomerAndCertificate(formik.values, true);
    } else {
      formik.handleSubmit();
    }
  };

  const handleSaveInvalid = () => {
    if (formik.isValid) {
      createCustomerAndCertificate(formik.values, false);
    } else {
      formik.handleSubmit();
    }
  };

  // Update useEffect for pre-filled customer data
  useEffect(() => {
    if (customerData) {
      formik.setFieldValue('certificate_customer_name', customerData.customer_name);
      setSelectedCustomerId('');
      setIsCustomerPreSelected(true);
    }
  }, [customerData]);

  return (
    <React.Fragment>
      <div style={{marginBottom:"50px"}}>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <Form onSubmit={formik.handleSubmit}>
                <Row className="mt-3">
                  <Col md="6">
                    <Form.Group controlId="certificate_customer_name" >
                      <Form.Label>Customers<span className="text-danger"> *</span></Form.Label>
                      {isCustomerPreSelected ? (
                        <Form.Control
                          type="text"
                          value={formik.values.certificate_customer_name}
                          disabled
                        />
                      ) : (
                        <Select
                          options={customerOptions}
                          name="certificate_customer_name"
                          onChange={(selectedOption: CustomerOption | null) => {
                            if (selectedOption) {
                              formik.setFieldValue(
                                'certificate_customer_name',
                                selectedOption.label
                              );
                              setSelectedCustomerId(selectedOption.value);
                              formik.setFieldValue(
                                'entity_id',
                                selectedOption.entity_id
                              );
                            } else {
                              formik.setFieldValue(
                                'certificate_customer_name',
                                ''
                              );
                              formik.setFieldValue('entity_id', '');
                              setSelectedCustomerId('');
                            }
                          }}
                          value={customerOptions.find(
                            (option: CustomerOption) =>
                              option.label ===
                              formik.values.certificate_customer_name
                          )}
                          placeholder="Search customers..."
                          className={formik.touched.certificate_customer_name && formik.errors.certificate_customer_name ? 'is-invalid' : ''}
                        />
                      )}
                      {formik.touched.certificate_customer_name && formik.errors.certificate_customer_name && (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.certificate_customer_name}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group className='mt-4'>
                      <Form.Label htmlFor="customer_code">
                        Certificate code<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="code"
                        name="code"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.code}
                        isInvalid={
                          formik.touched.code &&
                          !!formik.errors.code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.code}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    {!formik.values.file ? (
                      <div
                        {...getRootProps()}
                        style={{
                          border: '2px dashed #cccccc',
                          padding: '20px',
                          textAlign: 'center',
                          cursor: 'pointer',
                          backgroundColor: isDragActive ? '#e9f7fe' : '#f8f9fa',
                        }}
                      >
                        <input {...getInputProps()} />
                        {isDragActive ? (
                          <h1>Drop the certificate here...</h1>
                        ) : (
                          <p>
                            <h2>Drag and drop certificate here</h2>
                            <br />
                            Supported file formats include .pdf, .gif, .jpeg,
                            and .png
                            <br />
                            <strong>or click to select file</strong>
                          </p>
                        )}
                      </div>
                    ) : (
                      <div className="mt-3">
                        <p>Selected file: {formik.values.file.name}</p>
                        {previewUrl &&
                          formik.values.file.type.startsWith('image/') && (
                            <img
                              src={previewUrl}
                              alt="Preview"
                              style={{
                                maxWidth: '100%',
                                maxHeight: '200px',
                              }}
                            />
                          )}
                        <Button variant="link" onClick={handleRemoveFile}>
                          Remove file
                        </Button>
                      </div>
                    )}
                    {formik.touched.file && formik.errors.file && (
                      <div className="text-danger mt-2">
                        {formik.errors.file}
                      </div>
                    )}
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md="6">
                    <Form.Label htmlFor="state">
                      Regions covered by this certificate
                    </Form.Label>
                    <Select<RegionOption, true>
                      className="basic-multi-select"
                      classNamePrefix="select"
                      id="state"
                      name="state"
                      options={Object.values(regionOptions).flat()} // Flatten all region options from all countries
                      isMulti
                      onChange={(newValue: any, actionMeta: any) => {
                        const selectedValues = newValue.map((option: RegionOption) => option.value);
                        formik.setFieldValue('state', selectedValues);
                        setSelectedRegion(selectedValues);

                        // Check if any selected region requires a business type
                        const requiresBusinessType = selectedValues.some((state: string) =>
                          statesRequiringBusinessType.some((region) => region.code === state)
                        );
                        setShowBusinessType(requiresBusinessType);
                      }}
                      value={formik.values.state.map((value: string) =>
                        Object.values(regionOptions).flat().find(
                          (option: RegionOption) => option.value === value
                        )
                      )}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="exemption_reason">
                      Reason for the exemption
                    </Form.Label>
                    <Form.Control
                      className="form-select"
                      as="select"
                      id="exemption_reason"
                      name="exemption_reason"
                      onChange={(e) => {
                        formik.handleChange(e);
                        setShowIdFields(e.target.value !== '');
                        setShowOtherCustom(e.target.value === 'Other/custom');
                      }}
                      value={formik.values.exemption_reason}
                    >
                      <option value="">Select</option>
                      {exemption_reasonOptions.map((reason) => (
                        <option key={reason} value={reason}>
                          {reason}
                        </option>
                      ))}
                    </Form.Control>
                  </Col>
                </Row>
                {showOtherCustom && (
                  <Row className="mt-3">
                    <Col md="6">
                      <Form.Group controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          type="text"
                          id="description"
                          name="description"
                          onChange={formik.handleChange}
                          value={formik.values.description}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                {showBusinessType && (
                  <Row className="mt-3">
                    <Col md="6">
                      <Form.Group controlId="business_type">
                        <Form.Label>Business type</Form.Label>
                        <Form.Control
                          className="form-select"
                          as="select"
                          id="business_type"
                          name="business_type"
                          onChange={formik.handleChange}
                          value={formik.values.business_type}
                        >
                          <option value="">Select</option>
                          {business_typeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                {formik.values.exemption_reason && (
                  <>
                    {Array.isArray(selectedRegion) && selectedRegion.length > 0 && (
                      <Row className="mt-3">
                        {selectedRegion.map((region, index) => (
                          <Col md="6" key={index}>
                            <div
                              style={{
                                border: '2px dashed #cccccc',
                                padding: '20px',
                                textAlign: 'center',
                                backgroundColor: isDragActive ? '#e9f7fe' : '#f8f9fa',
                              }}
                            >
                              <Row className="mb-3">
                                <Col>
                                  <strong>{region}</strong>
                                </Col>
                              </Row>
                              <Row>
                                <Col md="6">
                                  <div>
                                    <Form.Label htmlFor={`tax_type_${region}`}>
                                      Type of ID
                                    </Form.Label>
                                    <Form.Control
                                      as="select"
                                      id={`tax_type_${region}`}
                                      name={`tax_type_${region}`}
                                      className="form-select"
                                      onChange={(e) => {
                                        // Update region-specific field
                                        setRegionFields(prev => ({
                                          ...prev,
                                          [region]: {
                                            ...prev[region],
                                            tax_type: e.target.value
                                          }
                                        }));
                                      }}
                                      value={regionFields[region]?.tax_type || ''}
                                    >
                                      <option value="Tax ID Number">Tax ID Number</option>
                                      <option value="Driver's license">Driver's license</option>
                                      <option value="FEIN">FEIN</option>
                                      <option value="Foreign diplomat number">Foreign diplomat number</option>
                                    </Form.Control>
                                  </div>
                                </Col>

                                <Col md="6">
                                  <Form.Label htmlFor={`tax_type_id_${region}`}>
                                    State-issued ID number
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id={`tax_type_id_${region}`}
                                    name={`tax_type_id_${region}`}
                                    onChange={(e) => {
                                      // Update region-specific field
                                      setRegionFields(prev => ({
                                        ...prev,
                                        [region]: {
                                          ...prev[region],
                                          tax_type_id: e.target.value
                                        }
                                      }));
                                    }}
                                    value={regionFields[region]?.tax_type_id || ''}
                                  />
                                </Col>
                              </Row>
                              <div className="mt-3">
                                <button
                                  id={`validate-tax-id-btn-${region}`}
                                  title="Validate Tax ID"
                                  className="link inline font-semibold"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'blue',
                                  }}
                                >
                                  <span className="md-left-sm">
                                    Verify taxpayer ID
                                  </span>
                                </button>
                              </div>
                              <Row>
                                <Col md="6">
                                  <Form.Group controlId={`expiration_date_${region}`}>
                                    <Form.Label>Expiration Date</Form.Label>
                                    <Form.Control
                                      type="date"
                                      name={`expiration_date_${region}`}
                                      onChange={(e) => {
                                        // Update region-specific field
                                        setRegionFields(prev => ({
                                          ...prev,
                                          [region]: {
                                            ...prev[region],
                                            expiration_date: e.target.value
                                          }
                                        }));
                                      }}
                                      value={regionFields[region]?.expiration_date || ''}
                                    />
                                  </Form.Group>
                                </Col>
                              </Row>
                            </div>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </>
                )}

                <Row className="mt-4">
                  <Col md="12">
                    <Form.Group controlId="exemption_limit">
                      <Form.Check
                        type="checkbox"
                        label="Limit this exemption to one document or purchase order"
                        name="exemption_limit"
                        onChange={(e) => {
                          formik.handleChange(e);
                          setShowPurchaseOrder(e.target.checked);
                        }}
                        checked={formik.values.exemption_limit}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                {showPurchaseOrder && (
                  <Row className="mt-3">
                    <Col md="6">
                      <Form.Group controlId="purchase_order_number">
                        <Form.Label>
                          Purchase order or invoice number
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="purchase_order_number"
                          onChange={formik.handleChange}
                          value={formik.values.purchase_order_number}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}

                <Row className="mt-4">
                  <Col md="12">
                    <Form.Group controlId="comment">
                      <Form.Label onClick={() => setShowComment(true)}>
                        <span style={{ color: 'blue', cursor: 'pointer' }}>
                          + Add a comment
                        </span>
                      </Form.Label>
                      {showComment && (
                        <Form.Control
                          as="textarea"
                          name="comment"
                          onChange={formik.handleChange}
                          value={formik.values.comment}
                        />
                      )}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="certificate_labels">
                      Certificate labels
                    </Form.Label>
                    <Select
                      className="basic-multi-select"
                      classNamePrefix="select"
                      id="certificate_labels"
                      name="certificate_labels"
                      isMulti
                      options={certificateLabelOptions.map((label) => ({
                        value: label,
                        label: label,
                      }))}
                      onChange={(selectedOptions: any) =>
                        formik.setFieldValue(
                          'certificate_labels',
                          selectedOptions
                        )
                      }
                      value={formik.values.certificate_labels}
                    />
                  </Col>

                  <Col md="6">
                    <Form.Group controlId="effective_date">
                      <Form.Label>Effective <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="date"
                        name="effective_date"
                        onChange={formik.handleChange}
                        value={formik.values.effective_date}
                        isInvalid={
                          formik.touched.effective_date &&
                          !!formik.errors.effective_date
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.effective_date}
                      </Form.Control.Feedback>

                    </Form.Group>

                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md="2">
                    <Button type="button" onClick={handleSaveValid}>
                      Save valid
                    </Button>
                  </Col>
                  <Col md="2">
                    <Button type="button" onClick={handleSaveInvalid}>
                      Save invalid
                    </Button>
                  </Col>
                  <Col md="2">
                    <button
                      type="button"
                      className="btn btn-light"
                      style={{ width: '100px' }}
                      onClick={() => {
                        formik.resetForm();
                      }}
                    >
                      Discard
                    </button>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddCertificate;
