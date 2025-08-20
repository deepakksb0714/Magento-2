import React, { useState, useEffect } from 'react';
import { useFormik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { Card, Col, Container, Row, Button, Form } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';
import { editEntitiesLocations as oneditEntitiesLocations } from '../../../slices/thunk';
import { countryData } from '../../../Common/data/countryState';
import { attributeData } from '../../../Common/data/location';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import Map from '../../../pages/components/Map';
import { createContext } from 'react';

import { useMarkerRef } from '@vis.gl/react-google-maps';
import AddressValidationModal from './AddressValidationModal';
import { string } from 'yup';
import { addAddressValidation as onAddAddressValidation } from '../../../slices/thunk';

type CountryregionData = {
  USA: string[];
  // Canada: string[];
  // Australia: string[];
};
export const mapContext = createContext({});

interface AttributeOption {
  name: string;
  values: string[];
  unitOfMeasure?: string[];
}

const attributeOptions: AttributeOption[] = attributeData;

const countryNameMapping: { [key: string]: string } = {
  "USA": "United States",
};

const reverseCountryMapping: { [key: string]: string } = {
  "United States": "USA",
};

interface Attribute {
  attribute_name: string;
  attribute_value: string;
  attribute_unit_of_measure: string;
}

const countryregionData = {
  USA: countryData.USA,
  Canada: countryData.Canada,
  Australia: countryData.Australia,
};

interface PrimaryEntity {
  id: any;
  name: string;
}

interface locationEditProps {
  onCancel: () => void;
  edit: any;
}

const EditLocations = ({ onCancel, edit }: locationEditProps) => {
  const [regions, setregions] = React.useState<any[]>([]);
  const [isMarketPlaceSelect, setIsMarketPlaceSelect] = useState(false);
  const [isEntitySellOutsideUsa, setIsEntitySellOutsideUsa] = useState(false);

  const [isSalesPerson, setIsSalesPerson] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const [cont, setCont] = useState<any>('');
  const [stat, setStat] = useState<any>('');
  const [countryData, setCountryData] = useState<string[]>([]);
  const [countryCodeMap, setCountryCodeMap] = useState<any>({});
  const [stateCodeMap, setStateCodeMap] = useState<any>({});
  const [data, setData] = useState<any>({});
  const [loder, setLoader] = React.useState(false);
  const [validText, setValidText] = React.useState('Validate Address');
  const [location, setLocation] = React.useState<any>({});
  const [isAddressValidationModalOpen, setIsAddressValidationModalOpen] = useState(false);
  const [originalAddress, setOriginalAddress] = useState<any>(null);
  const [validatedAddress, setValidatedAddress] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);


  const [locationAttributes, setLocationAttributes] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: 34.2805,
    lng: -119.2940,
  });

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const [markerRef, marker] = useMarkerRef();

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
  useEffect(() => {
    formik.setFieldValue('country', location.country);
    formik.setFieldValue('line1', location.address);
    formik.setFieldValue('city', location.city);
    formik.setFieldValue('region', location.state);
    formik.setFieldValue('postal_code', location.pin);

    queueMicrotask(() => {
      setCont(location.country);
      setregions(data[location.country]);
    });
    queueMicrotask(() => {
      setStat(location.state);
      setValidText('Validate Address');
    });
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/country_states.json');
      const jsonData = await response.json();
      const temp: { [key: string]: any } = {};
      const code_temp: { [key: string]: any } = {};
      
      // Add country name mapping
      const countryMapping: { [key: string]: string } = {
        "United States": "USA",
        // Add other mappings as needed
      };
      
      jsonData.data.forEach((item: any) => {
        temp[item.name] = item.states.length > 0 ? item.states : ['No data'];
        code_temp[item.name] = item?.iso2;
        
        // Also add mapped names to the temp object
        if (countryMapping[item.name]) {
          temp[countryMapping[item.name]] = temp[item.name];
        }
      });
      setData(temp);
      setCountryCodeMap(code_temp);
      setCountryData([...jsonData.data]);
    };
    fetchData();
  }, []);

  // Modify the useEffect that sets initial values
  useEffect(() => {
    if (edit) {
      // Map the country code to the full name
      const mappedCountry = countryNameMapping[edit.country] || edit.country;
      
      // Set the form values with the mapped country
      formik.setValues({
        ...edit,
        country: mappedCountry
      });
      
      // Set regions based on mapped country
      if (data[mappedCountry]) {
        setregions(data[mappedCountry]);
      }
    }
  }, [edit, data]);
    const handleAddAttribute = () => {
      formik.setFieldValue('location_attributes', [
        ...formik.values.location_attributes,
        {
          attribute_name: '',
          attribute_value: '',
          attribute_unit_of_measure: '',
        },
      ]);
    };
    
    const handleAttributeChange = (
      index: number,
      field: keyof Attribute,
      value: string
    ) => {
      const newAttributes = [...formik.values.location_attributes];
      newAttributes[index][field] = value;
      formik.setFieldValue('location_attributes', newAttributes);
    };
  
    const handleRemoveAttribute = (index: number) => {
      const newAttributes = formik.values.location_attributes.filter(
        (_: any, i: any) => i !== index
      );
      formik.setFieldValue('location_attributes', newAttributes);
    };

  const validationSchema = Yup.object().shape({
    location_code: Yup.string().required('Required'),
    address_type_id: Yup.string().required('Required'),
    address_category_id: Yup.string().test({
      name: 'addressCategoryIdRequired',
      test: (value: any, context: any) => {
        const { address_type_id } = context.parent;
        if (address_type_id === 'marketplace') {
          return true;
        }
        if (address_type_id === 'salesperson') {
          return value === 'salesperson';
        }
        return value !== undefined && value.trim().length > 0;
      },
      message: 'address_category_id is required for this type',
    }),
    country: Yup.string().test({
      name: 'countryRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    line1: Yup.string().test({
      name: 'addressRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    city: Yup.string().test({
      name: 'cityRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    region: Yup.string().test({
      name: 'regionRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    postal_code: Yup.string().test({
      name: 'postalCodeRequired',
      test: (value: any, context: any) => {
        return (
          context.parent.address_type_id === 'marketplace' ||
          (value !== undefined && value.length > 0)
        );
      },
      message: 'Required',
    }),
    start_date: Yup.string().required('Required'),
    end_date: Yup.string(),
    location_attributes: Yup.array().of(
      Yup.object().shape({
        attribute_name: Yup.string(),
        attribute_value: Yup.string().test({
          name: 'attributeValueRequired',
          test: function (value: any) {
            const { attribute_name } = this.parent;
            return !attribute_name || (value && value.length > 0);
          },
          message: 'Attribute value is required if attribute name is provided',
        }),
        attribute_unit_of_measure: Yup.string().test({
          name: 'attributeUnitOfMeasureRequired',
          test: function (value: any) {
            const { attribute_name } = this.parent;
            return (
              attribute_name !== 'Number of units for rent' ||
              (value && value.length > 0)
            );
          },
          message: 'Unit of Measure is required ',
        }),
      })
    ),
  });

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (edit && edit.id) || '',
      location_code: (edit && edit.location_code) || '',
      friendly_name: (edit && edit.friendly_name) || '',
      address_type_id: (edit && edit.address_type_id) || '',
      address_category_id: (edit && edit.address_category_id) || '',
      is_default: (edit && edit.is_default) || '',
      country: (edit && edit.country) || '',
      line1: (edit && edit.line1) || '',
      city: (edit && edit.city) || '',
      region: (edit && edit.region) || '',
      postal_code: (edit && edit.postal_code) || '',
      start_date: (edit && edit.start_date) || '',
      end_date: (edit && edit.end_date) || '',
      is_marketplace_outside_usa:
        (edit && edit.is_marketplace_outside_usa) || '',
      is_marketplace_remit_tax: (edit && edit.is_marketplace_remit_tax) || 'false',
      location_attributes: (edit && edit.location_attributes) || [
        {
          attribute_name: '',
          attribute_value: '',
          attribute_unit_of_measure: '',
        },
      ],
    },
    validationSchema,

    onSubmit: async (values: any) => {
      try {
        // await validationSchema.validate(values, { abortEarly: false });
        const transformedValues = {
          location: values,
        };

        dispatch(oneditEntitiesLocations(transformedValues));
        onCancel();
      } catch (err: any) {
        if (err instanceof Yup.ValidationError) {
          const errors: { [key: string]: string } = {};
          err.inner.forEach((error: any) => {
            if (error.path) {
              errors[error.path] = error.message;
              console.log(error.message);
            }
          });
          formik.setErrors(errors);
        }
      }
    },
  });

 
      const handleCountryChange = (
        event: React.ChangeEvent<{ value: unknown }>
      ) => {
        const selectedCountry = event.target.value as string;
        
        // Map the full country name back to the code if needed
        const countryCode = reverseCountryMapping[selectedCountry] || selectedCountry;
        
        formik.setFieldValue('country', selectedCountry);
        
        setCont(
          (event.target as HTMLSelectElement).options[
            (event.target as HTMLSelectElement).selectedIndex
          ].getAttribute('data-country')
        );
        
        setregions(data[selectedCountry] || []);
        formik.setFieldValue('region', '');
      };
    
    
      const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const selectedType = event.target.value as string;
        formik.handleChange(event);
    
        if (selectedType === 'salesperson') {
          formik.setFieldValue('address_category_id', 'salesperson');
          setIsMarketPlaceSelect(false);
          setIsSalesPerson(true);
        } else if (selectedType === 'marketplace') {
          formik.setFieldValue('address_category_id', 'other');
          setIsMarketPlaceSelect(true);
          setIsSalesPerson(false);
    
          formik.setFieldValue('country', '');
          formik.setFieldValue('line1', '');
          formik.setFieldValue('city', '');
          formik.setFieldValue('region', '');
          formik.setFieldValue('postal_code', '');
        } else {
          setIsMarketPlaceSelect(false);
          setIsSalesPerson(false);
        }
      };
      const formatAddressComponent = (text: string) => {
        if (!text) return '';
        
        // Split on spaces and handle each word
        return text.split(' ').map(word => {
          // Handle special cases like "PO" -> "PO" or "USA" -> "USA"
          if (word.toUpperCase() === word && word.length <= 3) return word;
          
          // Handle hyphenated words
          if (word.includes('-')) {
            return word.split('-')
              .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
              .join('-');
          }
          
          // Standard capitalization
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join(' ');
      };
    
 const validateAddress = async (e: any) => {
    e.preventDefault();
    
    // Check if required fields are filled
    const requiredFields = ['country', 'line1', 'city', 'region', 'postal_code'];
    const emptyFields = requiredFields.filter(field => !formik.values[field]);
    
    if (emptyFields.length > 0) {
      emptyFields.forEach(field => {
        formik.setFieldError(field, 'This field is required for validation');
        formik.setFieldTouched(field, true);
      });
      return;
    }
    
    setLoader(true);
    setValidText('Validating Address...');
    try {
      const { country, line1, city, region, postal_code } = formik.values;
      
      // Store original address for comparison
      const originalAddressData = {
        line1,
        city,
        region,
        country,
        postal_code
      };
      setOriginalAddress(originalAddressData);
  
      const requestData = {
        address: {
          postalCode: postal_code,
          addressLines: `${line1}`,
          regionCode: countryCodeMap[country],
          administrativeArea: stateCodeMap[region],
          locality: city,
        },
      };
      
          // Dispatch the address validation action
          const action = await dispatch(onAddAddressValidation(requestData));
          if (action.type.endsWith('/fulfilled')) {
            setApiResponse(action.payload);
          } else {
            throw new Error('Address validation failed');
          }
        } catch (e: any) {
          console.log(e);
          setValidText('❌ Address Invalid');
          setIsAddressValidationModalOpen(true);
          setLoader(false);
        }
      }
      
  
  // Update the useEffect to handle the response
   useEffect(() => {
    if (apiResponse?.response?.result) {
      try {
        const { result } = apiResponse.response;
        const standardizedAddress = result.uspsData?.standardizedAddress;
        
        if (standardizedAddress) {
          const { country } = formik.values;
  
          const validatedAddressData = {
            line1: formatAddressComponent(standardizedAddress.firstAddressLine),
            city: formatAddressComponent(standardizedAddress.city),
            region: formik.values.region,
            country: country,
            postal_code: standardizedAddress.zipCodeExtension 
              ? `${standardizedAddress.zipCode}-${standardizedAddress.zipCodeExtension}`
              : standardizedAddress.zipCode
          };
          setValidatedAddress(validatedAddressData);
          setIsAddressValidationModalOpen(true);
        }
  
        if (apiResponse.isAddressValid) {
          const geocode = result.geocode?.location;
  
          if (geocode) {
            setLocationAttributes({
              lat: geocode.latitude,
              lng: geocode.longitude,
            });
  
            const map = marker?.getMap() as google.maps.Map;
            if (map) {
              map.panTo({
                lat: geocode.latitude,
                lng: geocode.longitude,
              });
            }
            setValidText('✅ Address Validated');
          }
        } else {
          setValidText('Address Not Valid');
        }
  
        setLoader(false);
      } catch (e: any) {
        console.log('Error processing validation response:', e);
        setValidText('Error Processing Address');
        setIsAddressValidationModalOpen(true);
        setLoader(false);
      }
    }
  }, [apiResponse]);
    
      const handleUseValidatedAddress = () => {
        // Update form with validated address
        formik.setValues({
          ...formik.values,
          line1: validatedAddress.line1,
          city: validatedAddress.city,
          region: validatedAddress.region,
          postal_code: validatedAddress.postal_code
        });
    
        // Close modal
        setIsAddressValidationModalOpen(false);
        setValidText('✅ Address Validated');
      };
    
      const handleKeepOriginalAddress = () => {
        // Close modal without changing address
        setIsAddressValidationModalOpen(false);
        setValidText('Validate Address');
      };    

  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <Row>
            <Col xl={12}>
            <Form 
    onSubmit={(e) => {
      e.preventDefault();
      console.log("Form submit event triggered");
      formik.handleSubmit(e);
    }}
  >
                <br />

                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="location_code">
                        Location Code <span className="text-danger">*</span>{' '}
                      </Form.Label>
                      <Form.Control
                        id="location_code"
                        name="location_code"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.location_code}
                        isInvalid={
                          formik.touched.location_code &&
                          !!formik.errors.location_code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.location_code}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="friendly_name">
                        Friendly Name{' '}
                      </Form.Label>
                      <Form.Control
                        id="friendly_name"
                        name="friendly_name"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.friendly_name}
                        isInvalid={
                          formik.touched.friendly_name &&
                          !!formik.errors.friendly_name
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.friendly_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="address_type_id">
                        Type <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        className="form-select"
                        as="select"
                        id="address_type_id"
                        name="address_type_id"
                        onChange={handleTypeChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.address_type_id}
                        isInvalid={
                          formik.touched.address_type_id &&
                          !!formik.errors.address_type_id
                        }
                      >
                        <option value="location">Location</option>
                        <option value="salesperson">Salesperson</option>
                        <option value="marketplace">Marketplace</option>
                        {/* <option value="Marketplace">Marketplace</option> */}
                      </Form.Control>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.type}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <br />
                {!isMarketPlaceSelect ? (
                  <>
                    {!isSalesPerson && (
                      <>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label htmlFor="address_category_id">
                              category <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              className="form-select"
                              as="select"
                              id="address_category_id"
                              name="address_category_id"
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              value={formik.values.address_category_id}
                              isInvalid={
                                formik.touched.address_category_id &&
                                !!formik.errors.address_category_id
                              }
                            >
                              <option value="storefront">Storefront</option>
                              <option value="main_office">Main office</option>
                              <option value="warehouse">Warehouse</option>
                              <option value="other">Other</option>
                            </Form.Control>
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.address_category_id}
                            </Form.Control.Feedback>
                          </Form.Group>

                          {/* Only show the checkbox if is_default is false */}
                          {!edit.is_default && (
                          <Form.Group className="mt-3">
                            <Form.Check
                              name="is_default"
                              type="checkbox"
                              onChange={formik.handleChange}
                              checked={formik.values.is_default}
                              label="This is my primary business address"
                            />
                          </Form.Group>
                          )}
                        </Col>
                      </>
                    )}

                    <hr />
                    <Row className="mt-3">
                      <Col md={5}>
                        <h3>Address</h3>
                        <Row className="mt-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label htmlFor="country">
                                Country / Territory{' '}
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                className="form-select"
                                as="select"
                                id="country"
                                name="country"
                                onChange={(e) => {
                                  handleCountryChange(e);
                                  setValidText('Validate Address');
                                  const temp: any = {};
                                  data[e.target.value].forEach((item: any) => {
                                    temp[item.name] = item.state_code;
                                  });
                                  formik.setFieldValue(
                                    'region',
                                    e.target.value
                                  );
                                  setStateCodeMap(temp);
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.country}
                                isInvalid={
                                  formik.touched.country &&
                                  !!formik.errors.country
                                }
                              >
                                <option value="">Select country</option>
                                {countryData.map((country: any) => {
                                  return (
                                    <option
                                      key={country.iso2}
                                      data-country={country.iso2}
                                      value={country.name}
                                    >
                                      {country.name}
                                    </option>
                                  );
                                })}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.country}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label htmlFor="line1">
                                Address <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="line1"
                                name="line1"
                                type="text"
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  setValidText('Validate Address');
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.line1}
                                isInvalid={
                                  formik.touched.line1 && !!formik.errors.line1
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.line1}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-3">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label htmlFor="city">
                                City / County / Locality
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="city"
                                name="city"
                                type="text"
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  setValidText('Validate Address');
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.city}
                                isInvalid={
                                  formik.touched.city && !!formik.errors.city
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.city}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row className="mt-4">
                          <Col md={12}>
                            <Form.Group>
                              <Form.Label htmlFor="region">
                                Region / Territory
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                className="form-select"
                                as="select"
                                id="region"
                                name="region"
                                onChange={(event: any) => {
                                  setStat(
                                    (event.target as HTMLSelectElement).options[
                                      (event.target as HTMLSelectElement)
                                        .selectedIndex
                                    ].getAttribute('data-region')
                                  );
                                  formik.handleChange(event);
                                  setValidText('Validate Address');
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.region}
                                isInvalid={
                                  formik.touched.region &&
                                  !!formik.errors.region
                                }
                              >
                                <option value="">
                                  Select region or territory
                                </option>
                                {[...(regions || '')].map((region: any) => (
                                  <option
                                    key={region.name}
                                    data-region={region.state_code}
                                    value={region.name}
                                  >
                                    {region.name}
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
                          <Col>
                            <Form.Group>
                              <Form.Label htmlFor="postal_code">
                                Zip/Postal Code
                                <span className="text-danger">*</span>
                              </Form.Label>
                              <Form.Control
                                id="postal_code"
                                name="postal_code"
                                type="text"
                                onChange={(e) => {
                                  formik.handleChange(e);
                                  setValidText('Validate Address');
                                }}
                                onBlur={formik.handleBlur}
                                value={formik.values.postal_code}
                                isInvalid={
                                  formik.touched.postal_code &&
                                  !!formik.errors.postal_code
                                }
                              />
                              <Form.Control.Feedback type="invalid">
                                {formik.errors.postal_code}
                              </Form.Control.Feedback>
                            </Form.Group>
                          </Col>
                        </Row>

                        <br />
                        <Button 
                  onClick={validateAddress}
                  disabled={loder}
                >
                  {validText}
                </Button>
              </Col>
              <Col md="2" style={{paddingTop:"10%"}}>
                      {originalAddress && validatedAddress && (
                          <>
                              <p className="text-sm font-semibold mb-2 text-gray-700">Validated as</p>
                              <div className="space-y-2 text-sm">
                                <p> {validatedAddress.line1}</p>
                                <p> {validatedAddress.city} {validatedAddress.region}</p>
                                <p>{validatedAddress.country} {validatedAddress.postal_code}</p>
                              </div>
                          </>
                        )}
                     
              </Col>
                      <Col md={5}>
                        <mapContext.Provider value={locationAttributes}>
                          <Map
                            contextInjection={mapContext}
                            contextUpdator={setLocationAttributes}
                            setLocation={setLocation}
                            zoomLevel={13}
                            ref={markerRef}
                          />
                        </mapContext.Provider>
                      </Col>
                    </Row>
                   
                  </>
                ) : (
                  <>
                    <hr />
                    <h1>Marketplace</h1>
                    <div className="mt-4">
                      <Form.Group className="mt-3">
                        <Form.Check
                          name="is_marketplace_outside_usa"
                          type="checkbox"
                          onChange={(e) => {
                            formik.setFieldValue(
                              'is_marketplace_outside_usa',
                              e.target.checked ? 'true' : 'false'
                            );
                            setIsEntitySellOutsideUsa(e.target.checked);
                          }}
                          checked={
                            formik.values.is_marketplace_outside_usa === 'true'
                          }
                          label="This entity sells exclusively outside the U.S. and Canada."
                        />
                      </Form.Group>

                      {!isEntitySellOutsideUsa && (
                        <div style={{ paddingLeft: '0px' }}>
                          <div>
                            <h3>Marketplace transactions</h3>
                          </div>

                          <p style={{ paddingLeft: '0' }}>
                            This location is an online marketplace. Use the
                            location code when you import marketplace
                            transactions, or when you set up a rule for the
                            marketplace.
                          </p>
                          <div className="form-check">
                            <div className="mb-3 mt-4">
                              <h3>Returns for this location</h3>
                              <h5>
                                Select how this marketplace handles sales tax
                                <span className="text-danger">*</span>
                              </h5>
                              <div className="form-check mt-3">
                                <input
                                  type="radio"
                                  name="is_marketplace_remit_tax"
                                  value="true"
                                  className="form-check-input"
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.is_marketplace_remit_tax ===
                                    'true'
                                  }
                                />
                                <Form.Label style={{ color: 'gray' }}>
                                  As the seller, we remit tax on sales
                                </Form.Label>
                              </div>
                              <div className="form-check">
                                <input
                                  type="radio"
                                  name="is_marketplace_remit_tax"
                                  value="false"
                                  className="form-check-input"
                                  onChange={formik.handleChange}
                                  checked={
                                    formik.values.is_marketplace_remit_tax ===
                                    'false'
                                  }
                                />
                                <Form.Label style={{ color: 'gray' }}>
                                  The marketplace remits sales tax
                                </Form.Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}

                <hr />
                <h4>Business activity at this location</h4>

                <Row className="mt-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="start_date">
                        Effective<span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        id="start_date"
                        name="start_date"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.start_date}
                        isInvalid={
                          formik.touched.start_date &&
                          !!formik.errors.start_date
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.start_date}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={6}>
                    <Form.Group>
                      <Form.Label htmlFor="end_date">End Date</Form.Label>
                      <Form.Control
                        id="end_date"
                        name="end_date"
                        type="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.end_date}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <h4 className="mt-3">Attributes</h4>
                {formik.values.location_attributes.map(
                  (attribute: any, index: any) => (
                    <Row key={index} className="mb-3">
                      <Col md={4}>
                        <Form.Group>
                          <Form.Control
                            as="select"
                            name={`location_attributes[${index}].attribute_name`}
                            value={attribute.attribute_name}
                            onChange={(e) =>
                              handleAttributeChange(
                                index,
                                'attribute_name',
                                e.target.value
                              )
                            }
                            isInvalid={
                              formik.touched.location_attributes?.[index]
                                ?.attribute_name &&
                              formik.errors.location_attributes?.[index]
                                ?.attribute_name
                            }
                          >
                            <option value="">Select an attribute</option>
                            {attributeOptions.map((option) => (
                              <option key={option.name} value={option.name}>
                                {option.name}
                              </option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            {
                              formik.errors.location_attributes?.[index]
                                ?.attribute_name
                            }
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          {attribute.attribute_name ===
                            'Number of units for rent' ||
                          attribute.attribute_name === 'Iossregno' ? (
                            <Form.Control
                              type="text"
                              name={`location_attributes[${index}].attribute_value`}
                              value={attribute.attribute_value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'attribute_value',
                                  e.target.value
                                )
                              }
                              isInvalid={
                                formik.touched.location_attributes?.[index]
                                  ?.attribute_value &&
                                formik.errors.location_attributes?.[index]
                                  ?.attribute_value
                              }
                            />
                          ) : (
                            <Form.Control
                              as="select"
                              name={`location_attributes[${index}].attribute_value`}
                              value={attribute.attribute_value}
                              onChange={(e) =>
                                handleAttributeChange(
                                  index,
                                  'attribute_value',
                                  e.target.value
                                )
                              }
                              isInvalid={
                                formik.touched.location_attributes?.[index]
                                  ?.attribute_value &&
                                formik.errors.location_attributes?.[index]
                                  ?.attribute_value
                              }
                            >
                              <option value="">Select a value</option>
                              {attributeOptions
                                .find(
                                  (option) =>
                                    option.name === attribute.attribute_name
                                )
                                ?.values.map((value) => (
                                  <option key={value} value={value}>
                                    {value}
                                  </option>
                                ))}
                            </Form.Control>
                          )}
                          <Form.Control.Feedback type="invalid">
                            {
                              formik.errors.location_attributes?.[index]
                                ?.attribute_value
                            }
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={4}>
                        <Form.Group>
                          {attributeOptions.find(
                            (option) => option.name === attribute.attribute_name
                          )?.unitOfMeasure && (
                            <>
                              <Form.Control
                                as="select"
                                name={`location_attributes[${index}].attribute_unit_of_measure`}
                                value={attribute.attribute_unit_of_measure}
                                onChange={(e) =>
                                  handleAttributeChange(
                                    index,
                                    'attribute_unit_of_measure',
                                    e.target.value
                                  )
                                }
                                isInvalid={
                                  formik.touched.location_attributes?.[index]
                                    ?.attribute_unit_of_measure &&
                                  formik.errors.location_attributes?.[index]
                                    ?.attribute_unit_of_measure
                                }
                              >
                                <option value="">
                                  Select a unit of measure
                                </option>
                                {attributeOptions
                                  .find(
                                    (option) =>
                                      option.name === attribute.attribute_name
                                  )
                                  ?.unitOfMeasure?.map((unit) => (
                                    <option key={unit} value={unit}>
                                      {unit}
                                    </option>
                                  ))}
                              </Form.Control>
                              <Form.Control.Feedback type="invalid">
                                {
                                  formik.errors.location_attributes?.[index]
                                    ?.attribute_unit_of_measure
                                }
                              </Form.Control.Feedback>
                            </>
                          )}
                        </Form.Group>
                        <li
                          className="list-inline-item"
                          onClick={() => handleRemoveAttribute(index)}
                        >
                          <Link
                            to="#"
                            className="btn btn-soft-danger btn-sm d-inline-block"
                          >
                            <i className="bi bi-trash fs-17 align-middle"></i>
                          </Link>
                        </li>
                      </Col>
                    </Row>
                  )
                )}

            <Button

              type="button"
              className="btn btn-light"
              onClick={handleAddAttribute}
            >
              Add Attribute
            </Button>              
              <div className="hstack gap-2 justify-content-end">
                <Button
                  type="button"
                  className="btn btn-light"
                  style={{ marginLeft: '20px' }}
                  onClick={onCancel}
                >
                  Discard
                </Button>
                    <Button 
                  variant="primary" 
                  type="submit"
                >
                  Save location
                </Button>
              </div>
              </Form>
            </Col>
          </Row>
        </Container>
        <AddressValidationModal
            isOpen={isAddressValidationModalOpen}
            onClose={() => setIsAddressValidationModalOpen(false)}
            originalAddress={originalAddress}
            validatedAddress={validatedAddress}
            onUseValidated={handleUseValidatedAddress}
            onKeepOriginal={handleKeepOriginalAddress}
            apiResponse={apiResponse}
          />
      </div>
    </React.Fragment>
  );
};

export default EditLocations;
