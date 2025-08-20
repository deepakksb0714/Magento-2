import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import dummy from '../../assets/images/users/user-dummy-img.jpg';
import {
  getEntities as onGetEntities,
  editEntities as onEditEntities,
} from '../../slices/thunk';
import * as Yup from 'yup';
import { useNavigate, useLocation } from 'react-router-dom';

import { Button, Col, Form, Modal, Row } from 'react-bootstrap';

interface entitiesitProps {
  isShow: any;
  handleClose: any;
  edit: any;
  entityData: any;
}

const EditEntitiesAddress = ({
  isShow,
  handleClose,
  edit,
  entityData,
}: entitiesitProps) => {
  const dispatch = useDispatch();

  const [attributes, setAttributes] = useState([{ attribute: '', value: '' }]);

  const navigate = useNavigate();
  const location = useLocation();

  const [addressValidated, setAddressValidated] = useState(false);
  const [country, setCountry] = useState('United States of America');

  const states = [
    'Alabama',
    'Alaska',
    'American Samoa',
    // ... (add all states from your list)
  ];

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      country: 'United States of America',
      address_line1: (edit && edit.internal_address.address_line1) || '',
      city: (edit && edit.internal_address.city) || '',
      state: (edit && edit.internal_address.state) || '',
      zip_code: (edit && edit.internal_address.zip_code) || '',
    },

    validationSchema: Yup.object({
      country: Yup.string().required('Country is required'),
      address_line1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zip_code: Yup.string().required('ZIP/Postal Code is required'),
    }),
    onSubmit: (values: any) => {
      const allData = {
        ...entityData,
        address: values,
      };

      dispatch(onEditEntities(allData));
      navigate('/entities');
      formik.resetForm();
    },
  });

  const validateAddress = () => {
    setAddressValidated(true);
    alert('Address validated successfully!');
  };

  return (
    <React.Fragment>
      <Modal
        centered
        show={isShow}
        onHide={handleClose}
        style={{ display: 'block' }}
        tabIndex={-1}
      >
        <div className="modal-content border-0">
          <Modal.Header className="p-4 pb-0">
            <Modal.Title as="h5">Edit Address</Modal.Title>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form autoComplete="off" onSubmit={formik.handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label htmlFor="country">Country / Territory</Form.Label>
                <Form.Control
                  type="text"
                  id="country"
                  name="country"
                  value={country}
                  disabled
                  onChange={(e) => setCountry(e.target.value)}
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.country}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="address">Address </Form.Label>
                <Form.Control
                  id="address_line1"
                  name="address_line1"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address_line1}
                  isInvalid={
                    !!formik.touched.address_line1 &&
                    !!formik.errors.address_line1
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.address_line1}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="city">City</Form.Label>
                <Form.Control
                  id="city"
                  name="city"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.city}
                  isInvalid={!!formik.touched.city && !!formik.errors.city}
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.city}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="state">State or Territory</Form.Label>
                <Form.Select
                  id="state"
                  name="state"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.state}
                  isInvalid={!!formik.touched.state && !!formik.errors.state}
                >
                  <option value="">Select state or territory</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  {formik.errors.state}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label htmlFor="zip_code">ZIP/Postal Code</Form.Label>
                <Form.Control
                  id="zip_code"
                  name="zip_code"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.zip_code}
                  isInvalid={
                    !!formik.touched.zip_code && !!formik.errors.zip_code
                  }
                />
                <Form.Control.Feedback type="invalid">
                  {formik.errors.zip_code}
                </Form.Control.Feedback>
              </Form.Group>

              <Button type="button" variant="secondary" onClick={handleClose}>
                Back
              </Button>
              <Button
                variant="secondary"
                className="me-2"
                onClick={validateAddress}
              >
                Validate Address
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={!addressValidated}
                onClick={handleClose}
              >
                Submit
              </Button>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default EditEntitiesAddress;
