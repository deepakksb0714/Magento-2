import React from 'react';
import { useFormik } from 'formik';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useNavigate } from 'react-router-dom';

const ColumnMapping = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      itemCodeColumn: '',
      itemDescriptionColumn: '',
      skuColumn: '',
      upcColumn: '',
      eanColumn: '',
      asinColumn: '',
    },
    onSubmit: (values: any) => {
      navigate('/category-selection');
    },
  });

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
                <Button
                  variant="light"
                  onClick={() => navigate('/file-upload')}
                  style={{ marginBottom: '10px', color: 'red' }}
                >
                  <i className="bi bi-arrow-left"></i> Back
                </Button>
                <div className="p-2">
                  <h5 style={{ color: 'black' }}>Map your columns</h5>
                  <p>Map your columns to our categories.</p>

                  <form onSubmit={formik.handleSubmit}>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '500px',
                      }}
                    >
                      <label>Item code</label>
                      <small>
                        Select the column that includes your item codes
                      </small>
                      <select
                        className="form-select"
                        id="itemCodeColumn"
                        name="itemCodeColumn"
                        value={formik.values.itemCodeColumn}
                        onChange={formik.handleChange}
                      >
                        <option value="">ITEM CODE</option>
                        <option value="DESCRIPTION">DESCRIPTION</option>
                        <option value="CATEGORY">CATEGORY</option>
                        <option value="ITEM GROUP">ITEM GROUP</option>
                        <option value="TAX CODE">TAX CODE</option>
                      </select>
                    </div>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '500px',
                      }}
                    >
                      <label>Item description</label>
                      <small>
                        Select the column that includes your Item description
                      </small>
                      <select
                        className="form-select"
                        id="itemDescriptionColumn"
                        name="itemDescriptionColumn"
                        value={formik.values.itemDescriptionColumn}
                        onChange={formik.handleChange}
                      >
                        <option value="">ITEM CODE</option>
                        <option value="DESCRIPTION">DESCRIPTION</option>
                        <option value="CATEGORY">CATEGORY</option>
                        <option value="ITEM GROUP">ITEM GROUP</option>
                        <option value="TAX CODE">TAX CODE</option>
                      </select>
                    </div>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '500px',
                      }}
                    >
                      <label>SKU Optional</label>
                      <small>Select the column that includes your SKUs</small>
                      <select
                        className="form-select"
                        id="skuColumn"
                        name="skuColumn"
                        value={formik.values.skuColumn}
                        onChange={formik.handleChange}
                      >
                        <option value="">ITEM CODE</option>
                        <option value="DESCRIPTION">DESCRIPTION</option>
                        <option value="CATEGORY">CATEGORY</option>
                        <option value="ITEM GROUP">ITEM GROUP</option>
                        <option value="TAX CODE">TAX CODE</option>
                      </select>
                    </div>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '500px',
                      }}
                    >
                      <label>UPC Optional</label>
                      <small>Select the column that includes your UPCs</small>
                      <select
                        className="form-select"
                        id="upcColumn"
                        name="upcColumn"
                        value={formik.values.upcColumn}
                        onChange={formik.handleChange}
                      >
                        <option value="">ITEM CODE</option>
                        <option value="DESCRIPTION">DESCRIPTION</option>
                        <option value="CATEGORY">CATEGORY</option>
                        <option value="ITEM GROUP">ITEM GROUP</option>
                        <option value="TAX CODE">TAX CODE</option>
                      </select>
                    </div>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '500px',
                      }}
                    >
                      <label>IEAN Optional</label>
                      <small>Select the column that includes your EANs</small>
                      <select
                        className="form-select"
                        id="eanColumn"
                        name="eanColumn"
                        value={formik.values.eanColumn}
                        onChange={formik.handleChange}
                      >
                        <option value="">ITEM CODE</option>
                        <option value="DESCRIPTION">DESCRIPTION</option>
                        <option value="CATEGORY">CATEGORY</option>
                        <option value="ITEM GROUP">ITEM GROUP</option>
                        <option value="TAX CODE">TAX CODE</option>
                      </select>
                    </div>
                    <br />

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        maxWidth: '500px',
                      }}
                    >
                      <label>ASIN Optional</label>
                      <small>Select the column that includes your ASINs</small>
                      <select
                        className="form-select"
                        id="asinColumn"
                        name="asinColumn"
                        value={formik.values.asinColumn}
                        onChange={formik.handleChange}
                      >
                        <option value="">ITEM CODE</option>
                        <option value="DESCRIPTION">DESCRIPTION</option>
                        <option value="CATEGORY">CATEGORY</option>
                        <option value="ITEM GROUP">ITEM GROUP</option>
                        <option value="TAX CODE">TAX CODE</option>
                      </select>
                    </div>
                    <br />

                    <Button
                      type="submit"
                      style={{
                        marginLeft: '50px',
                        marginTop: '50px',
                        width: '100px',
                      }}
                    >
                      Next
                    </Button>
                  </form>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ColumnMapping;
