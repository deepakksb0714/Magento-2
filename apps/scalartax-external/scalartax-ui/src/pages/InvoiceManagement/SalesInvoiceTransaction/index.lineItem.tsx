import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Table,
  Alert,
} from 'react-bootstrap';
import { FiPlus } from 'react-icons/fi';
import { LuChevronDownCircle } from 'react-icons/lu';
import { useCustomerDetails } from '../../../Common/useTaxDetails';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { calculateTax as onCalculateTax } from '../../../slices/thunk';
import { Attribute, LineItem, Data } from './types';
import { IconText, GetAddressTemplate, Address } from './AddressValidation';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LabelList, Cell } from "recharts";
import { Spinner } from "react-bootstrap";


interface DataProps {
  data: Data | null;
  onCancel: () => void;
  editData?: any;
  onDataChange?: (items: any[]) => void;
}

// Define validation schema
const validationSchema = Yup.object({
  line_amount: Yup.number().required('Amount is required').min(0),
});

const LineIndex = ({ data, onCancel, editData, onDataChange }: DataProps) => {
  const dispatch = useDispatch();
  const { customersWithCertificates } = useCustomerDetails();
  // State management
  const [lineItems, setLineItems] = useState<LineItem[]>(data?.lineItems || []);
  const [showForm, setShowForm] = useState(false);
  const [showAttributesForm, setShowAttributesForm] = useState(false);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [showLineItemForm, setShowLineItemForm] = useState(false);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [responseData, setResponseData] = useState<any>();
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');
  const [error, setError] = useState<String>();
  const [originAddressType, setOriginAddressType] = useState<
    'DEFAULT' | 'OTHER' | 'ADDED'
  >('DEFAULT');
  const [destinationAddressType, setDestinationAddressType] = useState<
    'DEFAULT' | 'OTHER' | 'ADDED'
  >('OTHER');

  const [isCalculating, setIsCalculating] = useState(false);
  const [selectedAddresses, setSelectedAddresses] = React.useState<Address[]>([
    {
      id: '1',
      sub: 'Place of order acceptance',
      lab: 'Add a place of order acceptance address',
      view: false,
    },
    {
      id: '2',
      sub: 'Place of order origin',
      lab: 'Add a place of order origin address',
      view: false,
    },
    {
      id: '3',
      sub: 'Import location',
      lab: 'Add an import location address',
      view: false,
    },
    {
      id: '4',
      sub: 'Location of goods & services rendered',
      lab: 'Add a location of goods & services rendered address',
      view: false,
    },
  ]);

  const defaultAddress = {
    address: '5678 ',
    address2: '',
    address3: '',
    city: 'Long Beach',
    region: 'CA',
    country: 'USA',
    postal_code: '90802',
  };

  // Initialize Formik - with updated structure to match the form
  const formik = useFormik({
    initialValues: {
      line_number: 0,
      item_code: '',
      description: '',
      quantity: '',
      line_amount: '',
      tax_code: '',
      traffic_code: '',
      discount_added: true,
      rev_account: '',
      ref1: '',
      ref2: '',
      entity_use_code: '',
      exempt_no: '',
      customer_vat_number: '',
      tax_handling: 'no_special_tax_handling',
      lineAddress: false,
      tax_override_type: '',
      tax_override_amount: '',
      date: '',
      override_reason: '',
      address: {
        'Ship From': {
          address: '5678 ',
          city: 'Long Beach',
          region: 'CA',
          country: 'USA',
          postal_code: '90802',
        },
        'Ship To': {
          address: '5678 ',
          city: 'Long Beach',
          region: 'CA',
          country: 'USA',
          postal_code: '90802',
        },
      },
    },
    validationSchema,
    onSubmit: async (values: any) => {
      const isEditing = !!editingItem;
      // Prepare address data
      const addressData = {
        'Ship To': values.address['Ship To'],
        'Ship From': values.address['Ship From'],
        defaultAddress: values.address?.defaultAddress || {},
      };
      try {
        // Create line item structure
        const newLineItem: LineItem = {
          id: editingItem ? editingItem.id : new Date().getTime().toString(),
          // Basic item details
          line_number: isEditing ? editingItem.line_number : (lineItems?.length || 0) + 1,
          item_code: values.item_code,
          description: values.description,
          line_amount: parseFloat(values.line_amount),
          quantity: parseInt(values.quantity, 10),

          // Tax information
          tax_code: values.tax_code,
          traffic_code: values.traffic_code,

          // Tax handling
          tax_included: values.tax_handling === 'tax_included' ? 'true' : 'false',
          tax_handling: values.tax_handling,

          // Tax override data
          tax_override_type: values.tax_handling === 'override' ? values.tax_override_type : '',
          tax_override_amount: values.tax_handling === 'override' && values.tax_override_type === 'tax_amount'
            ? values.tax_override_amount : '',
          tax_date: values.date || '',
          tax_override_reason: values.override_reason || '',

          // Additional details
          discount_added: values.discount_added || false,


          address: values.lineAddress ? addressData : undefined,
          attributes: attributes,

          // Financial & customer details
          rev_account: values.rev_account || '',
          ref1: values.ref1 || '',
          ref2: values.ref2 || '',
          entity_use_code: values.entity_use_code || '',
          exempt_no: values.exempt_no || '',
          customer_vat_number: values.customer_vat_number || '',
          lineAddress: values.lineAddress || false,
        };

        // Required field validation
        if (!newLineItem.line_amount) {
          setError('Required Data Is Missing');
          return;
        }



        let updatedItems: LineItem[];

        if (editingItem !== null && editingIndex !== null) {
          // Update existing item
          updatedItems = [...lineItems];
          updatedItems[editingIndex] = newLineItem;
        } else {
          // Add new item
          updatedItems = [...lineItems, newLineItem];
        }

        // Update lineItems state
        setLineItems(updatedItems);

        // Update data.lineItems if data exists
        if (data) {
          data.lineItems = updatedItems;
        }

        // Reset form and state
        formik.resetForm();
        setAttributes([]);
        setShowForm(false);
        setShowAttributesForm(false);
        setShowLineItemForm(false);
        setEditingItem(null);
        setEditingIndex(null);

        // Notify parent component of data change
        if (onDataChange) {
          onDataChange(updatedItems);
        }
      } catch (error) {
        setAlertMessage('Error saving line item');
        setAlertVariant('danger');
        setShowAlert(true);
      }
    },
  });

  // Load initial data
  useEffect(() => {
    if (data && data.lineItems) {
      setLineItems(data.lineItems);
    }
  }, [data]);


  const handleDeleteLineItem = (lineNoToDelete: number) => {
    const updatedLineItems = lineItems.filter(
      (lineItem) => lineItem.line_number !== lineNoToDelete
    );
    setLineItems(updatedLineItems);
    if (data) {
      data.lineItems = updatedLineItems;
    }

    // Notify parent component of data change
    if (onDataChange) {
      onDataChange(updatedLineItems);
    }
  };

  const handleEditLineItem = (line_number: number) => {
    if (data && data.lineItems) {
      const dataIndex = data.lineItems.findIndex(
        (lineItem) => lineItem.line_number === line_number
      );

      if (dataIndex !== -1) {
        const selectedItem = data.lineItems[dataIndex];
        setEditingIndex(dataIndex);
        setEditingItem(selectedItem);
        setShowLineItemForm(true);

        if (selectedItem) {
          // Handle address settings if present
          if (selectedItem.address) {
            setOriginAddressType('ADDED');
            setDestinationAddressType('ADDED');
            formik.setFieldValue('lineAddress', true);
          }

          // Set item details values directly
          formik.setFieldValue('item_code', selectedItem.item_code || '');
          formik.setFieldValue('description', selectedItem.description || '');
          formik.setFieldValue('quantity', selectedItem.quantity?.toString() || '');
          formik.setFieldValue('line_amount', selectedItem.line_amount?.toString() || '');
          formik.setFieldValue('tax_code', selectedItem.tax_code || '');
          formik.setFieldValue('traffic_code', selectedItem.traffic_code || '');

          // Set other form sections
          formik.setFieldValue('discount_added', selectedItem.discount_added ?? true);
          formik.setFieldValue('rev_account', selectedItem.rev_account || '');
          formik.setFieldValue('ref1', selectedItem.ref1 || '');
          formik.setFieldValue('ref2', selectedItem.ref2 || '');
          formik.setFieldValue('entity_use_code', selectedItem.entity_use_code || '');
          formik.setFieldValue('exempt_no', selectedItem.exempt_no || '');
          formik.setFieldValue('customer_vat_number', selectedItem.customer_vat_number || '');
          formik.setFieldValue('tax_handling', selectedItem.tax_handling || 'no_special_tax_handling');

          // Set tax override details if present
          if (selectedItem.tax_override_type) {
            formik.setFieldValue('tax_override_type', selectedItem.tax_override_type);
            formik.setFieldValue('tax_override_amount', selectedItem.tax_override_amount);
            formik.setFieldValue('date', selectedItem.tax_date);
            formik.setFieldValue('override_reason', selectedItem.tax_override_reason);
          }

          // Set address values if present
          if (selectedItem.address) {
            // Ship From address
            if (selectedItem.address['Ship From']) {
              const shipFrom = selectedItem.address['Ship From'];
              formik.setFieldValue('address.Ship From', {
                address: shipFrom.address || shipFrom.address_line1 || '',
                address2: shipFrom.address2 || shipFrom.address_line2 || '',
                address3: shipFrom.address3 || shipFrom.address_line3 || '',
                city: shipFrom.city || '',
                region: shipFrom.region || shipFrom.state || '',
                country: shipFrom.country || '',
                postal_code: shipFrom.postal_code || '',
              });
            }

            // Ship To address
            if (selectedItem.address['Ship To']) {
              const shipTo = selectedItem.address['Ship To'];
              formik.setFieldValue('address.Ship To', {
                address: shipTo.address || shipTo.address_line1 || '',
                address2: shipTo.address2 || shipTo.address_line2 || '',
                address3: shipTo.address3 || shipTo.address_line3 || '',
                city: shipTo.city || '',
                region: shipTo.region || shipTo.state || '',
                country: shipTo.country || '',
                postal_code: shipTo.postal_code || '',
              });
            }
          }

          // Set attributes if present
          if (selectedItem.attributes && selectedItem.attributes.length > 0) {
            setAttributes(selectedItem.attributes);
          } else {
            setAttributes([]);
          }
        }
      }
    }
  };

  const toggleBreakdown = (lineNo: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [lineNo]: !prev[lineNo],
    }));
  };

  const handleAddNew = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setAttributes([]);
    setShowLineItemForm(true);

    // Reset form to initial values
    formik.resetForm();
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setAttributes([]);
    setShowForm(false);
    setShowAttributesForm(false);
    setShowLineItemForm(false);
    formik.resetForm();
  };

  const handleCancelLineItems = () => {
    onCancel();
  };

  const handleCalculate = async () => {
    if (!data || !data.lineItems || data.lineItems.length === 0) {
      setAlertMessage('Please add at least one line item before calculating tax');
      setAlertVariant('warning');
      setShowAlert(true);
      return;
    }
    setIsCalculating(true);
    try {
      const response = await dispatch(onCalculateTax(data));
      if (response.error) {
        setAlertMessage(response.payload);
        setAlertVariant('danger');
        setShowAlert(true);
        throw new Error(response.payload);
      }
      setResponseData(response.payload);
      setAlertMessage('Tax calculated successfully!');
      setAlertVariant('success');
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setAlertMessage(errorMessage);
      setAlertVariant('danger');
      setShowAlert(true);
      return;
    }
    setIsCalculating(false);
    setShowAlert(true);
  };

  const toggleForm = () => setShowForm(!showForm);
  const toggleAttributesForm = () => setShowAttributesForm(!showAttributesForm);

  const addAttributeForm = () => {
    setAttributes([
      ...attributes,
      { attribute: '', value: '', unit_of_measure: '' },
    ]);
  };

  const deleteAttributeForm = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const cancelAllAttributes = () => {
    setAttributes([]);
  };

  const handleOriginAddressChange = (newAddress: any) => {
    formik.setFieldValue('address[Ship From]', newAddress)
  };

  const handleDestinationAddressChange = (newAddress: any) => {
    formik.setFieldValue('address[Ship To]', newAddress)
  };

  return (
    <Container fluid>
      <Row>
        {/* Invoice Detail Column */}
        <Col md={4}>
          <h4 className="mb-3">Invoice Detail</h4>

          {data?.code && (
            <p className="mb-1 ps-0">
              <strong>Document Code:</strong> {data.code}
            </p>
          )}
          {data?.date && (
            <p className="mb-1 ps-0">
              <strong>Document Date:</strong> {data.date}
            </p>
          )}
          {data?.date && (
            <p className="mb-1 ps-0">
              <strong>Tax Date:</strong> {data.date}
            </p>
          )}
          {data?.description && (
            <p className="mb-1 ps-0">
              <strong>Description:</strong> {data.description}
            </p>
          )}
        </Col>

        {/* Additional Info Column */}
        <Col md={4}>
          <h4 className="mb-3">Additional Info</h4>
          {data?.exempt_no && (
            <p className="mb-1 ps-0">
              <strong>Exemption Applied:</strong>{' '}
              {data.exempt_no ? 'Yes' : 'NO'}
            </p>
          )}
          {data?.reference_code && (
            <p className="mb-1 ps-0">
              <strong>Reference Code:</strong> {data.reference_code}
            </p>
          )}
          {data?.sales_person_code && (
            <p className="mb-1 ps-0">
              <strong>Sales Person Code:</strong> {data.sales_person_code}
            </p>
          )}
          {data?.total_discount && (
            <p className="mb-1 ps-0">
              <strong>Total Discount:</strong> {data.total_discount}
            </p>
          )}
        </Col>

        {/* Customer Info Column */}
        <Col md={4}>
          <h4 className="mb-3">Customer Info</h4>
          {data?.entity_use_code && (
            <p className="mb-1 ps-0">
              <strong>Entity Use Code:</strong> {data.entity_use_code}
            </p>
          )}

          {data?.customer_code && (
            (() => {
              const matchedCustomer = customersWithCertificates?.find(
                customer => customer.id === data.customer_code
              );
              return matchedCustomer ? (
                <p className="mb-1 ps-0">
                  <strong>Customer Code:</strong> {matchedCustomer.customer_code}
                </p>
              ) : null;
            })()
          )}
          {data?.customer_code && (
            <p className="mb-1 ps-0">
              <strong>Certificate Applied:</strong> {data.certificate_id ? 'Yes' : 'No'}
            </p>
          )}

          {data?.customer_vat_number && (
            <p className="mb-1 ps-0">
              <strong>Customer VAT No:</strong> {data.customer_vat_number}
            </p>
          )}
          {data?.vendor_code && (
            <p className="mb-1 ps-0">
              <strong>Vendor Code:</strong> {data.vendor_code}
            </p>
          )}
        </Col>
      </Row>
      <hr />
      {/* Address Section */}
      <Row>
        {/* Ship From Address */}
        {data?.address?.['Ship To'] && (
          <Col md={6}>
            <h5 className="mb-3">Ship From</h5>
            <p className="mb-1 ps-0">
              {[
                // Include additional addresses, ensuring only strings are used
                ...(data.address?.['Ship From'].additionalAddresses?.map(addr => addr.addr).filter(Boolean) || []),

                // Include main address fields excluding additionalAddresses, city, and country
                ...Object.entries(data.address?.['Ship From'])
                  .filter(([key, value]) =>
                    key !== 'additionalAddresses' &&
                    key !== 'city' &&
                    key !== 'country' &&
                    typeof value === 'string' // Ensure only string values are included
                  )
                  .map(([_, value]) => value),

                // Include city and country at the end
                data.address?.['Ship From'].city,
                data.address?.['Ship From'].country
              ]
                .filter(Boolean) // Remove empty values
                .join(', ')}
            </p>

          </Col>
        )}

        {/* Ship To Address */}
        {data?.address?.['Ship From'] && (
          <Col md={6}>
            <h5 className="mb-3">Ship To</h5>
            <p className="mb-1 ps-0">
              {[
                // Include additional addresses, filtering out non-string values
                ...(data.address?.['Ship To'].additionalAddresses
                  ?.map(addr => (typeof addr.addr === 'string' ? addr.addr : null)) || []),
                // Include main address fields excluding additionalAddresses, city, and country
                ...Object.entries(data.address?.['Ship To'])
                  .filter(([key, value]) =>
                    key !== 'additionalAddresses' &&
                    key !== 'city' &&
                    key !== 'country' &&
                    typeof value === 'string' &&
                    value
                  )
                  .map(([_, value]) => value),
                // Include city and country at the end
                typeof data.address?.['Ship To'].city === 'string' ? data.address?.['Ship To'].city : null,
                typeof data.address?.['Ship To'].country === 'string' ? data.address?.['Ship To'].country : null
              ]
                .filter(Boolean) // Remove empty values
                .join(', ')}
            </p>
          </Col>
        )}
      </Row>

      {/* <Card.Body> */}
      <Card>
        <Card.Header>
          <Row className="align-items-center">
            {/* Left Button Column */}
            <Col lg={3}>
              <Button
                variant="success"
                className="btn btn-light"
                size="sm"
                onClick={handleAddNew}
              >
                Add New Item
              </Button>
            </Col>

            {/* Center Column for Alert */}
            <Col lg={6} className="d-flex justify-content-center alert">
              {showAlert && (
                <Alert
                  variant={alertVariant}
                  onClose={() => setShowAlert(false)}
                  dismissible
                >
                  {alertMessage}
                </Alert>
              )}
            </Col>

            {/* Right Button Column */}
            <Col lg={3} className="d-flex justify-content-end ms-8">
              {(data?.lineItems?.length ?? 0) > 0 && (
                <Button
                  variant="success"
                  className="btn btn-light"
                  size="sm"
                  onClick={handleCalculate}
                >
                  Calculate
                </Button>
              )}
            </Col>
          </Row>
        </Card.Header>
        {
          (data?.lineItems?.length ?? 0) > 0 && (
            <Card.Body>
              <Table responsive>
                <thead>
                  <tr>
                    <th>Line No</th>
                    <th>Item Code</th>
                    <th>Description</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                    <th>Discount</th>
                    <th>Not Taxed</th>
                    <th>Taxable</th>
                    <th>Taxes/Fees</th>
                    <th>Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    isCalculating ? (
                      <tr>
                        <td colSpan={11}>
                          <div className="d-flex justify-content-center align-items-center w-100" style={{ height: "100px" }}>
                            <Spinner animation="border" variant="primary" />
                          </div>
                        </td>
                      </tr>
                    ) :
                      (data?.lineItems?.map((item, index) => {
                        const taxData = responseData?.overall_tax_breakdown?.find(
                          (breakdownItem: any) => breakdownItem.line_number === item.line_number
                        );

                        return (
                          <React.Fragment key={index}>
                            <tr>
                              <td>{item.line_number}</td>
                              <td>{item.item_code || "-"}</td>
                              <td>{item.description || "-"}</td>
                              <td>{item.quantity || "-"}</td>
                              <td>{taxData ? taxData.line_amount : item.line_amount}</td>
                              <td>{taxData ? taxData.item_discount : "-"}</td>
                              <td>{taxData?.tax_breakdown[0]?.exempt_amount || "-"}</td>
                              <td>{taxData?.tax_breakdown[0]?.taxable_amount || "-"}</td>
                              <td>{taxData ? taxData.item_total_tax_amount : "-"}</td>
                              <td>{taxData ? taxData.item_total_amount_after_tax : "-"}</td>
                              <td>
                                <Button
                                  variant="warning"
                                  size="sm"
                                  className="list-inline-item edit btn btn-soft-info btn-sm d-inline-block"
                                  onClick={() => handleEditLineItem(item.line_number)}
                                >
                                  <i className="las la-pen fs-17 align-middle"></i>
                                </Button>
                                {' '}
                                <Button
                                  className="btn btn-soft-danger btn-sm d-inline-block"
                                  onClick={() => handleDeleteLineItem(item.line_number)}
                                >
                                  <i className="bi bi-trash fs-17 align-middle"></i>
                                </Button>
                                {' '}
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => toggleBreakdown(item.line_number)}
                                >
                                  {expandedItems[item.line_number] ? (
                                    <i className="bi bi-chevron-up"></i>
                                  ) : (
                                    <i className="bi bi-chevron-down"></i>
                                  )}
                                </Button>
                              </td>
                            </tr>

                            {/* Expanded Row for Tax Breakdown */}


                            {expandedItems[item.line_number] && taxData && (
                              <tr>
                                <td colSpan={11}>
                                  <div className="tax-breakdown p-3">
                                    <h6 className="mb-2">Tax Breakdown</h6>
                                    <Card>
                                      {taxData.tax_breakdown.map((tax: any, taxIndex: any) => {
                                        const totalTaxRate =
                                          (parseFloat(tax.state_rate) || 0) +
                                          (parseFloat(tax.estimated_county_rate) || 0) +
                                          (parseFloat(tax.estimated_city_rate) || 0) +
                                          (parseFloat(tax.estimated_special_rate) || 0);

                                        const totalTaxAmount = parseFloat(tax.tax_amount) || 1; // Avoid division by zero

                                        const stateTaxAmount = (parseFloat(tax.state_rate) / totalTaxRate) * totalTaxAmount || 0;
                                        const countyTaxAmount = (parseFloat(tax.estimated_county_rate) / totalTaxRate) * totalTaxAmount || 0;
                                        const cityTaxAmount = (parseFloat(tax.estimated_city_rate) / totalTaxRate) * totalTaxAmount || 0;
                                        const specialTaxAmount = (parseFloat(tax.estimated_special_rate) / totalTaxRate) * totalTaxAmount || 0;

                                        const taxDataChart = [
                                          { name: "State Tax", value: stateTaxAmount, percent: (stateTaxAmount / totalTaxAmount) * 100, taxRate: tax.state_rate },
                                          { name: "County Tax", value: countyTaxAmount, percent: (countyTaxAmount / totalTaxAmount) * 100, taxRate: tax.estimated_county_rate },
                                          { name: "City Tax", value: cityTaxAmount, percent: (cityTaxAmount / totalTaxAmount) * 100, taxRate: tax.estimated_city_rate },
                                          { name: "Special Tax", value: specialTaxAmount, percent: (specialTaxAmount / totalTaxAmount) * 100, taxRate: tax.estimated_special_rate },
                                        ];

                                        return (
                                          <div key={taxIndex}>
                                            <Row>
                                              <Col>
                                                <p>Jurisdiction: {tax.jurisdiction || "-"}</p>
                                                <p>Region: {tax.tax_state || "-"}</p>
                                              </Col>
                                              <Col>
                                                <p>Taxable Amount: {tax.taxable_amount}</p>
                                                <p>Exempt Amount: {tax.exempt_amount}</p>
                                              </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                              <Col>
                                                <h6>Tax Amount Breakdown</h6>
                                                <ResponsiveContainer width="100%" height={250}>
                                                  <BarChart
                                                    layout="vertical"
                                                    data={taxDataChart}
                                                    margin={{ left: 50 }}
                                                  >
                                                    <XAxis type="number" domain={[0, totalTaxAmount]} tickFormatter={(tick) => `$${tick.toFixed(2)}`} />
                                                    <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 12 }} />
                                                    <Tooltip
                                                      formatter={(value: any, name: any, entry: any) => [

                                                        `${entry?.payload?.taxRate || 0}%`,
                                                      ]}
                                                      labelFormatter={(label) => `${label}`}
                                                    />
                                                    <Bar dataKey="value" fill="#4CAF50" barSize={20}>
                                                      {taxDataChart.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={["#4CAF50", "#4CAF50", "#4CAF50", "#4CAF50"][index]} />
                                                      ))}
                                                      <LabelList
                                                        dataKey="value"
                                                        position="right"
                                                        formatter={(value: any, entry?: { payload?: { percent?: number } }) =>
                                                          entry?.payload?.percent !== undefined
                                                            ? `$${value.toFixed(2)} (${entry.payload.percent.toFixed(2)}%)`
                                                            : `$${value.toFixed(2)}`
                                                        }
                                                      />
                                                    </Bar>
                                                  </BarChart>
                                                </ResponsiveContainer>
                                              </Col>
                                            </Row>
                                            <hr />
                                            <Row>
                                              <Col>
                                                <p><strong>Total Tax:</strong> ${tax.tax_amount || "0.00"}</p>
                                              </Col>
                                              <Col className="d-flex justify-content-end">
                                                <p><strong>Total Amount:</strong> ${taxData ? taxData.item_total_amount_after_tax : "0.00"}</p>
                                              </Col>
                                            </Row>
                                          </div>
                                        );
                                      })}
                                    </Card>
                                  </div>
                                </td>
                              </tr>
                            )}

                          </React.Fragment>
                        );
                      }))}
                </tbody>
              </Table>
            </Card.Body>
          )}
      </Card>
      <Button
        className="btn btn-light "
        size="sm"
        onClick={handleCancelLineItems}
      >
        Back
      </Button>
      <hr />

      {showLineItemForm && (
        <Card.Body>
          <Card>
            <Form onSubmit={formik.handleSubmit}>
              <Row>
                {/* Basic Item Details */}
                <Col md={12}>
                  <Card>
                    <Card.Body>
                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label small">Item Code</Form.Label>
                            <Form.Control
                              className="form-control form-control-sm"
                              type="text"
                              name="item_code"
                              value={formik.values.item_code}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={!!formik.errors.item_code}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.item_code}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label small">Description</Form.Label>
                            <Form.Control
                              className="form-control form-control-sm"
                              type="text"
                              name="description"
                              value={formik.values.description}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={!!formik.errors.description}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.description}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label small">Quantity</Form.Label>
                            <Form.Control
                              className="form-control form-control-sm"
                              type="number"
                              name="quantity"
                              value={formik.values.quantity}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={!!formik.errors.quantity}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.quantity}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label small">Total Amount<span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              className="form-control form-control-sm"
                              type="number"
                              {...formik.getFieldProps('line_amount')}
                              isInvalid={!!formik.touched.line_amount}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.line_amount}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Tax and Traffic Codes */}
                <Col md={12}>
                  <Card>
                    <Card.Body>
                      <Row className="mt-4">
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label small">Tax Code</Form.Label>
                            <Form.Control
                              className="form-control form-control-sm"
                              type="text" // Not "number"
                              name="tax_code" // Not "line_amount"
                              value={formik.values.tax_code}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                              isInvalid={!!formik.errors.tax_code}
                            />
                            <Form.Control.Feedback type="invalid">
                              {formik.errors.tax_code}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label className="form-label small">Harmonized tariff code</Form.Label>
                            <Form.Control
                              className="form-control form-control-sm"
                              type="text"
                              name="traffic_code"
                              value={formik.values.traffic_code}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      {/* Additional Information Toggle */}
                      <Col md={12} className="mt-3">
                        <Link to="#" onClick={toggleForm}>
                          <IconText icon={<LuChevronDownCircle />}>
                            Add additional information and tax overrides
                          </IconText>
                        </Link>
                      </Col>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Additional Information Forms */}
                {showForm && (
                  <Col md={12} className="mt-4">
                    <Card>
                      <Card.Body>
                        <p>Include this line item in discount calculations</p>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Check
                                type="checkbox"
                                label="Include this line item in discount calculations"
                                {...formik.getFieldProps('discountAdded.discount_added')}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label small">Revenue Account</Form.Label>
                              <Form.Control
                                className="form-control form-control-sm"
                                type="text"
                                {...formik.getFieldProps('rev_account')}
                                name="rev_account"
                                value={formik.values.rev_account}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label small">Reference Code 1</Form.Label>
                              <Form.Control
                                className="form-control form-control-sm"
                                type="text"
                                name="ref1"
                                value={formik.values.ref1}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Form.Group>
                          </Col>

                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label small">Reference Code 2</Form.Label>
                              <Form.Control
                                className="form-control form-control-sm"
                                type="text"
                                name="ref2"
                                value={formik.values.ref2}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col>
                            <h3>Line Overrides</h3>
                            <p>This Information affects only this Line of Document</p>
                            <Link to="#" onClick={toggleAttributesForm}>
                              {' '}
                              {/* Click to toggle form */}
                              <IconText icon={<LuChevronDownCircle />}>
                                Document Line attributes
                              </IconText>
                            </Link>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>

                    {showAttributesForm && (
                      <>
                        {/* Attributes Section */}
                        <Col md={12}>
                          <Card>
                            <Card.Header>
                              <h1>Attributes</h1>
                            </Card.Header>
                            <Card.Body>
                              {attributes.length === 0 ? (
                                <h1>No Attributes Added</h1>
                              ) : (
                                attributes.map((form, index) => (
                                  <div className="container-inv" key={index}>
                                    <Row>
                                      <Form>
                                        <Row>
                                          <Col md={3}>
                                            <Form.Group controlId={`attribute-${index}`}>
                                              <Form.Label className="form-label small">Attribute</Form.Label>
                                              <Form.Control
                                                className="form-control form-control-sm"
                                                as="select"
                                                value={form.attribute}
                                                onChange={(e) => {
                                                  const updatedAttributes = [...attributes];
                                                  updatedAttributes[index].attribute = e.target.value;
                                                  setAttributes(updatedAttributes);
                                                }}
                                              >
                                                <option value="">Select Attribute</option>
                                                <option value="attribute1">Attribute 1</option>
                                                <option value="attribute2">Attribute 2</option>
                                              </Form.Control>
                                            </Form.Group>
                                          </Col>
                                          <Col md={3}>
                                            <Form.Group controlId={`value-${index}`}>
                                              <Form.Label className="form-label small">Value</Form.Label>
                                              <Form.Control
                                                className="form-control form-control-sm"
                                                type="text"
                                                value={form.value}
                                                onChange={(e) => {
                                                  const updatedAttributes = [...attributes];
                                                  updatedAttributes[index].value = e.target.value;
                                                  setAttributes(updatedAttributes);
                                                }}
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col md={3}>
                                            <Form.Group controlId={`unit_of_measure-${index}`}>
                                              <Form.Label className="form-label small">Unit of Measure</Form.Label>
                                              <Form.Control
                                                className="form-control form-control-sm"
                                                type="text"
                                                value={form.unit_of_measure}
                                                onChange={(e) => {
                                                  const updatedAttributes = [...attributes];
                                                  updatedAttributes[index].unit_of_measure = e.target.value;
                                                  setAttributes(updatedAttributes);
                                                }}
                                              />
                                            </Form.Group>
                                          </Col>
                                          <Col md={3} className="mt-3">
                                            <li
                                              className="list-inline-item"
                                              onClick={() => deleteAttributeForm(index)}
                                            >
                                              <Link
                                                to="#"
                                                className="btn btn-soft-danger btn-sm d-inline-block mt-3"
                                              >
                                                <i className="bi bi-trash fs-17 align-middle"></i>
                                              </Link>
                                            </li>
                                          </Col>
                                        </Row>
                                      </Form>
                                    </Row>
                                  </div>
                                ))
                              )}

                              <Link
                                to="#"
                                onClick={addAttributeForm}
                                style={{ marginTop: '10px' }}
                              >
                                + Add Attribute
                              </Link>

                              {attributes.length > 0 && (
                                <div style={{ marginTop: '20px' }}>
                                  <Button
                                    variant="primary"
                                    size="sm"
                                    onClick={formik.saveAttributes}
                                    style={{ marginRight: '10px' }}
                                  >
                                    Save Attributes
                                  </Button>
                                  <Button
                                    className="btn btn-light"
                                    size="sm"
                                    onClick={cancelAllAttributes}
                                  >
                                    Cancel All
                                  </Button>
                                </div>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      </>
                    )}
                    {/* Customer Details */}

                    <Card>
                      <Card.Body>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label small">Customer Exemption Type</Form.Label>
                              <div className="sub-labelF">Choosing an exemption reason enables AvaTax to determine exemption based on its tax rules</div>
                              <select
                                name="entity_use_code"
                                id="entity_use_code"
                                className="inputF form-select  form-select-sm"
                                value={formik.values.entity_use_code}  // Bind Formik state
                                onChange={formik.handleChange}  // Handle change via Formik
                              >
                                <option value="none">None</option>
                                <option value="A">A - Federal Government</option>
                                <option value="B">B - State Government</option>
                                <option value="C">C - Tribal Government</option>
                                <option value="D">D - Foreign Diplomat</option>
                                <option value="E">E - Charitable/Exempt Organization</option>
                                <option value="F">F - Religious Organization</option>
                                <option value="G">G - Resale</option>
                                <option value="H">H - Agriculture</option>
                                <option value="I">I - Industrial Prod/Manufacturers</option>
                                <option value="J">J - Direct Pay</option>
                                <option value="K">K - Direct Mail</option>
                                <option value="M">M - Educational Organization</option>
                                <option value="N">N - Local Government</option>
                                <option value="P">P - Commercial Aquaculture</option>
                                <option value="Q">Q - Commercial Fishery</option>
                                <option value="R">R - Non-Resident</option>
                                <option value="Taxable">Taxable - Override Exemption</option>
                                <option value="L">Use A Custom Entity/Use Code</option>
                              </select>
                            </Form.Group>
                          </Col>
                        </Row>
                        <Row>
                          <Col md={6}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label small">Customer Exempt Number</Form.Label>
                              <div className="sub-labelF">Enter an exemption number to exempt this transaction from tax in the US.</div>
                              <Form.Control
                                className="form-control form-control-sm"
                                type="text"
                                placeholder='Customer exempt number'
                                {...formik.getFieldProps('exempt_no')}
                              />
                            </Form.Group>
                          </Col>
                        </Row>

                        <Row>
                          <Col md={4}>
                            <Form.Group className="mb-3">
                              <Form.Label className="form-label small" >Customer VAT Number</Form.Label>
                              <Form.Control
                                className="form-control form-control-sm"
                                type="text"
                                {...formik.getFieldProps('customer_vat_number')}
                              />
                            </Form.Group>
                          </Col>
                        </Row>


                        <label className="labelF form-label">
                          {formik.values.lineAddress
                            ? "This line’s addresses are different than the addresses for the overall transaction"
                            : ""}
                        </label>

                        <Form.Group className="mb-3">
                          <Form.Check
                            type="checkbox"
                            label="This line’s addresses are different than the addresses for the overall transaction"
                            checked={formik.values.lineAddress}
                            onChange={() => {
                              formik.setFieldValue('lineAddress', true);
                            }}
                          />
                        </Form.Group>


                      </Card.Body>
                    </Card>
                    {formik.values.lineAddress && (
                      <div className="sales-inv-address-grid">
                        <GetAddressTemplate
                          header="Ship From"
                          selAddr={originAddressType}
                          defaultAdress={formik.values.address['Ship From']}
                          onAddressChange={handleOriginAddressChange}
                        />
                        <GetAddressTemplate
                          header="Ship To"
                          selAddr={destinationAddressType}
                          defaultAdress={formik.values.address['Ship To']}
                          onAddressChange={handleDestinationAddressChange}
                        />
                        {/* {selectedAddresses
                          .filter((val: Address) => val.view === true)
                          .map((item: Address, index: number) => {
                            return (
                              <GetAddressTemplate
                                header={item.sub}
                                selAddr="OTHER"
                                key={index}
                                req={true}
                                setSelectedAddresses={setSelectedAddresses}
                                selectedAddresses={selectedAddresses}
                                Address={item}
                                defaultAdress={defaultAddress}
                              />
                            );
                          })}
                        {selectedAddresses.filter(
                          (val: Address) => val.view === false
                        ).length > 0 ? (
                          <div className="sales-inv-box sales-inv-end-box">
                            <h2 className="h2_label">More Address Options</h2>
                            {selectedAddresses
                              .filter((val: Address) => val.view === false)
                              .map((item: any, index) => {
                                return (
                                  <div
                                    style={{ marginBottom: '15px' }}
                                    key={index}
                                  >
                                    <h3 className="h3_label">{item.sub}</h3>
                                    <IconText icon={<FiPlus />}>
                                      <p
                                        className="linkFtext"
                                        onClick={() => {
                                          setSelectedAddresses([
                                            ...selectedAddresses.filter(
                                              (value: Address) =>
                                                value.id !== item.id
                                            ),
                                            {
                                              id: item.id,
                                              sub: item.sub,
                                              lab: item.lab,
                                              view: true,
                                            },
                                          ]);
                                        }}
                                      >
                                        {item.lab}
                                      </p>
                                    </IconText>
                                  </div>
                                );
                              })}
                          </div>
                        ) : null} */}
                      </div>
                    )}
                    <Card>
                      <Card.Body>
                        <h4>Advanced Tax Handling</h4>
                        <label>Tax Handling</label>

                        <Form.Group>
                          <Form.Check
                            type="radio"
                            label="No special tax handling"
                            name="tax_handling"
                            value="no_special_tax_handling"
                            checked={formik.values.tax_handling === "no_special_tax_handling"}
                            onChange={(e) => formik.setFieldValue("tax_handling", e.target.value)}
                          />
                          <Form.Check
                            type="radio"
                            label="Tax was included"
                            name="tax_handling"
                            value="tax_included"
                            checked={formik.values.tax_handling === "tax_included"}
                            onChange={(e) => formik.setFieldValue("tax_handling", e.target.value)}
                          />
                          <Form.Check
                            type="radio"
                            label="Override the tax amount or specify a tax date that is different from the document date"
                            name="tax_handling"
                            value="override"
                            checked={formik.values.tax_handling === "override"}
                            onChange={(e) => {
                              formik.setFieldValue("tax_handling", e.target.value);
                              if (!formik.values.override) {
                                formik.setFieldValue("override", {
                                  tax_override_type: "",
                                  tax_override_amount: "",
                                });
                              }
                            }}
                          />
                        </Form.Group>


                        {formik.values.tax_handling === "override" && (
                          <Row>
                            <Col md="6" className="mt-2">
                              <Form.Group controlId="tax_override_type">
                                <Form.Label className="form-label small">Override Type</Form.Label>
                                <Form.Select
                                  className="form-select form-select-sm"
                                  value={formik.values.tax_override_type}
                                  onChange={(e) =>
                                    formik.setFieldValue("tax_override_type", e.target.value)
                                  }
                                >
                                  <option value="exemption">Exemption</option>
                                  <option value="tax_amount">Tax Amount</option>
                                  <option value="tax_date">Tax Date</option>
                                </Form.Select>
                              </Form.Group>
                            </Col>

                            {formik.values.tax_override_type === "tax_amount" && (
                              <Col md="6" className="mt-2">
                                <Form.Group controlId="tax_override_amount">
                                  <Form.Label className="form-label small">Tax Amount</Form.Label>
                                  <Form.Control
                                    className="form-control form-control-sm"
                                    type="number"
                                    value={formik.values.tax_override_amount}
                                    onChange={(e) =>
                                      formik.setFieldValue("tax_override_amount", e.target.value)
                                    }
                                  />
                                </Form.Group>
                              </Col>
                            )}
                            <Col md={6} className='mt-2'>
                              <div className="mb-3">
                                <label htmlFor="date" className="form-label">
                                  Document Date
                                </label>
                                <Form.Control
                                  className="form-control form-control-sm"
                                  type="date"
                                  name="date"
                                  value={formik.values.date || ''}
                                  onChange={formik.handleChange}
                                  isInvalid={formik.touched.date && !!formik.errors.date}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.date}
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                            <Col md={6}>
                              <div className="mb-3">
                                <label htmlFor="override_reason" className="form-label">
                                  Override Reason
                                </label>
                                <Form.Control
                                  className="form-control form-control-sm"
                                  type="text"
                                  name="override_reason"
                                  value={formik.values.override_reason || ''}
                                  onChange={formik.handleChange}
                                  isInvalid={formik.touched.override_reason && !!formik.errors.override_reason}
                                />
                                <Form.Control.Feedback type="invalid">
                                  {formik.errors.override_reason}
                                </Form.Control.Feedback>
                              </div>
                            </Col>
                          </Row>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                <Row className="mt-3">
                  <Col md={2}>
                    <Button type="submit" size="sm">
                      {editingItem !== null ? 'Update Item' : 'Save Item'}
                    </Button>
                  </Col>
                  <Col md={1}>
                    <Button className="btn btn-light" size="sm" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </Col>
                </Row>
              </Row>
            </Form>
          </Card>
        </Card.Body>
      )}

    </Container>
  );
};

export default LineIndex;