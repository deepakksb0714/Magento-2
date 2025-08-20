import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const ReviewRecommendations = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    onSubmit: (values: any) => {
    },
  });

  const handleTaxCodeChange = (
    product: string,
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = event.target;
    formik.setFieldValue(`taxCodes.${product}`, value);
  };

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb
          pageTitle="Review Tax Code Recommendations"
          title="Review Tax Code Recommendations"
        />
        <Row>
          <Col xl={12}>
            <Card>
              <Card.Body>
                <Button
                  variant="light"
                  onClick={() => navigate('/column-mapping')}
                  style={{ marginBottom: '10px', color: 'red' }}
                >
                  <i className="bi bi-arrow-left"></i> Back
                </Button>
                <div className="p-2">
                  <h3>1 Review tax code recommendations</h3>
                  <p style={{ marginTop: '20px' }}>
                    Here are the tax codes we’re suggesting based on the product
                    categories you selected.
                  </p>
                  <div style={{ marginTop: '30px', marginBottom: '50px' }}>
                    <Button variant="primary" onClick={formik.handleSubmit}>
                      Download Recommendations
                    </Button>
                  </div>
                  <h3>2 Choose a tax code for each product</h3>
                  <p>
                    Review the recommendations and choose the tax code that is
                    the best match for each product or service. The tax code we
                    think is the closest match is listed in the code_1 column.
                    While we try to make our tax code recommendations as
                    accurate as possible, it's up to you to decide which tax
                    codes to use. You can find tax codes and their descriptions
                    on Scalartax’s Tax Codes Search site.
                  </p>
                  <h3>3 Decide where to map</h3>
                  <p>
                    It's usually best to map your products to tax codes in the
                    business application where you update your product catalog.
                    If you can't map in your application – or you use more than
                    one Scalartax integration – it's best to map in Scalartax.
                    Important: Mapping in Scalartax overrides mapping in your
                    application.
                  </p>

                  <h4>Map in your business application</h4>
                  <Button
                    variant="link"
                    onClick={() => navigate('/map-instruction')}
                  >
                    Get instructions for your application in the Help
                  </Button>
                </div>
                <div>
                  <h3>Map in ScalarTax</h3>
                  <img
                    src="https://th.bing.com/th/id/R.a243c72be94e93f1399f3399b06c7677?rik=hrhQ9%2b%2fJ1SSPHA&riu=http%3a%2f%2fwww.riskmanagementmonitor.com%2fwp-content%2fuploads%2f2014%2f12%2fLaptop1.jpg&ehk=OfidPRNnM1a1JERcjUs9J725LwV1tT7YdUTEmeAi5Gw%3d&risl=1&pid=ImgRaw&r=0"
                    alt="Large image"
                    loading="lazy"
                    width={200}
                  />
                  <span style={{ fontSize: '20px' }}>Map many at once</span>
                  <br />
                  When you need to map your entire product catalog
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <Button onClick={() => navigate('/import-product')}>
                    Import products
                  </Button>
                </div>
                <br />
                <div>
                  <img
                    src="https://th.bing.com/th/id/R.a243c72be94e93f1399f3399b06c7677?rik=hrhQ9%2b%2fJ1SSPHA&riu=http%3a%2f%2fwww.riskmanagementmonitor.com%2fwp-content%2fuploads%2f2014%2f12%2fLaptop1.jpg&ehk=OfidPRNnM1a1JERcjUs9J725LwV1tT7YdUTEmeAi5Gw%3d&risl=1&pid=ImgRaw&r=0"
                    alt="Large image"
                    loading="lazy"
                    width={200}
                  />
                  <span style={{ fontSize: '20px' }}>Map one at a time</span>
                  <br />
                  When you have just a few products
                </div>
                <div style={{ paddingTop: '20px' }}>
                  <Button onClick={() => navigate('/product-add')}>
                    Add a product
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ReviewRecommendations;
