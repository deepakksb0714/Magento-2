import React, { useState } from 'react';
import { useFormik } from 'formik';
import {
  Card,
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
} from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useNavigate } from 'react-router-dom';

const FileUpload = () => {
  const [step, setStep] = useState(1); // State to manage current step
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [importSuccess, setImportSuccess] = useState(false);
  const navigate = useNavigate();
  const [unsupportedFormatError, setUnsupportedFormatError] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  // Formik hook for form handling
  const formik = useFormik({
    initialValues: {
      file: null as File | null,
    },
    onSubmit: (values: { file: File | null }) => {
      if (values.file) {
        setUploadedFile(values.file);
        // Simulate API upload process or handle submission logic here
        // For demonstration, we just update the uploadedFile state
        navigate('/column-mapping');
      }
    },
    validate: (values: { file: File | null }) => {
      const errors: { file?: string } = {};
      if (!values.file) {
        errors.file = 'Required';
      }
      return errors;
    },
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.files) {
      const file = event.currentTarget.files[0];
      formik.setFieldValue('file', file);
      setSelectedFileName(file.name);
      const acceptedFormats = ['.csv', '.tsv'];
      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !acceptedFormats.includes(`.${extension}`)) {
        setUnsupportedFormatError(true);
      } else {
        setUnsupportedFormatError(false);
      }
    }
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          pageTitle="Get Recommendations"
          title="Get Recommendations"
        />
        <Row>
          <Col xl={12}>
            <Card>
              <Card.Body>
                <div className="p-2">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '20px',
                    }}
                  >
                    <a
                      href="/product-list"
                      onClick={() => console.log('Switch company clicked')}
                      style={{ paddingBottom: '30px', color: 'black' }}
                    >
                      WHAT YOU SELL AND BUY
                    </a>
                    <span
                      style={{ paddingRight: '10px', paddingBottom: '30px' }}
                    >
                      SCALARHUB{' '}
                    </span>
                  </div>
                  <h4 style={{ color: 'black' }}>
                    Upload your product catalog
                  </h4>
                  <p style={{ color: 'grey', marginTop: '20px' }}>
                    Upload a spreadsheet including a list of your products and
                    services that includes a description and unique item code.
                    If available, also include catalog numbers such as SKU, UPC,
                    EAN, or ASIN. Your spreadsheet must have fewer than 5,000
                    rows.
                  </p>
                  <div
                    style={{
                      border: 'solid',
                      borderColor: 'blue',
                      paddingTop: '10px',
                      paddingLeft: '10px',
                      marginTop: '50px',
                      marginBottom: '50px',
                    }}
                  >
                    <p>
                      Tip: For the best recommendations, upload a spreadsheet
                      with similar categories at the same time, for example all
                      clothing or all food.
                    </p>
                  </div>

                  <Form
                    onSubmit={formik.handleSubmit}
                    style={{
                      border: 'dotted',
                      paddingTop: '40px',
                      marginTop: '30px',
                      paddingBottom: '10px',
                    }}
                  >
                    <Form.Group
                      controlId="file"
                      style={{ textAlign: 'center' }}
                    >
                      <h5 style={{ color: 'black' }}>
                        Drag and drop file here
                      </h5>
                      <Form.Label
                        style={{ color: 'grey', fontWeight: 'light' }}
                      >
                        File types accepted: .csv, .tsv.
                      </Form.Label>
                      <br />
                      <div
                        style={{
                          position: 'relative',
                          overflow: 'hidden',
                          display: 'inline-block',
                          marginTop: '10px',
                        }}
                      >
                        <Button
                          variant=""
                          className="margin-top-sm icon-leading"
                        >
                          <span className="pad-right-xs"></span> Choose file
                          <input
                            type="file"
                            name="file"
                            onChange={handleFileChange}
                            onBlur={formik.handleBlur}
                            accept=".csv, .tsv"
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              opacity: 0,
                              cursor: 'pointer',
                            }}
                          />
                        </Button>
                        <Button type="submit" style={{ marginLeft: '20px' }}>
                          Submit
                        </Button>
                      </div>
                      {selectedFileName && (
                        <div style={{ marginTop: '10px', color: 'grey' }}>
                          Selected file: {selectedFileName}
                        </div>
                      )}
                      {formik.errors.file && formik.touched.file ? (
                        <div className="text-danger">{formik.errors.file}</div>
                      ) : null}
                    </Form.Group>
                    {unsupportedFormatError && (
                      <Alert
                        variant="danger"
                        style={{ textAlign: 'center', marginTop: '20px' }}
                      >
                        File format not supported. Please upload a .csv, .xls,
                        or .xlsx file.
                      </Alert>
                    )}
                  </Form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default FileUpload;
