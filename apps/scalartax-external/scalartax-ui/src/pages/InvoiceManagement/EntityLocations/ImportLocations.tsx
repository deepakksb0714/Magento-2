import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form } from 'react-bootstrap';
import Dropzone from 'react-dropzone';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate, Link } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';
import * as XLSX from 'xlsx';
import { addEntitiesLocations as onAddEntitiesLocations } from '../../../slices/thunk';
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

const ImportLocationsHistory: React.FC = () => {
  document.title = 'Import Company Locations | Dashboard ';

  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );

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
        console.log(primaryEntity);
      } else {
        setPrimaryEntity(entitiesList[0]);
      }
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

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
    onSubmit: (values: any) => {
      const errors: string[] = [];
      const transformedLocations: any[] = [];

      selectedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          console.log('Imported File Data:', jsonData);
          // Remove the header row
          const [header, ...rows] = jsonData;

          rows.forEach((row: any) => {
            // Ensure that row has enough elements
            if (row.length >= 15) {
              const location = {
                location_code: row[1] || '',
                entity_id: (primaryEntity && primaryEntity.id) || '', // Set this to the correct value if you have it
                friendly_name: '',
                description: row[2] || '',
                address_type_id: row[3] || '',
                address_category_id: row[4] || '',
                isPrimaryAddress: row[13] === 'TRUE' || false,
                country: row[12] || '',
                line1: row[5] || '',
                line2: row[6] || '',
                line3: row[7] || '',
                city: row[8] || '',
                county: row[9] || '',
                region: row[10] || '',
                postal_code: row[11] || '',
                is_default: row[13] || '',
                is_registered: row[14] || '',
                dba_name: row[15] || '',
                outlet_name: row[16] || '',
                start_date: row[26] ? convertExcelDate(row[26]) : '',
                end_date: row[27] ? convertExcelDate(row[27]) : '',
                location_attributes: [
                  {
                    attribute_name: row[17] || '',
                    attribute_value: row[18] || '',
                    attribute_unit_of_measure: row[19] || '',
                  },
                  {
                    attribute_name: row[20] || '',
                    attribute_value: row[21] || '',
                    attribute_unit_of_measure: row[22] || '',
                  },
                  {
                    attribute_name: row[23] || '',
                    attribute_value: row[24] || '',
                    attribute_unit_of_measure: row[25] || '',
                  },
                ],
              };

              transformedLocations.push(location);

              if (!row[1])
                errors.push(
                  `Row ${rows.indexOf(row) + 2}: LocationCode is required`
                );
              if (!row[3])
                errors.push(
                  `Row ${rows.indexOf(row) + 2}: AddressTypeId is required`
                );
              // Add more validation checks as needed
            } else {
              errors.push(`Row ${rows.indexOf(row) + 2}: Missing data`);
            }
          });

          setValidationErrors(errors);

          dispatch(onAddEntitiesLocations({ locations: transformedLocations }));
          navigate('/locations');
        };

        reader.readAsArrayBuffer(file);
      });
    },
  });
  useEffect(() => {
    if (primaryEntity) {
      formik.setFieldValue('entity_id', primaryEntity.id);
    }
  }, [primaryEntity]);
  const handleAcceptedFiles = (files: any) => {
    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(files);
    formik.setFieldValue('files', files);

    // Log the accepted files
    console.log('Accepted Files:', files);
  };

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
    formik.setFieldValue('files', []);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Locations" title="Import Entity Locations" />
          <Row className="mt-3">
            <Col xl={12}>
              <Form onSubmit={formik.handleSubmit}>
                <div className="flex items-center space-x-4 mb-3">
                  <span className="font-semibold">
                    LOCATIONS | DEFAULT entity
                  </span>
                  <Link
                    to="/entities"
                    className="text-blue-500 hover:underline flex items-center"
                  >
                    <span className="mr-1" style={{ paddingLeft: '20px' }}>
                      🔗
                    </span>
                    Switch entity
                  </Link>
                </div>
                <h6>
                  For best results and fewer errors, use the template in our
                  toolkit
                </h6>
                <a href="/ScalarHubEntityLocationImportToolkit.zip" download>
                  Download the location import toolkit
                </a>

                <br />
                <br />

                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Validate the addresses of the locations"
                  />
                </Form.Group>

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

                {formik.errors.files && formik.touched.files ? (
                  <div className="text-danger">{formik.errors.files}</div>
                ) : null}

                <div className="list-unstyled mb-0" id="file-previews">
                  {selectedFiles.map((f: any, i: number) => (
                    <Card
                      className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                      key={i + '-file'}
                    >
                      <div className="p-2">
                        <Row className="align-items-center">
                          <Col className="col-auto">
                            <img
                              data-dz-thumbnail=""
                              height="80"
                              className="avatar-sm rounded bg-light"
                              alt={f.name}
                              src={f.preview}
                            />
                          </Col>
                          <Col>
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

                {validationErrors.length > 0 && (
                  <div className="alert alert-danger mt-4">
                    <ul>
                      {validationErrors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="hstack gap-2 mt-4">
                  <button type="submit" className="btn btn-primary">
                    Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-light"
                    onClick={handleDiscard}
                  >
                    Discard
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ImportLocationsHistory;
