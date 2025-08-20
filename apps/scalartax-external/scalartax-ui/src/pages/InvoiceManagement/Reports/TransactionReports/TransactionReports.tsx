import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import BreadCrumb from '../../../../Common/BreadCrumb';
import { Col, Container, Row, Button, Form } from 'react-bootstrap';
import { countryData } from '../../../../Common/data/countryState';
import FavoriteReportModal from '../FavoriteReportModal';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import SalesTransactionReport from './SalesTransactionReport';
import type { ReportData } from './SalesTransactionReport';
import { addTransactionReports as onTransactionReports } from '../../../../slices/thunk';

interface Metadata {
  currentPage: number;
  totalPages: number;
}

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

const reportOptions = {
  'Sales tax document reports': [
    { value: 'Sales tax top line', label: 'Sales tax top line' },
    {
      value: 'Sales tax document summary',
      label: 'Sales tax document summary',
    },
    {
      value: 'Sales tax document summary listing by jurisdiction',
      label: 'Sales tax document summary listing by jurisdiction',
    },
    {
      value: 'Sales tax document summary listing by address',
      label: 'Sales tax document summary listing by address',
    },
    {
      value: 'Sales tax document line detail',
      label: 'Sales tax document line detail',
    },
    {
      value: 'Sales tax document line tax detail',
      label: 'Sales tax document line tax detail',
    },
    {
      value: 'Retail delivery fee report',
      label: 'Retail delivery fee report',
    },
    {
      value: 'Sales tax document summary by item code',
      label: 'Sales tax document summary by item code',
    },
  ],
  'Sales tax document data export': [
    { value: 'Sales tax document export', label: 'Sales tax document export' },
    {
      value: 'Sales tax document line export',
      label: 'Sales tax document line export',
    },
    {
      value: 'Sales tax document line detail export',
      label: 'Sales tax document line detail export',
    },
    {
      value: 'Sales tax document export by item code',
      label: 'Sales tax document export by item code',
    },
    {
      value: 'Multi-tax Line Item Detail Export',
      label: 'Multi-tax Line Item Detail Export',
    },
  ],
  'Consumer use tax document reports': [
    { value: 'Consumer use tax top line', label: 'Consumer use tax top line' },
    {
      value: 'Consumer use tax document summary',
      label: 'Consumer use tax document summary',
    },
    {
      value: 'Consumer use tax document line tax detail',
      label: 'Consumer use tax document line tax detail',
    },
    {
      value: 'Consumer use tax document line detail',
      label: 'Consumer use tax document line detail',
    },
  ],
  'Consumer use tax document data export': [
    {
      value: 'Consumer use tax document export',
      label: 'Consumer use tax document export',
    },
    {
      value: 'Consumer use tax document line export',
      label: 'Consumer use tax document line export',
    },
    {
      value: 'Consumer use tax document line detail export',
      label: 'Consumer use tax document line detail export',
    },
    {
      value: 'Consumer use tax accounts payable doc export',
      label: 'Consumer use tax accounts payable doc export',
    },
    {
      value: 'Consumer use tax accounts payable line detail export',
      label: 'Consumer use tax accounts payable line detail export',
    },
  ],
  'Reverse charge, VAT & all taxes data export': [
    {
      value: 'Reverse charge document export',
      label: 'Reverse charge document export',
    },
    {
      value: 'Reverse charge document line export',
      label: 'Reverse charge document line export',
    },
    {
      value: 'Reverse charge document line detail export',
      label: 'Reverse charge document line detail export',
    },
    {
      value: 'All taxes document line detail export',
      label: 'All taxes document line detail export',
    },
    {
      value: 'All taxes document line detail export including attributes',
      label: 'All taxes document line detail export including attributes',
    },
    {
      value: 'VAT document line detail export',
      label: 'VAT document line detail export',
    },
    {
      value: 'VAT marketplace transaction export',
      label: 'VAT marketplace transaction export',
    },
    {
      value: 'VAT document line detail export including attributes',
      label: 'VAT document line detail export including attributes',
    },
    { value: 'VAT transaction export', label: 'VAT transaction export' },
  ],
  'Cross border reports': [
    {
      value: 'Basic Transaction Variance View',
      label: 'Basic Transaction Variance View',
    },
    {
      value: 'Duty and tax data export report',
      label: 'Duty and tax data export report',
    },
  ],
  'Economic nexus': [
    { value: 'Economic nexus summary', label: 'Economic nexus summary' },
    {
      value: 'Economic nexus state document line export',
      label: 'Economic nexus state document line export',
    },
  ],
};

// show message with report name field
const reportDescriptions: ReportDescriptions = {
  'Sales tax document reports': {
    'Sales tax top line':
      'Shows top line totals for your companies with transactions in ScalarTax',
    'Sales tax document summary':
      'Use this report to reconcile ScalarTax invoice detail with the sales report in your system',
    'Sales tax document summary listing by jurisdiction':
      "Shows totals, broken up by tax jurisdiction, for transactions you've entered in ScalarTax",
    'Sales tax document summary listing by address':
      "Shows totals, broken up by address, for transactions you've entered in ScalarTax",
    'Sales tax document line detail':
      "Shows totals of each line within the transactions you've entered in ScalarTax",
    'Sales tax document line tax detail':
      'Shows details for a selected transaction, displaying each tax jurisdiction within a document line',
    'Retail delivery fee report':
      'Shows the summary of taxable and non-taxable deliveries, the associated fee amount, and the document details',
    'Sales tax document summary by item code':
      'Shows the sales tax totals, broken up by item codes, for lodging transactions you have entered in ScalarTax',
  },
  'Sales tax document data export': {
    'Sales tax document export':
      "Shows totals for the transactions you've entered in ScalarTax",
    'Sales tax document line export':
      "Shows totals of each line within the transactions you've entered in ScalarTax",
    'Sales tax document line detail export':
      'Shows details for a selected transaction, displaying each tax jurisdiction within a document line',
    'Sales tax document export by item code':
      'Shows all the details at the document level for transactions you have entered in ScalarTax',
    'Multi-tax Line Item Detail Export':
      'Shows the user-defined fields, lodging tax types, and other parameters applied for transactions at line and document level',
  },
  'Consumer use tax document reports': {
    'Consumer use tax top line':
      'Shows top line totals for your companies with transactions in ScalarTax',
    'Consumer use tax document summary':
      "Shows totals for the transactions you've entered in ScalarTax",
    'Consumer use tax document line tax detail':
      'Shows details for a selected transaction, displaying each tax jurisdiction within a document line',
    'Consumer use tax document line detail':
      "Shows totals of each line within the transactions you've entered in ScalarTax",
  },
  'Consumer use tax document data export': {
    'Consumer use tax document export':
      "Shows totals for the transactions you've entered in ScalarTax",
    'Consumer use tax document line export':
      "Shows totals of each line within the transactions you've entered in ScalarTax",
    'Consumer use tax document line detail export':
      'Shows details for a selected transaction, displaying each tax jurisdiction within a document line',
    'Consumer use tax accounts payable doc export':
      "Shows totals of each line within the transactions you've entered in ScalarTax",
    'Consumer use tax accounts payable line detail export':
      "Shows totals of each line within the transactions you've entered in ScalarTax",
  },
  'Reverse charge, VAT & all taxes data export': {
    'Reverse charge document export':
      "Shows totals for reverse charges you've entered in ScalarTax. Reverse charge is commonly required in the European Union (EU).",
    'Reverse charge document line export':
      "Shows totals of each line within the reverse charges you've entered in ScalarTax. Reverse charge is commonly required in the European Union (EU).",
    'Reverse charge document line detail export':
      'Shows details for a selected reverse charge, displaying each tax jurisdiction within a document line. Reverse charge is commonly required in the European Union (EU).',
    'All taxes document line detail export':
      'Shows information for taxes that ScalarTax calculates other than sales tax, such as lodging or landed cost',
    'All taxes document line detail export including attributes':
      'Shows information for taxes that ScalarTax calculates other than sales tax, such as lodging or landed cost',
    'VAT document line detail export':
      'Shows VAT tax totals for selected transactions. Tax jurisdictions are displayed within a document line. Product attributes are not included.',
    'VAT marketplace transaction export':
      'Report showing all transactions for goods sold in a Marketplace',
    'VAT document line detail export including attributes':
      'Shows VAT tax totals for selected transactions, including product attributes. Tax jurisdictions are displayed within a document line.',
    'VAT transaction export':
      'Shows the summary of VAT data on a transactional basis',
  },
  'Cross border reports': {
    'Basic Transaction Variance View':
      'This report compares the committed sales invoice or purchase order with related customs document to display the difference between calculated and charged amounts of duty and tax.',
    'Duty and tax data export report':
      "Shows totals for the transactions you've entered in ScalarTax",
  },
  'Economic nexus': {
    'Economic nexus summary':
      'This report displays the threshold status of your economic activity in all the states',
    'Economic nexus state document line export':
      "Shows all document lines included or excluded for a state's economic nexus threshold",
  },
};

//currency
const currencies = [
  'Afghanistan Afghani',
  'Albanian Lek',
  'Armenian Dram',
  'Netherlands Antillian Guilder',
  'Angolan Kwanza',
  'Argentine Peso',
  'Australian Dollar',
  'Aruban Guilder',
  'Azerbaijanian Manat',
  'Bosnian and Herzegovinan Convertible Marks',
  'Barbados Dollar',
  'Bangladeshi Taka',
  'Bulgarian Lev',
  'Bahraini Dinar',
  'Burundian Franc',
  'Bermuda Dollar',
  'Brunein Dollar',
  'Bolivian Boliviano',
  'Bolivian Mvdol',
  'Brazilian Real',
  'Bahamian Dollar',
  'BTC',
  'Bhutan Ngultrum',
  'Botswanan Pula',
  'BYN',
  'Belarussian Ruble',
  'Belize Dollar',
  'Canadian Dollar',
  'Congolais Franc',
  'Swiss Franc',
  'CLF',
  'Chilean Peso',
  'CNH',
  'Chinese Yuan Renminbi',
  'Colombian Peso',
  'Costa Rican Colon',
  'CUC',
  'Cuban Peso',
  'Cape Verdean Escudo',
  'Cyprus Pound',
  'Czech Koruna',
  'Djibouti Franc',
  'Danish Krone',
  'Dominican Peso',
  'Algerian Dinar',
  'Estonian Kroon',
  'Egyptian Pound',
  'Eritrean Nakfa',
  'Ethiopian Birr',
  'Euro',
  'Fijian Dollar',
  'Falkland Islands Pound',
  'British Pound Sterling',
  'Georgian Lari',
  'Guernseyan Pounds',
  'Ghanan Cedi',
  'Gibraltarian Pound',
  'Gambian Dalasi',
  'Guinean Franc',
  'Guatemalan Quetzal',
  'Guinea-Bissauian Peso',
  'Guyanan Dollar',
  'Hong Kong Dollar',
  'Hondurasian Lempira',
  'Croatian Kuna',
  'Haitian Gourde',
  'Hungarian Forint',
  'Indonesian Rupiah',
  'Israeli New Shekel',
  'Isle of Man Pounds',
  'Indian Rupee',
  'Iraqi Dinar',
  'Iranian Rial',
  'Icelandic Krona',
  'Jersey Pounds',
  'Jamaican Dollar',
  'Jordanian Dinar',
  'Japanese Yen',
  'Kenyan Shilling',
  'Kyrgyzstan Som',
  'Cambodian Riel',
  'Comoro Franc',
  'North Korean Won',
  'South Korean Won',
  'Kuwaiti Dinar',
  'Cayman Islands Dollar',
  'Kazakhstani Tenge',
  'Laos Kip',
  'Lebanese Pound',
  'Sri Lankan Rupee',
  'Liberian Dollar',
  'Lesotho Maloti',
  'Lithuanian Litas',
  'Latvian Lats',
  'Libyan Dinar',
  'Moroccan Dirham',
  'Moldovan Leu',
  'Malagasy Ariary',
  'Macedonian Denar',
  'Myanmar Kyat',
  'Mongolian Tugrik',
  'Macao Pataca',
  'Mauritania Ouguiya',
  'MRU',
  'Maltese Lira',
  'Mauritius Rupee',
  'Maldives Rufiyaa',
  'Malawi Kwacha',
  'Mexican Peso',
  'Malaysian Ringgit',
  'Mozambique Metical',
  'Namibian Dollar',
  'Nigerian Naira',
  'Nicaraguan Cordoba',
  'Norwegian Krone',
  'Nepalese Rupee',
  'New Zealand Dollar',
  'Omani Rials',
  'Panamanian Balboa',
  'Peruvian Nuevo Sol',
  'Papua New Guinean Kina',
  'Philippine Peso',
  'Pakistani Rupee',
  'Polish Zloty',
  'Paraguayan Guarani',
  'Qatari Rial',
  'Romanian New Leu',
  'Serbian Dinar',
  'Russian Ruble',
  'Rwandan Franc',
  'Saudi Arabian Riyal',
  'Solomon Islands Dollar',
  'Seychelles Rupee',
  'Sudanese Pound',
  'Swedish Krona',
  'Singaporean Dollar',
  'Saint Helena Pound',
  'Slovakian Koruna',
  'Sierra Leone Leones',
  'Somali Shilling',
  'Seborgan Luigini',
  'Surinam Dollar',
  'SSP',
  'Sao Tome Dobra',
  'STN',
  'El Salvadorian Colon',
  'Syrian Pound',
  'Swaziland Lilangeni',
  'Thai Baht',
  'Tajikistanian Somoni',
  'Turkmenistan New Manat',
  'Tunisian Dinar',
  "Tonga Pa'anga'",
  'Turkish New Lira',
  'Trinidad and Tobago Dollar',
  'Tuvalu Dollars',
  'Taiwanese New Dollar',
  'Tanzanian Shilling',
  'Ukrainian Hryvnia',
  'Ugandan Shilling',
  'US Dollar',
  'Uruguayan Peso',
  'Uzbekistanian Sum',
  'Venezuelan Bolivares',
  'Venezuelan Bolivar Fuerte',
  'VES',
  'Vietnamese Dong',
  'Vanuatu Vatu',
  'Samoan Tala',
  'CFA Franc BEAC',
  'XAG',
  'XAU',
  'Bit Coin',
  'East Caribbean Dollar',
  'XDR',
  'CFA Franc BCEAO',
  'XPD',
  'CFP Franc',
  'XPT',
  'Yemeni Rial',
  'South African Rand',
  'Zimbabwe Gold',
  'Zambian Kwacha',
  'Zimbabwean Dollar',
  'Zimbabwe Dollar',
];

const documentTypeOptions = [
  'All',
  'Sales invoice',
  'Purchase invoice',
  'Return invoice',
  'Inv. transfer invoice',
  'Reverse charge invoice',
  'Customs invoice',
];

const TransactionReports = ({ flag }: { flag?: string }) => {
  document.title = 'Transaction Reports';
  const dispatch = useDispatch();
  const [selectedReportName, setSelectedReportName] =
    useState('Sales tax top line');
  const [dateOption, setDateOption] = useState('previous_month');
  const [exportFormat, setExportFormat] = useState('preview');
  const [showModal, setShowModal] = useState(false);
  const [selectedReportInstantly, setSelectedReportInstantly] =
    useState('report_instantly');
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
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
      report_category: 'Sales tax document reports',
      report_name: 'Sales tax top line',
      reason: 'All',
      report_instantly: 'report_instantly',
      include_locked_transactions_only: false,
      compress_your_report_into_a_zip_file: false,
      date_option: 'previous_month',
      date_type: 'Document date',
      status: 'All',
      compress_zip_file: false,
      is_favorite: false,
      entity: '',
      entity_id: '',
      custom_date_from: '',
      custom_date_to: '',
      document_code_from: '',
      document_code_to: '',
      customer_id: '',
      document_code: 'All',
      sort_by: 'document_date',
      country: 'US',
      preview: true,
      pdf: false,
      xlsx: false,
    },
    validationSchema: Yup.object({
      report_category: Yup.string().required('Required'),
      report_name: Yup.string().required('Required'),
    }),
    onSubmit: async (values: any) => {
      try {
        // console.log('submmited values', values);
        setLoading(true);
        const response = await dispatch(onTransactionReports(values));

        // Always set showReport to true, regardless of data presence
        setShowReport(true);

        if (response.payload?.data) {
          const responseData = response.payload.data;
          //console.log('responseData', responseData);
          const transformedData = Array.isArray(responseData)
            ? transformReportData(responseData)
            : [];
          setReportData(transformedData);
          //console.log('Report data:', transformedData);
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
        setPrimaryEntity(defaultEntity);
        formik.setFieldValue('entity_id', defaultEntity.id);
        formik.setFieldValue('entity', defaultEntity.name); // Set entity name
      } else {
        setPrimaryEntity(entitiesList[0]);
        formik.setFieldValue('entity_id', entitiesList[0].id);
        formik.setFieldValue('entity', entitiesList[0].name); // Set entity name
      }
    } else {
      setPrimaryEntity(null);
      formik.setFieldValue('entity_id', '');
      formik.setFieldValue('entity', '');
    }
  }, [entitiesList]);

  const handleEntityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedEntityId = e.target.value;
    // Find the selected entity
    const selectedEntity = entitiesList.find(
      (entity: PrimaryEntity) =>
        entity.id.toString() === selectedEntityId.toString()
    );

    // Set both ID and name in formik values
    formik.setFieldValue('entity_id', selectedEntityId);
    formik.setFieldValue('entity', selectedEntity ? selectedEntity.name : '');

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

  // Get current report options based on selected category
  const getCurrentReportOptions = (): ReportOption[] => {
    return (
      reportOptions[
        formik.values.report_category as keyof typeof reportOptions
      ] || []
    );
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

  const handleSaveFavorite = (name: string) => {
    formik.setFieldValue('is_favorite', true);
    console.log(`Favorite saved as: ${name}`);
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

  const currencyOptions = currencies.map((currency) => ({
    value: currency,
    label: currency,
  }));

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
                pageTitle="Transaction Reports"
                title="Transaction Reports"
              />
            ) : null}
            {flag === 'hide' ? <Row className="mt-3"></Row> : null}
            <Row>
              <Col xl={12}>
                <Form onSubmit={formik.handleSubmit}>
                  <Row>{flag !== 'hide' ? <h1></h1> : null}</Row>
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
                        value={formik.values.report_category}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={
                          formik.touched.report_category &&
                          !!formik.errors.report_category
                        }
                      >
                        <option value="Sales tax document reports">
                          Sales tax document reports
                        </option>
                        <option value="Sales tax document data export">
                          Sales tax document data export
                        </option>
                        <option value="Consumer use tax document reports">
                          Consumer use tax document reports
                        </option>
                        <option value="Consumer use tax document data export">
                          Consumer use tax document data export
                        </option>
                        <option value="Reverse charge, VAT & all taxes data export">
                          Reverse charge, VAT & all taxes data export
                        </option>
                        <option value="Cross border reports">
                          Cross border reports
                        </option>
                        <option value="Economic nexus">Economic nexus</option>
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
                        {getCurrentReportOptions().map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Control>
                      {formik.touched.report_name &&
                      formik.errors.report_name ? (
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
                  <Row className="mt-3">
                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName ===
                        'Sales tax document line tax detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName ===
                        'Sales tax document summary by item code' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report') && (
                      // <Row className="mt-3">
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Date to be used</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            name="date_type"
                            value={formik.values.date_type}
                            onChange={formik.handleChange}
                          >
                            <option value="document date">Document Date</option>
                            <option value="tax date">Tax date</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                      // </Row>
                    )}

                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName ===
                        'Sales tax document summary by item code' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report') && (
                      // <Row className="mt-3">
                      <Col md={6}>
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
                      </Col>
                    )}
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
                          Depending on your ScalarTax Data Plan subscription,
                          you might not have access to transaction records from
                          before January 1st, 2020.
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
                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName ===
                        'Sales tax document line tax detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName ===
                        'Sales tax document summary by item code' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line tax detail' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report' ||
                      selectedReportName === 'Economic nexus summary' ||
                      selectedReportName ===
                        'Economic nexus state document line export') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Entity<span className="text-danger"> *</span></Form.Label>
                          <Form.Select
                            className="form-select"
                            name="entity_id"
                            value={formik.values.entity_id}
                            onChange={handleEntityChange}
                            disabled={
                              selectedReportName ===
                              'Sales tax document line tax detail'
                            }
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
                    )}
                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName ===
                        'Sales tax document summary by item code' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report') && (
                      <Col md="6">
                        <Form.Group>
                          <Form.Label>Country<span className="text-danger"> *</span></Form.Label>
                          <Form.Control
                            as="select"
                            name="country"
                            disabled
                            value={formik.values.country}
                            onChange={formik.handleChange}
                          >
                            <option value="country">
                              UNITED STATES OF AMERICA
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                  {/* Document Code Section */}
                  <Row className="mt-3">
                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Document code from</Form.Label>
                          <Form.Control
                            type="text"
                            name="document_code_from"
                            value={formik.values.document_code_from}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}

                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Document code to</Form.Label>
                          <Form.Control
                            type="text"
                            name="document_code_to"
                            value={formik.values.document_code_to}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Row className="mt-3">
                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName ===
                        'Sales tax document line tax detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName ===
                        'Sales tax document summary by item code' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export' ||
                      selectedReportName ===
                        'Duty and tax data export report' ||
                      selectedReportName ===
                        'Consumer use tax document line tax detail') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Document status<span className="text-danger"> *</span></Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            name="status"
                            value={formik.values.status}
                            onChange={formik.handleChange}
                          >
                            <option value="All">All</option>
                            <option value="Committed">Committed</option>
                            <option value="Uncommitted">Uncommitted</option>
                            <option value="Voided">Voided</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    )}

                    {(selectedReportName === 'Sales tax top line' ||
                      selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName === 'Consumer use tax top line' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail' ||
                      selectedReportName ===
                        'Sales tax document summary by item code' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export' ||
                      selectedReportName ===
                        'Basic Transaction Variance View' ||
                      selectedReportName ===
                        'Duty and tax data export report' ||
                      selectedReportName ===
                        'Economic nexus state document line export') && (
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
                              formik.touched.reason && !!formik.errors.reason
                            }
                          >
                            <option value="all">All</option>
                            {stateOptions.map((state) => (
                              <option key={state} value={state}>
                                {state}
                              </option>
                            ))}
                          </Form.Control>
                          {formik.touched.reason && formik.errors.reason ? (
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.reason}
                            </Form.Control.Feedback>
                          ) : null}
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  {(selectedReportName === 'Sales tax document export' ||
                    selectedReportName === 'Sales tax document line export' ||
                    selectedReportName ===
                      'Sales tax document line detail export' ||
                    selectedReportName ===
                      'Sales tax document export by item code' ||
                    selectedReportName ===
                      'Multi-tax Line Item Detail Export') && (
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

                  {/* Customer ID and Sort By */}
                  <Row className="mt-3">
                    {(selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Customer ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="customer_id"
                            value={formik.values.customer_id}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}

                    {(selectedReportName === 'Sales tax document summary' ||
                      selectedReportName ===
                        'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address' ||
                      selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName === 'Retail delivery fee report' ||
                      selectedReportName ===
                        'Consumer use tax document summary' ||
                      selectedReportName ===
                        'Consumer use tax document line detail') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Sort by</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            name="sort_by"
                            value={formik.values.sort_by}
                            onChange={formik.handleChange}
                          >
                            <option value="document_code">Document Code</option>
                            <option value="document_date">Document Date</option>
                            <option value="company">Company</option>
                            <option value="customer_vender_code">
                              Customer Vendor Code
                            </option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Row className="mt-3">
                    {(selectedReportName ===
                      'Sales tax document line tax detail' ||
                      selectedReportName ===
                        'Consumer use tax document line tax detail') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Document code</Form.Label>
                          <Form.Control
                            type="text"
                            name="document_code"
                            value={formik.values.document_code}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}

                    {(selectedReportName ===
                      'Sales tax document summary listing by jurisdiction' ||
                      selectedReportName ===
                        'Sales tax document summary listing by address') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Report level</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            name="report_level"
                            value={formik.values.report_level}
                            onChange={formik.handleChange}
                          >
                            <option value="by_state">By State</option>
                            <option value="state_by_county">
                              State By County
                            </option>
                            <option value="state_by_city">State By City</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    )}
                  </Row>

                  <Row className="mt-3">
                    {(selectedReportName === 'Sales tax document line detail' ||
                      selectedReportName ===
                        'Consumer use tax document line detail') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Jurisdiction type</Form.Label>
                          <Form.Control
                            as="select"
                            className="form-select"
                            name="jurisdiction_type"
                            value={formik.values.jurisdiction_type}
                            onChange={formik.handleChange}
                          >
                            <option value="state">State</option>
                            <option value="county">County</option>
                            <option value="city">City</option>
                          </Form.Control>
                        </Form.Group>
                      </Col>
                    )}

                    {selectedReportName ===
                      'Sales tax document line detail' && (
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
                  </Row>
                  <Row>
                    {(selectedReportName === 'Sales tax document export' ||
                      selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'Sales tax document line detail export' ||
                      selectedReportName ===
                        'Sales tax document export by item code' ||
                      selectedReportName ===
                        'Multi-tax Line Item Detail Export' ||
                      selectedReportName ===
                        'Consumer use tax document export' ||
                      selectedReportName ===
                        'Consumer use tax document line export' ||
                      selectedReportName ===
                        'Consumer use tax document line detail export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable doc export' ||
                      selectedReportName ===
                        'Consumer use tax accounts payable line detail export' ||
                      selectedReportName === 'Reverse charge document export' ||
                      selectedReportName ===
                        'Reverse charge document line export' ||
                      selectedReportName ===
                        'Reverse charge document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export' ||
                      selectedReportName ===
                        'All taxes document line detail export including attributes' ||
                      selectedReportName ===
                        'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName ===
                        'Duty and tax data export report') && (
                      <Col md={6}>
                        <Form.Label htmlFor="currency">Currency</Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          id="currency"
                          name="currency"
                          value={formik.values.currency}
                          onChange={(e) => {
                            formik.handleChange(e);
                          }}
                          onBlur={formik.handleBlur}
                        >
                          {currencyOptions.map(
                            (option: { value: string; label: string }) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            )
                          )}
                        </Form.Control>
                      </Col>
                    )}
                    {selectedReportName ===
                      'Sales tax document export by item code' && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Item Code</Form.Label>
                          <Form.Control
                            type="text"
                            name="item_code"
                            value={formik.values.item_code}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}
                    {(selectedReportName === 'Sales tax document line export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export') && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Merchant Seller Identifier</Form.Label>
                          <Form.Control
                            type="text"
                            name="merchant_seller_identifier"
                            value={formik.values.merchant_seller_identifier}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}
                  </Row>
                  <Row>
                    {selectedReportName === 'VAT transaction export' && (
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
                    {selectedReportName === 'VAT transaction export' && (
                      <Col md={6}>
                        <Form.Group>
                          <Form.Label>Tax ID</Form.Label>
                          <Form.Control
                            type="text"
                            name="taxt_id"
                            value={formik.values.taxt_id}
                            onChange={formik.handleChange}
                          />
                        </Form.Group>
                      </Col>
                    )}
                    {(selectedReportName ===
                      'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export') && (
                      <Col md={6}>
                        <Form.Label htmlFor="document_type">
                          Document type
                        </Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          id="document_type"
                          name="document_type"
                          value={formik.values.document_type}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.document_type &&
                            !!formik.errors.document_type
                          }
                        >
                          {documentTypeOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </Form.Control>
                        {formik.touched.document_type &&
                        formik.errors.document_type ? (
                          <div className="text-danger">
                            {formik.errors.document_type}
                          </div>
                        ) : null}
                      </Col>
                    )}
                    {(selectedReportName ===
                      'VAT document line detail export' ||
                      selectedReportName ===
                        'VAT marketplace transaction export' ||
                      selectedReportName ===
                        'VAT document line detail export including attributes' ||
                      selectedReportName === 'VAT transaction export') && (
                      <Col md={6}>
                        <Form.Label htmlFor="deemed_supplier_flag">
                          Deemed Supplier Flag
                        </Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          id="deemed_supplier_flag"
                          name="deemed_supplier_flag"
                          value={formik.values.deemed_supplier_flag}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.deemed_supplier_flag &&
                            !!formik.errors.deemed_supplier_flag
                          }
                        >
                          <option value="All">All</option>
                          <option value="Marketplace">Marketplace</option>
                        </Form.Control>
                        {formik.touched.deemed_supplier_flag &&
                        formik.errors.deemed_supplier_flag ? (
                          <div className="text-danger">
                            {formik.errors.deemed_supplier_flag}
                          </div>
                        ) : null}
                      </Col>
                    )}
                    {selectedReportName ===
                      'Basic Transaction Variance View' && (
                      <Col md={6}>
                        <Form.Label htmlFor="ior">ior</Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          id="ior"
                          name="ior"
                          value={formik.values.ior}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.ior && !!formik.errors.ior}
                        >
                          <option value="Partial">Partial</option>
                          <option value="Partial">Partial</option>
                        </Form.Control>
                        {formik.touched.ior && formik.errors.ior ? (
                          <div className="text-danger">{formik.errors.ior}</div>
                        ) : null}
                      </Col>
                    )}
                    {selectedReportName ===
                      'Basic Transaction Variance View' && (
                      <Col md={6}>
                        <Form.Label htmlFor="status">status</Form.Label>
                        <Form.Control
                          as="select"
                          className="form-select"
                          id="status"
                          name="status"
                          value={formik.values.status}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={
                            formik.touched.status && !!formik.errors.status
                          }
                        >
                          <option value="All">All</option>
                          <option value="Marketplace">Marketplace</option>
                        </Form.Control>
                        {formik.touched.status && formik.errors.status ? (
                          <div className="text-danger">
                            {formik.errors.status}
                          </div>
                        ) : null}
                      </Col>
                    )}
                  </Row>

                  {(selectedReportName === 'Sales tax top line' ||
                    selectedReportName === 'Sales tax document summary' ||
                    selectedReportName ===
                      'Sales tax document summary listing by jurisdiction' ||
                    selectedReportName === 'Sales tax document line detail' ||
                    selectedReportName === 'Retail delivery fee report' ||
                    selectedReportName ===
                      'Sales tax document summary by item code' ||
                    selectedReportName === 'Sales tax document export' ||
                    selectedReportName === 'Sales tax document line export' ||
                    selectedReportName ===
                      'Sales tax document line detail export' ||
                    selectedReportName ===
                      'Sales tax document export by item code' ||
                    selectedReportName ===
                      'Multi-tax Line Item Detail Export' ||
                    selectedReportName === 'Consumer use tax document export' ||
                    selectedReportName ===
                      'Consumer use tax document line export' ||
                    selectedReportName ===
                      'Consumer use tax document line detail export' ||
                    selectedReportName ===
                      'Consumer use tax accounts payable doc export' ||
                    selectedReportName ===
                      'Consumer use tax accounts payable line detail export' ||
                    selectedReportName === 'Reverse charge document export' ||
                    selectedReportName ===
                      'Reverse charge document line export' ||
                    selectedReportName ===
                      'Reverse charge document line detail export' ||
                    selectedReportName ===
                      'All taxes document line detail export' ||
                    selectedReportName ===
                      'All taxes document line detail export including attributes' ||
                    selectedReportName === 'VAT document line detail export' ||
                    selectedReportName ===
                      'VAT marketplace transaction export' ||
                    selectedReportName ===
                      'VAT document line detail export including attributes' ||
                    selectedReportName === 'VAT transaction export' ||
                    selectedReportName === 'Basic Transaction Variance View' ||
                    selectedReportName === 'Duty and tax data export report' ||
                    selectedReportName ===
                      'Economic nexus state document line export') && (
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
                              transactions. It may take 5 to 10 minutes to
                              create the report and we will send you an email
                              and a notification on the homepage.
                            </p>
                          )}
                        </Col>
                      </Row>
                    </>
                  )}

                  {(selectedReportName === 'Sales tax top line' ||
                    selectedReportName === 'Sales tax document summary' ||
                    selectedReportName ===
                      'Sales tax document summary listing by jurisdiction' ||
                    selectedReportName ===
                      'Sales tax document summary listing by address' ||
                    selectedReportName === 'Sales tax document line detail' ||
                    selectedReportName ===
                      'Sales tax document line tax detail' ||
                    selectedReportName === 'Retail delivery fee report' ||
                    selectedReportName ===
                      'Sales tax document summary by item code' ||
                    selectedReportName === 'Consumer use tax top line' ||
                    selectedReportName ===
                      'Consumer use tax document summary' ||
                    selectedReportName ===
                      'Consumer use tax document line tax detail' ||
                    selectedReportName ===
                      'Consumer use tax document line detail' ||
                    selectedReportName === 'Economic nexus summary') && (
                    <>
                      <Row className="mt-3">
                        <h2>Report preview and export</h2>
                        <p>
                          You can download or choose to preview before
                          downloading your report
                        </p>

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

                  {(selectedReportName === 'Sales tax document export' ||
                    selectedReportName === 'Sales tax document line export' ||
                    selectedReportName ===
                      'Sales tax document line detail export' ||
                    selectedReportName ===
                      'Sales tax document export by item code' ||
                    selectedReportName ===
                      'Multi-tax Line Item Detail Export' ||
                    selectedReportName === 'Consumer use tax document export' ||
                    selectedReportName ===
                      'Consumer use tax document line export' ||
                    selectedReportName ===
                      'Consumer use tax document line detail export' ||
                    selectedReportName ===
                      'Consumer use tax accounts payable doc export' ||
                    selectedReportName ===
                      'Consumer use tax accounts payable line detail export' ||
                    selectedReportName === 'Reverse charge document export' ||
                    selectedReportName ===
                      'Reverse charge document line export' ||
                    selectedReportName ===
                      'Reverse charge document line detail export' ||
                    selectedReportName ===
                      'All taxes document line detail export' ||
                    selectedReportName ===
                      'All taxes document line detail export including attributes' ||
                    selectedReportName === 'VAT document line detail export' ||
                    selectedReportName ===
                      'VAT marketplace transaction export' ||
                    selectedReportName ===
                      'VAT document line detail export including attributes' ||
                    selectedReportName === 'VAT transaction export' ||
                    selectedReportName === 'Basic Transaction Variance View' ||
                    selectedReportName === 'Duty and tax data export report' ||
                    selectedReportName ===
                      'Economic nexus state document line export') && (
                    <Row>
                      <h2>Export format</h2>
                      <p>
                        Export the report data into a comma-delimited (.csv)
                        file
                      </p>
                      <Col md="6">
                        <Form.Check
                          type="checkbox"
                          name="compress_your_report_into_a_zip_file"
                          id="compress_your_report_into_a_zip_file"
                          label="Compress your report into a zip file"
                          checked={
                            formik.values.compress_your_report_into_a_zip_file
                          }
                          onChange={formik.handleChange}
                        />
                      </Col>
                    </Row>
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
          <SalesTransactionReport
            reportData={reportData}
            loading={loading}
            onBackClick={() => setShowReport(false)}
            currentPage={currentPage}
            totalPages={metadata?.totalPages || 1}
            onPageChange={onPageChange}
            reportName={formik.values.report_name}
            reason={formik.values.reason}
            entity={formik.values.entity}
            date_type={formik.values.date_type}
            status={formik.values.status}
            document_code={formik.values.document_code}
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
        defaultName="Transaction Report"
        reportData={formik.values}
      />
    </React.Fragment>
  );
};

export default TransactionReports;
