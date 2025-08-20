import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BreadCrumb from '../../../../Common/BreadCrumb';
import { Col, Container, Row, Card, Button, Form } from 'react-bootstrap';
import { countryData } from '../../../../Common/data/countryState';
import FavoriteReportModal from '../FavoriteReportModal';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { ReportData } from "./reportTypes";
import ExemptionDetailJurisdictionReport  from "./ExemptionDetailJurisdictionReport"
import { addExemptionReports as onExemptionReports } from '../../../../slices/thunk';
import { usePrimaryEntity } from '../../../../Common/usePrimaryEntity';

interface PrimaryEntity {
  id: any;
  name: string;
}

interface CountryOption {
  name: string;
  regions: string[];
}

type ReportDescription = {
  [key: string]: string;
};

type ReportDescriptions = {
  [key: string]: ReportDescription;
};

const stateOptions = countryData.USA;

// Add certificate fields array
const certificateFields = [
  'ECMS Cert Id',
  'AvaCert Id',
  'Issuing Country',
  'Issuing Region',
  'Exemption No',
  'Exemption No Type',
  'Eff Date',
  'End Date',
  'Company Code',
  'Cert Type',
  'Business Type',
  'Business Type Desc',
  'Exemption Reason',
  'Exempt Reason Desc',
  'Customer Name',
  'Address 1',
  'Address 2',
  'Address 3',
  'City',
  'Region',
  'Postal Code',
  'Country',
  'Cert Status',
  'Review Status',
  'Last Trans Date',
  'Applied',
  'Created Date',
  'Modified Date',
];

const SalesJurisdiction = [
  'Entity and Use based exemption',
  'Product based exemptions',
  'No Nexus Jurisdictions based exemptions',
];

interface Metadata {
  currentPage: number;
  totalPages: number;
}

const ExemptionReports = ({ flag }: { flag?: string }) => {
  document.title = 'Exemption Reports';
  const dispatch = useDispatch();
  const [selectedReportName, setSelectedReportName] = useState('');
  const [dateOption, setDateOption] = useState('previous_month');
  const [showModal, setShowModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('preview');
  const [selectedReportInstantly, setSelectedReportInstantly] =
    useState('report_instantly');
  const primaryEntity = usePrimaryEntity();
  // const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
  //   null
  // );
  const [showReport, setShowReport] = useState(false);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<ReportData[]>([]);

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);

  // Convert countryData to an array of options
  const countryOptions = Object.entries(countryData).map(
    ([country, regions]) => ({
      country,
      regions,
    })
  );

  const formik = useFormik({
    initialValues: {
      report_name: '',
      report_category: 'Exemption reports',
      report_instantly: 'report_instantly',
      date_option: 'previous_month',
      compress_zip_file: false,
      entity_id: '',
      entity: '',
      custom_date_from: '',
      custom_date_to: '',
      customer_code: '',
      exempt_cert_status: '',
      Level: 'State',
      tax_type: 'Sales and sellers use',
      include_locked_transactions_only: false,
      preview: true,
      pdf: false,
      xlsx: false,
      is_favorite: false,
      ...certificateFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.toLowerCase().replace(/\s+/g, '_')]: false,
        }),
        {}
      ),
      ecms_cert_id: true,
      avacert_id: true,
      issuing_country: true,
      issuing_region: true,
      exemption_no: true,
      exemption_no_type: true,
      eff_date: true,
      end_date: true,
      company_code: true,
      cert_type: true,
      invoice_po_no: true,
      business_type: true,
      business_type_desc: true,
      exemption_reason: true,
      reason:'All',
      exempt_reason_desc: true,
      customer_name: true,
      address_1: true,
      address_2: true,
      address_3: true,
      city: true,
      region: true,
      postal_code: true,
      country: true,
      cert_status: true,
      review_status: true,
      last_trans_date: true,
      applied: true,
      created_date: true,
      modified_date: true,
      ...SalesJurisdiction.reduce(
        (acc, field) => ({
          ...acc,
          [field.toLowerCase().replace(/\s+/g, '_')]: true,
        }),
        {}
      ),
    },
    validationSchema: Yup.object({
      report_name: Yup.string().required('Required'),
    }),
   onSubmit: async (values: any) => {
        try {
          // console.log('submmited values', values);
          setLoading(true);
          const response = await dispatch(onExemptionReports(values));
  
          // Always set showReport to true, regardless of data presence
          setShowReport(true);
  
          if (response.payload?.data) {
            const responseData = response.payload.data;
            // console.log('responseData', responseData);
            const transformedData = Array.isArray(responseData)
              ? transformReportData(responseData)
              : [];
            setReportData(transformedData);
            // console.log('Report data:', transformedData);
            setMetadata(response.payload.meta || { totalPages: 1 });
          } else {
            // Handle empty response by setting empty array
            setReportData([]);
            setMetadata({ currentPage: 1, totalPages: 1 });
          }
        } catch (error) {
          setReportData([]);
          setMetadata({ currentPage: 1, totalPages: 1 });
          setShowReport(true);
        } finally {
          setLoading(false);
        }
      },
    });

      const transformReportData = (data: any[]): ReportData[] => {
        return data.map((row) => ({
          id: row.id || '',
          region: row.destination_address?.region || '',
          country: row.destination_address?.country || '',
          customer_code: row.customer_code || '',
          total_amount: Number(row.total_amount) || 0,
          total_discount: Number(row.total_discount) || 0,
          total_exempt: Number(row.total_exempt) || 0,
          total_taxable: Number(row.total_taxable) || 0,
          total_tax: Number(row.total_tax) || 0,
          transaction_type: row.transaction_type || '',
          entity_use_code: row.entity_use_code || '',
          has_nexus: row.has_nexus || '',
          certificate_id: row.certificate_id || '',
          status: row.status || '',
          date: row.date || '',
          code: row.code || '',
          created_at: row.created_at || '',
          updated_at: row.updated_at || '',
          destination_address: {
            street: row.destination_address?.street || '',
            street2: row.destination_address?.street2 || '',
            city: row.destination_address?.city || '',
            region: row.destination_address?.region || '',
            country: row.destination_address?.country || '',
            postal_code: row.destination_address?.postal_code || '',
          },
          origin_address: {
            street: row.origin_address?.street || '',
            street2: row.origin_address?.street2 || '',
            city: row.origin_address?.city || '',
            region: row.origin_address?.region || '',
            country: row.origin_address?.country || '',
            postal_code: row.origin_address?.postal_code || '',
          },
          line_items:
            row.line_items?.map((item: any) => ({
              item_code: item.item_code || '',
              line_amount: Number(item.line_amount) || 0,
              tax: Number(item.tax) || 0,
              tax_code: item.tax_code || '',
              line_number: item.line_number || 0,
              quantity: item.quantity || 0,
              discount_amount: Number(item.discount_amount) || 0,
              taxable_amount: Number(item.taxable_amount) || 0,
              destination_address: {
                street: item.destination_address?.street || '',
                street2: item.destination_address?.street2 || '',
                city: item.destination_address?.city || '',
                region: item.destination_address?.region || '',
                country: item.destination_address?.country || '',
                postal_code: item.destination_address?.postal_code || '',
              },
              origin_address: {
                street: item.origin_address?.street || '',
                street2: item.origin_address?.street2 || '',
                city: item.origin_address?.city || '',
                region: item.origin_address?.region || '',
                country: item.origin_address?.country || '',
                postal_code: item.origin_address?.postal_code || '',
              },
            })) || [],
        }));
      };
  

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find(
        (entity: any) => entity.is_default
      );

      if (defaultEntity) {
        // setPrimaryEntity(defaultEntity);
        formik.setFieldValue('entity_id', defaultEntity.id);
        // formik.setFieldValue('entity', defaultEntity.id);
        formik.setFieldValue('entity', defaultEntity.name);
      } else {
        // setPrimaryEntity(entitiesList[0]);
        formik.setFieldValue('entity_id', entitiesList[0].id);
        formik.setFieldValue('entity', entitiesList[0].name);
      }
    } else {
      // setPrimaryEntity(null);
      formik.setFieldValue('entity_id', '');
      formik.setFieldValue('entity', '');
    }
  }, [entitiesList]);

  const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEntityId = e.target.value;
    formik.setFieldValue('entity_id', selectedEntityId);
    formik.setFieldValue('entity', selectedEntityId);
    

    const selectedEntity = entitiesList.find(
      (entity: PrimaryEntity) =>
        entity.id.toString() === selectedEntityId.toString()
    );

        // Set both ID and name in formik values
        formik.setFieldValue('entity_id', selectedEntityId);
        formik.setFieldValue('entity', selectedEntity ? selectedEntity.name : '');
        
    if (selectedEntity) {
      // setPrimaryEntity(selectedEntity);
    }
  };

  const handleDateOptionChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDateOption(event.target.value);
    formik.setFieldValue('date_option', event.target.value);
  };

  const handleFavoriteClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveFavorite = (name: string) => {
    formik.setFieldValue('is_favorite', true);
  };

  // Add handler for export format changes
  const handleExportFormatChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name } = event.target;
    setExportFormat(name);

    // Reset all format values
    formik.setFieldValue('preview', false);
    formik.setFieldValue('pdf', false);
    formik.setFieldValue('xlsx', false);

    // Set the selected format to true
    formik.setFieldValue(name, true);
  };

  // Add this function to check if export options should be shown
  const shouldShowExportOptions = (reportName: string) => {
    return [
      'Sales tax exemption detail by jurisdiction',
      'Exemption exposure',
      'Exemption exposure aging',
    ].includes(reportName);
  };

    // TransactionReports.tsx
    const [currentPage, setCurrentPage] = useState(1);
  
    const onPageChange = (page: number) => {
      setCurrentPage(page);
      // You may need to fetch the report data for the new page here
    };

  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{
          padding: flag === 'hide' ? 'unset' : 'revert-layer',
        }}
      >
     {!showReport ? (
        <Container fluid>
          {flag !== 'hide' ? (
            <BreadCrumb
              pageTitle="Exemption reports"
              title="Exemption reports"
            />
          ) : null}
          <Row>
            <Col xl={12}>
              <Form onSubmit={formik.handleSubmit}>
                <Row>{flag !== 'hide' ? <h1>Select a report</h1> : null}</Row>
                {flag === 'hide' ? <Row className="mt-3"></Row> : null}
                <Row>
                  <Col md={6}>
                    <Form.Label htmlFor="report_category">
                      Report Category<span className="text-danger"> *</span>
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="form-select"
                      id="report_category"
                      name="report_category"
                      disabled
                      value={formik.values.report_category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.report_category &&
                        !!formik.errors.report_category
                      }
                    >
                      <option value="Exemption reports">
                        Exemption reports
                      </option>
                    </Form.Control>
                    {formik.touched.report_category &&
                    formik.errors.report_category ? (
                      <div className="text-danger">
                        {formik.errors.report_category}
                      </div>
                    ) : null}
                  </Col>
                  <Col md={6}>
                    <Form.Label htmlFor="report_name">Report Name<span className="text-danger"> *</span></Form.Label>
                    <Form.Control
                      as="select"
                      className="form-select"
                      id="report_name"
                      name="report_name"
                      value={formik.values.report_name}
                      onChange={(e) => {
                        formik.handleChange(e);
                        setSelectedReportName(e.target.value);
                      }}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.report_name &&
                        !!formik.errors.report_name
                      }
                    >
                      <option value="">Select report</option>
                      <option value="Sales tax exemption detail by jurisdiction">
                        Sales tax exemption detail by jurisdiction
                      </option>
                      <option value="Exemption exposure">
                        Exemption exposure
                      </option>
                      <option value="Exemption exposure aging">
                        Exemption exposure aging
                      </option>
                      <option value="Sales tax exemption certificates">
                        Sales tax exemption certificates
                      </option>
                    </Form.Control>
                    {formik.touched.report_name && formik.errors.report_name ? (
                      <div className="text-danger">
                        {formik.errors.report_name}
                      </div>
                    ) : null}
                  </Col>
                </Row>
                <Row className="justify-content-end">
                  <Col md={6} className="text-start">
                    {selectedReportName ===
                      'Sales tax exemption detail by jurisdiction' && (
                      <p>Shows exempt and non-taxable sales details.</p>
                    )}
                    {selectedReportName === 'Exemption exposure' && (
                      <p>
                        Shows the total exempt transactions that don't have
                        exemption certificate entries applied.
                      </p>
                    )}
                    {selectedReportName === 'Exemption exposure aging' && (
                      <p>
                        Shows groups of exempt transactions that don't have
                        exemption certificate entries applied.
                      </p>
                    )}
                    {selectedReportName ===
                      'Sales tax exemption certificates' && (
                      <p>Shows details for each exemption certificate entry.</p>
                    )}
                  </Col>
                </Row>
                <hr className="mt-5 mb-4" />
                <Row className="mt-3">
                  <h2>Select report details</h2>
                </Row>

                  <Row className="mt-3">
                      <Form.Group>
                        <Form.Label>Date Range<span className="text-danger"> *</span></Form.Label>
                        <Row className="mt-2">
                          <Col sm={4}>
                            <Form.Check
                              type="radio"
                              name="date_option"
                              id="previous_month"
                              label="Previous month"
                              value="previous_month"
                              checked={dateOption === 'previous_month'}
                              onChange={handleDateOptionChange}
                            />
                          </Col>
                          <Col sm={4}>
                            <Form.Check
                              type="radio"
                              name="date_option"
                              id="current_month"
                              label="Current month"
                              value="current_month"
                              checked={dateOption === 'current_month'}
                              onChange={handleDateOptionChange}
                            />
                          </Col>
                          <Col sm={4}>
                            <Form.Check
                              type="radio"
                              name="date_option"
                              id="other_range"
                              label="Other range"
                              value="other_range"
                              checked={dateOption === 'other_range'}
                              onChange={handleDateOptionChange}
                            />
                          </Col>
                        </Row>
                      </Form.Group>

                      {selectedReportName ==='Sales tax exemption detail by jurisdiction' && (
                       <Row className="mt-3">
                          <Col md="6">
                          <Form.Check
                          type="checkbox"
                          name="include_locked_transactions_only"
                          id="include_locked_transactions_only"
                          label="Include locked transactions only"
                          checked={
                          formik.values.include_locked_transactions_only
                          }
                          onChange={formik.handleChange}
                        />
                      </Col>
                    </Row>
                      )}

                    <Col sm={6} className='mt-3'>
                      <Form.Group>
                        <Form.Label>Entity<span className="text-danger"> *</span></Form.Label>
                        <Form.Select
                          className="form-select"
                          name="entity_id"
                          value={formik.values.entity_id}
                          onChange={handleEntityChange}
                        >
                          <option value="">All companies</option>
                          {entitiesList &&
                            entitiesList.map((entity: PrimaryEntity) => (
                              <option key={entity.id} value={entity.id}>
                                {entity.name}
                              </option>
                            ))}
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                

                {dateOption === 'other_range' && (
                  <Row className="mt-3">
                    <div
                      className="alert alert-primary d-flex align-items-center"
                      role="alert"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="currentColor"
                        className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2"
                        viewBox="0 0 16 16"
                        role="img"
                        aria-label="Warning:"
                      >
                        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
                      </svg>
                      <div>
                        Depending on your ScalarTax Data Plan subscription, you
                        might not have access to transaction records from before
                        January 1st, 2020.
                      </div>
                    </div>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>From</Form.Label>
                        <Form.Control
                          type="date"
                          name="custom_date_from"
                          value={formik.values.custom_date_from}
                          onChange={formik.handleChange}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>To</Form.Label>
                        <Form.Control
                          type="date"
                          name="custom_date_to"
                          value={formik.values.custom_date_to}
                          onChange={formik.handleChange}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                )}
                
                <Row className="mt-3">
                  <Col md="6">
                    <Form.Group>
                      <Form.Label>Country<span className="text-danger"> *</span></Form.Label>
                      <Form.Control
                        as="select"
                        name="Country"
                        disabled
                        value={formik.values.Country}
                        onChange={formik.handleChange}
                      >
                        <option value="Exemption reports">
                          UNITED STATES OF AMERICA
                        </option>
                      </Form.Control>
                    </Form.Group>
                  </Col>
                  <Col md="6">
                    <Form.Group>
                      <Form.Label htmlFor="reason">Region<span className="text-danger"> *</span></Form.Label>
                      <Form.Control
                        as="select"
                        className="form-select"
                        id="reason"
                        name="reason"
                        value={formik.values.reason}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.reason &&
                          !!formik.errors.reason
                        }
                      >
                        <option value="All">All</option>
                        {stateOptions.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </Form.Control>
                      {formik.touched.reason &&
                      formik.errors.reason ? (
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.reason}
                        </Form.Control.Feedback>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row></Row>
                {selectedReportName === 'Sales tax exemption certificates' && (
                  <Row>
                    <Row className="mt-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Customer code</Form.Label>
                          <Form.Control
                            type="text"
                            name="customer_code"
                            value={formik.values.customer_code}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group>
                          <Form.Label htmlFor="exempt_cert_status">
                            Exempt cert status
                          </Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            id="exempt_cert_status"
                            name="exempt_cert_status"
                            value={formik.values.exempt_cert_status}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.exempt_cert_status &&
                              !!formik.errors.exempt_cert_status
                            }
                          >
                            <option value="">All</option>
                            <option value="Active">Active</option>
                            <option value="Expired">Expired</option>
                            <option value="Revoked">Revoked</option>
                          </Form.Control>
                          {formik.touched.exempt_cert_status &&
                          formik.errors.exempt_cert_status ? (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.exempt_cert_status}
                            </Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group>
                          <Form.Label htmlFor="applied">Applied</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            id="applied"
                            name="applied"
                            value={formik.values.applied}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.applied && !!formik.errors.applied
                            }
                          >
                            <option value="">All</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                          </Form.Control>
                          {formik.touched.applied && formik.errors.applied ? (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.applied}
                            </Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                      </Col>
                    </Row>
                    {/* Add Certificate Fields */}

                    <Row className="mt-3">
                      <Col md={12}>
                        <h4>Data export options</h4>
                        <Row className="mt-2">
                          {certificateFields.map((field, index) => (
                            <Col md={4} key={index} className="mb-2">
                              <Form.Check
                                type="checkbox"
                                id={field.toLowerCase().replace(/\s+/g, '_')}
                                name={field.toLowerCase().replace(/\s+/g, '_')}
                                label={field}
                                checked={
                                  formik.values[
                                    field.toLowerCase().replace(/\s+/g, '_')
                                  ]
                                }
                                onChange={formik.handleChange}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                    {/* Export Format Section */}
                    <Row className="mt-3">
                      <h2>Export format</h2>
                      <Col>
                        <p>
                          Export the report data into a comma-delimited (.xls)
                          file
                        </p>
                      </Col>
                    </Row>
                  </Row>
                )}
                {selectedReportName ===
                  'Sales tax exemption detail by jurisdiction' && (
                  <Row>
                    <Row className="mt-3">
                      <Col md={12}>
                        <h4>Exempt type</h4>
                        <Row className="mt-2">
                          {SalesJurisdiction.map((field, index) => (
                            <Col md={4} key={index} className="mb-2">
                              <Form.Check
                                type="checkbox"
                                id={field.toLowerCase().replace(/\s+/g, '_')}
                                name={field.toLowerCase().replace(/\s+/g, '_')}
                                label={field}
                                checked={
                                  formik.values[
                                    field.toLowerCase().replace(/\s+/g, '_')
                                  ]
                                }
                                onChange={formik.handleChange}
                              />
                            </Col>
                          ))}
                        </Row>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <Form.Group>
                          <Form.Label htmlFor="Level">Level</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            id="Level"
                            name="Level"
                            value={formik.values.Level}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.Level && !!formik.errors.Level
                            }
                          >
                            <option value="State">State</option>
                            <option value="County">County</option>
                            <option value="City">City</option>
                            <option value="Special tax jurisdiction">
                              Special tax jurisdiction
                            </option>
                          </Form.Control>
                          {formik.touched.Level && formik.errors.Level ? (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.Level}
                            </Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                      </Col>
                      <Col md="6">
                        <Form.Group>
                          <Form.Label htmlFor="tax_type">Tax type</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            id="tax_type"
                            name="tax_type"
                            value={formik.values.tax_type}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={
                              formik.touched.tax_type &&
                              !!formik.errors.tax_type
                            }
                          >
                            <option value="Sales and sellers use">
                              Sales and sellers use
                            </option>
                            <option value="Sales">Sales</option>
                            <option value="Sellers use">Sellers use</option>
                          </Form.Control>
                          {formik.touched.tax_type && formik.errors.tax_type ? (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.tax_type}
                            </Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Row>
                )}
                {shouldShowExportOptions(selectedReportName) && (
                  <>
                    <Row className="mt-3">
                      <h2>Report preview and export</h2>
                      <p>
                        'You can download or choose to preview before
                        downloading your report'
                      </p>
                    </Row>

                    <Row className="mt-3">
                      {selectedReportInstantly === 'report_instantly' && (
                        <Col md="2">
                          <Form.Check
                            type="radio"
                            name="preview"
                            id="preview"
                            label="Preview"
                            checked={formik.values.preview}
                            onChange={handleExportFormatChange}
                          />
                        </Col>
                      )}
                      <Col md="2">
                        <Form.Check
                          type="radio"
                          name="pdf"
                          id="pdf"
                          label=".PDF"
                          checked={formik.values.pdf}
                          onChange={handleExportFormatChange}
                        />
                      </Col>
                      <Col md="2">
                        <Form.Check
                          type="radio"
                          name="xlsx"
                          id="xlsx"
                          label=".XLSX"
                          checked={formik.values.xlsx}
                          onChange={handleExportFormatChange}
                        />
                      </Col>
                    </Row>
                  </>
                )}
                <Row className="mt-3">
                  <Col md="4">
                    <Button
                      type="button"
                      onClick={handleFavoriteClick}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0d6efd',
                      }}
                    >
                      Make this report a favorite
                    </Button>
                  </Col>
                </Row>
                <Row>
                  <p>
                    A favorite report reflects all the report selections made
                    during creation and is available in the Favorites tab
                  </p>
                </Row>
                <Row className="mt-3">
                  {exportFormat === 'preview' && (
                    <Col md={2}>
                      <Button type="submit" variant="primary">
                        Create Report
                      </Button>
                    </Col>
                  )}
                  {(exportFormat === 'pdf' || exportFormat === 'xlsx') && (
                    <Col md={4}>
                      <Button type="submit" variant="primary">
                        Create and download Report
                      </Button>
                    </Col>
                  )}
                </Row>
              </Form>
            </Col>
          </Row>
        </Container>
      ) : (
          <ExemptionDetailJurisdictionReport
            reportData={reportData}
            loading={loading}
            onBackClick={() => setShowReport(false)}
            currentPage={currentPage}
            totalPages={metadata?.totalPages || 1}
            onPageChange={onPageChange}
            reportName={formik.values.report_name}
            reason={formik.values.reason}
            entity={formik.values.entity}
            tax_type={formik.values.tax_type}
            Level={formik.values.Level}
            date_option={formik.values.date_option}
            custom_date_from={formik.values.custom_date_from}
            custom_date_to={formik.values.custom_date_to}
          />
        )}
      </div>
      <FavoriteReportModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSaveFavorite}
        defaultName="Exemption report"
        reportData={formik.values}
      />
    </React.Fragment>
  );
};

export default ExemptionReports;
