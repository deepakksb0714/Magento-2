import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../../Common/BreadCrumb';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from 'react-bootstrap';

import logoDark from '../../../assets/images/logo-dark.png';
import logoLight from '../../../assets/images/logo-light.png';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Flatpickr from 'react-flatpickr';

const AddInvoice = () => {
  document.title = 'New Invoice | ScalarHub Admin Dashboard ';

  const [ispaymentStatus, setispaymentStatus] = useState<any>();

  function handleispaymentStatus(selectedOption: any) {
    setispaymentStatus(selectedOption);
  }

  const paymentstatus = [
    {
      options: [
        { label: 'Paid', value: 'Paid' },
        { label: 'Unpaid', value: 'Unpaid' },
        { label: 'Refund', value: 'Refund' },
      ],
    },
  ];

  const [isallStatus, setisallStatus] = useState<any>();

  function handleisAllStatus(selectedOption: any) {
    setisallStatus(selectedOption);
  }

  const allstatus = [
    {
      options: [
        { label: 'Select Payment Status', value: 'Select Payment Status' },
        { label: 'Paid', value: 'Paid' },
        { label: 'Unpaid', value: 'Unpaid' },
        { label: 'Refund', value: 'Refund' },
      ],
    },
  ];

  const [count, setCount] = useState<number>(0);
  const [rate, setRate] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [dis, setDis] = useState<number>(0);
  const [charge, setCharge] = useState<number>(0);

  useEffect(() => {
    let tax = 0.125 * rate * count;
    let dis = 0.15 * rate * count;

    if (rate && count) {
      setCharge(65);
    } else {
      setCharge(0);
    }
    setTax(tax);
    setDis(dis);
  }, [rate, count]);

  const dateformate = () => {
    // const date = e.toString().split(" ");
    // const joinDate = (date[2] + " " + date[1] + ", " + date[3]).toString();
    // setDate(joinDate);
  };

  const validation: any = useFormik({
    enableReinitialize: true,

    initialValues: {
      companyAddress: '',
      postalcode: '',
      companyAdrees: '',
      email: '',
      // website: "",
      // contact: "",
      // invoiceId: "",
      // date: "",
      name: '',
      // status: "",
      // country: "",
      // amount: "",
      billing_address: '',
      billing_phone: '',
      billing_taxno: '',
      shipping_name: '',
      shipping_address: '',
      shipping_phone: '',
      shipping_taxno: '',
      product_name: '',
    },
    validationSchema: Yup.object({
      companyAdrees: Yup.string().required('Please Enter a Company Address'),
      email: Yup.string().required('Please Enter a Email'),
      postalcode: Yup.string().required('Please Enter a Postal Code'),
      // website: Yup.string().required("Please Enter a website"),
      // contact: Yup.string().required("Please Enter a contact number"),
      // invoiceId: Yup.string().required("This field is required"),
      name: Yup.string().required('Please Enter a Full name'),
      // // country: Yup.string().required("Please Enter a Country"),
      billing_address: Yup.string().required('Please Enter a Address'),
      billing_phone: Yup.string().required('Please Enter a Phone Number'),
      billing_taxno: Yup.string().required('Please Enter a tax Number'),
      shipping_name: Yup.string().required('Please Enter a Full name'),
      shipping_address: Yup.string().required('Please Enter a Address'),
      shipping_phone: Yup.string().required('Please Enter a Phone Number'),
      shipping_taxno: Yup.string().required('Please enter a tax Number'),
      product_name: Yup.string().required('Please Enter a product Name'),
    }),
    onSubmit: (values: any) => {
      validation.resetForm();
    },
  });

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Invoice" title="New Invoice" />
          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <Form className="needs-validation" id="invoice_form">
                  <Card.Body className="border-bottom border-bottom-dashed p-4">
                    <Row>
                      <Col lg={6}>
                        <Row className="g-3">
                          <Col lg={8} sm={6}>
                            <label htmlFor="invoicenoInput">Invoice No</label>
                            <input
                              type="text"
                              className="form-control bg-light border-0"
                              id="invoicenoInput"
                              placeholder="Invoice No"
                              value="#VL25000355"
                              readOnly
                            />
                          </Col>

                          <Col lg={8} sm={6}>
                            <div>
                              <label htmlFor="date-field">Date</label>
                              <Flatpickr
                                name="date"
                                id="date-field"
                                className="form-control bg-light border-0"
                                placeholder="Create Date"
                                options={{
                                  altInput: true,
                                  altFormat: 'd M, Y',
                                  dateFormat: 'd M, Y',
                                }}
                                onChange={dateformate}
                                value={validation.values.date || ''}
                              />
                              {validation.touched.date &&
                              validation.errors.date ? (
                                <Form.Control.Feedback type="invalid">
                                  {validation.errors.date}
                                </Form.Control.Feedback>
                              ) : null}
                            </div>
                          </Col>

                          <Col lg={8} sm={6}>
                            <label htmlFor="choices-payment-status">
                              Payment Status
                            </label>
                            <div className="input-light">
                              <Select
                                className="bg-light border-0"
                                value={ispaymentStatus}
                                onChange={handleispaymentStatus}
                                options={paymentstatus}
                                name="choices-single-default"
                                id="idStatus"
                                placeholder="Payment Method"
                              />
                            </div>
                          </Col>

                          <Col lg={8} sm={6}>
                            <div>
                              <label htmlFor="totalamountInput">
                                Total Amount
                              </label>
                              <Form.Control
                                className="bg-light border-0"
                                type="text"
                                id="totalamountInput"
                                placeholder="$0.00"
                                readOnly
                                value={
                                  '$' +
                                  Math.round(rate * count + tax + charge - dis)
                                }
                              />
                            </div>
                          </Col>
                        </Row>
                      </Col>

                      <Col lg={4} className="ms-auto">
                        <div className="profile-user mx-auto  mb-3">
                          <input
                            id="profile-img-file-input"
                            type="file"
                            className="profile-img-file-input"
                          />
                          <label
                            htmlFor="profile-img-file-input"
                            className="d-block"
                            tabIndex={0}
                          >
                            <span
                              className="overflow-hidden border border-dashed d-flex align-items-center justify-content-center rounded"
                              style={{ height: '60px', width: '256px' }}
                            >
                              <img
                                src={logoDark}
                                className="card-logo card-logo-dark user-profile-image img-fluid"
                                alt="logo dark"
                              />
                              <img
                                src={logoLight}
                                className="card-logo card-logo-light user-profile-image img-fluid"
                                alt="logo light"
                              />
                            </span>
                          </label>
                        </div>

                        <div>
                          <label htmlFor="companyAddress">Address</label>
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            id="companyAdrees"
                            as="textarea"
                            // type="textarea"
                            className="bg-light border-0"
                            name="companyAdrees"
                            value={validation.values.companyAdrees || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="CompanyAddres"
                            isInvalid={
                              validation.errors.companyAdrees &&
                              validation.touched.companyAdrees
                                ? true
                                : false
                            }
                          />
                          {validation.errors.companyAdrees &&
                          validation.touched.companyAdrees ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.companyAdrees}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            id="companyaddpostalcode"
                            className="bg-light border-0"
                            name="postalcode"
                            value={validation.values.postalcode || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Postal Code"
                            isInvalid={
                              validation.errors.postalcode &&
                              validation.touched.postalcode
                                ? true
                                : false
                            }
                          />
                          {validation.errors.postalcode &&
                          validation.touched.postalcode ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.postalcode}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>

                        <div className="mb-2">
                          <Form.Control
                            type="email"
                            className="bg-light border-0"
                            id="companyEmail"
                            name="email"
                            value={validation.values.email || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Email Address"
                            isInvalid={
                              validation.errors.email &&
                              validation.touched.email
                                ? true
                                : false
                            }
                          />
                          {validation.errors.email &&
                          validation.touched.email ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.email}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            type="text"
                            className="bg-light border-0"
                            id="companyWebsite"
                            name="website"
                            value={validation.values.website || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Website"
                            isInvalid={
                              validation.errors.website &&
                              validation.touched.website
                                ? true
                                : false
                            }
                          />
                          {validation.errors.website &&
                          validation.touched.website ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.website}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            type="text"
                            data-plugin="cleave-phone"
                            className="bg-light border-0"
                            id="compnayContactno"
                            name="contact"
                            value={validation.values.contact || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Contact No"
                            isInvalid={
                              validation.errors.contact &&
                              validation.touched.contact
                                ? true
                                : false
                            }
                          />
                          {validation.errors.contact &&
                          validation.touched.contact ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.contact}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Body className="p-4 border-top border-top-dashed">
                    <Row>
                      <Col lg={4} sm={6}>
                        <div>
                          <label
                            htmlFor="billingName"
                            className="text-muted text-uppercase fw-semibold"
                          >
                            Billing Address
                          </label>
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            type="text"
                            className="bg-light border-0"
                            id="billingName"
                            name="name"
                            value={validation.values.name || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Full Name"
                            isInvalid={
                              validation.errors.name && validation.touched.name
                                ? true
                                : false
                            }
                          />
                          {validation.errors.name && validation.touched.name ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.name}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            as="textarea"
                            type="textarea"
                            className="bg-light border-0"
                            id="billingAddress"
                            name="billing_address"
                            value={validation.values.billing_address || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            rows={3}
                            placeholder="Address"
                            isInvalid={
                              validation.errors.billing_address &&
                              validation.touched.billing_address
                                ? true
                                : false
                            }
                          />
                          {validation.errors.billing_address &&
                          validation.touched.billing_address ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.billing_address}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="mb-2">
                          <Form.Control
                            type="text"
                            data-plugin="cleave-phone"
                            className="bg-light border-0"
                            id="billingPhoneno"
                            name="billing_phone"
                            value={validation.values.billing_phone || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="(123)456-7890"
                            isInvalid={
                              validation.errors.billing_phone &&
                              validation.touched.billing_phone
                                ? true
                                : false
                            }
                          />
                          {validation.errors.billing_phone &&
                          validation.touched.billing_phone ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.billing_phone}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="mb-3">
                          <Form.Control
                            type="text"
                            id="billingTaxno"
                            className="bg-light border-0"
                            name="billing_taxno"
                            value={validation.values.billing_taxno || ''}
                            onBlur={validation.handleBlur}
                            onChange={validation.handleChange}
                            placeholder="Tax Number"
                            isInvalid={
                              validation.errors.billing_taxno &&
                              validation.touched.billing_taxno
                                ? true
                                : false
                            }
                          />
                          {validation.errors.billing_taxno &&
                          validation.touched.billing_taxno ? (
                            <Form.Control.Feedback type="invalid">
                              {validation.errors.billing_taxno}
                            </Form.Control.Feedback>
                          ) : null}
                        </div>
                        <div className="form-check">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="same"
                            name="same"
                          />
                          <label className="form-check-label" htmlFor="same">
                            Will your Billing and Shipping address same?
                          </label>
                        </div>
                      </Col>

                      <Col sm={6} className="ms-auto">
                        <Row>
                          <div className="col-lg-8">
                            <div>
                              <label
                                htmlFor="shippingName"
                                className="text-muted text-uppercase fw-semibold"
                              >
                                Shipping Address
                              </label>
                            </div>
                            <div className="mb-2">
                              <Form.Control
                                type="text"
                                id="shippingName"
                                className="bg-light border-0"
                                name="shipping_name"
                                value={validation.values.shipping_name || ''}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                placeholder="Full Name"
                                isInvalid={
                                  validation.errors.shipping_name &&
                                  validation.touched.shipping_name
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.shipping_name &&
                              validation.touched.shipping_name ? (
                                <Form.Control.Feedback type="invalid">
                                  {validation.errors.shipping_name}
                                </Form.Control.Feedback>
                              ) : null}
                            </div>
                            <div className="mb-2">
                              <Form.Control
                                as="textarea"
                                type="textarea"
                                className="bg-light border-0"
                                id="shippingAddress"
                                rows={3}
                                name="shipping_address"
                                value={validation.values.shipping_address || ''}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                placeholder="Address"
                                isInvalid={
                                  validation.errors.shipping_address &&
                                  validation.touched.shipping_address
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.shipping_address &&
                              validation.touched.shipping_address ? (
                                <Form.Control.Feedback type="invalid">
                                  {validation.errors.shipping_address}
                                </Form.Control.Feedback>
                              ) : null}
                            </div>
                            <div className="mb-2">
                              <Form.Control
                                type="text"
                                data-plugin="cleave-phone"
                                className="bg-light border-0"
                                id="shippingPhoneno"
                                name="shipping_phone"
                                value={validation.values.shipping_phone || ''}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                placeholder="(123)456-7890"
                                isInvalid={
                                  validation.errors.shipping_phone &&
                                  validation.touched.shipping_phone
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.shipping_phone &&
                              validation.touched.shipping_phone ? (
                                <Form.Control.Feedback type="invalid">
                                  {validation.errors.shipping_phone}
                                </Form.Control.Feedback>
                              ) : null}
                            </div>
                            <div>
                              <Form.Control
                                type="text"
                                id="shippingTaxno"
                                placeholder="Tax Number"
                                className="bg-light border-0"
                                name="shipping_taxno"
                                value={validation.values.shipping_taxno || ''}
                                onBlur={validation.handleBlur}
                                onChange={validation.handleChange}
                                isInvalid={
                                  validation.errors.shipping_taxno &&
                                  validation.touched.shipping_taxno
                                    ? true
                                    : false
                                }
                              />
                              {validation.errors.shipping_taxno &&
                              validation.touched.shipping_taxno ? (
                                <Form.Control.Feedback type="invalid">
                                  {validation.errors.shipping_taxno}
                                </Form.Control.Feedback>
                              ) : null}
                            </div>
                          </div>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Body className="p-4">
                    <div className="table-responsive">
                      <table className="invoice-table table table-borderless table-nowrap mb-0">
                        <thead className="align-middle">
                          <tr className="table-active">
                            <th scope="col" style={{ width: '50px' }}>
                              #
                            </th>
                            <th scope="col">Product Details</th>
                            <th scope="col" style={{ width: '120px' }}>
                              <div className="d-flex currency-select input-light align-items-center">
                                Rate
                                <Form.Select
                                  className="form-selectborder-0 bg-light border-0"
                                  id="choices-payment-currency"
                                >
                                  <option value="$">($)</option>
                                  <option value="£">(£)</option>
                                  <option value="₹">(₹)</option>
                                  <option value="€">(€)</option>
                                </Form.Select>
                              </div>
                            </th>
                            <th scope="col" style={{ width: '120px' }}>
                              Quantity
                            </th>
                            <th
                              scope="col"
                              className="text-end"
                              style={{ width: '150px' }}
                            >
                              Amount
                            </th>
                            <th
                              scope="col"
                              className="text-end"
                              style={{ width: '105px' }}
                            ></th>
                          </tr>
                        </thead>
                        <tbody id="newlink">
                          <tr id="1" className="product">
                            <th scope="row" className="product-id">
                              1
                            </th>
                            <td className="text-start">
                              <div className="mb-2">
                                <Form.Control
                                  type="text"
                                  id="productName-1"
                                  className="bg-light border-0"
                                  placeholder="Product Name"
                                  name="product_name"
                                  value={validation.values.product_name || ''}
                                  onBlur={validation.handleBlur}
                                  onChange={validation.handleChange}
                                  isInvalid={
                                    validation.errors.product_name &&
                                    validation.touched.product_name
                                      ? true
                                      : false
                                  }
                                />
                                {validation.errors.product_name &&
                                validation.touched.product_name ? (
                                  <Form.Control.Feedback type="invalid">
                                    {validation.errors.product_name}
                                  </Form.Control.Feedback>
                                ) : null}
                              </div>
                              <textarea
                                className="form-control bg-light border-0"
                                id="productDetails-1"
                                rows={2}
                                placeholder="Product Details"
                              ></textarea>
                            </td>
                            <td>
                              <Form.Control
                                type="number"
                                className="product-price bg-light border-0"
                                placeholder="0.00"
                                id="productRate-1"
                                step="0.01"
                                onChange={(e: any) => {
                                  setRate(e.target.value);
                                }}
                              />
                              <div className="invalid-feedback">
                                Please enter a rate
                              </div>
                            </td>
                            <td>
                              <div className="input-step">
                                <Button
                                  type="button"
                                  className="minus-btn"
                                  onClick={() =>
                                    setCount(count > 0 ? count - 1 : count)
                                  }
                                >
                                  –
                                </Button>
                                <Form.Control
                                  type="number"
                                  className="product-quantity"
                                  id="product-qty-1"
                                  value={count}
                                  readOnly
                                />
                                <Button
                                  type="button"
                                  className="plus-btn"
                                  onClick={() => setCount(count + 1)}
                                >
                                  +
                                </Button>
                              </div>
                            </td>
                            <td className="text-end">
                              <div>
                                <Form.Control
                                  type="text"
                                  className="product-line-price"
                                  id="productPrice-1"
                                  placeholder="$0.00"
                                  value={'$' + rate * count}
                                  readOnly
                                />
                              </div>
                            </td>
                            <td className="product-removal">
                              <Link to="#" className="btn btn-success">
                                Delete
                              </Link>
                            </td>
                          </tr>
                        </tbody>
                        <tbody>
                          <tr id="newForm" style={{ display: 'none' }}>
                            <td className="d-none" colSpan={5}>
                              <p>Add New Form</p>
                            </td>
                          </tr>
                          <tr>
                            <td colSpan={5}>
                              <Link
                                to="#"
                                id="add-item"
                                className="btn btn-soft-secondary fw-medium"
                              >
                                <i className="ri-add-fill me-1 align-bottom"></i>{' '}
                                Add Item
                              </Link>
                            </td>
                          </tr>
                          <tr className="border-top border-top-dashed mt-2">
                            <td colSpan={3}></td>
                            <td colSpan={2} className="p-0">
                              <Table className="table-borderless table-sm table-nowrap align-middle mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row">Sub Total</th>
                                    <td style={{ width: '150px' }}>
                                      <Form.Control
                                        type="text"
                                        id="cart-subtotal"
                                        placeholder="$0.00"
                                        readOnly
                                        value={'$' + rate * count}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Estimated Tax (12.5%)</th>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        id="cart-tax"
                                        placeholder="$0.00"
                                        readOnly
                                        value={'$' + tax}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">
                                      Discount{' '}
                                      <small className="text-muted">
                                        (Invoika15)
                                      </small>
                                    </th>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        id="cart-discount"
                                        placeholder="$0.00"
                                        readOnly
                                        value={'$' + dis}
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Shipping Charge</th>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        id="cart-shipping"
                                        placeholder="$0.00"
                                        readOnly
                                        value={'$' + charge}
                                      />
                                    </td>
                                  </tr>
                                  <tr className="border-top border-top-dashed">
                                    <th scope="row">Total Amount</th>
                                    <td>
                                      <Form.Control
                                        type="text"
                                        id="cart-total"
                                        placeholder="$0.00"
                                        readOnly
                                        value={
                                          '$' +
                                          Math.round(
                                            rate * count + tax + charge - dis
                                          )
                                        }
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <Row className="mt-3">
                      <Col lg={4}>
                        <div className="mb-2">
                          <label
                            htmlFor="choices-payment-type"
                            className="form-label text-muted text-uppercase fw-semibold"
                          >
                            Payment Details
                          </label>
                          <div className="input-light">
                            <Select
                              className="bg-light border-0"
                              value={isallStatus}
                              onChange={handleisAllStatus}
                              options={allstatus}
                              name="choices-single-default"
                              id="idStatus"
                              placeholder="Payment Method"
                            />
                            {validation.touched.status &&
                            validation.errors.status ? (
                              <Form.Control.Feedback type="invalid">
                                {validation.errors.status}
                              </Form.Control.Feedback>
                            ) : null}
                          </div>
                        </div>
                        <div className="mb-2">
                          <input
                            className="form-control bg-light border-0"
                            type="text"
                            id="cardholderName"
                            placeholder="Card Holder Name"
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            className="form-control bg-light border-0"
                            type="text"
                            id="cardNumber"
                            placeholder="xxxx xxxx xxxx xxxx"
                          />
                        </div>
                        <div>
                          <input
                            className="form-control  bg-light border-0"
                            type="text"
                            id="amountTotalPay"
                            placeholder="$0.00"
                            readOnly
                          />
                        </div>
                      </Col>
                    </Row>

                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlTextarea1"
                        className="form-label text-muted text-uppercase fw-semibold"
                      >
                        NOTES
                      </label>
                      <Alert
                        className="form-control alert-info"
                        id="exampleFormControlTextarea1"
                      >
                        All accounts are to be paid within 7 days from receipt
                        of invoice. To be paid by cheque or credit card or
                        direct payment online. If account is not paid within 7
                        days the credits details supplied as confirmation of
                        work undertaken will be charged the agreed quoted fee
                        noted above.
                      </Alert>
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <button type="submit" className="btn btn-info">
                        <i className="ri-printer-line align-bottom me-1"></i>{' '}
                        Save
                      </button>
                      <Link to="#" className="btn btn-primary">
                        <i className="ri-download-2-line align-bottom me-1"></i>{' '}
                        Download Invoice
                      </Link>
                      <Link to="#" className="btn btn-danger">
                        <i className="ri-send-plane-fill align-bottom me-1"></i>{' '}
                        Send Invoice
                      </Link>
                    </div>
                  </Card.Body>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddInvoice;
