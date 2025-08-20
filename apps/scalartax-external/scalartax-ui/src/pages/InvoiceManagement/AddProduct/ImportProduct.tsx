import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Form } from 'react-bootstrap';
import Dropzone, { DropzoneState } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import BreadCrumb from '../../../Common/BreadCrumb';
import * as XLSX from 'xlsx';
import { createSelector } from 'reselect';
import { addProducts as onAddProduct } from '../../../slices/thunk';

const convertExcelDate = (serial: any) => {
  const utcDays = serial - 25567;
  const date = new Date(utcDays * 86400 * 1000);
  return date.toISOString().split('T')[0];
};

interface PrimaryEntity {
  id: any;
  name: string;
}

const ImportProduct: React.FC = () => {
  document.title = 'Import Product | Dashboard ';

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
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
      const transformedProducts: any[] = [];

      selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          // Remove the header row
          const [header, ...rows] = jsonData;

          const attributeMappings = [
            { attribute_name: 'link', column: 6 },
            { attribute_name: 'image_link', column: 7 },
            { attribute_name: 'condition', column: 8 },
            { attribute_name: 'hs_hint', column: 10 },
            { attribute_name: 'google_product_category', column: 12 },
            { attribute_name: 'availability', column: 13 },
            { attribute_name: 'sale_price', column: 14 },
            { attribute_name: 'sale_price_effective_date', column: 15 },
            { attribute_name: 'gtin', column: 16 },
            { attribute_name: 'mpn', column: 18 },
            { attribute_name: 'material', column: 19 },
            { attribute_name: 'shipping', column: 20 },
            { attribute_name: 'color', column: 21 },
            { attribute_name: 'gender', column: 24 },
            { attribute_name: 'age_group', column: 25 },
            { attribute_name: 'size', column: 26 },
            { attribute_name: 'shipping_weight', column: 27 },
            { attribute_name: 'asin', column: 9 },
            { attribute_name: 'ean', column: 11 },
            { attribute_name: 'height', column: 29 },
            { attribute_name: 'price', column: 17 },
            { attribute_name: 'sku', column: 22 },
            { attribute_name: 'summary', column: 23 },
            { attribute_name: 'upc', column: 28 },
            { attribute_name: 'width', column: 5 },
          ];

          rows.forEach((row: any) => {
            if (row.length >= 12) {
              const productAttributes = attributeMappings.map((mapping) => ({
                attribute_name: mapping.attribute_name,
                attribute_value: row[mapping.column] || '',
                attribute_unit_of_measure: '',
              }));

              const product = {
                product_code: row[0] || '',
                entity_id: (primaryEntity && primaryEntity.id) || '',
                product_group: row[1] || '',
                category: row[2] || '',
                description: row[3] || '',
                tax_code: row[4] || '',
                product_attributes: productAttributes,
              };

              transformedProducts.push(product);

              if (!row[0])
                errors.push(
                  `Row ${rows.indexOf(row) + 2}: ProductCode is required`
                );
              if (!row[3])
                errors.push(
                  `Row ${rows.indexOf(row) + 2}: Description is required`
                );
              if (!row[4])
                errors.push(
                  `Row ${rows.indexOf(row) + 2}: TaxCode is required`
                );
            } else {
              errors.push(`Row ${rows.indexOf(row) + 2}: Missing data`);
            }
          });

          setValidationErrors(errors);

          dispatch(onAddProduct({ products: transformedProducts }));
          navigate('/product-list');
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
    const file = files[0];
    if (file.name !== 'ImportProductsTemplate-CrossBorder.xlsx') {
      setValidationErrors([
        "We couldn't import this file. This might be due to:",
        ' An unrecognized file format',
        ' Extra commas in your file',
        " Missing column headers, or headers that don't match our template exactly",
        'How do I fix the problem?',
        'If there is an error file, download it and scroll to the last column, where you will find error information that can help you make changes that will lead to a successful import',
      ]);
      setSelectedFiles([]);
      formik.setFieldValue('files', []);
      return;
    }

    // Clear validation errors if the correct file is selected
    setValidationErrors([]);

    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setSelectedFiles(files);
    formik.setFieldValue('files', files);
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
      <div className="page-content" style={{ padding: 'unset' }}>
        <Container fluid>
          {/* <BreadCrumb pageTitle="Product" title="Import Product" /> */}

          <Row>
            <Col xl={12}>
              <Row>
                <Col xl={12}>
                  {/* <h2 stSyle={{ textAlign: 'left' }}>Import products</h2> */}
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md={12}>
                  <Form.Label>
                    For best results and fewer errors, use the template in our
                    ProductImportToolkit
                  </Form.Label>
                </Col>
              </Row>

              <Form onSubmit={formik.handleSubmit}>
                <a href="/ImportProductsTemplate-CrossBorder.xlsx" download>
                  Download the product import toolkit
                </a>

                <div className="mt-4">
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
                </div>

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
                  <button
                    type="button"
                    className="btn btn-light gap-2"
                    onClick={handleDiscard}
                  >
                    Discard
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit
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

export default ImportProduct;
