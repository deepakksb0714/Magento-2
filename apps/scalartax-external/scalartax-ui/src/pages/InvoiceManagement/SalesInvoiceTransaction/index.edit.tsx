import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { LuChevronDownCircle } from 'react-icons/lu';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import { useCustomerDetails } from '../../../Common/useTaxDetails';
import { ToastContainer, toast } from 'react-toastify';
import LineIndex from './index.lineItem';
import { IconText, GetAddressTemplate } from './AddressValidation';
import { Attribute, LineItem, Data } from './types'
import './index.css';
import { editTransaction as onEditTransaction } from '../../../slices/thunk';
import TransactionDetails from './index.details';
import { identity } from 'lodash';


interface IndexProps {
  editData?: any;
  isEdit?: boolean;
  onCancel: () => void;
}

interface Address {
  id: string;
  sub: string;
  lab: string;
  view: boolean;
}

const Index = ({ editData, onCancel }: IndexProps) => {
  const [type, settype] = useState<string>('sales_invoice');
  const [error, setError] = useState<String>('');
  const primaryEntity = usePrimaryEntity();
  const navigate = useNavigate();
  const [hasLineItems, setHasLineItems] = useState(false);
  const dispatch = useDispatch();
  const { customersWithCertificates } = useCustomerDetails();
  const [showEdit, setShowEdit] = useState(false);

  // States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLineItems, setShowLineItems] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showAttributesForm, setShowAttributesForm] = useState(false);
  const [lineItems, setLineItems] = useState<LineItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string>();
  const [data, setData] = useState<Data | null>(null);
  const [attributes, setAttributes] = useState([{ attribute: '', value: '', unit_of_measure: '' }]);

  const defaultAdress = {
    address: '5678 main avenue',
    address2: '',
    address3: '',
    city: 'Long Beach',
    region: 'CA',
    country: 'USA',
    postal_code: '90802',
  };


  const [originAddressType, setOriginAddressType] = useState<'DEFAULT' | 'OTHER' | 'ADDED'>('DEFAULT');
  const [destinationAddressType, setDestinationAddressType] = useState<'DEFAULT' | 'OTHER' | 'ADDED'>('OTHER');

  const [selectedAddresses, setSelectedAddresses] = useState<Address[]>([
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


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (editData && editData.id) || '',
      code: (editData && editData.code) || '',
      type: (editData && editData.transaction_type) || 'Sales Invoice',
      date: (editData && editData.date) || '',
      customer_code: (editData && editData.customer_id) || '',
      certificate_id: (editData && editData.certificate_id) || '',
      vendor_code: (editData && editData.vendor_code) || '',
      total_discount: (editData && editData.total_discount) || '',
      location_code: (editData && editData.location_code) || '',
      entity_use_code: (editData && editData.entity_use_code) || '',
      exempt_no: (editData && editData.exempt_no) || '',
      customer_vat_number: (editData && editData.customer_vat_number) || '',
      vendor_vat_number: (editData && editData.vendor_vat_number) || '',
      description: (editData && editData.description) || '',
      sales_person_code: (editData && editData.sales_person_code) || '',
      reference_code: (editData && editData.reference_code) || '',
      purchase_order: (editData && editData.purchase_order) || '',
      currency_code: (editData && editData.currency_code) || 'USD',
      attributes: (editData && editData.attributes) || [],
      address: {
        'Ship From': {
          address: (editData && editData.origin_address?.address_line1) || '5678 main avenue',
          city: (editData && editData.origin_address?.city) || 'Long Beach',
          region: (editData && editData.origin_address?.region) || 'CA',
          country: (editData && editData.origin_address?.country) || 'USA',
          postal_code: (editData && editData.origin_address?.postal_code) || '90802',
        },
        'Ship To': {
          address: (editData && editData.destination_address?.address_line1) || '5678 main avenue',
          city: (editData && editData.destination_address?.city) || 'Long Beach',
          region: (editData && editData.destination_address?.region) || 'CA',
          country: (editData && editData.destination_address?.country) || 'USA',
          postal_code: (editData && editData.destination_address?.postal_code) || '90802',
        },
      },
      additionalAddresses: (editData && editData.additionalAddresses) || [],
      override: (editData && editData.tax_override_type !== null) || false,
      tax_override_type: (editData && editData.tax_override_type) || '',
      tax_override_amount: (editData && editData.tax_override_amount) || '',
      tax_override_reason: (editData && editData.tax_override_reason) || '',
      status: (editData && editData.status) || 'committed',
    },

    // Validation Schema
    validationSchema: Yup.object().shape({
      code: Yup.string().required('Code is required'),
      type: Yup.string().required('Transaction type is required'),
      date: Yup.date().required('Date is required'),
      customer_code: Yup.string().when('type', {
        is: 'Sales Invoice',
        then: () => Yup.string().required('Customer code is required'),
        otherwise: () => Yup.string()
      }),
      vendor_code: Yup.string().when('type', {
        is: 'Purchase Invoice',
        then: () => Yup.string().required('Vendor code is required'),
        otherwise: () => Yup.string()
      }),
      certificate_id: Yup.string(),
      total_discount: Yup.number(),
      location_code: Yup.string(),
      entity_use_code: Yup.string(),
      exempt_no: Yup.string(),
      customer_vat_number: Yup.string(),
      vendor_vat_number: Yup.string(),
      description: Yup.string(),
      address: Yup.object().shape({
        'Ship From': Yup.object().shape({
          address: Yup.string().required('Address is required'),
          city: Yup.string().required('City is required'),
          region: Yup.string().required('Region is required'),
          country: Yup.string().required('Country is required'),
          postal_code: Yup.string().required('Postal code is required'),
        }),
        'Ship To': Yup.object().shape({
          address: Yup.string().required('Address is required'),
          city: Yup.string().required('City is required'),
          region: Yup.string().required('Region is required'),
          country: Yup.string().required('Country is required'),
          postal_code: Yup.string().required('Postal code is required'),
        }),
      }),
      override: Yup.boolean(),
      tax_override_type: Yup.string().when('override', {
        is: true,
        then: () => Yup.string().required('Tax override type is required'),
      }),
      tax_override_amount: Yup.number().when('override', {
        is: true,
        then: () => Yup.number().required('Tax override amount is required'),
      }),
      tax_override_reason: Yup.string().when('override', {
        is: true,
        then: () => Yup.string().required('Tax override reason is required'),
      }),
      status: Yup.string().required('Status is required'),
    }),
    onSubmit: async (values: any) => {
      setIsSubmitting(true);

      if (!lineItems.length) {
        setError('At least one line item is required');
        setIsSubmitting(false);
        return;
      }

      try {
        // Transform the data to match the required structure
        const transformedData = {
          // Document details
          id: values.id,
          code: values.code,
          type: values.type.toLowerCase(),
          date: values.date,
          customer_code: values.customer_code || "",
          certificate_id: values.certificate_id || "",
          vendor_code: values.vendor_code || "",

          // Address information
          address: {
            'Ship To': formik.values.address['Ship To'],
            'Ship From': formik.values.address['Ship From']
          },

          // Line items
          lineItems: lineItems.map(item => ({
            id: item.id || "",
            line_number: item.line_number,
            item_code: item.item_code || "",
            description: item.description || "",
            line_amount: item.line_amount || 0,
            quantity: item.quantity || 0,
            tax_override_amount: item.tax_override_amount || "",
            tax_date: item.tax_date || "",
            tax_override_reason: item.tax_override_reason || "",
            tax_included: item.tax_included || "false",
            address: {
              'Ship To': item.address?.['Ship To'] || {},
              'Ship From': item.address?.['Ship From'] || {}
            },
            attributes: item.attributes || [],
            traffic_code: item.traffic_code || ""
          })),

          // Entity ID
          entity_id: primaryEntity?.id || "",

          // Customer details
          total_discount: values.total_discount || "",
          location_code: values.location_code || "",
          entity_use_code: values.entity_use_code || "",
          exempt_no: values.exempt_no || "",
          customer_vat_number: values.customer_vat_number || "",
          vendor_vat_number: values.vendor_vat_number || "",
          description: values.description || "",

          // Status
          Status: values.status.status || "committed"
        };
        // Dispatch the action
        dispatch(onEditTransaction(transformedData));
        onCancel();
        // Reset the form and navigate
        formik.resetForm();
        navigate('/transaction-list', { state: { activeTab: 'Transaction List' } });
      } catch (err) {
        setError('Error submitting form. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    },
  });


  const combineData = async (): Promise<any> => {
    const combinedData = {
      id: formik.values.id,
      type: formik.values.type,
      code: formik.values.code,
      date: formik.values.date,
      customer_code: formik.values.customer_code,
      certificate_id: formik.values.certificate_id,
      vendor_code: formik.values.vendor_code,
      total_discount: formik.values.total_discount,
      location_code: formik.values.location_code,
      entity_use_code: formik.values.entity_use_code,
      exempt_no: formik.values.exempt_no,
      customer_vat_number: formik.values.customer_vat_number,
      vendor_vat_number: formik.values.vendor_vat_number,
      description: formik.values.description,
      sales_person_code: formik.values.sales_person_code,
      reference_code: formik.values.reference_code,
      purchase_order: formik.values.purchase_order,
      currency_code: formik.values.currency_code,
      attributes: attributes.map(attr => ({
        attribute: attr.attribute,
        value: attr.value,
        unit_of_measure: attr.unit_of_measure,
      })),
      address: {
        'Ship From': {
          ...formik.values.address['Ship From'],
        },
        'Ship To': {
          ...formik.values.address['Ship To'],
        },
      },
      additionalAddresses: selectedAddresses.filter(addr => addr.view).map(addr => ({
        id: addr.id,
        sub: addr.sub,
        lab: addr.lab,
      })),
      override: formik.values.override,
      tax_override_type: formik.values.tax_override_type,
      tax_override_amount: formik.values.tax_override_amount,
      tax_override_reason: formik.values.tax_override_reason,
      status: formik.values.status,
      lineItems,
      entity_id: primaryEntity?.id,
    };
    return combinedData;
  };;

  const validateRequiredData = (combinedData: any): boolean => {
    if (
      !combinedData?.type ||
      !combinedData?.code ||
      !combinedData?.date ||
      (!combinedData?.customer_code && !combinedData?.vendor_code) ||
      (combinedData?.override &&
        ((combinedData?.tax_override_type === 'Tax Amount' &&
          !combinedData?.tax_override_amount) ||
          !combinedData?.tax_override_reason))
    ) {
      setError('Required Data Is Missing');
      return false;
    }
    return true;
  };;

  useEffect(() => {
    if (editData?.line_items) {
      setLineItems(editData.line_items);
    }
  }, [editData]);

  const handleCombinedSubmit = async () => {
    const combinedData = await combineData();

    // If combinedData is null, return early
    if (!combinedData) {
      setError('Form validation failed');
      return;
    }

    if (!validateRequiredData(combinedData)) {
      return; // This will stop further execution if validation fails
    }

    setError('');
    setData(combinedData);
    setShowLineItems(true);
    setHasLineItems(true);
  };

  useEffect(() => {
    if (data?.address || editData) {
      setOriginAddressType('ADDED');
      setDestinationAddressType('ADDED');
    }
  }, [data, editData]);

  // Function to save all attributes
  const saveAttributes = () => { };

  // Handle line item changes and cancel
  const handleDataChange = (updatedLineItems: LineItem[]) => {
    setLineItems(updatedLineItems);
    setHasLineItems(updatedLineItems.length > 0);
  };

  // Toggle functions
  const toggleForm = () => {
    setShowForm(!showForm);
  };

  const toggleAttributesForm = () => {
    setShowAttributesForm(!showAttributesForm);
  };

  // Handle adding and removing attribute forms
  const addAttributeForm = () => {
    setAttributes([...attributes, { attribute: '', value: '', unit_of_measure: '' }]);
  };

  const deleteAttributeForm = (index: number) => {
    const updatedAttributes = [...attributes];
    updatedAttributes.splice(index, 1);
    setAttributes(updatedAttributes);
  };

  const cancelAllAttributes = () => {
    setAttributes([{ attribute: '', value: '', unit_of_measure: '' }]);
  };


  const handleCancelLineItems = () => {
    setShowLineItems(false);
  };

  // Final submit function for the save button
  const handleFinalSubmit = () => {
    if (!lineItems.length) {
      setError('At least one line item is required');
      return;
    }

    formik.handleSubmit();
  };


  const handleOriginAddressChange = (newAddress: any) => {
    formik.setFieldValue('address[Ship From]', newAddress)
  };

  const handleDestinationAddressChange = (newAddress: any) => {
    formik.setFieldValue('address[Ship To]', newAddress)
  };
  return (
    <React.Fragment>
      <div className='mt-2'>
        <Container fluid>
          <ToastContainer />
          {!showEdit ? (
            <>
              <TransactionDetails transaction={editData} onEdit={() => setShowEdit(true)} />
            </>
          ) : (
            <>
              <Row>
                <Col xl={12}>
                  <div>
                    {!showLineItems ? (
                      <Form onSubmit={formik.handleSubmit}>
                        <Row>
                          <Col md={12}>
                            <Row className="g-2">
                              {/* Document Code */}
                              <Col md={4}>
                                <div className="mb-2">
                                  <label htmlFor="code" className="form-label small">
                                    Document Code<span className="text-danger">*</span>
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="code"
                                    value={formik.values?.code || ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter document code"
                                    className="form-control form-control-sm"
                                    isInvalid={!!formik.touched?.code && !!formik.errors?.code}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors?.code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              {/* Document Type */}
                              <Col md={4}>
                                <div className="mb-2">
                                  <label htmlFor="type" className="form-label small">
                                    Document Type<span className="text-danger">*</span>
                                  </label>
                                  <Form.Select
                                    name="type"
                                    value={formik.values.type}
                                    onChange={(e) => {
                                      formik.setFieldValue("type", e.target.value);
                                      formik.setFieldValue("customer_code", "");
                                      formik.setFieldValue("vendor_code", "");
                                    }}
                                    onBlur={formik.handleBlur}
                                    className="form-select form-select-sm"
                                    isInvalid={!!formik.touched?.type && !!formik.errors?.type}
                                  >
                                    <option value="sales invoice">Sales Invoice</option>
                                    <option value="return invoice">Return Invoice</option>
                                    <option value="inventory transfer_invoice">
                                      Inventory Transfer Invoice
                                    </option>
                                    <option value="inventory transfer_outbound_invoice">
                                      Inventory Transfer Outbound Invoice
                                    </option>
                                    <option value="customs invoice">Customs Invoice</option>
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors?.type}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              {/* Document Date */}
                              <Col md={4}>
                                <div className="mb-2">
                                  <label htmlFor="date" className="form-label small">
                                    Document Date<span className="text-danger">*</span>
                                  </label>
                                  <Form.Control
                                    type="date"
                                    name="date"
                                    value={formik.values?.date || ""}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    className="form-control form-control-sm"
                                    isInvalid={!!formik.touched?.date && !!formik.errors?.date}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors?.date}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>


                            </Row>

                            <Row className="g-2">
                              {/* Customer Code */}
                              <Col md={4}>
                                <div className="mb-2">
                                  <label htmlFor="customer_code" className="form-label small">
                                    Customer Code<span className="text-danger">*</span>
                                  </label>
                                  <Form.Select
                                    name="customer_code"
                                    value={formik.values.customer_code}
                                    onChange={(e) => {
                                      const selectedCustomer = customersWithCertificates.find(
                                        (customer) => customer.id === e.target.value
                                      );
                                      formik.setFieldValue("customer_code", selectedCustomer?.id);
                                      setSelectedCustomer(selectedCustomer?.id || "");
                                    }}
                                    className="form-select form-select-sm"
                                    isInvalid={!!formik.touched?.customer_code && !!formik.errors?.customer_code}
                                  >
                                    <option value="">Select Customer</option>
                                    {customersWithCertificates.map((customer) => (
                                      <option key={customer.id} value={customer.id}>
                                        {customer.customer_code}
                                      </option>
                                    ))}
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors?.customer_code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              {/* Certificate Code */}
                              <Col md={4}>
                                <div className="mb-2">
                                  <label htmlFor="certificate_id" className="form-label small">
                                    Certificate Code
                                  </label>
                                  <Form.Select
                                    name="certificate_id"
                                    value={formik.values.certificate_id}
                                    onChange={formik.handleChange}
                                    className="form-select form-select-sm"
                                  >
                                    <option value="">none</option>
                                    {customersWithCertificates
                                      .find((c) => c.id === formik.values.customer_code)
                                      ?.certificates?.filter((cert) => {
                                        const effectiveDate = new Date(cert.effective_date);
                                        const today = new Date();
                                        today.setHours(0, 0, 0, 0);
                                        effectiveDate.setHours(0, 0, 0, 0);
                                        return effectiveDate <= today;
                                      })
                                      .map((cert) => (
                                        <option key={cert.id} value={cert.id}>
                                          {cert.code}
                                        </option>
                                      ))}
                                  </Form.Select>
                                </div>
                              </Col>
                              {/* Entity Use Code */}
                              <Col md={4}>
                                <div className="mb-2">
                                  <label htmlFor="entity_use_code" className="form-label small">
                                    Entity Use Code
                                  </label>
                                  <Form.Select
                                    name="entity_use_code"
                                    value={formik.values.entity_use_code || ""}
                                    onChange={formik.handleChange}
                                    className="form-select form-select-sm"
                                    isInvalid={formik.touched.entity_use_code && !!formik.errors.entity_use_code}
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
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.entity_use_code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>


                            </Row>
                            <Row className="mt-3 g-2 align-items-center">
                              {/* Left Column */}
                              <Col md={5}>
                                {/* Discount Amount */}
                                <div className="mb-2">
                                  <label htmlFor="total_discount" className="form-label small">
                                    Discount Amount
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="total_discount"
                                    value={formik.values.total_discount || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Discount Amount"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.total_discount && !!formik.errors.total_discount}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.total_discount}
                                  </Form.Control.Feedback>
                                </div>

                                {/* Location Code */}
                                <div className="mb-2">
                                  <label htmlFor="location_code" className="form-label small">
                                    Location Code
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="location_code"
                                    value={formik.values.location_code || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Location Code"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.location_code && !!formik.errors.location_code}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.location_code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              {/* Vertical Divider */}
                              <Col md={1} className="d-flex justify-content-center align-items-center">
                                <div style={{ borderLeft: "2px solid grey", height: "160px" }}></div>
                              </Col>


                              {/* Right Column */}
                              <Col md={5}>
                                {/* Customer Exempt Number */}
                                <div className="mb-2">
                                  <label htmlFor="exempt_no" className="form-label small">
                                    Customer Exempt Number
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="exempt_no"
                                    value={formik.values.exempt_no || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Customer Exempt Number"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.exempt_no && !!formik.errors.exempt_no}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.exempt_no}
                                  </Form.Control.Feedback>
                                </div>

                                {/* Customer VAT Number */}
                                <div className="mb-2">
                                  <label htmlFor="customer_vat_number" className="form-label small">
                                    Customer VAT Number
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="customer_vat_number"
                                    value={formik.values.customer_vat_number || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Customer VAT Number"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.customer_vat_number && !!formik.errors.customer_vat_number}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.customer_vat_number}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mt-3 g-2">
                              {/* Description */}
                              <Col md={6}>
                                <div className="mb-2">
                                  <label htmlFor="description" className="form-label small">
                                    Description
                                  </label>
                                  <Form.Control
                                    as="textarea"
                                    rows={2} // Reduced to 2 rows for compactness
                                    name="description"
                                    value={formik.values.description || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Enter Description"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.description && !!formik.errors.description}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.description}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>





                          </Col>
                          <hr />
                          <Link to="#" onClick={toggleForm}>
                            {' '}
                            {/* Click to toggle form */}
                            <IconText icon={<LuChevronDownCircle />}>
                              Add additional information and tax overrides
                            </IconText>
                          </Link>
                        </Row>
                        {showForm && (
                          <>
                            <Row className="mt-3 g-2">
                              {/* Sales Person Code */}
                              <Col md={6}>
                                <div className="mb-2">
                                  <label htmlFor="sales_person_code" className="form-label small">
                                    Sales Person Code
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="sales_person_code"
                                    value={formik.values.sales_person_code || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Sales Person Code"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.sales_person_code && !!formik.errors.sales_person_code}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.sales_person_code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                              {/* Reference Code */}
                              <Col md={6}>
                                <div className="mb-2">
                                  <label htmlFor="reference_code" className="form-label small">
                                    Reference Code
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="reference_code"
                                    value={formik.values.reference_code || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Reference Code"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched.reference_code && !!formik.errors.reference_code}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors.reference_code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>
                            </Row>

                            <Row className="mt-2 g-2">
                              {/* Purchase Order */}
                              <Col md={6}>
                                <div className="mb-2">
                                  <label htmlFor="purchase_order" className="form-label small">
                                    Purchase Order
                                  </label>
                                  <Form.Control
                                    type="text"
                                    name="purchase_order"
                                    value={formik.values?.purchase_order || ""}
                                    onChange={formik.handleChange}
                                    placeholder="Purchase Order"
                                    className="form-control form-control-sm"
                                    isInvalid={formik.touched?.purchase_order && !!formik.errors?.purchase_order}
                                  />
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors?.purchase_order}
                                  </Form.Control.Feedback>
                                  <div className="text-muted small">
                                    You can tie a purchase order to a single-use exemption certificate
                                  </div>
                                </div>
                              </Col>

                              {/* Currency */}
                              <Col md={6} className="p-0">
                                <div className="mb-1">
                                  <label htmlFor="currency_code" className="form-label small">
                                    Currency
                                  </label>
                                  <Form.Select
                                    name="currency_code"
                                    disabled
                                    value={formik.values?.currency_code || ""}
                                    onChange={formik.handleChange}
                                    className="form-select form-select-sm"
                                    isInvalid={formik.touched?.currency_code && !!formik.errors?.currency_code}
                                  >
                                    <option value="">Select Currency</option>
                                    <option value="USD">USD - US Dollar</option>
                                  </Form.Select>
                                  <Form.Control.Feedback type="invalid">
                                    {formik.errors?.currency_code}
                                  </Form.Control.Feedback>
                                </div>
                              </Col>

                            </Row>

                            {/* Toggle Additional Attributes */}
                            <Link to="#" onClick={toggleAttributesForm} className="d-block mt-2">
                              <IconText icon={<LuChevronDownCircle />}>Document Header Attributes</IconText>
                            </Link>

                            {/* Attributes Form */}
                            {showAttributesForm && (
                              <Card className="mt-3">
                                <Card.Body>
                                  <Card.Header>
                                    <h6>Attributes</h6>
                                  </Card.Header>
                                  <Card.Body>
                                    {attributes.length === 0 ? (
                                      <p className="text-muted">No Attributes Added</p>
                                    ) : (
                                      attributes.map((form, index) => (
                                        <div className="container-inv mb-2" key={index}>
                                          <Row className="g-2">
                                            <Col md={3}>
                                              <Form.Group controlId={`attribute-${index}`}>
                                                <Form.Label className="small">Attribute</Form.Label>
                                                <Form.Select
                                                  value={form.attribute}
                                                  onChange={(e) => {
                                                    const updatedAttributes = [...attributes];
                                                    updatedAttributes[index].attribute = e.target.value;
                                                    setAttributes(updatedAttributes);
                                                  }}
                                                  className="form-control-sm"
                                                >
                                                  <option value="">Select Attribute</option>
                                                  <option value="attribute1">Attribute 1</option>
                                                  <option value="attribute2">Attribute 2</option>
                                                </Form.Select>
                                              </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group controlId={`value-${index}`}>
                                                <Form.Label className="small">Value</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  value={form.value}
                                                  onChange={(e) => {
                                                    const updatedAttributes = [...attributes];
                                                    updatedAttributes[index].value = e.target.value;
                                                    setAttributes(updatedAttributes);
                                                  }}
                                                  className="form-control-sm"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col md={3}>
                                              <Form.Group controlId={`unit_of_measure-${index}`}>
                                                <Form.Label className="small">Unit of Measure</Form.Label>
                                                <Form.Control
                                                  type="text"
                                                  value={form.unit_of_measure}
                                                  onChange={(e) => {
                                                    const updatedAttributes = [...attributes];
                                                    updatedAttributes[index].unit_of_measure = e.target.value;
                                                    setAttributes(updatedAttributes);
                                                  }}
                                                  className="form-control-sm"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col md={3} className="d-flex align-items-end">
                                              <Button
                                                variant="danger"
                                                size="sm"
                                                onClick={() => deleteAttributeForm(index)}
                                              >
                                                <i className="bi bi-trash"></i>
                                              </Button>
                                            </Col>
                                          </Row>
                                        </div>
                                      ))
                                    )}

                                    <Button variant="primary" size="sm" onClick={addAttributeForm} className="mt-2">
                                      + Add Attribute
                                    </Button>

                                    {attributes.length > 0 && (
                                      <div className="mt-3">
                                        <Button variant="success" size="sm" className="me-2">
                                          Save Attributes
                                        </Button>
                                        <Button variant="light" size="sm" onClick={cancelAllAttributes}>
                                          Cancel All
                                        </Button>
                                      </div>
                                    )}
                                  </Card.Body>
                                </Card.Body>
                              </Card>
                            )}

                            <hr />

                            {/* Override Checkbox */}
                            <Form.Group controlId="override">
                              <Form.Check
                                type="checkbox"
                                label="Override tax amount or specify a different tax date"
                                checked={formik.values.override}
                                onChange={(e) => formik.setFieldValue("override", e.target.checked)}
                              />
                            </Form.Group>

                            {/* Override Options */}
                            {formik.values.override && (
                              <Row className="mt-2 g-2">
                                <Col md={6}>
                                  <Form.Group controlId="tax_override_type">
                                    <Form.Label className="small">Override Type</Form.Label>
                                    <Form.Select
                                      value={formik.values.tax_override_type}
                                      onChange={(e) => formik.setFieldValue("tax_override_type", e.target.value)}
                                      className="form-control-sm"
                                    >
                                      <option value="exemption">Exemption</option>
                                      <option value="tax_amount">Tax Amount</option>
                                      <option value="tax_date">Tax Date</option>
                                    </Form.Select>
                                  </Form.Group>
                                </Col>
                              </Row>
                            )}
                          </>
                        )}

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
                              defaultAdress={defaultAdress}
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

                        <div style={{ width: '60%' }}>
                          <h2>Document Status</h2>
                          <p className="ps-0">
                            Only committed transactions are included on tax returns.
                            Transactions become locked and can’t be edited once
                            they’ve been reported on a filed return.
                          </p>
                          <Col md="5">
                            <Form.Select
                              as="select"
                              className="form-label"
                              name="status"
                              value={formik.values.status}
                              onChange={formik.handleChange}
                              onBlur={formik.handleBlur}
                            >
                              <option value="committed">committed</option>
                              <option value="uncommitted">uncommitted</option>
                            </Form.Select>
                            {formik.touched.status && formik.errors.status && (
                              <div className="text-danger">{formik.errors.status}</div>
                            )}
                          </Col>
                        </div>
                        <hr />
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: '25%',
                          }}>
                          <Button
                            className="btn btn-primary"
                            onClick={() => handleCombinedSubmit()}
                            size="sm"
                          >
                            Save and add line detail
                          </Button>
                        </div>
                        {error && (
                          <p className="ps-0 mt-4" style={{ color: 'red' }}>
                            {error}
                          </p>
                        )}

                        <div style={{ width: '60%' }}>
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '23%',
                              marginTop: '20px',
                            }}
                          >

                          </div>
                        </div>
                      </Form>
                    ) : (
                      <div>
                        {data ? (
                          <LineIndex
                            data={data}
                            onCancel={handleCancelLineItems}
                            onDataChange={handleDataChange}
                          />
                        ) : (
                          <p>Loading or no data available</p>
                        )}
                      </div>
                    )}
                  </div>
                </Col>
              </Row>
            </>
          )}
          {/* Final save and discard buttons */}
          {
            showEdit ?
              (<Row className="mt-3">
                <Col md="2">
                  <Button
                    type="button"
                    size='sm'
                    className="btn btn-primary"
                    disabled={!hasLineItems || isSubmitting}
                    onClick={handleFinalSubmit}
                    style={{ width: '100px' }}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </Button>
                </Col>
                <Col md="2">
                  <Button
                    variant="light"
                    size='sm'
                    style={{ width: '100px' }}
                    onClick={() => {
                      setShowEdit(false)
                    }}
                  >
                    Back
                  </Button>
                </Col>
              </Row>
              ) : (
                <Col md="2">
                  <Button
                    variant="light"
                    size='sm'
                    style={{ width: '100px' }}
                    onClick={() => {
                      onCancel()
                    }}
                  >
                    Back
                  </Button>
                </Col>

              )
          }
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Index;