import React, { useState } from 'react';
import { useFormik } from 'formik';
import { Card, Container, Row, Col, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';

const CategorySelection = () => {
  const navigate = useNavigate();
  const [showSubcategories, setShowSubcategories] = useState({
    administrative: false,
    clothing: false,
    construction: false,
    digitalProducts: false,
    feesAndCharges: false,
    foodAndBeverage: false,
  });

  const formik = useFormik({
    initialValues: {
      categories: [],
      subcategories: [],
    },
    validationSchema: Yup.object({
      categories: Yup.array()
        .min(1, 'Select at least one category')
        .required('Select at least one category'),
      subcategories: Yup.array()
        .min(1, 'Select at least one subcategory')
        .required('Select at least one subcategory'),
    }),
    onSubmit: (values: { categories: string[]; subcategories: string[] }) => {
      navigate('/review-recommendations');
    },
  });

  const toggleSubcategory = (category: keyof typeof showSubcategories) => {
    setShowSubcategories({
      ...showSubcategories,
      [category]: !showSubcategories[category],
    });
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
                <Button
                  variant="light"
                  onClick={() => navigate('/column-mapping')}
                  style={{ marginBottom: '10px', color: 'red' }}
                >
                  <i className="bi bi-arrow-left"></i> Back
                </Button>
                <div className="p-2">
                  <h2>Select product categories</h2>
                  <p>
                    Tell us more about what you sell so we can recommend
                    matching tax codes. Select at least one category and any
                    subcategories that describe what you sell.
                  </p>
                  <form onSubmit={formik.handleSubmit}>
                    <div className="category">
                      <input
                        type="checkbox"
                        id="administrative"
                        name="categories"
                        value="Administrative and support services"
                        checked={formik.values.categories.includes(
                          'Administrative and support services'
                        )}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => toggleSubcategory('administrative')}
                      />
                      <label
                        htmlFor="administrative"
                        style={{ paddingLeft: '10px' }}
                      >
                        Administrative and support services
                      </label>
                      {showSubcategories.administrative && (
                        <>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="building"
                              name="subcategories"
                              value="Building & home services"
                              checked={formik.values.subcategories.includes(
                                'Building & home services'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="building"
                              style={{ paddingLeft: '10px' }}
                            >
                              Building & home services
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="businessSupport"
                              name="subcategories"
                              value="Business support services"
                              checked={formik.values.subcategories.includes(
                                'Business support services'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="businessSupport"
                              style={{ paddingLeft: '10px' }}
                            >
                              Business support services
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="employment"
                              name="subcategories"
                              value="Employment services"
                              checked={formik.values.subcategories.includes(
                                'Employment services'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="employment"
                              style={{ paddingLeft: '10px' }}
                            >
                              Employment services
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="wasteCollection"
                              name="subcategories"
                              value="Waste collection"
                              checked={formik.values.subcategories.includes(
                                'Waste collection'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="wasteCollection"
                              style={{ paddingLeft: '10px' }}
                            >
                              Waste collection
                            </label>
                          </div>
                        </>
                      )}
                    </div>

                    <hr />
                    <div className="category">
                      <input
                        type="checkbox"
                        id="clothing"
                        name="categories"
                        value="Clothing"
                        checked={formik.values.categories.includes('Clothing')}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => toggleSubcategory('clothing')}
                      />
                      <label htmlFor="clothing" style={{ paddingLeft: '10px' }}>
                        Clothing
                      </label>
                      {showSubcategories.clothing && (
                        <>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="accessories"
                              name="subcategories"
                              value="Accessories and supplies"
                              checked={formik.values.subcategories.includes(
                                'Accessories and supplies'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="accessories"
                              style={{ paddingLeft: '10px' }}
                            >
                              Accessories and supplies
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="clothingBusiness"
                              name="subcategories"
                              value="Clothing business-to-business"
                              checked={formik.values.subcategories.includes(
                                'Clothing business-to-business'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="clothingBusiness"
                              style={{ paddingLeft: '10px' }}
                            >
                              Clothing business-to-business
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="clothing-consumer"
                              name="subcategories"
                              value="Clothing business-to-consumer"
                              checked={formik.values.subcategories.includes(
                                'Clothing business-to-consumer'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="Clothing-consumer"
                              style={{ paddingLeft: '10px' }}
                            >
                              Clothing business-to-consumer
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="Clothing-related"
                              name="subcategories"
                              value="Clothing-related services"
                              checked={formik.values.subcategories.includes(
                                'Clothing-related services'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="Clothing-related"
                              style={{ paddingLeft: '10px' }}
                            >
                              Clothing-related services
                            </label>
                          </div>
                        </>
                      )}
                    </div>

                    <hr />
                    <div className="category">
                      <input
                        type="checkbox"
                        id="construction"
                        name="categories"
                        value="construction"
                        checked={formik.values.categories.includes(
                          'construction'
                        )}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => toggleSubcategory('construction')}
                      />
                      <label
                        htmlFor="construction"
                        style={{ paddingLeft: '10px' }}
                      >
                        Construction and real property
                      </label>
                      {showSubcategories.construction && (
                        <>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="construction-materials"
                              name="subcategories"
                              value="Construction materials"
                              checked={formik.values.subcategories.includes(
                                'Construction materials'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="construction-materials"
                              style={{ paddingLeft: '10px' }}
                            >
                              Construction materials
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="construction-services"
                              name="subcategories"
                              value="Construction services"
                              checked={formik.values.subcategories.includes(
                                'Construction services'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="construction-services"
                              style={{ paddingLeft: '10px' }}
                            >
                              Construction services
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="inspectionAndPermitting"
                              name="subcategories"
                              value="Inspection and permitting"
                              checked={formik.values.subcategories.includes(
                                'Inspection and permitting'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="inspectionAndPermitting"
                              style={{ paddingLeft: '10px' }}
                            >
                              Inspection and permitting
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="installation"
                              name="subcategories"
                              value="Installation"
                              checked={formik.values.subcategories.includes(
                                'Installation'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="installation"
                              style={{ paddingLeft: '10px' }}
                            >
                              Installation
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="landscape"
                              name="subcategories"
                              value="Landscape"
                              checked={formik.values.subcategories.includes(
                                'Landscape'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="landscape"
                              style={{ paddingLeft: '10px' }}
                            >
                              Landscape
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="repair"
                              name="subcategories"
                              value="Repair"
                              checked={formik.values.subcategories.includes(
                                'Repair'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="repair"
                              style={{ paddingLeft: '10px' }}
                            >
                              Repair
                            </label>
                          </div>
                        </>
                      )}
                    </div>
                    <hr />
                    <div className="category">
                      <input
                        type="checkbox"
                        id="digitalProducts"
                        name="categories"
                        value="Digital products"
                        checked={formik.values.categories.includes(
                          'Digital products'
                        )}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => toggleSubcategory('digitalProducts')}
                      />
                      <label
                        htmlFor="digitalProducts"
                        style={{ paddingLeft: '10px' }}
                      >
                        Digital products
                      </label>
                      {showSubcategories.digitalProducts && (
                        <>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="audio"
                              name="subcategories"
                              value="Audio"
                              checked={formik.values.subcategories.includes(
                                'Audio'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="audio"
                              style={{ paddingLeft: '10px' }}
                            >
                              Audio
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="booksAndPublications"
                              name="subcategories"
                              value=" Books and publications"
                              checked={formik.values.subcategories.includes(
                                ' Books and publications'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="booksAndPublications"
                              style={{ paddingLeft: '10px' }}
                            >
                              Books and publications
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="games"
                              name="subcategories"
                              value="Games"
                              checked={formik.values.subcategories.includes(
                                'Games'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="games"
                              style={{ paddingLeft: '10px' }}
                            >
                              Games
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="images"
                              name="subcategories"
                              value="Images"
                              checked={formik.values.subcategories.includes(
                                'Images'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="images"
                              style={{ paddingLeft: '10px' }}
                            >
                              Images
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="mailingLists"
                              name="subcategories"
                              value="Mailing lists"
                              checked={formik.values.subcategories.includes(
                                'Mailing lists'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="mailingLists"
                              style={{ paddingLeft: '10px' }}
                            >
                              Mailing lists
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="movies&video"
                              name="subcategories"
                              value="Movies & video"
                              checked={formik.values.subcategories.includes(
                                'Movies & video'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="movies&video"
                              style={{ paddingLeft: '10px' }}
                            >
                              Movies & video
                            </label>
                          </div>
                        </>
                      )}
                    </div>

                    <hr />
                    <div className="category">
                      <input
                        type="checkbox"
                        id="feesAndCharges"
                        name="categories"
                        value="Fees, coupons, dues and charges"
                        checked={formik.values.categories.includes(
                          'Fees, coupons, dues and charges'
                        )}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => toggleSubcategory('feesAndCharges')}
                      />
                      <label
                        htmlFor="feesAndCharges"
                        style={{ paddingLeft: '10px' }}
                      >
                        Fees, coupons, dues and charges
                      </label>
                      {showSubcategories.feesAndCharges && (
                        <>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="admissions"
                              name="subcategories"
                              value="Admissions"
                              checked={formik.values.subcategories.includes(
                                'Admissions'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="admissions"
                              style={{ paddingLeft: '10px' }}
                            >
                              Admissions
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="billingAndInvoicingFees"
                              name="subcategories"
                              value="Billing and invoicing fees"
                              checked={formik.values.subcategories.includes(
                                'Billing and invoicing fees'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="billingAndInvoicingFees"
                              style={{ paddingLeft: '10px' }}
                            >
                              Billing and invoicing fees
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="discountsAndCoupons"
                              name="subcategories"
                              value="Discounts and coupons"
                              checked={formik.values.subcategories.includes(
                                'Discounts and coupons'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="discountsAndCoupons"
                              style={{ paddingLeft: '10px' }}
                            >
                              Discounts and coupons
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="membershipDues"
                              name="subcategories"
                              value="Membership dues"
                              checked={formik.values.subcategories.includes(
                                'Membership dues'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="membershipDues"
                              style={{ paddingLeft: '10px' }}
                            >
                              Membership dues
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="miscellaneous"
                              name="subcategories"
                              value="Miscellaneous"
                              checked={formik.values.subcategories.includes(
                                'Miscellaneous'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="miscellaneous"
                              style={{ paddingLeft: '10px' }}
                            >
                              Miscellaneous
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="purchaseDeposits"
                              name="subcategories"
                              value="Purchase deposits"
                              checked={formik.values.subcategories.includes(
                                'Purchase deposits'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="purchaseDeposits"
                              style={{ paddingLeft: '10px' }}
                            >
                              Purchase deposits
                            </label>
                          </div>
                        </>
                      )}
                    </div>

                    <hr />
                    <div className="category">
                      <input
                        type="checkbox"
                        id="foodAndBeverage"
                        name="categories"
                        value="Food and beverage"
                        checked={formik.values.categories.includes(
                          'Food and beverage'
                        )}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        onClick={() => toggleSubcategory('foodAndBeverage')}
                      />
                      <label
                        htmlFor="foodAndBeverage"
                        style={{ paddingLeft: '10px' }}
                      >
                        Food and beverage
                      </label>
                      {showSubcategories.foodAndBeverage && (
                        <>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="alcohol"
                              name="subcategories"
                              value="Alcohol"
                              checked={formik.values.subcategories.includes(
                                'Alcohol'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="alcohol"
                              style={{ paddingLeft: '10px' }}
                            >
                              Alcohol
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="beverages"
                              name="subcategories"
                              value="Beverages"
                              checked={formik.values.subcategories.includes(
                                'Beverages'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="beverages"
                              style={{ paddingLeft: '10px' }}
                            >
                              Beverages
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="foodRelatedServices"
                              name="subcategories"
                              value="Food-related services"
                              checked={formik.values.subcategories.includes(
                                'Food-related services'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="foodRelatedServices"
                              style={{ paddingLeft: '10px' }}
                            >
                              Food-related services
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="giftBasketsAndCombinationProducts"
                              name="subcategories"
                              value="Gift baskets and combination products"
                              checked={formik.values.subcategories.includes(
                                'Gift baskets and combination products'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="giftBasketsAndCombinationProducts"
                              style={{ paddingLeft: '10px' }}
                            >
                              Gift baskets and combination products
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="groceryItems"
                              name="subcategories"
                              value="Grocery items"
                              checked={formik.values.subcategories.includes(
                                'Grocery items'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="groceryItems"
                              style={{ paddingLeft: '10px' }}
                            >
                              Grocery items
                            </label>
                          </div>
                          <div
                            className="subcategory"
                            style={{ marginLeft: '10px' }}
                          >
                            <input
                              type="checkbox"
                              id="preparedFood&beverages"
                              name="subcategories"
                              value="Prepared food & beverages"
                              checked={formik.values.subcategories.includes(
                                'Prepared food & beverages'
                              )}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                            <label
                              htmlFor="reparedFood&beverages"
                              style={{ paddingLeft: '10px' }}
                            >
                              Prepared food & beverages
                            </label>
                          </div>
                        </>
                      )}
                    </div>

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
export default CategorySelection;
