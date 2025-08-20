import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from 'react';
import { useFormik } from 'formik';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { usePrimaryEntity } from '../../../../Common/usePrimaryEntity';
import {
  requiredColumns,
  originAddress,
  destinationAddress,
  originCoordinates,
  destinationCoordinates,
} from '../data';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { EntityLocation, PrimaryEntity } from '../types';
import { getEntitiesLocations as onGetEntitiesLocations } from '../../../../slices/thunk';
interface Props {
  data: any;
  uploadData: string[][];
  initialValues: any;
  updateData: (data: any) => void;
  updateValues: (values: any) => void;
}
import { useCustomerDetails } from '../../../../Common/useTaxDetails';


const RequiredColumns = forwardRef((props: Props, ref) => {
  const { data, initialValues, uploadData, updateData, updateValues } = props;
  const columnHeaders = uploadData[0] || [];
  const dataRows = uploadData.slice(1);
  const [locations, setLocations] = useState<EntityLocation[]>([]);
  const primaryEntity = usePrimaryEntity();
  const primaryEntityId = primaryEntity?.id;

  const { taxCodes, customersWithCertificates } = useCustomerDetails();
  const formik = useFormik({
    initialValues: {
      originLocationCode: initialValues?.originLocationCode || '',
      destinationLocationCode: initialValues?.destinationLocationCode || '',
      requiredFields: requiredColumns?.reduce(
        (acc, column) => {
          acc[column] = initialValues?.requiredFields?.[column] || '';
          return acc;
        },
        {} as { [key: string]: string }
      ),
      originAddress: originAddress?.reduce(
        (acc, column) => {
          acc[column] = initialValues?.originAddress?.[column] || '';
          return acc;
        },
        {} as { [key: string]: string }
      ),
      originCoordinates: originCoordinates?.reduce(
        (acc, column) => {
          acc[column] = initialValues?.originCoordinates?.[column] || '';
          return acc;
        },
        {} as { [key: string]: string }
      ),
      origin: initialValues?.origin || 'from file',
      originOption: initialValues?.originOption || 'in USA and Canada',
      destinationAddress: destinationAddress?.reduce(
        (acc, column) => {
          acc[column] = initialValues?.destinationAddress?.[column] || '';
          return acc;
        },
        {} as { [key: string]: string }
      ),
      destinationCoordinates: destinationCoordinates?.reduce(
        (acc, column) => {
          acc[column] = initialValues?.destinationCoordinates?.[column] || '';
          return acc;
        },
        {} as { [key: string]: string }
      ),
      destination: initialValues?.destination || 'from file',
      destinationOption:
        initialValues?.destinationOption || 'in USA and Canada',
    },
    validate: (values: any) => {
      const errors: any = {};
      // Validate requiredFields
      const requiredFieldsErrors = requiredColumns.reduce(
        (acc, column) => {
          if (!values.requiredFields?.[column]?.trim()) {
            acc[column] = `${column} is required and cannot be empty`;
          }
          return acc;
        },
        {} as { [key: string]: string }
      );
      if (Object.keys(requiredFieldsErrors).length > 0) {
        errors.requiredFields = requiredFieldsErrors;
      }
      // Validate originAddress based on origin value
      if (values.origin === 'from file') {
        if (values.originOption !== 'longitude and latitude') {
          const skipValidation = new Set([
            'addressLine2',
            'addressLine3',
            'locationCode',
          ]);
          const originAddressErrors = originAddress.reduce(
            (acc, column) => {
              // Check if the column is in the skipValidation set
              if (
                !skipValidation.has(column) &&
                !values.originAddress?.[column]?.trim()
              ) {
                acc[column] = `${column} is required and cannot be empty`;
              }
              return acc;
            },
            {} as { [key: string]: string }
          );
          if (Object.keys(originAddressErrors).length > 0) {
            errors.originAddress = originAddressErrors;
          }
        } else {
          const originCoordinatesErrors = originCoordinates.reduce(
            (acc, column) => {
              if (!values.originCoordinates?.[column]?.trim()) {
                acc[column] = `${column} is required and cannot be empty`;
              }
              return acc;
            },
            {} as { [key: string]: string }
          );

          if (Object.keys(originCoordinatesErrors).length > 0) {
            errors.originCoordinates = originCoordinatesErrors;
          }
        }
      } else {
        // Check for destinationLocationCode
        if (!values.originLocationCode?.trim()) {
          errors.originLocationCode = 'Origin Location Code is required';
        }
      }
      // Validate destinationAddress based on destination value
      if (values.destination === 'from file') {
        if (values.destinationOption !== 'longitude and latitude') {
          const skipValidation = new Set([
            'addressLine2',
            'addressLine3',
            'locationCode',
          ]);
          const destinationAddressErrors = destinationAddress.reduce(
            (acc, column) => {
              if (
                !skipValidation.has(column) &&
                !values.destinationAddress?.[column]?.trim()
              ) {
                acc[column] = `${column} is required and cannot be empty`;
              }
              return acc;
            },
            {} as { [key: string]: string }
          );
          if (Object.keys(destinationAddressErrors).length > 0) {
            errors.destinationAddress = destinationAddressErrors;
          }
        } else {
          const destinationCoordinatesErrors = destinationCoordinates.reduce(
            (acc, column) => {
              if (!values.destinationCoordinates?.[column]?.trim()) {
                acc[column] = `${column} is required and cannot be empty`;
              }
              return acc;
            },
            {} as { [key: string]: string }
          );

          if (Object.keys(destinationCoordinatesErrors).length > 0) {
            errors.destinationCoordinates = destinationCoordinatesErrors;
          }
        }
      } else {
        // Check for destinationLocationCode
        if (!values.destinationLocationCode?.trim()) {
          errors.destinationLocationCode =
            'Destination Location Code is required';
        }
      }
      // Return errors only if there are any
      return Object.keys(errors).length > 0 ? errors : undefined;
    },

    onSubmit: (values: any) => {
      const mappedData = dataRows.map((row) => {
        const mappedRow: { [key: string]: any } = {};

        // Helper function to map fields from values to mappedRow
        const mapFields = (
          fieldValues: { [key: string]: string },
          target: { [key: string]: any },
          isNestedObject: boolean = false
        ) => {
          Object.keys(fieldValues).forEach((predefinedColumn) => {
            const selectedHeader = fieldValues[predefinedColumn];
            if (selectedHeader) {
              const headerIndex = columnHeaders.indexOf(selectedHeader);
              if (isNestedObject) {
                target[predefinedColumn] =
                  headerIndex !== -1 ? row[headerIndex] : null;
              } else {
                mappedRow[predefinedColumn] =
                  headerIndex !== -1 ? row[headerIndex] : null;
              }
            }
          });
        };

        // Map required fields

        mapFields(values.requiredFields, mappedRow);

        // Map originAddress as a nested object
        mappedRow.originAddress = {};
        mapFields(values.originAddress, mappedRow.originAddress, true);

        // Map originCoordinates as a nested object
        mappedRow.originCoordinates = {};
        mapFields(values.originCoordinates, mappedRow.originCoordinates, true);

        // Map destinationAddress as a nested object
        mappedRow.destinationAddress = {};
        mapFields(
          values.destinationAddress,
          mappedRow.destinationAddress,
          true
        );

        // Map destinationCoordinates as a nested object
        mappedRow.destinationCoordinates = {};
        mapFields(
          values.destinationCoordinates,
          mappedRow.destinationCoordinates,
          true
        );

        // Map additional location codes directly
        mappedRow.originLocationCode = values.originLocationCode || null;
        mappedRow.destinationLocationCode =
          values.destinationLocationCode || null;

        return mappedRow;
      });

      // Update the state with the mapped data

      updateData(mappedData);
      updateValues(values);
    },
  });

  // Expose the submit function to the parent component
  useImperativeHandle(ref, () => ({
    submit: async () => {
      try {
        // Validate the form
        const errors = await formik.validateForm();

        // If there are validation errors, log them and return false
        if (Object.keys(errors).length > 0) {
          await formik.handleSubmit(formik.values);
          return false;
        }
        // Call the form's onSubmit event handler with the form values
        await formik.handleSubmit(formik.values);

        // If the submission was successful, return true
        return true;
      } catch (error) {
        return false;
      }
    },
  }));

  const selectLocationsList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesLocationsList: invoices.entitiesLocationsList,
    })
  );

  const { entitiesLocationsList } = useSelector(selectLocationsList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetEntitiesLocations());
  }, [dispatch]);

  useEffect(() => {
    if (entitiesLocationsList && primaryEntity) {
      const filteredLocations = entitiesLocationsList.filter(
        (location: EntityLocation) =>
          location.entity_id === primaryEntityId &&
          location.address_type_id === 'location'
      );
      setLocations(filteredLocations);
    } else {
      setLocations([]);
    }
  }, [entitiesLocationsList, primaryEntity]);

  const handleOriginChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    formik.handleChange(event);
    formik.setFieldValue('originOption', 'in USA and Canada'); // Reset the default value
    // Reset the originAddress and originLocationCode to empty
    formik.setFieldValue(
      'originAddress',
      originAddress.reduce(
        (acc, column) => {
          acc[column] = ''; // Set each column value to an empty string
          return acc;
        },
        {} as { [key: string]: string }
      )
    );
    formik.setFieldValue('originLocationCode', '');
  };

  const handleOriginOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    formik.handleChange(event);
    // Reset the originAddress and originLocationCode to empty
    formik.setFieldValue(
      'originAddress',
      originAddress.reduce(
        (acc, column) => {
          acc[column] = ''; // Set each column value to an empty string
          return acc;
        },
        {} as { [key: string]: string }
      )
    );
    formik.setFieldValue(
      'originCoordinates',
      originCoordinates.reduce(
        (acc, column) => {
          acc[column] = ''; // Set each column value to an empty string
          return acc;
        },
        {} as { [key: string]: string }
      )
    );
    formik.setFieldValue('originLocationCode', '');
  };

  const handleDestinationChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    formik.handleChange(event);
    formik.setFieldValue('destinationOption', 'in USA and Canada'); // Set the default value for destinationOption
    // Reset the destinationAddress values to empty
    formik.setFieldValue(
      'destinationAddress',
      destinationAddress.reduce(
        (acc, column) => {
          acc[column] = ''; // Set each column value to an empty string
          return acc;
        },
        {} as { [key: string]: string }
      )
    );
    formik.setFieldValue('destinationLocationCode', ''); // Reset the destinationLocationCode
  };

  const handleDestinationOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    formik.handleChange(event);
    // Reset the destinationAddress values to empty
    formik.setFieldValue(
      'destinationAddress',
      destinationAddress.reduce(
        (acc, column) => {
          acc[column] = ''; // Set each column value to an empty string
          return acc;
        },
        {} as { [key: string]: string }
      )
    );
    formik.setFieldValue(
      'destinationCoordinates',
      destinationCoordinates.reduce(
        (acc, column) => {
          acc[column] = ''; // Set each column value to an empty string
          return acc;
        },
        {} as { [key: string]: string }
      )
    );
    formik.setFieldValue('destinationLocationCode', ''); // Reset the destinationLocationCode
  };

  return (
    <div className="p-4 uploadScreen mt-2">
      <Row>
        <Col>
          <h2>Map required columns</h2>
          <p className="mt-2 custom-paragraph">
            For each required Avalara column, select the corresponding column
            from your template. These mappings let us work with your transaction
            data to calculate tax.
          </p>
        </Col>
      </Row>
      <Form onSubmit={formik.handleSubmit} className="mt-4">
        <Row>
          {requiredColumns.map((column, index) => (
            <Col sm={6} key={index} className="mb-3">
              <Form.Group
                controlId={`requiredFields.${column}`}
                className="d-flex align-items-center"
              >
                <Form.Label className="mb-0 me-2" style={{ width: '40%' }}>
                  {column}:
                </Form.Label>
                <Form.Control
                  as="select"
                  name={`requiredFields.${column}`}
                  onChange={formik.handleChange}
                  value={formik.values.requiredFields[column]}
                  className="custom-dropdown"
                >
                  <option value="">Select a column</option>
                  {columnHeaders.map((header, idx) => (
                    <option key={idx} value={header}>
                      {header}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
              {/* Displaying error messages for the specific field */}
              {formik.errors.requiredFields?.[column] &&
                formik.touched.requiredFields?.[column] && (
                  <div className="error-message">
                    {formik.errors.requiredFields[column]}
                  </div>
                )}
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <h2>Addresses</h2>
          <hr />
          <Col className="border-end border-gray">
            <h2>Origin</h2>
            <Form.Group>
              <Form.Check
                type="radio"
                label="Map the origin address from my file"
                name="origin"
                value="from file"
                checked={formik.values.origin === 'from file'}
                onChange={handleOriginChange}
                className="me-2 mt-2"
              />
            </Form.Group>
            {formik.values.origin === 'from file' && (
              <div className="mt-2 ms-4">
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="My origin addresses are all within the U.S. and Canada"
                    name="originOption"
                    value="in USA and Canada"
                    onChange={handleOriginOptionChange}
                    checked={formik.values.originOption === 'in USA and Canada'}
                    className="me-2 mt-2"
                  />
                  <Form.Check
                    type="radio"
                    label="My origin addresses are all outside the U.S. and Canada"
                    name="originOption"
                    value="outside USA and Canada"
                    onChange={handleOriginOptionChange}
                    checked={
                      formik.values.originOption === 'outside USA and Canada'
                    }
                    className="me-2 mt-2"
                  />
                  <Form.Check
                    type="radio"
                    label="My transactions use latitude and longitude coordinates for the origin"
                    name="originOption"
                    value="longitude and latitude"
                    onChange={handleOriginOptionChange}
                    checked={
                      formik.values.originOption === 'longitude and latitude'
                    }
                    className="me-2 mt-2"
                  />
                </Form.Group>
                {formik.values.originOption !== 'longitude and latitude' ? (
                  <Row>
                    {originAddress.map((column, index) => (
                      <Col lg={12} key={index} className="mb-3 mt-3">
                        <Form.Group
                          controlId={`originAddress.${column}`}
                          className="d-flex align-items-center"
                        >
                          <Form.Label
                            className="mb-0 me-2"
                            style={{ width: '40%' }}
                          >
                            {column}:
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name={`originAddress.${column}`}
                            onChange={formik.handleChange}
                            value={formik.values.originAddress[column]}
                            className="custom-dropdown"
                          >
                            <option value="">Select a column</option>
                            {columnHeaders.map((header, idx) => (
                              <option key={idx} value={header}>
                                {header}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        {/* Displaying error messages for the specific field */}
                        {formik.errors.originAddress?.[column] &&
                          formik.touched.originAddress?.[column] && (
                            <div className="error-message">
                              {formik.errors.originAddress[column]}
                            </div>
                          )}
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Row>
                    {originCoordinates.map((column, index) => (
                      <Col lg={12} key={index} className="mb-3 mt-3">
                        <Form.Group
                          controlId={`originCoordinates.${column}`}
                          className="d-flex align-items-center"
                        >
                          <Form.Label
                            className="mb-0 me-2"
                            style={{ width: '40%' }}
                          >
                            {column}:
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name={`originCoordinates.${column}`}
                            onChange={formik.handleChange}
                            value={formik.values.originCoordinates[column]}
                            className="custom-dropdown"
                          >
                            <option value="">Select a column</option>
                            {columnHeaders.map((header, idx) => (
                              <option key={idx} value={header}>
                                {header}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        {formik.errors.originCoordinates?.[column] &&
                          formik.touched.originCoordinates?.[column] && (
                            <div className="error-message">
                              {formik.errors.originCoordinates[column]}
                            </div>
                          )}
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}

            <Form.Group>
              <Form.Check
                type="radio"
                label="Assign address information to all transactions using a
               location code from my company settings
                AvaTax uses the address associated with this location code to calculate tax"
                name="origin"
                value="from location"
                onChange={handleOriginChange}
                checked={formik.values.origin === 'from location'}
                className="me-2 mt-2"
              />
            </Form.Group>
            {formik.values.origin === 'from location' && (
              <div className="mt-2 ms-4">
                <Row>
                  <Form.Group
                    controlId="originLocationCode"
                    className="d-flex align-items-center"
                  >
                    <Form.Label className="mb-0 me-2" style={{ width: '20%' }}>
                      Origin location code:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="originLocationCode"
                      onChange={formik.handleChange}
                      value={formik.values.originLocationCode}
                      className="custom-dropdown"
                    >
                      <option value="">Select a location code</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.location_code}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <div className="error-message">
                    {formik.errors.originLocationCode}
                  </div>
                </Row>
              </div>
            )}
          </Col>
          {/* destination  */}
          <Col lg={6} className="ps-5">
            <h2>Destination</h2>
            <Form.Group>
              <Form.Check
                type="radio"
                label="Map the destination address from my file"
                name="destination"
                value="from file"
                onChange={handleDestinationChange}
                checked={formik.values.destination === 'from file'}
                className="me-2 mt-2"
              />
            </Form.Group>
            {formik.values.destination === 'from file' && (
              <div className="mt-2 ms-4">
                <Form.Group>
                  <Form.Check
                    type="radio"
                    label="My destination addresses are all within the U.S. and Canada"
                    name="destinationOption"
                    value="in USA and Canada"
                    onChange={handleDestinationOptionChange}
                    checked={
                      formik.values.destinationOption === 'in USA and Canada'
                    }
                    className="me-2 mt-2"
                  />
                  <Form.Check
                    type="radio"
                    label="My destination addresses are all outside the U.S. and Canada"
                    name="destinationOption"
                    value="outside USA and Canada"
                    onChange={handleDestinationOptionChange}
                    checked={
                      formik.values.destinationOption ===
                      'outside USA and Canada'
                    }
                    className="me-2 mt-2"
                  />
                  <Form.Check
                    type="radio"
                    label="My transactions use latitude and longitude coordinates for the destination"
                    name="destinationOption"
                    value="longitude and latitude"
                    onChange={handleDestinationOptionChange}
                    checked={
                      formik.values.destinationOption ===
                      'longitude and latitude'
                    }
                    className="me-2 mt-2"
                  />
                </Form.Group>
                {formik.values.destinationOption !==
                  'longitude and latitude' ? (
                  <Row>
                    {destinationAddress.map((column, index) => (
                      <Col lg={12} key={index} className="mb-3 mt-3">
                        <Form.Group
                          controlId={`destinationAddress.${column}`}
                          className="d-flex align-items-center"
                        >
                          <Form.Label
                            className="mb-0 me-2"
                            style={{ width: '40%' }}
                          >
                            {column}:
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name={`destinationAddress.${column}`}
                            onChange={formik.handleChange}
                            value={formik.values.destinationAddress[column]}
                            className="custom-dropdown"
                          >
                            <option value="">Select a column</option>
                            {columnHeaders.map((header, idx) => (
                              <option key={idx} value={header}>
                                {header}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        {formik.errors.destinationAddress?.[column] &&
                          formik.touched.destinationAddress?.[column] && (
                            <div className="error-message">
                              {formik.errors.destinationAddress[column]}
                            </div>
                          )}
                      </Col>
                    ))}
                  </Row>
                ) : (
                  <Row>
                    {destinationCoordinates.map((column, index) => (
                      <Col lg={12} key={index} className="mb-3 mt-3">
                        <Form.Group
                          controlId={`destinationCoordinates.${column}`}
                          className="d-flex align-items-center"
                        >
                          <Form.Label
                            className="mb-0 me-2"
                            style={{ width: '40%' }}
                          >
                            {column}:
                          </Form.Label>
                          <Form.Control
                            as="select"
                            name={`destinationCoordinates.${column}`}
                            onChange={formik.handleChange}
                            value={formik.values.destinationCoordinates[column]}
                            className="custom-dropdown"
                          >
                            <option value="">Select a column</option>
                            {columnHeaders.map((header, idx) => (
                              <option key={idx} value={header}>
                                {header}
                              </option>
                            ))}
                          </Form.Control>
                        </Form.Group>
                        {formik.errors.destinationCoordinates?.[column] &&
                          formik.touched.destinationCoordinates?.[column] && (
                            <div className="error-message">
                              {formik.errors.destinationCoordinates[column]}
                            </div>
                          )}
                      </Col>
                    ))}
                  </Row>
                )}
              </div>
            )}

            <Form.Group>
              <Form.Check
                type="radio"
                label="Assign address information to all transactions using a
               location code from my company settings
                AvaTax uses the address associated with this location code to calculate tax"
                name="destination"
                value="from location"
                onChange={handleDestinationChange}
                checked={formik.values.destination === 'from location'}
                className="me-2 mt-2"
              />
            </Form.Group>
            {formik.values.destination === 'from location' && (
              <div className="mt-2 ms-4">
                <Row>
                  <Form.Group
                    controlId="destinationLocationCode"
                    className="d-flex align-items-center"
                  >
                    <Form.Label className="mb-0 me-2" style={{ width: '20%' }}>
                      Destination location code:
                    </Form.Label>
                    <Form.Control
                      as="select"
                      name="destinationLocationCode"
                      onChange={formik.handleChange}
                      value={formik.values.destinationLocationCode}
                      className="custom-dropdown"
                    >
                      <option value="">Select a location code</option>
                      {locations.map((location) => (
                        <option key={location.id} value={location.id}>
                          {location.location_code}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                  <div className="error-message">
                    {formik.errors.destinationLocationCode}
                  </div>
                </Row>
              </div>
            )}
          </Col>
        </Row>
      </Form>
    </div>
  );
});

export default RequiredColumns;