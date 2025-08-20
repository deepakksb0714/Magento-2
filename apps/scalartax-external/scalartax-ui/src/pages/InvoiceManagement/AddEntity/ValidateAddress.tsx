import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { addEntities as onAddEntities } from '../../../slices/thunk';
import Map from '../../../pages/components/Map';
import { createContext } from 'react';
import { useMarkerRef } from '@vis.gl/react-google-maps';
import AddressValidationModal from '.././EntityLocations/AddressValidationModal';
import { countryData } from '../../../Common/data/countryState';
import { addAddressValidation as onAddAddressValidation } from '../../../slices/thunk';

interface ValidateAddressProps {
  onSubmit: (data: any) => void;
  entityData: any;
  setStep: any;
}
type CountryregionData = {
  USA: string[];
};
export const mapContext = createContext({});

const countryregionData = {
  USA: countryData.USA,
  Canada: countryData.Canada,
  Australia: countryData.Australia,
};

const ValidateAddress: React.FC<ValidateAddressProps> = ({
  onSubmit,
  entityData,
  setStep,
}) => {
  const navigate = useNavigate();
  const [addressValidated, setAddressValidated] = useState(false);
  const [country, setCountry] = useState('United');
  const [cont, setCont] = useState<any>('');
  const [regions, setregions] = React.useState<any[]>([]);
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

  const dispatch = useDispatch();

  const [locationAttributes, setLocationAttributes] = useState<{
    lat: number | null;
    lng: number | null;
  }>({
    lat: 34.2805,
    lng: -119.2940,
  });

  

  const [markerRef, marker] = useMarkerRef();

  const formik = useFormik({
    initialValues: {
      location_code: '',
      address_type_id: 'location',
      country: 'United States', 
      line1: '',
      city: '',
      region: '',
      is_default: 'true',
      postal_code: '',
      status: 'active',
    },
    validationSchema: Yup.object({
      country: Yup.string().required('Country is required'),
      line1: Yup.string().required('Address is required'),
      city: Yup.string().required('City is required'),
      region: Yup.string().required('region is required'),
      postal_code: Yup.string()
        .required('ZIP/Postal Code is required')
        .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code format'),
      location_code: Yup.string().required('Location code is required'),
    }),
    onSubmit: (values: any) => {
      const allData = {
        ...entityData,
        address: values,
      };
      dispatch(onAddEntities(allData));
      console.log("allData",allData)
      navigate('/entities', { state: { activeTab: 'Entity List' } });
      formik.resetForm();
    },
  });


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
      jsonData.data.forEach((item: any) => {
        temp[item.name] = item.states.length > 0 ? item.states : ['No data'];
        code_temp[item.name] = item?.iso2;
      });
      setData(temp);
      setCountryCodeMap(code_temp);
      setCountryData([
        ...jsonData.data.map((item: any) => {
          return item;
        }),
      ]);
    };
    fetchData();
  }, []);

  const handleCountryChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedCountry = event.target.value as keyof CountryregionData;
    formik.handleChange(event);

    setCont(
      (event.target as HTMLSelectElement).options[
        (event.target as HTMLSelectElement).selectedIndex
      ].getAttribute('data-country')
    );
    setregions(data[selectedCountry] || []);
    formik.setFieldValue('region', '');
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

    // Handle standardized address and geocode update in useEffect
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
             setValidText('Validate Address');
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
    setValidText('✅ Address Validate');
    setAddressValidated(true);
  };

  const handleKeepOriginalAddress = () => {
    // Close modal without changing address
    setIsAddressValidationModalOpen(false);
    setValidText('Validate Address');
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{ padding: 'unset' , marginBottom:"50px"}}>
        <Container fluid>
          <Row>
            <Col xl={12}>
              <h2>Primary Business Location</h2>
              <Form onSubmit={formik.handleSubmit}>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3 mt-3">
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
                </Row>
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
                            <option value="country">Select country</option>
                            {countryData
                            .filter((country: any) => country.name === "United States")
                            .map((country: any) => (
                              <option
                                key={country.iso2}
                                data-country={country.iso2}
                                value={country.name}
                              >
                                {country.name}
                              </option>
                            ))
                          }
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
                  <Col md="2" style={{ paddingTop: "10%" }}>
                    {originalAddress && validatedAddress && (
                      <>
                        <p style={{color:"rgb(114, 118, 126)"}}>Validated as</p>
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
                <hr />
                <Row className='mt-3'>
                  <Form.Group className="mt-4">
                  <Form.Label htmlFor="status">
                  <h4>Activate Later</h4></Form.Label>
                  <Form.Check 
                    type='checkbox'
                    id="status-checkbox"
                    name="status"
                    onChange={(e) => {
                      // Set the status value based on checkbox state
                      formik.setFieldValue('status', e.target.checked ? 'inactive' : 'active');
                    }}
                    onBlur={formik.handleBlur}
                    checked={formik.values.status === "inactive"}
                    label="Inactive"
                  />
                   </Form.Group>
                </Row>
                <Row className="mt-4">
                  <Col md="9">
                  </Col>
                  <Col>
                    <button
                      type="button"
                      className="btn btn-light me-4" 
                      style={{ width: '100px' }}
                      onClick={() => setStep('manage')}
                    >
                      Back
                    </button>
                  
                    <Button
                      type="submit"
                      className="btn btn-primary"
                      style={{ width: '100px' }}
                      disabled={!addressValidated}
                    >
                      Submit
                    </Button>
                  </Col>
                </Row>
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

export default ValidateAddress;
