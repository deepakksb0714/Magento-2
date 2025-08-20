import React, {
  forwardRef,
  useImperativeHandle,
  useState,
  useEffect,
} from 'react';
import { Card, Col, Container, Row, Form, Alert } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import BreadCrumb from '../../../../Common/BreadCrumb';
import * as XLSX from 'xlsx';
import { addEntitiesLocations as onAddEntitiesLocations } from '../../../../slices/thunk';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';

const convertExcelDate = (serial: any) => {
  const utcDays = serial - 25567;
  const date = new Date(utcDays * 86400 * 1000);
  return date.toISOString().split('T')[0]; // Return date in YYYY-MM-DD format
};

interface PrimaryEntity {
  id: any;
  name: string;
  parent_entity_id: string | null;
}
interface Props {
  onSubmit: (data: any) => void;
  template: string | null;
  updateFile: (file: any) => void;
}

const ImportFile = forwardRef((props: Props, ref) => {
  document.title = 'Import Company Locations | Dashboard';

  const { onSubmit, template, updateFile } = props;
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const [showDiscard, setShowDiscard] = useState(false);
  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );
  const { entitiesList } = useSelector(selectEntitiesList);
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
  const validateFiles = (files: any[]) => {
    const errors: string[] = [];
    if (files.length === 0) {
      errors.push('No file selected. Please upload a file.');
      return errors;
    }

    files.forEach((file: any) => {
      // Check if the file is in an acceptable format
      const validExtensions = ['csv', 'xls', 'xlsx'];
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (!validExtensions.includes(fileExtension)) {
        errors.push(
          `File "${file.name}" is an invalid format. Please upload a .csv, .xls, or .xlsx file.`
        );
        return; // Skip further processing for this file
      }
    });

    return errors;
  };

  const handleAcceptedFiles = (files: any) => {
    const validationErrors = validateFiles(files);
    if (validationErrors.length > 0) {
      setValidationErrors(validationErrors);
      return; // Stop further processing if there are validation errors
    }

    // Proceed with processing if files are valid
    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );

    setSelectedFiles(files);
    updateFile(files);
    setValidationErrors([]);
    setShowDiscard(true);
    formik.setFieldValue('files', files);

    files.forEach((file: any) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const fileData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Check if the file is empty
        if (
          fileData.length === 0 ||
          fileData.every((row: any) =>
            row.every((cell: any) => cell === null || cell === '')
          )
        ) {
          setValidationErrors((prevErrors) => [
            ...prevErrors,
            `File "${file.name}" is empty. Please upload a valid file.`,
          ]);
          return;
        }

        // Separate header and rows
        const [header, ...rows] = fileData;

        // Filter out empty rows
        const filteredRows = rows.filter((row: any) =>
          row.some((cell: any) => cell !== null && cell !== '')
        );

        if (filteredRows.length === 0) {
          setValidationErrors((prevErrors) => [
            ...prevErrors,
            `File "${file.name}" contains only headers or empty rows.`,
          ]);
          return;
        }

        // Combine header and filtered rows
        const combinedData = [header, ...filteredRows];

        // Pass combined data including header to onSubmit
        onSubmit(combinedData);
      };

      reader.readAsArrayBuffer(file);
    });
  };

  const formik = useFormik({
    initialValues: {
      description: '',
      files: [] as any[],
    },
    validationSchema: Yup.object({
      files: Yup.array().of(
        Yup.mixed().test('fileType', 'File must be an object', (value: any) => {
          return value && typeof value === 'object';
        })
      ),
    }),
  });

  useImperativeHandle(ref, () => ({
    submit: async () => {
      await formik.handleSubmit();
      const errors: string[] = [];

      if (selectedFiles.length === 0) {
        errors.push('No file selected. Please upload a file.');
        setValidationErrors(errors);
        return false;
      }
      if (validationErrors.length > 0) {
        return false;
      }
      if (template === 'savedTemplate') {
        return template;
      }
      return true;
    },
  }));

  useEffect(() => {
    if (primaryEntity) {
      formik.setFieldValue('entity_id', primaryEntity.id);
    }
  }, [primaryEntity]);

  const formatBytes = (bytes: any, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleDiscard = () => {
    setSelectedFiles([]);
    setValidationErrors([]);
    setShowDiscard(false);
    formik.setFieldValue('files', []);
  };

  return (
    <React.Fragment>

        <Row>
          <Col xl={12}>
                <Form onSubmit={formik.handleSubmit}>
                  {selectedFiles.length === 0 ? (
                    <Dropzone
                      onDrop={(acceptedFiles: any) =>
                        handleAcceptedFiles(acceptedFiles)
                      }
                    >
                      {({ getRootProps, getInputProps }: any) => (
                        <div
                          className="dropzone dz-clickable text-center"
                          {...getRootProps()}
                        >
                          <input {...getInputProps()} />
                          <div className="dz-message needsclick">
                            <div className="mb-3">
                              <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                            </div>
                            <h4>Drag and drop</h4>
                            <h4>Upload your .csv, .xls, or .xlsx file</h4>
                          </div>
                        </div>
                      )}
                    </Dropzone>
                  ) : (
                    <div
                      className="d-flex justify-content-center align-items-center"
                      id="file-previews"
                      style={{ height: '150px' }}
                    >
                      {selectedFiles.map((f: any, i: number) => (
                        <Card
                          className="shadow-none border dz-processing dz-image-preview dz-success dz-complete text-center"
                          key={i + '-file'}
                        >
                          <div className="p-2">
                            <Row className="justify-content-center">
                              <Col className="text-center">
                                <Link
                                  to="#"
                                  className="text-muted font-weight-bold"
                                >
                                  {f.name}
                                </Link>
                                <p className="mb-0">
                                  <strong>{f.formattedSize}</strong>
                                </p>
                              </Col>
                            </Row>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}

                  {formik.errors.files && formik.touched.files && (
                    <div className="text-danger">{formik.errors.files}</div>
                  )}

                  {validationErrors.length > 0 && (
                    <div className="alert alert-danger mt-4">
                      <ul>
                        {validationErrors.map((error, index) => (
                          <li key={index}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {showDiscard && (
                    <div className="hstack gap-2 mt-4">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={handleDiscard}
                      >
                        Discard
                      </button>
                    </div>
                  )}
                </Form>
          </Col>
        </Row>
    </React.Fragment>
  );
});

export default ImportFile;
