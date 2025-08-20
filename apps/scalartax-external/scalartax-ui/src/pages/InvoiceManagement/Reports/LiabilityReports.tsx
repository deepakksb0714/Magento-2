import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Col, Container, Row, Card, Button, Form } from 'react-bootstrap';
import { countryData } from '../../../Common/data/countryState';
import FavoriteReportModal from './FavoriteReportModal';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface PrimaryEntity {
  id: any;
  name: string;
}

// Define interfaces for our component
interface ReportOption {
  value: string;
  label: string;
}

type ReportDescription = {
  [key: string]: string;
};

type ReportDescriptions = {
  [key: string]: ReportDescription;
};

const stateOptions = countryData.USA;

// Define report options for each category
const reportOptions = {
  'Sales & sellers use tax return filing reports': [
    {
      value: 'Sales and sellers use tax jurisdiction detail',
      label: 'Sales and sellers use tax jurisdiction detail',
    },
    {
      value: 'All taxes jurisdiction detail report',
      label: 'All taxes jurisdiction detail report',
    },
    {
      value: 'All taxes liability summary report',
      label: 'All taxes liability summary report',
    },
    {
      value: 'Sales and sellers use tax summary',
      label: 'Sales and sellers use tax summary',
    },
    {
      value: 'Sales and sellers use tax summary - Ewaste fees',
      label: 'Sales and sellers use tax summary - Ewaste fees',
    },
    {
      value: 'Sales and sellers use tax jurisdiction detail expanded view',
      label: 'Sales and sellers use tax jurisdiction detail expanded view',
    },
    {
      value: 'Sales and sellers use tax jurisdiction detail county city',
      label: 'Sales and sellers use tax jurisdiction detail county city',
    },
    {
      value:
        'Sales and sellers use tax jurisdiction detail sales by destination address',
      label:
        'Sales and sellers use tax jurisdiction detail sales by destination address',
    },
    {
      value: 'Sales and sellers use tax jurisdiction detail combined view',
      label: 'Sales and sellers use tax jurisdiction detail combined view',
    },
    {
      value: 'Sales and sellers use tax jurisdiction combined extended view',
      label: 'Sales and sellers use tax jurisdiction combined extended view',
    },
    {
      value:
        'Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction',
      label:
        'Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction',
    },
    {
      value: 'Sales and sellers use tax levels report California detail',
      label: 'Sales and sellers use tax levels report California detail',
    },
    {
      value: 'Sales and sellers use tax levels report California summary',
      label: 'Sales and sellers use tax levels report California summary',
    },
    {
      value: 'Sales and sellers use tax levels report Colorado',
      label: 'Sales and sellers use tax levels report Colorado',
    },
    {
      value:
        'Sales and sellers use tax levels report Colorado - home rule location',
      label:
        'Sales and sellers use tax levels report Colorado - home rule location',
    },
    { value: 'New York apparel taxation', label: 'New York apparel taxation' },
    { value: 'Colorado multi-location', label: 'Colorado multi-location' },
    {
      value: 'Sales tax summary by marketplace location',
      label: 'Sales tax summary by marketplace location',
    },
  ],
  'Consumer use tax return filing reports': [
    { value: 'Consumer use tax summary', label: 'Consumer use tax summary' },
    {
      value: 'Consumer use tax jurisdiction detail',
      label: 'Consumer use tax jurisdiction detail',
    },
    {
      value: 'Consumer use tax jurisdiction detail expanded',
      label: 'Consumer use tax jurisdiction detail expanded',
    },
    {
      value: 'Consumer use tax jurisdiction detail county city view',
      label: 'Consumer use tax jurisdiction detail county city view',
    },
    {
      value: 'Consumer use tax jurisdiction detail combined view',
      label: 'Consumer use tax jurisdiction detail combined view',
    },
    {
      value: 'Consumer use tax jurisdiction detail combined extended view',
      label: 'Consumer use tax jurisdiction detail combined extended view',
    },
    {
      value:
        'Consumer use tax jurisdiction detail combined view by taxing jurisdiction',
      label:
        'Consumer use tax jurisdiction detail combined view by taxing jurisdiction',
    },
    {
      value: 'Consumer use tax exemption detail by jurisdiction',
      label: 'Consumer use tax exemption detail by jurisdiction',
    },
    {
      value: 'Consumer use tax levels report California detail',
      label: 'Consumer use tax levels report California detail',
    },
    {
      value: 'Consumer use tax levels report California summary',
      label: 'Consumer use tax levels report California summary',
    },
    {
      value: 'Consumer use tax levels report Colorado',
      label: 'Consumer use tax levels report Colorado',
    },
  ],
  'Excise & Canada HST reports': [
    {
      value: 'Federal excise tax summary',
      label: 'Federal excise tax summary',
    },
    { value: 'Canada HST Summary', label: 'Canada HST Summary' },
  ],
};

// show message with report name field
const reportDescriptions: ReportDescriptions = {
  'Sales & sellers use tax return filing reports': {
    'Sales and sellers use tax jurisdiction detail':
      'Use this report to fill out tax returns for all tax types by state and local jurisdiction',
    'All taxes jurisdiction detail report':
      'Use this report to fill out tax returns for all tax types by state and local jurisdiction',
    'All taxes liability summary report':
      'Use this report to view your summary tax liability by state',
    'Sales and sellers use tax summary':
      'Shows tax summary liability by country or region',
    'Sales and sellers use tax summary - Ewaste fees':
      'Shows tax summary liability by country or region and includes Ewaste fees',
    'Sales and sellers use tax jurisdiction detail expanded view':
      'Shows transactions summarized by individual tax jurisdictions within a state with extra space between lines',
    'Sales and sellers use tax jurisdiction detail county city':
      'Shows transactions sorted by state, then county, and finally city tax jurisdictions',
    'Sales and sellers use tax jurisdiction detail sales by destination address':
      "Shows totals, broken up by shipping destination, for transactions you've entered in ScalarTax",
    'Sales and sellers use tax jurisdiction detail combined view':
      'Shows transactions with details displayed for specific counties and cities',
    'Sales and sellers use tax jurisdiction combined extended view':
      'Shows transactions by address and is used for state returns that require combined rate reporting by a non-taxing jurisdiction',
    'Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction':
      'Shows transactions with details displayed for specific counties and cities plus special tax jurisdictions',
    'Sales and sellers use tax levels report California detail':
      'Provides detailed information to help you fill out California state returns',
    'Sales and sellers use tax levels report California summary':
      'Provides summarized information to help you fill out California state returns',
    'Sales and sellers use tax levels report Colorado':
      'Provides summarized information to help you fill out Colorado state returns',
    'Sales and sellers use tax levels report Colorado - home rule location':
      'Provides information to help you fill out local home rule Colorado tax returns',
    'New York apparel taxation':
      'Provides information to help you fill out New York Schedule H forms',
    'Colorado multi-location':
      'Provides information to help you fill out local home rule CO tax returns, including your CO account number and site ID',
    'Sales tax summary by marketplace location':
      "Shows sales tax totals for each online marketplace location you've set up in ScalarTax",
  },
  'Consumer use tax return filing reports': {
    'Consumer use tax summary':
      'Shows tax summary liability by country or region',
    'Consumer use tax jurisdiction detail':
      'Shows transactions summarized by individual tax jurisdictions within a state',
    'Consumer use tax jurisdiction detail expanded':
      'Shows transactions summarized by individual tax jurisdictions within a state with extra space between lines',
    'Consumer use tax jurisdiction detail county city view':
      'Shows transactions sorted by state, then county, and finally city tax jurisdictions',
    'Consumer use tax jurisdiction detail combined view':
      'Shows transactions with details displayed for specific counties and cities',
    'Consumer use tax jurisdiction detail combined extended view':
      'Shows transactions by address and is used for state returns that require combined rate reporting by a non-taxing jurisdiction',
    'Consumer use tax jurisdiction detail combined view by taxing jurisdiction':
      'Shows transactions with details displayed for specific counties and cities plus special tax jurisdictions',
    'Consumer use tax exemption detail by jurisdiction':
      'Shows exempt and non-taxable sales details',
    'Consumer use tax levels report California detail':
      'Provides detailed information to help you fill out California state returns',
    'Consumer use tax levels report California summary':
      'Provides summarized information to help you fill out California state returns',
    'Consumer use tax levels report Colorado':
      'Provides summarized information to help you fill out Colorado state and local home rule returns',
  },
  'Excise & Canada HST reports': {
    'Federal excise tax summary':
      'Provides detailed information to help you complete federal medical device excise tax forms',
    'Canada HST Summary':
      'Shows totals for harmonized sales tax and provincial sales tax in Canada',
  },
};

const homeRuleLocations = [
  'All home rule locations',
  'Aguilar',
  'Akron',
  'Alamosa',
  'Alma',
  'Antonito',
  'Arvada',
  'Aspen',
  'Ault',
  'Aurora',
  'Aurora Cd Only',
  'Avon',
  'Basalt',
  'Bayfield',
  'Bennett',
  'Berthoud',
  'Berthoud (Weld Co)',
  'Black Hawk',
  'Blanca',
  'Blue River',
  'Boulder',
  'Breckenridge',
  'Brighton',
  'Broomfield',
  'Broomfield I-25 Hwy7 Intc',
  'Brush',
  'Buena Vista',
  'Burlington',
  'Calhan',
  'Canon City',
  'Carbondale',
  'Castle Pines North',
  'Castle Rock',
  'Cedaredge',
  'Centennial',
  'Center',
  'Central City',
  'Cherry Hills Village',
  'Cheyenne Wells',
  'Collbran',
  'Colorado Springs',
  'Columbine Valley',
  'Commerce City',
  'Cortez',
  'Craig',
  'Crawford',
  'Creede',
  'Crested Butte',
  'Crestone',
  'Cripple Creek',
  'Dacono',
  'De Beque',
  'Deer Trail',
  'Del Norte',
  'Delta',
  'Denver',
  'Dillon',
  'Dinosaur',
  'Dolores',
  'Dove Creek',
  'Durango',
  'Eads',
  'Eagle',
  'Eaton',
  'Edgewater',
  'Elizabeth',
  'Empire',
  'Englewood',
  'Erie',
  'Erie (Weld Co) No Rtd',
  'Estes Park',
  'Evans',
  'Fairplay',
  'Federal Heights',
  'Firestone',
  'Flagler',
  'Fleming',
  'Florence',
  'Fort Collins',
  'Fort Lupton',
  'Fort Morgan',
  'Fountain',
  'Fowler',
  'Foxfield',
  'Fraser',
  'Frederick',
  'Frisco',
  'Fruita',
  'Garden City',
  'Georgetown',
  'Gilcrest',
  'Glendale',
  'Glenwood Springs',
  'Golden',
  'Granada',
  'Granby',
  'Grand Junction',
  'Grand Lake',
  'Greeley',
  'Green Mountain Falls',
  'Greenwood Village',
  'Gunnison',
  'Gypsum',
  'Haxtun',
  'Hayden',
  'Highlands Ranch',
  'Holly',
  'Holyoke',
  'Hooper',
  'Hot Sulphur Springs',
  'Hotchkiss',
  'Hudson',
  'Hugo',
  'Idaho Springs',
  'Ignacio',
  'Johnstown',
  'Julesburg',
  'Keenesburg',
  'Kersey',
  'Kiowa',
  'Kit Carson',
  'Kremmling',
  'La Jara',
  'La Junta',
  'La Salle',
  'La Veta',
  'Lafayette',
  'Lakeside',
  'Lakewood',
  'Lakewood Marston Bellevie',
  'Lamar',
  'Larkspur',
  'Las Animas',
  'Leadville',
  'Limon',
  'Littleton',
  'Lochbuie',
  'Log Lane Village',
  'Lone Tree',
  'Lone Tree Lincoln Station',
  'Lone Tree Rtd Cd Only',
  'Longmont',
  'Longmont (No Stj)',
  'Louisville',
  'Loveland',
  'Lyons',
  'Manassa',
  'Mancos',
  'Manitou Springs',
  'Manzanola',
  'Marble',
  'Mead',
  'Milliken',
  'Minturn',
  'Moffat',
  'Monte Vista',
  'Montezuma',
  'Montrose',
  'Monument',
  'Monument Baptist Road Rta',
  'Morrison',
  'Mount Crested Butte',
  'Mountain View',
  'Mountain Village',
  'Naturita',
  'Nederland',
  'New Castle',
  'Northglenn',
  'Northglenn (Weld Co)',
  'Norwood',
  'Nucla',
  'Nunn',
  'Oak Creek',
  'Olathe',
  'Ordway',
  'Otis',
  'Ouray',
  'Ovid',
  'Pagosa Springs',
  'Palisade',
  'Palmer Lake',
  'Paonia',
  'Parachute',
  'Parker',
  'Pierce',
  'Pitkin',
  'Platteville',
  'Poncha Springs',
  'Pueblo',
  'Red Cliff',
  'Rico',
  'Ridgway',
  'Rifle',
  'Rocky Ford',
  'Romeo',
  'Saguache',
  'Salida',
  'San Luis',
  'Sawpit',
  'Sedgwick',
  'Seibert',
  'Severance',
  'Sheridan',
  'Silt',
  'Silver Cliff',
  'Silver Plume',
  'Silverthorne',
  'Silverton',
  'Simla',
  'Snowmass Village',
  'South Fork',
  'Springfield',
  'Steamboat Springs',
  'Sterling',
  'Stratton',
  'Superior',
  'Telluride',
  'Thornton',
  'Timnath',
  'Trinidad',
  'Vail',
  'Victor',
  'Walden',
  'Walsenburg',
  'Walsh',
  'Ward',
  'Wellington',
  'Westcliffe',
  'Westminster',
  'Wheat Ridge',
  'Wiggins',
  'Windsor',
  'Winter Park',
  'Woodland Park',
  'Wray',
  'Yampa',
  'Yuma',
];

//showing selection field
const REPORT_CONFIG = {
  // Reports that don't show country selector
  noCountrySelector: [
    'Sales and sellers use tax levels report California detail',
    'Sales and sellers use tax levels report California summary',
    'Sales and sellers use tax levels report Colorado',
    'New York apparel taxation',
    'Colorado multi-location',
    'Consumer use tax levels report California detail',
    'Consumer use tax levels report California summary',
    'Canada HST Summary',
  ],

  // Reports that don't show locked transactions checkbox
  noLockedTransactions: [
    'Sales and sellers use tax jurisdiction combined extended view',
    'Sales tax summary by marketplace location',
    'Consumer use tax jurisdiction detail',
    'Federal excise tax summary',
  ],

  // Reports that don't show region selector
  noRegionSelector: [
    'Sales and sellers use tax levels report California detail',
    'Sales and sellers use tax levels report California summary',
    'Sales and sellers use tax levels report Colorado',
    'New York apparel taxation',
    'Colorado multi-location',
    'Consumer use tax return filing reports',
    'Consumer use tax levels report California summary',
  ],
};

const LiabilityReports = ({ flag }: { flag?: string }) => {
  document.title = 'Transaction Reports';
  const [selectedReportName, setSelectedReportName] = useState(
    'Sales and sellers use tax jurisdiction detail'
  );
  const [exportFormat, setExportFormat] = useState('preview');
  const [dateOption, setDateOption] = useState('previous_month');
  const [showModal, setShowModal] = useState(false);
  const [selectedReportInstantly, setSelectedReportInstantly] =
    useState('report_instantly');
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

  // Convert countryData to an array of options
  const countryOptions = Object.entries(countryData).map(
    ([country, regions]) => ({
      country,
      regions,
    })
  );

  const formik = useFormik({
    initialValues: {
      report_category: 'Sales & sellers use tax return filing reports',
      report_name: 'Sales and sellers use tax jurisdiction detail',
      exemption_reason: '',
      report_instantly: 'report_instantly',
      date_option: 'previous_month',
      custom_date_from: '',
      custom_date_to: '',
      entity_id: '',
      entity: '',
      Country: '',
      include_locked_transactions_only: false,
      display_rate: false,
      display_zip_code: false,
      display_freight_break_out: false,
      display_state_assigned_codes: false,
      display_location_code: false,
      location_code: '',
      tax_code: '',
      tax_type: 'input and output tax',
      compress_zip_file: false,
      is_favorite: false,
      preview: true,
      pdf: false,
      xlsx: false,
    },
    validationSchema: Yup.object({
      report_category: Yup.string().required('Required'),
      report_name: Yup.string().required('Required'),
      exemption_reason: Yup.string().required('Required'),
    }),
    onSubmit: (values: any) => {
      // Handle form submission
    },
  });

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find(
        (entity: any) => entity.is_default
      );

      if (defaultEntity) {
        setPrimaryEntity(defaultEntity);
        formik.setFieldValue('entity_id', defaultEntity.id);
        formik.setFieldValue('entity', defaultEntity.id);
      } else {
        setPrimaryEntity(entitiesList[0]);
        formik.setFieldValue('entity_id', entitiesList[0].id);
        formik.setFieldValue('entity', entitiesList[0].id);
      }
    } else {
      setPrimaryEntity(null);
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

    if (selectedEntity) {
      setPrimaryEntity(selectedEntity);
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

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<any>) => {
    formik.handleChange(e);
    formik.setFieldValue('report_name', '');
  };

  // Get current report options based on selected category
  const getCurrentReportOptions = (): ReportOption[] => {
    return (
      reportOptions[
        formik.values.report_category as keyof typeof reportOptions
      ] || []
    );
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

  const getReportDescription = (category: string, reportName: string) => {
    return reportDescriptions[category]?.[reportName] || '';
  };

  // Add this useEffect to handle report category changes
  useEffect(() => {
    const newCategoryOptions =
      reportOptions[
        formik.values.report_category as keyof typeof reportOptions
      ] || [];
    if (newCategoryOptions.length > 0) {
      const firstReportInCategory = newCategoryOptions[0].value;
      setSelectedReportName(firstReportInCategory);
      formik.setFieldValue('report_name', firstReportInCategory);
    }
  }, [formik.values.report_category]);

  const reportUtils = {
    shouldShowCountrySelector: (reportName: string) => {
      return !REPORT_CONFIG.noCountrySelector.includes(reportName);
    },

    shouldShowLockedTransactions: (reportName: string) => {
      return !REPORT_CONFIG.noLockedTransactions.includes(reportName);
    },

    shouldShowRegionSelector: (reportName: string) => {
      return !REPORT_CONFIG.noRegionSelector.includes(reportName);
    },
  };

  return (
    <React.Fragment>
      <div
        className="page-content"
        style={{
          padding: flag === 'hide' ? 'unset' : 'revert-layer',
        }}
      >
        <Container fluid>
          {flag !== 'hide' ? (
            <BreadCrumb
              pageTitle="Liability & tax return reports"
              title="Liability & tax return reports"
            />
          ) : null}
          {flag === 'hide' ? <Row className="mt-3"></Row> : null}
          <Row>
            <Col xl={12}>
              <Form onSubmit={formik.handleSubmit}>
                <Row>{flag !== 'hide' ? <h1>Select a report</h1> : null}</Row>
                <Row>
                  <Col md={6}>
                    <Form.Label htmlFor="report_category">
                      Report Category
                    </Form.Label>
                    <Form.Control
                      as="select"
                      className="form-select"
                      id="report_category"
                      name="report_category"
                      value={formik.values.report_category}
                      onChange={handleCategoryChange}
                      onBlur={formik.handleBlur}
                      isInvalid={
                        formik.touched.report_category &&
                        !!formik.errors.report_category
                      }
                    >
                      <option value="Sales & sellers use tax return filing reports">
                        Sales & sellers use tax return filing reports
                      </option>
                      <option value="Consumer use tax return filing reports">
                        Consumer use tax return filing reports
                      </option>
                      <option value="Excise & Canada HST reports">
                        Excise & Canada HST reports
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
                    <Form.Label htmlFor="report_name">Report Name</Form.Label>
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
                      {getCurrentReportOptions().map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
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
                    {getReportDescription(
                      formik.values.report_category,
                      selectedReportName
                    ) && (
                      <p>
                        {getReportDescription(
                          formik.values.report_category,
                          selectedReportName
                        )}
                      </p>
                    )}
                  </Col>
                </Row>
                <hr className="mt-3 mb-4" />
                <Row className="mt-3">
                  <h2>Select report details</h2>
                </Row>

                <div className="mt-3">
                  <Row>
                    <Col sm={6}>
                      <Form.Label>Date Range</Form.Label>
                      <Row className="mt-2">
                        <Col md={4}>
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
                        <Col md={4}>
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
                        <Col md={4}>
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
                    </Col>
                    <Col sm={6}></Col>
                  </Row>
                </div>

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
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Entity</Form.Label>
                      <Form.Select
                        className="form-select"
                        name="entity_id"
                        disabled
                        value={formik.values.entity_id}
                        onChange={handleEntityChange}
                      >
                        {entitiesList &&
                          entitiesList.map((entity: PrimaryEntity) => (
                            <option key={entity.id} value={entity.id}>
                              {entity.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  {reportUtils.shouldShowCountrySelector(
                    selectedReportName
                  ) && (
                    <Col md="6">
                      <Form.Group>
                        <Form.Label>Country</Form.Label>
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
                  )}
                </Row>
                <Row className="mt-3">
                  {reportUtils.shouldShowLockedTransactions(
                    selectedReportName
                  ) && (
                    <Col md="6">
                      <Form.Check
                        type="checkbox"
                        name="include_locked_transactions_only"
                        id="include_locked_transactions_only"
                        label="Include locked transactions only"
                        checked={formik.values.include_locked_transactions_only}
                        onChange={formik.handleChange}
                      />
                    </Col>
                  )}
                </Row>
                <Row className="mt-3">
                  {reportUtils.shouldShowRegionSelector(selectedReportName) && (
                    <Col md="6">
                      <Form.Group>
                        <Form.Label htmlFor="exemption_reason">
                          Region
                        </Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          id="exemption_reason"
                          name="exemption_reason"
                          value={formik.values.exemption_reason}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.exemption_reason &&
                            !!formik.errors.exemption_reason
                          }
                        >
                          <option value="all">All</option>
                          {stateOptions.map((state) => (
                            <option key={state} value={state}>
                              {state}
                            </option>
                          ))}
                        </Form.Control>
                        {formik.touched.exemption_reason &&
                        formik.errors.exemption_reason ? (
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.exemption_reason}
                          </Form.Control.Feedback>
                        ) : null}
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                {(selectedReportName ===
                  'Sales and sellers use tax jurisdiction detail' ||
                  selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail expanded view' ||
                  selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail county city' ||
                  selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail sales by destination address' ||
                  selectedReportName ===
                    '  Sales and sellers use tax jurisdiction detail combined view' ||
                  selectedReportName ===
                    ' Sales and sellers use tax jurisdiction combined extended view' ||
                  selectedReportName ===
                    ' Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction' ||
                  selectedReportName ===
                    'Consumer use tax jurisdiction detail' ||
                  selectedReportName ===
                    ' Consumer use tax jurisdiction detail expanded' ||
                  selectedReportName ===
                    'Consumer use tax jurisdiction detail county city view' ||
                  selectedReportName ===
                    'Consumer use tax jurisdiction detail combined view' ||
                  selectedReportName ===
                    ' Consumer use tax jurisdiction detail combined extended view' ||
                  selectedReportName ===
                    'Consumer use tax jurisdiction detail combined view by taxing jurisdiction') && (
                  <>
                    <Row className="mt-3">
                      <label>Options</label>
                      <Col md="4">
                        <Form.Check
                          type="checkbox"
                          name="display_rate"
                          id="display_rate"
                          label="Display rate"
                          checked={formik.values.display_rate}
                          onChange={formik.handleChange}
                        />
                      </Col>
                      <Col md="4">
                        <Form.Check
                          type="checkbox"
                          name="display_zip_code"
                          id="display_zip_code"
                          label="Display Zip Code"
                          checked={formik.values.display_zip_code}
                          onChange={formik.handleChange}
                        />
                      </Col>
                      <Col md="4">
                        <Form.Check
                          type="checkbox"
                          name="display_freight_break_out"
                          id="display_freight_break_out"
                          label="Display freight break out"
                          checked={formik.values.display_freight_break_out}
                          onChange={formik.handleChange}
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md="4">
                        <Form.Check
                          type="checkbox"
                          name="display_state_assigned_codes"
                          id="display_state_assigned_codes"
                          label="Display state assigned codes"
                          checked={formik.values.display_state_assigned_codes}
                          onChange={formik.handleChange}
                        />
                      </Col>
                      <Col md="4">
                        <Form.Check
                          type="checkbox"
                          name="display_location_code"
                          id="display_location_code"
                          label="Display location code"
                          checked={formik.values.display_location_code}
                          onChange={formik.handleChange}
                        />
                      </Col>
                    </Row>
                  </>
                )}

                {(selectedReportName ===
                  'Sales and sellers use tax levels report California detail' ||
                  selectedReportName ===
                    'Sales and sellers use tax levels report California summary' ||
                  selectedReportName === 'New York apparel taxation') && (
                  <Row className="mt-3">
                    <label>Liability type</label>
                    <Col md={4}>
                      <Form.Check
                        type="radio"
                        name="sales_option"
                        id="direct_sales"
                        label="Direct sales only"
                        value="direct_sales"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Check
                        type="radio"
                        name="sales_option"
                        id="marketplace_sales"
                        label="Marketplace sales only"
                        value="marketplace_sales"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Check
                        type="radio"
                        name="sales_option"
                        id="total_sales"
                        label="Total sales (direct sales + marketplace sales)"
                        value="total_sales"
                      />
                    </Col>
                    <Col md={4}>
                      <Form.Check
                        type="radio"
                        name="sales_option"
                        id="sales_summary"
                        label="Total sales, direct sales, and marketplace sales summarized separately"
                        value="sales_summary"
                      />
                    </Col>
                  </Row>
                )}

                {/* Document Code Section */}
                <Row className="mt-3">
                  {(selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail sales by destination address' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail county city view') && (
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Location code</Form.Label>
                        <Form.Control
                          type="text"
                          name="location_code"
                          value={formik.values.location_code}
                          onChange={formik.handleChange}
                        />
                      </Form.Group>
                    </Col>
                  )}

                  {selectedReportName ===
                    'Consumer use tax exemption detail by jurisdiction' && (
                    <Row className="mt-3">
                      <label>Exempt type</label>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          name="entityUseExemption"
                          id="entity_use_exemption"
                          label="Entity and Use based exemption"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          name="productExemption"
                          id="product_exemption"
                          label="Product based exemptions"
                        />
                      </Col>
                      <Col md={4}>
                        <Form.Check
                          type="checkbox"
                          name="noNexusJurisdictions"
                          id="no_nexus_jurisdictions"
                          label="No Nexus Jurisdictions based exemptions"
                        />
                      </Col>
                    </Row>
                  )}

                  {(selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail' ||
                    selectedReportName ===
                      'All taxes jurisdiction detail report' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail expanded view' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail county city' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail sales by destination address' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail combined view' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction combined extended view' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail expanded' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail county city view' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail combined view' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail combined extended view' ||
                    selectedReportName ===
                      'Consumer use tax jurisdiction detail combined view by taxing jurisdiction') && (
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tax code</Form.Label>
                        <Form.Control
                          type="text"
                          name="tax_code"
                          value={formik.values.tax_code}
                          onChange={formik.handleChange}
                        />
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                {/* Tax type */}
                <Row className="mt-3">
                  {(selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail' ||
                    selectedReportName ===
                      'Sales and sellers use tax summary' ||
                    selectedReportName ===
                      'Sales and sellers use tax summary - Ewaste fees' ||
                    selectedReportName === 'Federal excise tax summary' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail expanded view' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail county city' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail sales by destination address' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail combined view' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction combined extended view' ||
                    selectedReportName ===
                      'Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction') && (
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Tax type</Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          name="tax_type"
                          value={formik.values.tax_type}
                          onChange={formik.handleChange}
                        >
                          <option value="Sales and sellers use">
                            Sales and sellers use
                          </option>
                          <option value="Sales">Sales</option>
                          <option value="Sellers use">Sellers use</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  )}

                  {(selectedReportName ===
                    'Sales and sellers use tax levels report Colorado - home rule location' ||
                    selectedReportName ===
                      'Consumer use tax levels report Colorado') && (
                    <Col md={6}>
                      <Form.Label htmlFor="homeRuleLocation">
                        Home Rule Location
                      </Form.Label>
                      <Form.Control
                        as="select"
                        className="form-select"
                        id="homeRuleLocation"
                        name="homeRuleLocation"
                        value={formik.values.homeRuleLocation}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.homeRuleLocation &&
                          !!formik.errors.homeRuleLocation
                        }
                      >
                        {homeRuleLocations.map((location) => (
                          <option key={location} value={location}>
                            {location}
                          </option>
                        ))}
                      </Form.Control>
                      {formik.touched.homeRuleLocation &&
                      formik.errors.homeRuleLocation ? (
                        <div className="text-danger">
                          {formik.errors.homeRuleLocation}
                        </div>
                      ) : null}
                    </Col>
                  )}

                  {selectedReportName ===
                    'Consumer use tax exemption detail by jurisdiction' && (
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label>Lebel</Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          name="level"
                          value={formik.values.level}
                          onChange={formik.handleChange}
                        >
                          <option value="State">State</option>
                          <option value="Country">Country</option>
                          <option value="City">City</option>
                          <option value="level">level</option>
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  )}
                </Row>

                {(selectedReportName ===
                  'Sales and sellers use tax jurisdiction detail' ||
                  selectedReportName === 'All taxes liability summary report' ||
                  selectedReportName === 'Sales and sellers use tax summary' ||
                  selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail county city' ||
                  selectedReportName ===
                    'Sales and sellers use tax jurisdiction combined extended view' ||
                  selectedReportName ===
                    'Sales and sellers use tax jurisdiction detail combined view by taxing jurisdiction') && (
                  <>
                    <Row className="mt-3">
                      <h2>
                        Select the approximate number of transactions for your
                        report
                      </h2>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Form.Check
                          type="radio"
                          name="report_instantly"
                          id="report_instantly"
                          label="Create and download the report instantly"
                          checked={
                            selectedReportInstantly === 'report_instantly'
                          }
                          onChange={() =>
                            setSelectedReportInstantly('report_instantly')
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col>
                        <Form.Check
                          type="radio"
                          name="report_instantly"
                          id="report_in_the_background"
                          label="Create and download the report in the background"
                          checked={
                            selectedReportInstantly ===
                            'report_in_the_background'
                          }
                          onChange={() =>
                            setSelectedReportInstantly(
                              'report_in_the_background'
                            )
                          }
                        />
                      </Col>
                    </Row>
                    <Row className="mt-3">
                      <Col md={6}>
                        {selectedReportInstantly === 'report_instantly' && (
                          <p>
                            Recommended for reports with a small volume of
                            transactions.
                          </p>
                        )}
                        {selectedReportInstantly ===
                          'report_in_the_background' && (
                          <p>
                            Recommended for reports with a large volume of
                            transactions. It may take 5 to 10 minutes to create
                            the report and we will send you an email and a
                            notification on the homepage.
                          </p>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
                <Row className="mt-3">
                  <h2>
                    {selectedReportInstantly === 'report_instantly' ||
                    selectedReportInstantly === 'report_in_the_background'
                      ? 'Report preview and export'
                      : 'Select your file format'}
                  </h2>
                  {(selectedReportInstantly === 'report_instantly' ||
                    selectedReportInstantly === 'report_in_the_background') && (
                    <p>
                      {selectedReportInstantly === 'report_instantly'
                        ? 'You can download or choose to preview before downloading your report'
                        : 'Select your file format'}
                    </p>
                  )}
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
      </div>
      <FavoriteReportModal
        show={showModal}
        onHide={handleCloseModal}
        onSave={handleSaveFavorite}
        defaultName="Return report"
        reportData={formik.values}
      />
    </React.Fragment>
  );
};

export default LiabilityReports;
