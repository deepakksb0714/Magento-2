import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Form, Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BreadCrumb from '../../../Common/BreadCrumb';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import {
  getProductList as onGetProductList,
  getTaxCodeList as onGetTaxCodeList,
} from '../../../slices/thunk';
import './Calculator.css';
import MonochromePie from '../../components/MonochromePie';

import { faTimes } from '@fortawesome/free-solid-svg-icons';

interface TaxBreakdownItem {
  jurisdiction: string;
  tax_region_name: string;
  estimated_combined_rate: string;
  state_rate: string;
  estimated_county_rate: string;
  estimated_city_rate: string;
  estimated_special_rate: string;
  taxable_amount: number;
  tax_amount: string;
}

interface OverallTaxBreakdownItem {
  itemName: string;
  itemCode: string;
  quantity: number;
  totalAmount: number;
  tax_breakdown: TaxBreakdownItem[];
  item_total_tax_amount: string;
  item_total_amount_after_tax: string;
  item_total_amount_after_tax_for_total_quantity: string;
}

interface TaxResponse {
  final_amount_for_all_items: string;
  overall_tax_breakdown: OverallTaxBreakdownItem[];
  total_tax_amount: string;
}

interface Country {
  name: {
    common: string;
  };
}

interface Product {
  id: number;
  name: string;
  sproduct_code: string;
  sku: string;
  price: number;
}

interface TaxCode {
  id: number;
  tax_code: string;
  description: string;
}

type Item = {
  itemName: string;
  itemCode: string;
  quantity: string;
  totalAmount: string;
  taxCode: string;
};

const TaxCalculator: React.FC = () => {
  const [shipToLocationType, setShipToLocationType] =
    useState<string>('DEFAULT');
  const [fromToLocationType, setFromToLocationType] =
    useState<string>('DEFAULT');
  const [selectedCountry, setSelectedCountry] = useState<string>(
    'United States of America'
  );
  const [countries, setCountries] = useState<string[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<string>('');
  const [taxCodes, setTaxCodes] = useState<TaxCode[]>([]);
  const [selectedTaxCode, setSelectedTaxCode] = useState<string>('');
  const [response, setResponse] = useState<TaxResponse | null>(null);
  const [seriesData, setSeriesData] = useState<number[] | null>(null);
  const dispatch = useDispatch();
  const responseRef = useRef<HTMLDivElement>(null);

  const [items, setItems] = useState<Item[]>([]);

  const [showDetails, setShowDetails] = useState<number | null>(null);

  // Function to toggle item details
  const toggleItemDetails = (index: number) => {
    setShowDetails((prevShowDetails) =>
      prevShowDetails === index ? null : index
    );
  };
  const selectProductList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => invoices.productList || [] // Ensure a default value
  );

  const selectTaxCodeList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => invoices.taxCodeList.data || [] // Ensure a default value and access the nested data property
  );

  const productList = useSelector(selectProductList);
  const taxCodeList = useSelector(selectTaxCodeList);

  useEffect(() => {
    dispatch(onGetProductList());
    dispatch(onGetTaxCodeList());
  }, [dispatch]);

  useEffect(() => {
    setProducts(productList);
    setTaxCodes(taxCodeList);
  }, [productList, taxCodeList]);

  const handleTaxCodeChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    setSelectedTaxCode(event.target.value as string);
    formik.setFieldValue('taxCode', event.target.value as string);
  };

  const handleItemChange = (index: number, event: React.ChangeEvent<any>) => {
    const { name, value } = event.target;
    setItems((prevItems) => {
      const newItems = [...prevItems];
      newItems[index] = { ...newItems[index], [name]: value };
      return newItems;
    });
    formik.setFieldValue(`items[${index}].${name}`, value);
  };

  const addItem = async () => {
    await formik.validateForm();
    if (Object.keys(formik.errors).length === 0) {
      const newItem = {
        itemName: '',
        itemCode: '',
        quantity: '',
        totalAmount: '',
        taxCode: '',
      };
      const newItems = [...items, newItem];
      setItems(newItems);
      setShowDetails(newItems.length - 1); // Set the index of the new item to be true
      formik.setFieldValue('items', newItems);
    } else {
      formik.setTouched({
        items: formik.values.items.map(() => ({
          itemName: true,
          itemCode: true,
          quantity: true,
          totalAmount: true,
          taxCode: true,
        })),
      });
    }
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    formik.setFieldValue('items', newItems);
  };

  const handleBackClick = () => {
    // Reset the response state
    setResponse(null);
    // Reset the form using Formik's resetForm method
    formik.resetForm();
    // Remove all items
    setItems([]);
    formik.setFieldValue('items', []);
  };

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const countryNames = response.data.map(
          (country: Country) => country.name.common
        );
        setCountries(countryNames);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    fetchCountries();
  }, []);

  const formik = useFormik({
    initialValues: {
      shipFromAddress: '',
      shipToAddress: '',
      items: [
        {
          itemName: '',
          itemCode: '',
          quantity: '',
          totalAmount: '',
          taxCode: '',
        },
      ],
      calculationType: 'sales',
      taxDate: '',
      customerVendorCode: '',
      state: '',
      city: '',
      zip: '94005',
    },
    validationSchema: Yup.object({
      items: Yup.array().of(
        Yup.object({
          itemName: Yup.string().required('Item Name is required'),
          itemCode: Yup.string().required('Item code is required'),
          quantity: Yup.number().required('Quantity is required'),
          totalAmount: Yup.number().required('Total amount is required'),
          taxCode: Yup.string().required('Tax code is required'),
        })
      ),
      // calculationType: Yup.string().required('Calculation type is required'),
      // taxDate: Yup.date().required('Tax date is required'),
      // customerVendorCode: Yup.string().required('Customer/Vendor code is required'),
      // state: Yup.string().required('State is required'),
      // city: Yup.string().required('City is required'),
      // zip: Yup.string().required('ZIP/Postal Code is required')
    }),
    onSubmit: async (values: any) => {
      try {
        const siteConfig = process.env.REACT_APP_SITE_CONFIG
          ? JSON.parse(process.env.REACT_APP_SITE_CONFIG)
          : null;

        const url = siteConfig
          ? `${siteConfig.apiUrl}/taxes/calculate`
          : 'http://localhost:3004/taxes/calculate';

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            zip_code: values.zip,
            amount: values.totalAmount,
            shipFromAddress: values.shipFromAddress,
            shipToAddress: values.shipToAddress,
            items: values.items,
            calculationType: values.calculationType,
            taxDate: values.taxDate,
            customerVendorCode: values.customerVendorCode,
            state: values.state,
            city: values.city,
          }),
        });

        console.log('Response from API:', response);
        console.log('response.status from API:', response.status);
        console.log('response.status from API:', response.status);
        if (response.status === 200) {
          const data: TaxResponse = await response.json();
          setResponse(data);
          console.log(data);

          // const extractedSeriesData = data.tax_breakdown.map((item) => ({
          //   stateRate: parseFloat(item.state_rate),
          //   countyRate: parseFloat(item.estimated_county_rate),
          //   cityRate: parseFloat(item.estimated_city_rate),
          //   specialRate: parseFloat(item.estimated_special_rate),
          // }));

          // const ratesArray = extractedSeriesData.map((item) => [
          //   item.stateRate,
          //   item.countyRate,
          //   item.cityRate,
          //   item.specialRate,
          // ]).flat();
          // setSeriesData(ratesArray);

          // console.log("extractedSeriesData after set: ", extractedSeriesData);
          console.log('seriesData after set: ', seriesData);
          console.log(data);
        } else {
          console.error('Failed to calculate tax:');
        }
      } catch (error) {
        console.error('Error calculating tax:', error);
      }
      responseRef.current?.scrollIntoView({ behavior: 'smooth' });
      // formik.resetForm();
    },
  });

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb pageTitle="Invoice" title="Tax calculator" />
        <Row className="justify-content-center">
          <Col xxl={12}>
            <Container>
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col md={6}>
                    <h4 className="headc">Ship From</h4>
                    <Form.Group controlId="locationType" className="margB">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        as="select"
                        value={fromToLocationType}
                        onChange={(e) => setFromToLocationType(e.target.value)}
                      >
                        <option value="DEFAULT">DEFAULT</option>
                        <option value="OTHERS">OTHERS</option>
                      </Form.Control>
                    </Form.Group>
                    {fromToLocationType === 'DEFAULT' ? (
                      <div className="othrAdd">
                        <p>185 Valley Dr</p>
                        <p>Brisbane CA, US</p>
                        <p>94005-1340</p>
                      </div>
                    ) : (
                      <>
                        <Form.Group controlId="country" className="margB">
                          <Form.Label>Country/Territory</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="country"
                            value={formik.values.countryNames}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.state && formik.touched.state && (
                            <div className="text-danger">
                              {formik.errors.state}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group
                          controlId="shipFromAddress"
                          className="margB"
                        >
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Address line"
                            value={formik.values.shipFromAddress}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.shipFromAddress &&
                            formik.touched.shipFromAddress && (
                              <div className="text-danger">
                                {formik.errors.shipFromAddress}
                              </div>
                            )}
                        </Form.Group>
                        <Form.Group controlId="state" className="margB">
                          <Form.Label>State/Territory</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.state && formik.touched.state && (
                            <div className="text-danger">
                              {formik.errors.state}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group controlId="city" className="margB">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.city && formik.touched.city && (
                            <div className="text-danger">
                              {formik.errors.city}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group controlId="zip" className="margB">
                          <Form.Label>ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ZIP/Postal Code"
                            value={formik.values.zip}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.zip && formik.touched.zip && (
                            <div className="text-danger">
                              {formik.errors.zip}
                            </div>
                          )}
                        </Form.Group>
                      </>
                    )}
                    <Button variant="primary" type="submit">
                      Validate Address
                    </Button>
                  </Col>
                  <Col md={6}>
                    <h4 className="headc">Ship To</h4>
                    <Form.Group controlId="locationType" className="margB">
                      <Form.Label>Location</Form.Label>
                      <Form.Control
                        as="select"
                        value={shipToLocationType}
                        onChange={(e) => setShipToLocationType(e.target.value)}
                      >
                        <option value="DEFAULT">DEFAULT</option>
                        <option value="OTHERS">OTHERS</option>
                      </Form.Control>
                    </Form.Group>
                    {shipToLocationType === 'DEFAULT' ? (
                      <div className="othrAdd">
                        <p>185 Valley Dr</p>
                        <p>Brisbane CA, US</p>
                        <p>94005-1340</p>
                      </div>
                    ) : (
                      <>
                        <Form.Group controlId="country" className="margB">
                          <Form.Label>Country/Territory</Form.Label>
                          <Form.Control
                            as="select"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                          >
                            {countries.map((country) => (
                              <option key={country} value={country}>
                                {country}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        <Form.Group controlId="shipToAddress" className="margB">
                          <Form.Label>Address</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Address line"
                            value={formik.values.shipToAddress}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.shipToAddress &&
                            formik.touched.shipToAddress && (
                              <div className="text-danger">
                                {formik.errors.shipToAddress}
                              </div>
                            )}
                        </Form.Group>
                        <Form.Group controlId="state" className="margB">
                          <Form.Label>State/Territory</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="State"
                            value={formik.values.state}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.state && formik.touched.state && (
                            <div className="text-danger">
                              {formik.errors.state}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group controlId="city" className="margB">
                          <Form.Label>City</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="City"
                            value={formik.values.city}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.city && formik.touched.city && (
                            <div className="text-danger">
                              {formik.errors.city}
                            </div>
                          )}
                        </Form.Group>
                        <Form.Group controlId="zip" className="margB">
                          <Form.Label>ZIP/Postal Code</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="ZIP/Postal Code"
                            value={formik.values.zip}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.zip && formik.touched.zip && (
                            <div className="text-danger">
                              {formik.errors.zip}
                            </div>
                          )}
                        </Form.Group>
                      </>
                    )}
                    <Button variant="primary" type="submit">
                      Validate Address
                    </Button>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={12}>
                    <h4 className="headc">Product Details</h4>

                    {items.map((item, index) => (
                      <div key={index} className="d-flex flex-column">
                        <Row>
                          <Col md={12}>
                            <h4 className="mt-1"></h4>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={12}>
                            {/* Toggle button to show/hide item details */}
                            <Button
                              variant="light"
                              onClick={() => toggleItemDetails(index)}
                              className="mb-3 mr-3"
                            >
                              {item.itemName || 'New Item'}
                            </Button>
                          </Col>
                        </Row>

                        {/* Details section */}
                        {showDetails === index && (
                          <Row>
                            <Col md={12}>
                              <Form.Group controlId={`itemName-${index}`}>
                                <Form.Label>Item Name</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="itemName"
                                  value={item.itemName}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      e as React.ChangeEvent<HTMLInputElement>
                                    )
                                  }
                                />
                                {formik.errors.items &&
                                  formik.errors.items[index]?.itemName && (
                                    <div className="text-danger">
                                      {formik.errors.items[index].itemName}
                                    </div>
                                  )}
                              </Form.Group>
                              <Form.Group controlId={`itemCode-${index}`}>
                                <Form.Label>Item Code</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="itemCode"
                                  value={item.itemCode}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      e as React.ChangeEvent<HTMLInputElement>
                                    )
                                  }
                                />
                                {formik.errors.items &&
                                  formik.errors.items[index]?.itemCode && (
                                    <div className="text-danger">
                                      {formik.errors.items[index].itemCode}
                                    </div>
                                  )}
                              </Form.Group>
                              <Form.Group controlId={`quantity-${index}`}>
                                <Form.Label>Quantity</Form.Label>
                                <Form.Control
                                  type="number"
                                  name="quantity"
                                  value={item.quantity}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      e as React.ChangeEvent<HTMLInputElement>
                                    )
                                  }
                                />
                                {formik.errors.items &&
                                  formik.errors.items[index]?.quantity && (
                                    <div className="text-danger">
                                      {formik.errors.items[index].quantity}
                                    </div>
                                  )}
                              </Form.Group>
                              <Form.Group controlId={`totalAmount-${index}`}>
                                <Form.Label>Total Amount</Form.Label>
                                <Form.Control
                                  type="number"
                                  name="totalAmount"
                                  value={item.totalAmount}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      e as React.ChangeEvent<HTMLInputElement>
                                    )
                                  }
                                />
                                {formik.errors.items &&
                                  formik.errors.items[index]?.totalAmount && (
                                    <div className="text-danger">
                                      {formik.errors.items[index].totalAmount}
                                    </div>
                                  )}
                              </Form.Group>
                              <Form.Group controlId={`taxCode-${index}`}>
                                <Form.Label>Tax Code</Form.Label>
                                <Form.Control
                                  as="select"
                                  name="taxCode"
                                  value={item.taxCode}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      e as React.ChangeEvent<
                                        HTMLSelectElement | HTMLInputElement
                                      >
                                    )
                                  }
                                >
                                  <option value="">Select a tax code</option>
                                  {taxCodes.map((taxCode) => (
                                    <option
                                      key={taxCode.id}
                                      value={taxCode.tax_code.toString()}
                                    >
                                      {taxCode.tax_code} - {taxCode.description}
                                    </option>
                                  ))}
                                </Form.Control>
                              </Form.Group>
                            </Col>
                            <Col md={6}>
                              {/* Remove button */}
                              <Button
                                variant="danger"
                                onClick={() => removeItem(index)}
                                className="mb-3"
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        )}
                      </div>
                    ))}

                    {/* Add Item button */}
                    <Button variant="success" onClick={addItem}>
                      Add Item
                    </Button>
                  </Col>
                </Row>
                <hr />
                <Row>
                  <Col md={12}>
                    <h4>Other Details</h4>
                    <Form.Group controlId="calculationType">
                      <Form.Label>Calculation Type</Form.Label>
                      <Form.Control
                        as="select"
                        value={formik.values.calculationType}
                        onChange={formik.handleChange}
                      >
                        <option value="sales">Sales</option>
                        <option value="use">Use</option>
                      </Form.Control>
                      {formik.errors.calculationType &&
                        formik.touched.calculationType && (
                          <div className="text-danger">
                            {formik.errors.calculationType}
                          </div>
                        )}
                    </Form.Group>
                    <Form.Group controlId="taxDate">
                      <Form.Label>Tax Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={formik.values.taxDate}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.taxDate && formik.touched.taxDate && (
                        <div className="text-danger">
                          {formik.errors.taxDate}
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group controlId="customerVendorCode">
                      <Form.Label>Customer/Vendor Code</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Customer/Vendor Code"
                        value={formik.values.customerVendorCode}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.customerVendorCode &&
                        formik.touched.customerVendorCode && (
                          <div className="text-danger">
                            {formik.errors.customerVendorCode}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>
                <div className="text-center">
                  <Button variant="primary" type="submit" className="mt-3">
                    Calculate Tax
                  </Button>
                </div>
              </Form>
            </Container>

            <Card style={{ marginTop: '70px' }}>
              <Container>
                <Row>
                  <Col md={12}>
                    <h4 className="mt-1">Order Items</h4>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item Name</th>
                          <th>Item Code</th>
                          <th>Quantity</th>
                          <th>Total Amount</th>
                          <th>Tax Code</th>
                          <th>Action</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, index) => (
                          <tr key={index}>
                            <td>{item.itemName}</td>
                            <td>{item.itemCode}</td>
                            <td>{item.quantity}</td>
                            <td>{item.totalAmount}</td>
                            <td>{item.taxCode}</td>
                            <td>
                              {items.length > 0 && ( // Conditionally render the Remove button
                                <Button
                                  variant="danger"
                                  onClick={() => removeItem(index)}
                                ></Button>
                              )}
                            </td>
                            {/* <Button variant="primary" onClick={() => toggleItemDetails(index)}>
              Edit
            </Button> */}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Container>
            </Card>

            {response && (
              <Card style={{ marginTop: '70px' }}>
                <Container ref={responseRef}>
                  {/* <h4>Calculated Tax:</h4> */}
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Item Name</th>
                        <th>Quantity</th>
                        <th>State</th>
                        <th>Region</th>
                        <th>Combined Tax</th>
                        <th>State Tax</th>
                        <th>County Tax</th>
                        <th>City Tax</th>
                        <th>Special Tax</th>
                        <th>Taxable Amount</th>
                        <th>Tax Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {response.overall_tax_breakdown.map((item, index) =>
                        item.tax_breakdown.map((tax, taxIndex) => (
                          <tr key={`${index}-${taxIndex}`}>
                            <td>{item.itemName}</td>
                            <td>{item.quantity}</td>
                            <td>{tax.jurisdiction}</td>
                            <td>{tax.tax_region_name}</td>
                            <td>{tax.estimated_combined_rate}%</td>
                            <td>{tax.state_rate}%</td>
                            <td>{tax.estimated_county_rate}%</td>
                            <td>{tax.estimated_city_rate}%</td>
                            <td>{tax.estimated_special_rate}%</td>
                            <td>{tax.taxable_amount}</td>
                            <td>{tax.tax_amount}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>{' '}
                  <div className="additional-details mt-3">
                    <p>
                      <strong>Total Tax Amount:</strong>{' '}
                      {response.total_tax_amount}
                    </p>
                    <p>
                      <strong>Total Tax Amount:</strong>{' '}
                      {response.final_amount_for_all_items}
                    </p>
                    {/* Loop through each item to show its additional details */}
                  </div>
                  {/* <div className="col-md-6">
        <MonochromePie seriesData={seriesData} />
      </div> */}
                  <Button
                    variant="primary"
                    type="button"
                    onClick={handleBackClick}
                  >
                    Clear
                  </Button>
                </Container>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default TaxCalculator;
