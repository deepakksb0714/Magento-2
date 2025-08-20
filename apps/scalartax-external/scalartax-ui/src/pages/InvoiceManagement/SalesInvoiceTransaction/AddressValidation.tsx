import React, { useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { ImBin } from 'react-icons/im';
import { Form } from 'react-bootstrap';
import AddressValidationModal from '../EntityLocations/AddressValidationModal';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { stateCodeToName } from '../Reports/ExemptionReports/stateMapping';
import { addAddressValidation as onAddAddressValidation, AddValidateCoordinates as onValidateCoordinates } from '../../../slices/thunk';
import { countryStateData } from '../../../Common/data/countryState';
import { useDispatch, useSelector } from 'react-redux';
export type IconTextProps = {
  children?: React.ReactNode;
  icon: React.ReactNode;
};

export interface Address {
  id: string;
  sub: string;
  lab: string;
  view: boolean;
}

export function IconText({ children, icon }: IconTextProps) {
  return (
    <div className="icon-text">
      <div>{icon}</div>
      <>{children}</>
    </div>
  );
}

export type GetAddressTemplateProps = {
  header?: string;
  selAddr?: string;
  req?: boolean;
  setSelectedAddresses?: (Address: Address[]) => void | undefined;
  selectedAddresses?: Address[];
  Address?: Address;
  defaultAdress?: any;
  onAddressChange: (newAddress: any) => void;
};

export const GetAddressTemplate = React.forwardRef(function (
  {
    header,
    selAddr,
    req,
    setSelectedAddresses,
    selectedAddresses,
    Address,
    defaultAdress,
    onAddressChange
  }: GetAddressTemplateProps,
  ref: any
) {
  const [additionalAddresses, setAdditionalAddresses] = useState<any[]>([
    { id: 1, value: '' },
  ]);

  const [isAddressValidationModalOpen, setIsAddressValidationModalOpen] = useState(false);
  const [originalAddress, setOriginalAddress] = useState<any>(null);
  const [validatedAddress, setValidatedAddress] = useState<any>(null);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loder, setLoader] = useState(false);
  const [validText, setValidText] = useState('Validate Address');
  const [addressValidated, setAddressValidated] = useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState<any>(selAddr);
  const [addressMode, setAddressMode] = React.useState<any>(true);

  const dispatch = useDispatch();

  const addressFormSchema = Yup.object().shape({
    // address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    region: Yup.string().required('Region/State is required'),
    country: Yup.string().required('Country is required'),
    postal_code: Yup.string().required('Postal code is required'),
  });

  // Main form using Formik
  const mainFormik = useFormik({
    initialValues: {
      address: '',
      city: '',
      region: '',
      country: '',
      postal_code: '',
    },
    validationSchema: addressFormSchema,
    onSubmit: (values: any) => {
      handleCombinedSubmit2();
    },
  });

  // Additional addresses formik
  const additionalAddressesFormik = additionalAddresses.map((addr, index) => (
    useFormik({
      initialValues: {
        addr: '',
      },
      onSubmit: () => { },
    })
  ));

  // Coordinates form using Formik (for when addressMode is false)
  const coordinatesFormik = useFormik({
    initialValues: {
      latitude: '',
      longitude: ''
    },
    validationSchema: Yup.object().shape({
      latitude: Yup.number()
        .required('Latitude is required')
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90'),
      longitude: Yup.number()
        .required('Longitude is required')
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
    }),
    onSubmit: (values:any) => {
      handleCombinedSubmit2();
    }
  });




  const formatAddressComponent = (text: string) => {
    if (!text) return '';
    return text.split(' ').map(word => {
      if (word.toUpperCase() === word && word.length <= 3) return word;
      if (word.includes('-')) {
        return word.split('-')
          .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
          .join('-');
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };



  const handleValidateAddress = async (formData: any) => {
    setLoader(true);
    setValidText("Validating Address...");

    try {
      const formattedData = {
        ...formData,
        additionalAddresses: formData.additionalAddresses?.map((addr: any) => ({
          ...addr,
          addr: addr.addr?.trim() || ""
        })) || []
      };
      const address = formattedData.address?.trim() || "";
      const city = formattedData.city?.trim();
      const regionFullName = formattedData.region?.trim();
      const country = formattedData.country?.trim();
      let postal_code = formattedData.postal_code?.trim();

      // Convert full state name to abbreviation
      const region = Object.keys(stateCodeToName).find(
        key => stateCodeToName[key] === regionFullName
      ) || regionFullName;

      // Convert country format
      const formattedCountry = country === "United States" ? "US" : country;

      // Ensure postal code follows expected format
      if (postal_code && postal_code.length === 5) {
        postal_code += "-1340"; // Append ZIP+4 code if missing
      }


      // Validate required fields
      const missingFields = [];
      if (!city) missingFields.push("city");
      if (!region) missingFields.push("region/state");
      if (!formattedCountry) missingFields.push("country");
      if (!postal_code) missingFields.push("postal code");

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
      }

      const originalAddressData = {
        address,
        city,
        region,
        country: formattedCountry,
        postal_code,
      };
      setOriginalAddress(originalAddressData);

      const requestData = {
        address: {
          postalCode: postal_code,
          addressLines: address,
          regionCode: formattedCountry,
          administrativeArea: region,
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
      setValidText('Validate Address');
      setIsAddressValidationModalOpen(true);
      setLoader(false);
    }
  };

  useEffect(() => {
    if (apiResponse?.response?.result) {
      try {
        const { result } = apiResponse.response;
        const standardizedAddress = result.uspsData?.standardizedAddress;
        if (standardizedAddress) {
          const { country } = mainFormik.values;

          const validatedAddressData = {
            line1: formatAddressComponent(standardizedAddress.firstAddressLine),
            city: formatAddressComponent(standardizedAddress.city),
            region: mainFormik.values.region,
            country: country,
            postal_code: standardizedAddress.zipCodeExtension
              ? `${standardizedAddress.zipCode}-${standardizedAddress.zipCodeExtension}`
              : standardizedAddress.zipCode
          };
          setValidatedAddress(validatedAddressData);
          setIsAddressValidationModalOpen(true);
        }

        if (apiResponse.isAddressValid) {
          setValidText('Address Validate');
          setAddressValidated(true);
        } else {
          setValidText('Address Invalid');
        }

        setLoader(false);
      } catch (e: any) {
        setValidText('Address Invalid');
        setIsAddressValidationModalOpen(true);
        setLoader(false);
      }
    }
  }, [apiResponse]);

  const handleUseValidatedAddress = async () => {
    if (validatedAddress) {
      try {
        // Update the formik values with validated address
        mainFormik.setValues({
          ...mainFormik.values,
          address: validatedAddress.address,
          city: validatedAddress.city,
          region: validatedAddress.region,
          country: validatedAddress.country,
          postal_code: validatedAddress.postal_code
        });

        setIsAddressValidationModalOpen(false);
        setValidText('✅ Address Validated');
        setAddressValidated(true);
      } catch (error) {
        setValidText('❌ Error updating address');
      }
    }
  };

  const handleKeepOriginalAddress = () => {
    setIsAddressValidationModalOpen(false);
    setValidText('Validate Address');
  };

  const handleClick = (updatedAddress: any) => {
    onAddressChange(updatedAddress); // Triggering parent function with new data
  };

  const handleCombinedSubmit2 = async () => {
    if (selectedAddress === 'OTHER') {
      if (addressMode === true) {
        // Address mode validation (existing code)
        const errors = await mainFormik.validateForm();
  
        if (Object.keys(errors).length > 0) {
          Object.keys(mainFormik.values).forEach(field => {
            mainFormik.setFieldTouched(field, true);
          });
          return;
        }
  
        try {
          const mainFormData = mainFormik.values;
          const additionalAddressesData = additionalAddressesFormik.map(formik => ({
            addr: formik.values.addr
          }));
  
          const combinedFormData = {
            ...mainFormData,
            additionalAddresses: additionalAddressesData
          };
  
          await handleValidateAddress(combinedFormData);
  
          const newAddress = {
            ...combinedFormData
          }
          handleClick(newAddress);
        } catch (error: any) {
          setValidText(`❌ ${error.message}`);
          setLoader(false);
        }
      } else {
        // Coordinates mode validation (new code)
        const errors = await coordinatesFormik.validateForm();
        
        if (Object.keys(errors).length > 0) {
          Object.keys(coordinatesFormik.values).forEach(field => {
            coordinatesFormik.setFieldTouched(field, true);
          });
          return;
        }
  
        try {
          setLoader(true);
          setValidText("Validating Coordinates...");
          
          // Get coordinate values
          const { latitude, longitude } = coordinatesFormik.values;
          
          // Validate that latitude and longitude are valid numbers
          if (!latitude || !longitude || isNaN(parseFloat(latitude)) || isNaN(parseFloat(longitude))) {
            throw new Error('Invalid latitude or longitude values');
          }
          
          // Call the new geocode endpoint
          await handleValidateCoordinates(latitude, longitude);
          
          // Will be updated in the success callback
        } catch (error: any) {
          setValidText(`❌ ${error.message}`);
          setLoader(false);
        }
      }
    }
  };


const handleValidateCoordinates = async (latitude:any, longitude:any) => {
  try {
    // Format data for API call
    const requestData = {
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude)
      }
    };

    // Dispatch the coordinates validation action
    // You'll need to create this action in your Redux setup
    const action = await dispatch(onValidateCoordinates(requestData));
    
    if (action.type.endsWith('/fulfilled')) {
      setApiResponse(action.payload);
      
      // Extract the address from the response
      if (action.payload?.response?.result) {
        const addressData = action.payload.response.result.address;
        
        if (addressData) {
          // Update the form with the resolved address
          mainFormik.setValues({
            address: addressData.formattedAddress || '',
            city: addressData.locality || '',
            region: addressData.administrativeArea || '',
            country: addressData.countryCode === 'US' ? 'United States' : addressData.countryName || '',
            postal_code: addressData.postalCode || ''
          });
          
          setValidText('✅ Address Resolved');
          setAddressValidated(true);
          
          const newAddress = {
            ...mainFormik.values,
            latitude,
            longitude
          };
          
          handleClick(newAddress);
        }
      }
    } else {
      throw new Error('Coordinates validation failed');
    }
  } catch (error) {
    setValidText('❌ Validation failed');
    setLoader(false);
    throw error;
  }
};

  // Render form fields based on addressMode and formik
  const renderFormFields = () => {
    if (addressMode) {
      return (
        <>
          {/* Main address form fields */}
          <Form.Group className="mb-3">
            <Form.Label className="labelF">Address</Form.Label>
            <Form.Control
              type="text"
              className="inputF form-control form-control-sm"
              style={{ width: '90%' }}
              name="address"
              value={mainFormik.values.address}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              isInvalid={!!(mainFormik.touched.address && mainFormik.errors.address)}
            />
            {mainFormik.touched.address && mainFormik.errors.address && (
              <Form.Control.Feedback type="invalid">{mainFormik.errors.address}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* City field */}
          <Form.Group className="mb-3">
            <Form.Label className="labelF">City</Form.Label>
            <Form.Control
              type="text"
              className="inputF form-control form-control-sm"
              style={{ width: '90%' }}
              name="city"
              value={mainFormik.values.city}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              isInvalid={!!(mainFormik.touched.city && mainFormik.errors.city)}
            />
            {mainFormik.touched.city && mainFormik.errors.city && (
              <Form.Control.Feedback type="invalid">{mainFormik.errors.city}</Form.Control.Feedback>
            )}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="labelF">Country</Form.Label>
            <Form.Select
              className="inputF form-select form-select-sm"
              style={{ width: '90%' }}
              name="country"
              value={mainFormik.values.country}
              onChange={(e) => {
                mainFormik.handleChange(e);
                // Reset region when country changes
                mainFormik.setFieldValue('region', '');
              }}
              onBlur={mainFormik.handleBlur}
              isInvalid={!!(mainFormik.touched.country && mainFormik.errors.country)}
            >
              <option value="">Select a country</option>
              <option value="United States">United States</option>
            </Form.Select>
            {mainFormik.touched.country && mainFormik.errors.country && (
              <Form.Control.Feedback type="invalid">{mainFormik.errors.country}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Region/State field - dynamic select list based on country */}
          <Form.Group className="mb-3">
            <Form.Label className="labelF">Region/State</Form.Label>
            <Form.Select
              className="inputF form-select form-select-sm"
              style={{ width: '90%' }}
              name="region"
              value={mainFormik.values.region}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              isInvalid={!!(mainFormik.touched.region && mainFormik.errors.region)}
              disabled={mainFormik.values.country !== "United States"}
            >
              <option value="">Select region or territory</option>
              {countryStateData[mainFormik.values.country === "United States" ? "USA" : mainFormik.values.country]?.map((region) => (
                <option key={region.code} value={region.code}>{region.name}</option>
              ))}

            </Form.Select>
            {mainFormik.touched.region && mainFormik.errors.region && (
              <Form.Control.Feedback type="invalid">{mainFormik.errors.region}</Form.Control.Feedback>
            )}
          </Form.Group>

          {/* Postal code field */}
          <Form.Group className="mb-3">
            <Form.Label className="labelF">Postal/ZIP Code</Form.Label>
            <Form.Control
              type="text"
              className="inputF form-control form-control-sm"
              name="postal_code"
              style={{ width: '90%' }}
              value={mainFormik.values.postal_code}
              onChange={mainFormik.handleChange}
              onBlur={mainFormik.handleBlur}
              isInvalid={!!(mainFormik.touched.postal_code && mainFormik.errors.postal_code)}
            />
            {mainFormik.touched.postal_code && mainFormik.errors.postal_code && (
              <Form.Control.Feedback type="invalid">{mainFormik.errors.postal_code}</Form.Control.Feedback>
            )}
          </Form.Group>
        </>
      );
    } else {
      // For coordinates mode (when addressMode is false)
      return (
        <>
        <Form.Group className="mb-3">
          <Form.Label className="labelF">Latitude</Form.Label>
          <Form.Control
            type="text"
            className="inputF form-control form-control-sm"
            style={{ width: '90%' }}
            name="latitude"
            value={coordinatesFormik.values.latitude}
            onChange={coordinatesFormik.handleChange}
            onBlur={coordinatesFormik.handleBlur}
            isInvalid={!!(coordinatesFormik.touched.latitude && coordinatesFormik.errors.latitude)}
          />
          {coordinatesFormik.touched.latitude && coordinatesFormik.errors.latitude && (
            <Form.Control.Feedback type="invalid">{coordinatesFormik.errors.latitude}</Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="labelF">Longitude</Form.Label>
          <Form.Control
            type="text"
            className="inputF form-control form-control-sm"
            style={{ width: '90%' }}
            name="longitude"
            value={coordinatesFormik.values.longitude}
            onChange={coordinatesFormik.handleChange}
            onBlur={coordinatesFormik.handleBlur}
            isInvalid={!!(coordinatesFormik.touched.longitude && coordinatesFormik.errors.longitude)}
          />
          {coordinatesFormik.touched.longitude && coordinatesFormik.errors.longitude && (
            <Form.Control.Feedback type="invalid">{coordinatesFormik.errors.longitude}</Form.Control.Feedback>
          )}
        </Form.Group>
      </>
      );
    }
  };

  return (
    <div className="sales-inv-box">
      <div style={{ height: '72px' }}>
        <h2 className="h2_label">{header}</h2>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          width: '40%',
          justifyContent: 'space-between',
        }}
      >
        {req && (
          <IconText icon={<ImBin />}>
            <p
              className="linkFtext"
              onClick={() => {
                if (setSelectedAddresses && selectedAddresses && Address) {
                  setSelectedAddresses([
                    ...selectedAddresses.filter(
                      (value: Address) => value.id !== Address.id
                    ),
                    {
                      id: Address.id,
                      sub: Address.sub,
                      lab: Address.lab,
                      view: false,
                    },
                  ]);
                }
              }}
            >
              Remove
            </p>
          </IconText>
        )}
      </div>
      <Form.Group className="mb-3 flex-item">
        {selectedAddress !== 'ADDED' ? (
          <>
            <Form.Label className="labelF">Location</Form.Label>
            <Form.Control
              as="select"
              className="inputF form-control form-control-sm"
              style={{ width: '90%' }}
              value={selectedAddress}
              onChange={(e: any) => {
                setSelectedAddress(e.target.value);
                if (e.target.value === 'OTHER') {
                  setAddressMode(true);
                } else {
                  setAddressMode(false);
                }
              }}
            >
              {['DEFAULT', 'OTHER'].map((name, i) => (
                <option key={i} value={name}>
                  {name}
                </option>
              ))}
            </Form.Control>
          </>
        ) : (
          <Button
            size="sm"
            variant="link"
            className="text-decoration-none"
            onClick={() => setSelectedAddress('OTHER')}
          >
            Update Address
          </Button>
        )}
      </Form.Group>

      {selectedAddress === 'DEFAULT' ? (
        <div className="address-block">
          <h3 className="h3_label">Address</h3>
          <div className="address-line">{defaultAdress.address}</div>
          <div className="address-line">
            {defaultAdress.city}, {defaultAdress.region},{' '}
            {defaultAdress.country}
          </div>
          <div className="address-line">{defaultAdress.postal_code}</div>
        </div>
      ) : selectedAddress === 'ADDED' ? (
        <div className="address-block">
          <h3 className="h3_label">Address</h3>
          <div className="address-line">
            {[defaultAdress.address, defaultAdress.address2, defaultAdress.address3]
              .filter(Boolean)
              .join(', ')}
          </div>

          <div className="address-line">
            {defaultAdress.city}, {defaultAdress.region},{' '}
            {defaultAdress.country}
          </div>
          <div className="address-line">{defaultAdress.postal_code}</div>
        </div>
      ) : (
        <div className="mb-3 flex-item">
          <Form onSubmit={addressMode ? mainFormik.handleSubmit : coordinatesFormik.handleSubmit}>
            {renderFormFields()}

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'left',
                alignItems: 'flex-start',
                width: '90%',
              }}
            >
              <Button type="button" size="sm" onClick={handleCombinedSubmit2}>
                {validText}
              </Button>
              <Button
                variant="link"
                style={{ textDecoration: 'none', marginLeft: '-15px' }}
                onClick={() => {
                  setAddressMode(!addressMode);
                }}
              >
                {addressMode === false
                  ? 'I want to use a street address'
                  : 'I want to use a lat/long coordinates'}
              </Button>
            </div>
          </Form>
        </div>
      )}

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
  );
});