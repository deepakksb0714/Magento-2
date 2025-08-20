import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { countryData } from '../../../Common/data/countryState';
import { addCustomers as onAddCustomer } from '../../../slices/thunk';
import Select from 'react-select';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


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
  'Address Change Needed',
  'Annoyed',
  'Business Closed',
  'Contractor',
  'Do Not Use',
  'Drop Ship',
  'Exclude From Auto Requests',
  'Insufficient Address',
  'Internal Customer',
  'Moved',
  'Name Change Needed',
  'No Longer Customer',
  'Refused',
  'Undeliverable Address',
];

type CountrystateData = {
  USA: string[];
};

const regionOptions: RegionOption[] = countryData.USA.map((region) => ({
  value: region,
  label: region,
}));

const AddCustomer = () => {
  document.title = 'Add Customer | Dashboard';

  const [tax_regions, setTaxRegions] = React.useState<string[]>([]);
  //const [isSaveAndAddCertificate, setIsSaveAndAddCertificate] = useState(false);
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
  useEffect(() => {
    if (primaryEntity) {
      formik.setFieldValue('entity_id', primaryEntity.id);
    }
  }, [primaryEntity]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      entity_id: (primaryEntity && primaryEntity.id) || '',
      customer_name: '',
      customer_code: '',
      taxpayer_id: '',
      alternate_id: '',
      customer_labels: '',
      tax_regions: [],
      name: '',
      email: '',
      phone: '',
      fax: '',
      address_line1: '',
      address_line2: '',
      city: '',
      region: '',
      zip_code: '',
      country: 'USA',
    },

    validationSchema: Yup.object({
      customer_name: Yup.string().required('Customer name is required'),
      customer_code: Yup.string().required('Customer code is required'),
      address_line1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      region: Yup.string().required('region is required'),
      zip_code: Yup.string().required('Zip is required'),
    }),
    onSubmit: (values: any) => {
      if (!primaryEntity || !primaryEntity.id) {
        alert('Primary entity is required to create a customer.');
        return;
      }

      const customer = {
        entity_id: primaryEntity.id,
        customer_name: values.customer_name,
        customer_code: values.customer_code,
        taxpayer_id: values.taxpayer_id,
        alternate_id: values.alternate_id,
        customer_labels: values.customer_labels,
        tax_regions: values.tax_regions
          .map((region: any) => region.value)
          .join(', '),
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
          region: values.region,
          zip_code: values.zip_code,
          country: values.country,
        },
      };

      dispatch(onAddCustomer({ customer }))
        .then((response: any) => {
          navigate('/customers', { state: { activeTab: 'Customer List' } });
        })
        .catch((error: any) => {
          // Handle error
        });

      formik.resetForm();
    },
  });

  const handleSaveAndAddCertificate = () => {
    const customerData = {
      entity_id: primaryEntity?.id || '',
      customer_name: formik.values.customer_name,
      customer_code: formik.values.customer_code,
      taxpayer_id: formik.values.taxpayer_id,
      alternate_id: formik.values.alternate_id,
      customer_labels: formik.values.customer_labels,
      tax_exemption: {
        tax_regions: formik.values.tax_regions.map((region: any) => region.value).join(', '),
      },
      contact: {
        name: formik.values.name,
        email: formik.values.email,
        phone: formik.values.phone,
        fax_number: formik.values.fax,
      },
      external_address: {
        address_line1: formik.values.address_line1,
        address_line2: formik.values.address_line2,
        city: formik.values.city,
        region: formik.values.region,
        zip_code: formik.values.zip_code,
        country: formik.values.country,
      },
    };

    navigate('/add-certificate', {
      state: { customerData },
    });
  };



  const handleCountryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedCountry = event.target.value as keyof CountrystateData;
    formik.handleChange(event);
    setTaxRegions(countrystateData[selectedCountry] || []);
  };
  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{
          padding: 'unset',
          paddingBottom: 'revert-layer',
        }}
      >
        <Container fluid>
          {/* <BreadCrumb pageTitle="Add Customer" title="Add Customer" /> */}
          <Row>
            <Col xl={12}>

              <Form onSubmit={formik.handleSubmit}>
                <Row className="mt-4">
                  <Col md="3">
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
                  <Col md="3">
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
                  <Col md="3">
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
                  <Col md="3">
                    <Form.Group>
                      <Form.Label htmlFor="alternate_id">
                        Alternate ID
                      </Form.Label>
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
                <br />
                <Row>
                  <Col md="4">
                    <h3 className="mb-3">Primary business address</h3>
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
                      {/* <Form.Control.Feedback type="invalid">
                                                        {formik.values.errors.country}
                                                    </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>

                  <Col md="4">
                    <h3 className="mb-3">Contact information</h3>
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

                  <Col md="4">
                    <h3 className="mb-3">Tax regions</h3>
                    <Form.Group>
                      <Form.Label htmlFor="tax_regions">Region</Form.Label>
                      <Select
                        className="basic-multi-select"
                        classNamePrefix="select"
                        id="tax_regions"
                        name="tax_regions"
                        options={regionOptions}
                        isMulti
                        value={formik.values.tax_regions}
                        onChange={(selectedOption: any) => {
                          formik.setFieldValue(
                            'tax_regions',
                            selectedOption
                          );
                        }}
                        onBlur={formik.handleBlur}
                      />
                      {formik.touched.tax_regions &&
                        formik.errors.tax_regions ? (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.tax_regions}
                        </Form.Control.Feedback>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
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
                      <Form.Label htmlFor="phone">Phone number</Form.Label>
                      <Form.Control
                        name="phone"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.phone}
                        isInvalid={
                          formik.touched.phone && !!formik.errors.phone
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.phone}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
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
                        <option></option>
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

                <Row>
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
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label htmlFor="email">Email</Form.Label>
                      <Form.Control
                        id="email"
                        name="email"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        isInvalid={
                          formik.touched.email && !!formik.errors.email
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.email}
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
                  <Col md="4">
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
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label htmlFor="region">
                        Region<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        className="form-select"
                        as="select"
                        id="region"
                        name="region"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.region}
                        isInvalid={
                          formik.touched.region && !!formik.errors.region
                        }
                      >
                        <option></option>
                        {stateOptions.map((region) => (
                          <option key={region} value={region}>
                            {region}
                          </option>
                        ))}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.region}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
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

                <Row className="mt-4">
                  <Col md="2">
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100px' }}
                    >
                      Save
                    </Button>
                  </Col>
                  <Col md="3">
                    <Button
                      className="btn btn-primary"
                      type="button"
                      onClick={handleSaveAndAddCertificate}
                    >
                      Save and Add Certificate
                    </Button>
                  </Col>
                  <Col md="1">
                    <button
                      type="button"
                      className="btn btn-light"
                      style={{ width: '100px' }}
                      onClick={() => {
                        formik.resetForm();
                        // handleCancel();
                      }}
                    >
                      Discard
                    </button>
                  </Col>
                </Row>
                <div></div>
              </Form>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddCustomer;
