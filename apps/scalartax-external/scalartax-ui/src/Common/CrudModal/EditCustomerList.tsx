import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Modal, Row, Button, Form } from 'react-bootstrap';
import { countryData } from '../../Common/data/countryState';
import { editCustomerList as onEditCustomerList } from '../../slices/thunk';
import Select from 'react-select';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface CustomerEditProps {
  isShow: boolean;
  handleClose: () => void;
  edit: any;
}

interface PrimaryEntity {
  id: any;
  name: string;
}

interface RegionOption {
  value: string;
  label: string;
}

const countrystateData = {
  USA: countryData.USA,
};

const stateOptions = countryData.USA;

const labelOptions = [
  'ADDRESS CHANGE NEEDED',
  'ANNOYED',
  'BUSINESS CLOSED',
  'CONTRACTOR',
  'DO NOT USE',
  'DROP SHIP',
  'EXCLUDE FROM AUTO REQUESTS',
  'INSUFFICIENT ADDRESS',
  'INTERNAL CUSTOMER',
  'MOVED',
  'NAME CHANGE NEEDED',
  'NO LONGER CUSTOMER',
  'REFUSED',
  'UNDELIVERABLE ADDRESS',
];

type CountrystateData = {
  USA: string[];
};

const regionOptions: RegionOption[] = countryData.USA.map((region) => ({
  value: region,
  label: region,
}));

const EditCustomerList: React.FC<CustomerEditProps> = ({
  isShow,
  handleClose,
  edit,
}) => {
  document.title = 'Add Customer | Dashboard';

  const [exemption_reason, setExemption_reason] = React.useState<string[]>([]);
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
      } else {
        setPrimaryEntity(entitiesList[0]);
      }
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: edit?.id || '',
      entity_id: primaryEntity && primaryEntity.id,
      customer_name: edit?.customer_name || '',
      customer_code: edit?.customer_code || '',
      taxpayer_id: edit?.taxpayer_id || '',
      alternate_id: edit?.alternate_id || '',
      customer_labels: edit?.customer_labels || '',
      states: edit?.states || [],
      name: edit?.contact?.name || '',
      email: edit?.contact?.email || '',
      phone: edit?.contact?.phone || '',
      fax: edit?.contact?.fax_number || '',
      address_line1: edit?.external_address?.address_line1 || '',
      address_line2: edit?.external_address?.address_line2 || '',
      city: edit?.external_address?.city || '',
      state: edit?.external_address?.state || '',
      zip_code: edit?.external_address?.zip_code || '',
      country: edit?.external_address?.country || 'USA',
      exemption_reason: edit?.tax_exemption?.exemption_reason
        ? edit.tax_exemption.exemption_reason
            .split(', ')
            .map((region: string) => ({ value: region, label: region }))
        : [],
    },
    validationSchema: Yup.object({
      customer_name: Yup.string().required('Customer name is required'),
      customer_code: Yup.string().required('Customer code is required'),
      address_line1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      state: Yup.string().required('State is required'),
      zip_code: Yup.string().required('Zip is required'),
    }),
    onSubmit: (values: any) => {
      const customer = {
        ...values,
        entity_id: primaryEntity && primaryEntity.id,
        tax_exemption: {
          exemption_reason: values.exemption_reason
            .map((region: any) => region.value)
            .join(', '),
        },
        contact: {
          name: values.name,
          email: values.email,
          phone: values.phone,
          fax_number: values.fax,
        },
        external_address: {
          address_line1: values.address_line1,
          address_line2: values.address_line2,
          city: values.city,
          state: values.state,
          zip_code: values.zip_code,
          country: values.country,
        },
      };
      dispatch(onEditCustomerList({ customer }));
      handleClose();
    },
  });

  const handleCountryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedCountry = event.target.value as keyof CountrystateData;
    formik.handleChange(event);
    setExemption_reason(countrystateData[selectedCountry] || []);
    // formik.setFieldValue('state', '');
  };

  const handleRegionChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selectedCountry = 'USA';
    formik.handleChange(event);
    setExemption_reason(countrystateData[selectedCountry] || []);
    formik.setFieldValue('state', '');
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
            <Modal.Title as="h5">Edit Customer</Modal.Title>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form autoComplete="off" onSubmit={formik.handleSubmit}>
              <Row>
                <Col md="6">
                  <Form.Group>
                    <Form.Label htmlFor="customer_name">
                      Customer name<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      id="customer_name"
                      name="customer_name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.customer_name}
                      isInvalid={
                        formik.touched.customer_name &&
                        !!formik.errors.customer_name
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.customer_name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Label htmlFor="customer_code">
                      Customer code<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      id="customer_code"
                      name="customer_code"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.customer_code}
                      isInvalid={
                        formik.touched.customer_code &&
                        !!formik.errors.customer_code
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.customer_code}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <Col md="6">
                  <Form.Group>
                    <Form.Label htmlFor="taxpayer_id">Taxpayer ID</Form.Label>
                    <Form.Control
                      id="taxpayer_id"
                      name="taxpayer_id"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.taxpayer_id}
                      isInvalid={
                        formik.touched.taxpayer_id &&
                        !!formik.errors.taxpayer_id
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.taxpayer_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md="6">
                  <Form.Group>
                    <Form.Label htmlFor="alternate_id">Alternate ID</Form.Label>
                    <Form.Control
                      id="alternate_id"
                      name="alternate_id"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.alternate_id}
                      isInvalid={
                        formik.touched.alternate_id &&
                        !!formik.errors.alternate_id
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.alternate_id}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <h3 className="mb-3">Primary business address</h3>
                <Col md="4">
                  <Form.Group>
                    <Form.Label htmlFor="country">
                      Country<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      disabled
                      as="select"
                      id="country"
                      name="country"
                      onChange={handleCountryChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.country}
                      isInvalid={
                        formik.touched.country && !!formik.errors.country
                      }
                    >
                      {Object.keys(countrystateData).map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label htmlFor="address_line1">
                      Address<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      id="address_line1"
                      name="address_line1"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address_line1}
                      isInvalid={
                        formik.touched.address_line1 &&
                        !!formik.errors.address_line1
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.address_line1}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label htmlFor="address_line2">
                      Address Line 2
                    </Form.Label>
                    <Form.Control
                      id="address_line2"
                      name="address_line2"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.address_line2}
                      isInvalid={
                        formik.touched.address_line2 &&
                        !!formik.errors.address_line2
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.address_line2}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={4}>
                  <Form.Group>
                    <Form.Label htmlFor="city">
                      City<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      id="city"
                      name="city"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.city}
                      isInvalid={formik.touched.city && !!formik.errors.city}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.city}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label htmlFor="state">
                      Region<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      className="form-select"
                      as="select"
                      id="state"
                      name="state"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.state}
                      isInvalid={formik.touched.state && !!formik.errors.state}
                    >
                      <option></option>
                      {stateOptions.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.state}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group>
                    <Form.Label htmlFor="zip_code">
                      Zip<span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      id="zip_code"
                      name="zip_code"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.zip_code}
                      isInvalid={
                        formik.touched.zip_code && !!formik.errors.zip_code
                      }
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.zip_code}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <h3 className="mb-3">Contact information</h3>
                <Col md="6">
                  <Form.Group>
                    <Form.Label htmlFor="name">Name of contact</Form.Label>
                    <Form.Control
                      id="name"
                      name="name"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.name}
                      isInvalid={formik.touched.name && !!formik.errors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label htmlFor="phone">Phone number</Form.Label>
                    <Form.Control
                      name="phone"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.phone}
                      isInvalid={formik.touched.phone && !!formik.errors.phone}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.phone}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label htmlFor="email">Email</Form.Label>
                    <Form.Control
                      id="email"
                      name="email"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.email}
                      isInvalid={formik.touched.email && !!formik.errors.email}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>

                <Col md="6">
                  <Form.Group>
                    <Form.Label htmlFor="fax">Fax</Form.Label>
                    <Form.Control
                      id="fax"
                      name="fax"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.fax}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mt-3">
                <h3 className="mb-3">Tax regions</h3>
                <Col md="8">
                  <Form.Group>
                    <Form.Label htmlFor="exemption_reason">Region</Form.Label>
                    <Select
                      className="basic-multi-select"
                      classNamePrefix="select"
                      id="exemption_reason"
                      name="exemption_reason"
                      options={regionOptions}
                      isMulti
                      value={formik.values.exemption_reason}
                      onChange={(selectedOption: any) => {
                        formik.setFieldValue(
                          'exemption_reason',
                          selectedOption
                        );
                      }}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.exemption_reason &&
                    formik.errors.exemption_reason ? (
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.exemption_reason}
                      </Form.Control.Feedback>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={12}>
                  <h3 className=" mt-3">Additional customer info</h3>
                  <Form.Group>
                    <Form.Label htmlFor="customer_labels">
                      Customer labels
                    </Form.Label>
                    <Form.Control
                      className="form-select"
                      as="select"
                      id="customer_labels"
                      name="customer_labels"
                      onChange={handleCountryChange}
                      onBlur={formik.handleBlur}
                      value={formik.values?.customer_labels}
                      isInvalid={
                        formik.touched?.customer_labels &&
                        !!formik.errors?.customer_labels
                      }
                    >
                      {labelOptions.map((customer_labels) => (
                        <option key={customer_labels} value={customer_labels}>
                          {customer_labels}
                        </option>
                      ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                      {formik.values.errors?.customer_labels}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-3">
                <Button variant="secondary" type="submit">
                  Save
                </Button>
                <Button
                  variant="light"
                  style={{ marginLeft: '20px' }}
                  onClick={handleClose}
                >
                  Close
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default EditCustomerList;
