import React, { useState, useEffect } from 'react';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTaxTypeHandler } from "../AddTaxRule/taxTypeUtils"
import { editTaxRule as onEditTaxRule } from '../../../slices/thunk';
import { countryData } from '../../../Common/data/countryState';

const EditTaxRule = () => {

    document.title = 'EDIT TAX RULE | Dashboard';


    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { rowData } = location.state || {};
    const [showOptions, setShowOptions] = useState({
        showCapOptions: false,
        showThresholdOptions: false,
        showIsAllJuris: false,
    });

    const toggleOption = (optionKey: keyof typeof showOptions) => {
        setShowOptions((prev) => ({
            ...prev,
            [optionKey]: !prev[optionKey],
        }));
    };

    useEffect(() => {
        if (rowData?.source || rowData?.is_all_juris) {
            toggleOption('showIsAllJuris');
        }
    }, [rowData?.source, rowData?.is_all_juris]);

    useEffect(() => {
        if (rowData?.cap) {
            formik.setFieldValue('specialHandling', "setACap");
            toggleOption('showCapOptions');
        }
    }, [rowData?.cap]);

    useEffect(() => {
        if (rowData?.threshold) {
            formik.setFieldValue('specialHandling', "setAThreshold");
            toggleOption('showThresholdOptions');
        }
    }, [rowData?.threshold]);
    const entityUseCodes = [
        { value: 'none', name: 'None' },
        { value: 'a', name: 'A - Federal Government' },
        { value: 'b', name: 'B - State Government' },
        { value: 'c', name: 'C - Tribal Government' },
        { value: 'd', name: 'D - Foreign Diplomat' },
        { value: 'e', name: 'E - Charitable/Exempt Organization' },
        { value: 'f', name: 'F - Religious Organization' },
        { value: 'g', name: 'G - Resale' },
        { value: 'h', name: 'H - Agriculture' },
        { value: 'i', name: 'I - Industrial Prod/Manufacturers' },
        { value: 'j', name: 'J - Direct Pay' },
        { value: 'k', name: 'K - Direct Mail' },
        { value: 'm', name: 'M - Educational Organization' },
        { value: 'n', name: 'N - Local Government' },
        { value: 'p', name: 'P - Commercial Aquaculture' },
        { value: 'q', name: 'Q - Commercial Fishery' },
        { value: 'r', name: 'R - Non-Resident' },
        { value: 'taxable', name: 'Taxable - Override Exemption' },
        { value: 'custom', name: 'Use A Custom Entity/Use Code' },
    ];

    const toSnakeCase = (obj: any): any => {
        if (Array.isArray(obj)) {
            return obj.map((item) => toSnakeCase(item));
        } else if (obj !== null && typeof obj === 'object') {
            return Object.keys(obj).reduce((acc, key) => {
                const snakeKey = key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
                acc[snakeKey] = toSnakeCase(obj[key]);
                return acc;
            }, {} as any);
        }
        return obj; // Return the value if it's not an object or array
    };

    const formik = useFormik({
        initialValues: {
            id: rowData?.id || '',
            name: rowData?.name || '',
            effectiveDate: rowData?.effective_date || '',
            expirationDate: rowData?.expiration_date || '',
            ruleType: rowData?.rule_type || '',
            country: rowData?.country || '',
            taxType: rowData?.tax_type || '',
            taxSubtype: rowData?.tax_sub_type || '',
            rateType: rowData?.rate_type || '',
            jurisdictionType: rowData?.jurisdiction_type || '',
            region: rowData?.region || '',
            jurisdictionName: rowData?.jurisdiction_name || '',
            entityUseCode: rowData?.entity_use_code || 'none',
            taxCode: rowData?.tax_code || '',
            tariffCode: rowData?.tariff_code || '',
            taxTreatment: rowData?.cap || rowData?.trasehold ? 'taxable' : 'non-taxable',
            specialHandling: rowData?.special_handling || 'none',
            isAllJuris: rowData?.is_all_juris ? 'true' : 'false',
            source: rowData?.source || '',
            cap: rowData?.cap || '',
            capAppliedValue: rowData?.cap_applied_value || '',
            capOption: rowData?.cap_option || '',
            threshold: rowData?.threshold || '',
            thresholdAppliedValue: rowData?.threshold_applied_value || '',
            taxEntireAmount: rowData?.tax_entire_amount || false,
            baseValue: rowData?.base_value,
            rateValue: rowData?.rate_value,
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('Name is required'),
            effectiveDate: Yup.date().required('Effective date is required'),
            ruleType: Yup.string().required('Rule type is required'),
            country: Yup.string().required('Country is required'),
            taxType: Yup.string().required('Tax type is required'),
            taxSubType: Yup.string().when('taxType', (taxType:string, schema:any) => {
                if (typeof taxType === "string" && taxType !== "All") {
                    return schema.required('Tax subtype is required'); // Add "required" validation
                }
                return schema;
            }),
            rateType: Yup.string().required('Rate type is required'),
            jurisdictionType: Yup.string().required('Jurisdiction type is required'),
            region: Yup.string().required('Region is required'),
            jurisdictionName: Yup.string().required('Jurisdiction is required'),
            taxCode: Yup.string().required('Tax code is required'),
            cap: Yup.number().when('specialHandling', {
                is: (value: string) => value === 'setACap',
                then: (schema: any) => schema.required('Cap value is required'),
                otherwise: (schema: any) => schema.notRequired(),
            }),
            threshold: Yup.number().when('specialHandling', {
                is: (value: string) => value === 'setAThreshold',
                then: (schema: any) => schema.required('Threshold amount is required'),
                otherwise: (schema: any) => schema.notRequired(),
            }),
            baseValue: Yup.number().when('ruleType', {
                is: (value: string) => value === 'baseOverrideRule',
                then: (schema: any) => schema.required('Base value is required').typeError('Base value must be a number'),
                otherwise: (schema: any) => schema.notRequired(),
            }),
            rateValue: Yup.number().when('ruleType', {
                is: (value: string) => value === 'rateOverrideRule',
                then: (schema: any) => schema.required('Rate value is required').typeError('Rate value must be a number'),
                otherwise: (schema: any) => schema.notRequired(),
            }),
        }),
        onSubmit: (values: any) => {
            // Convert camelCase values to snake_case
            const data = toSnakeCase(values);
            dispatch(onEditTaxRule(data));
            navigate('/tax-rules');
        },
    });

    const { availableSubTaxTypes, availableRateTypes, availablejurisdictionValues,
        disableJurisdiction, handleTaxTypeChange, handleSubTaxTypeChange, handleRateTypeChange} = useTaxTypeHandler(formik);

    // Using useEffect hook to monitor taxType and subTaxType changes
    useEffect(() => {
        if (formik.values.taxType) {
            handleTaxTypeChange(formik.values.taxType);
        }
    }, [formik.values.taxType, formik.setFieldValue]);

    useEffect(() => {
        if (formik.values.taxType || formik.values.taxSubType) {
            handleSubTaxTypeChange(formik.values.taxType, formik.values.taxSubType);
        }
    }, [formik.values.taxType, formik.values.taxSubType]);

    useEffect(() => {
        if (formik.values.taxType || formik.values.taxSubType || formik.values.rateType) {
            handleRateTypeChange(formik.values.taxType, formik.values.taxSubType, formik.values.rateType);
        }
    }, [formik.values.taxType, formik.values.taxSubType, formik.values.rateType]);
    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb pageTitle="Edit custom rule" title="Edit custom rule" />
                    <Card>
                        <Card.Body>
                            <div className="p-2">
                                <b>
                                    Once you save your new custom tax rule, it applies to future transactions according to the criteria you set here
                                </b>

                                <Form onSubmit={formik.handleSubmit}>
                                    <Row>
                                        <Col xl={6}>
                                            <div className="mb-3 mt-4">
                                                <Form.Label htmlFor="name">
                                                    NAME
                                                    <span className="text-danger">*</span>
                                                </Form.Label>
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
                                                    {formik.errors.name ? String(formik.errors.name) : ''}
                                                </Form.Control.Feedback>
                                            </div>
                                        </Col>

                                        <Col xl={3}>
                                            <div className="mb-3 mt-4">
                                                <Form.Label htmlFor="effectiveDate">
                                                    EFFECTIVE
                                                    <span className="text-danger">*</span>
                                                </Form.Label>
                                                <Form.Control
                                                    id="effectiveDate"
                                                    name="effectiveDate"
                                                    type="date"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.effectiveDate}
                                                    isInvalid={formik.touched.effectiveDate && !!formik.errors.effectiveDate}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.effectiveDate ? String(formik.errors.effectiveDate) : ''}
                                                </Form.Control.Feedback>
                                            </div>
                                        </Col>
                                        <Col xl={3}>
                                            <div className="mb-3 mt-4">
                                                <Form.Label htmlFor="expirationDate">
                                                    EXPIRATION
                                                </Form.Label>
                                                <input
                                                    id="expirationDate"
                                                    name="expirationDate"
                                                    type="date"
                                                    className="form-control"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.expirationDate}
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col xl={12}>
                                            <div className="mb-3 mt-4">
                                                <h3>
                                                    What would you like to create?
                                                </h3>

                                                <Form.Group className="mt-3">
                                                    <Form.Label htmlFor='ruleType'>RULE TYPE<span className="text-danger">*</span></Form.Label>
                                                    <Form.Control
                                                        as="select"
                                                        id="ruleType"
                                                        name="ruleType"
                                                        onChange={formik.handleChange}
                                                        onBlur={formik.handleBlur}
                                                        value={formik.values.ruleType}
                                                        isInvalid={formik.touched.ruleType && !!formik.errors.ruleType}
                                                    >
                                                        <option value="">Select Rule Type</option>
                                                        <option value="productTaxabilityRule">Product Taxability Rule</option>
                                                        <option value="exemptEntityRule">Exempt Entity Rule</option>
                                                        <option value="rateOverrideRule">Rate Override Rule</option>
                                                        <option value="baseOverrideRule">Base Override Rule</option>
                                                    </Form.Control>
                                                    <Form.Control.Feedback type="invalid">
                                                        {formik.errors.ruleType ? String(formik.errors.ruleType) : ''}
                                                    </Form.Control.Feedback>
                                                </Form.Group>
                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="mb-3 mt-4">
                                        {/* Applicability Section */}
                                        <Col md={6}>
                                            <h4><b>1. Applicability Test :</b></h4>
                                            <p>This rule will apply to transactions with these criteria you select</p>

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor='country'>COUNTRY<span className="text-danger">*</span></Form.Label>
                                                <Form.Control id="country" name="country" onChange={formik.handleChange}
                                                    as="select"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.country}
                                                    isInvalid={formik.touched.country && !!formik.errors.country}>
                                                    <option value="">Select a country</option>
                                                    <option value="US">United States</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.country ? String(formik.errors.country) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor="taxType">TAX TYPE<span className="text-danger">*</span></Form.Label>
                                                <Form.Control id="taxType"
                                                    name="taxType"
                                                    onChange={(e:any) => {
                                                        formik.handleChange(e); // Update formik value
                                                        handleTaxTypeChange(e.target.value); // Update sub-tax type logic
                                                    }}
                                                    as="select"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.taxType}
                                                    isInvalid={formik.touched.taxType && !!formik.errors.taxType}>
                                                    <option value="">Select a tax type</option>
                                                    <option value="Consumer Use">Consumer Use</option>
                                                    <option value="Rent To Own">Rent to Own</option>
                                                    <option value="Sales">Sales</option>
                                                    <option value="All">Sales and Use</option>
                                                    <option value="Use">Use</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.taxType ? String(formik.errors.taxType) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>


                                            {
                                                formik.values.ruleType !== "baseOverrideRule" && (
                                                    <>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label htmlFor='taxSubType'>TAX SUBE TYPE{formik.values.taxType !== "All" && <span className="text-danger">*</span>}</Form.Label>
                                                            <Form.Control as="select"
                                                                id="taxSubType"
                                                                name="taxSubType"
                                                                onChange={(e:any) => {
                                                                    formik.handleChange(e); // Update formik value
                                                                    handleSubTaxTypeChange(formik.values.taxType, e.target.value); // Update sub-tax type logic
                                                                }}
                                                                onBlur={formik.handleBlur}
                                                                disabled={formik.values.taxType === "All"}
                                                                value={formik.values.taxSubType}
                                                                isInvalid={formik.touched.taxSubType && !!formik.errors.taxSubType}
                                                                style={{
                                                                    backgroundColor: formik.values.taxType === "All" ? "#f0f0f0" : "",
                                                                    cursor: formik.values.taxType === "All" ? "not-allowed" : "auto",
                                                                }}

                                                            >
                                                             
                                                                {availableSubTaxTypes.map((subType) => (
                                                                    <option key={subType.value} value={subType.value}>
                                                                        {subType.label}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                            {formik.touched.taxSubType && formik.errors.taxSubType && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {formik.errors.taxSubType ? String(formik.errors.taxSubType) : ''}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Form.Group>
                                                    </>
                                                )
                                            }

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor='rateType'>RATE TYPE<span className="text-danger">*</span></Form.Label>
                                                <Form.Control as="select"
                                                    id="rateType"
                                                    name="rateType"
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.rateType}
                                                    isInvalid={formik.touched.rateType && !!formik.errors.rateType}
                                                    onChange={(e:any) => {
                                                        formik.handleChange(e);
                                                        handleRateTypeChange(formik.values.taxType, formik.values.taxSubType, e.target.value);
                                                    }}
                                                >
                                                    <option>Select a rate type</option>
                                                    {availableRateTypes.map((rateType) => (
                                                        <option key={rateType.value} value={rateType.value}>
                                                            {rateType.label}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.rateType ? String(formik.errors.rateType) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>


                                            {
                                                formik.values.ruleType !== "baseOverrideRule" && (
                                                    <>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label htmlFor="jurisdictionType">
                                                                JURISDICTION TYPE<span className="text-danger">*</span>
                                                            </Form.Label>
                                                            <Form.Control
                                                                as="select"
                                                                id="jurisdictionType"
                                                                name="jurisdictionType"
                                                                onChange={formik.handleChange}
                                                                onBlur={formik.handleBlur}
                                                                value={formik.values.jurisdictionType}
                                                                isInvalid={formik.touched.jurisdictionType && !!formik.errors.jurisdictionType}
                                                            >
                                                                <option>select jurisdiction</option>
                                                                {availablejurisdictionValues.map((jurisType) => (
                                                                    <option key={jurisType.value} value={jurisType.value}>
                                                                        {jurisType.label}
                                                                    </option>

                                                                ))}
                                                            </Form.Control>
                                                            <Form.Control.Feedback type="invalid">
                                                                {formik.errors.jurisdictionType ? String(formik.errors.jurisdictionType) : ""}
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                    </>
                                                )
                                            }

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor='region'>REGION<span className="text-danger">*</span></Form.Label>
                                                <Form.Control as="select"
                                                    id="region"
                                                    name="region"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.region}
                                                    isInvalid={formik.touched.region && !!formik.errors.region}
                                                >
                                                    <option>Select a region</option>
                                                    {/* {availableRegionValues.map((regType) => (
                                                        <option key={regType.value} value={regType.value}>
                                                            {regType.label}
                                                        </option>

                                                    ))} */}
                                                    {countryData.USA.map((region: string) => (
                                                        <option key={region} value={region}>
                                                            {region}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.region ? String(formik.errors.region) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor='jurisdictionName'>JURISDICTION<span className="text-danger">*</span></Form.Label>
                                                <Form.Control as="select" id="jurisdictionName"
                                                    name="jurisdictionName"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.jurisdictionName}
                                                    isInvalid={formik.touched.jurisdictionName && !!formik.errors.jurisdictionName}
                                                    disabled={disableJurisdiction}
                                                    style={{
                                                        backgroundColor: disableJurisdiction ? "#f0f0f0" : "", // Optional: visually indicate it's disabled
                                                        cursor: disableJurisdiction ? "not-allowed" : "auto", // Optional: change cursor
                                                    }}
                                                >
                                                    <option value="">Select a jurisdiction</option>
                                                    <option value="Alameda">Alameda</option>
                                                    <option value="Alphine">Alpine</option>
                                                    <option value="Amador">Amador</option>
                                                </Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.jurisdictionName ? String(formik.errors.jurisdictionName) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            {
                                                formik.values.ruleType === "rateOverrideRule" && (
                                                    <>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label htmlFor="unitOfBasis">UNIT OF BASIS</Form.Label>
                                                            <Form.Control as="select" name="unitOfBasis" id="unitOfBasis"
                                                                disabled={disableJurisdiction}
                                                                style={{
                                                                    backgroundColor: disableJurisdiction ? "#f0f0f0" : "", // Optional: visually indicate it's disabled
                                                                    cursor: disableJurisdiction ? "not-allowed" : "auto", // Optional: change cursor
                                                                }}
                                                            >
                                                                <option>Select a unit of Basis</option>
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </>
                                                )
                                            }

                                            {
                                                formik.values.ruleType !== "baseOverrideRule" && (
                                                    <>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label htmlFor='entityUseCode'>ENTITY USE CODE</Form.Label>
                                                            <Form.Control as="select" name="entityUseCode" id="entityUseCode">
                                                                <option value="none">None</option>
                                                                {entityUseCodes.map((company) => (
                                                                    <option key={company.value} value={company.name}>
                                                                        {company.name}
                                                                    </option>
                                                                ))}
                                                            </Form.Control>
                                                        </Form.Group>
                                                    </>
                                                )
                                            }

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor='taxCode'>TAX CODE<span className="text-danger">*</span></Form.Label>
                                                <p>Assign the appropriate tax code for this</p>
                                                <Form.Control
                                                    id="taxCode"
                                                    name="taxCode"
                                                    type="text"
                                                    placeholder="Type a tax code to see its description"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.taxCode}
                                                    isInvalid={formik.touched.taxCode && !!formik.errors.taxCode}
                                                />
                                                <Form.Control.Feedback type="invalid">
                                                    {formik.errors.taxCode ? String(formik.errors.taxCode) : ''}
                                                </Form.Control.Feedback>
                                            </Form.Group>

                                            <Form.Group className="mb-3">
                                                <Form.Label htmlFor='tariffCode'>TARIFF CODE</Form.Label>
                                                <Form.Control
                                                    id="tariffCode"
                                                    name="tariffCode"
                                                    type="text"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.tariffCode}
                                                    placeholder="Enter tariff code"
                                                />
                                            </Form.Group>

                                        </Col>

                                        <Col style={{ padding: "0px 0px 0px 0px", margin: "0px 0px 0px 0px" }}>
                                            <div className="vertical-line" style={{
                                                width: "0.5px", backgroundColor: "black", padding: "0px", margin: "0px", height: "100%",
                                                alignSelf: "stretch"
                                            }}></div>
                                        </Col>

                                        <Col md={5}>
                                            <h4><b>2. Tax Treatment :</b></h4>

                                            {
                                                formik.values.ruleType === "productTaxabilityRule" && (
                                                    <>
                                                        <Form.Check
                                                            type="radio"
                                                            label="Non-Taxable"
                                                            name="taxTreatment"
                                                            value="non-taxable"
                                                            onChange={formik.handleChange}
                                                            checked={formik.values.taxTreatment === 'non-taxable'}
                                                        />

                                                        <Form.Check
                                                            type="radio"
                                                            label="Taxable"
                                                            name="taxTreatment"
                                                            value="taxable"
                                                            onChange={formik.handleChange}
                                                            checked={formik.values.taxTreatment === 'taxable'}
                                                        />

                                                        {formik.values.taxTreatment === 'taxable' && (
                                                            <div className="mt-3" style={{ marginTop: "2rem" }}>
                                                                <Form.Group className="mb-4">
                                                                    <Form.Label htmlFor="specialHandling">
                                                                        SPECIAL HANDLING
                                                                    </Form.Label>
                                                                    <Form.Control
                                                                        as="select"
                                                                        id="specialHandling"
                                                                        name="specialHandling"
                                                                        onChange={formik.handleChange}
                                                                        value={formik.values.specialHandling}
                                                                    >
                                                                        <option value="none">None</option>
                                                                        <option value="setACap">Set a cap</option>
                                                                        <option value="setAThreshold">Set a threshold</option>
                                                                    </Form.Control>
                                                                </Form.Group>

                                                            </div>
                                                        )}
                                                        {formik.values.specialHandling === "setACap" && (
                                                            <div>
                                                                {/* CAP VALUE */}
                                                                <Form.Group className="mb-4">
                                                                    <Form.Label htmlFor="cap">CAP VALUE<span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <p style={{ fontSize: "16px" }}>Enter a cap amount and how you want it to be applied</p>
                                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="cap"
                                                                            onChange={formik.handleChange}
                                                                            value={formik.values.cap}
                                                                        />
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="capAppliedValue"
                                                                            onChange={formik.handleChange}
                                                                            value={formik.values.capAppliedValue}
                                                                        />
                                                                    </div>
                                                                </Form.Group>

                                                                {/* Advanced Cap Options */}
                                                                <div>
                                                                    <Button
                                                                        variant="link"
                                                                        onClick={() => toggleOption("showCapOptions")}
                                                                        className="mb-2"
                                                                    >
                                                                        Advanced cap options
                                                                    </Button>

                                                                    {showOptions.showCapOptions && (
                                                                        <div>
                                                                            <h5 className="mt-2 mb-3">OPTIONS</h5>
                                                                            <Form.Check
                                                                                type="radio"
                                                                                label="Cap taxable amount at the document level"
                                                                                name="capOption"
                                                                                value="documentLevel"
                                                                                onChange={formik.handleChange}
                                                                                checked={formik.values.capOption === "documentLevel"}
                                                                            />
                                                                            <Form.Check
                                                                                type="radio"
                                                                                label="Limit the tax of the line to the cap amount"
                                                                                name="capOption"
                                                                                value="limitTax"
                                                                                onChange={formik.handleChange}
                                                                                checked={formik.values.capOption === "limitTax"}
                                                                            />
                                                                            <Form.Check
                                                                                type="radio"
                                                                                label="Exempt the entire amount after the cap is met"
                                                                                name="capOption"
                                                                                value="exemptAfterCap"
                                                                                onChange={formik.handleChange}
                                                                                checked={formik.values.capOption === "exemptAfterCap"}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        {formik.values.specialHandling === "setAThreshold" && (
                                                            <div>
                                                                {/* Threshold Value */}
                                                                <Form.Group className="mb-3">
                                                                    <Form.Label htmlFor="thresholdValue">
                                                                        THRESHOLD VALUE <span className="text-danger">*</span>
                                                                    </Form.Label>
                                                                    <p style={{ fontSize: "16px" }}>Enter a threshold amount and how you want it to be applied</p>
                                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="threshold"
                                                                            onChange={formik.handleChange}
                                                                            value={formik.values.threshold}
                                                                        />
                                                                        <Form.Control
                                                                            type="number"
                                                                            name="thresholdAppliedValue"
                                                                            onChange={formik.handleChange}
                                                                            value={formik.values.thresholdAppliedValue}
                                                                        />
                                                                    </div>
                                                                </Form.Group>

                                                                {/* Advanced Threshold Options */}
                                                                <div>
                                                                    <Button
                                                                        variant="link"
                                                                        onClick={() => toggleOption("showIsAllJuris")}
                                                                        className="mb-2"
                                                                    >
                                                                        Advanced threshold options
                                                                    </Button>

                                                                    {showOptions.showThresholdOptions && (
                                                                        <div>
                                                                            <Form.Check
                                                                                type="checkbox"
                                                                                label="Tax the entire amount if threshold met"
                                                                                name="taxEntireAmount"
                                                                                onChange={formik.handleChange}
                                                                                checked={formik.values.taxEntireAmount}
                                                                            />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        )}

                                                        <hr />
                                                        <Button variant="link"
                                                            onClick={() => toggleOption("showIsAllJuris")}
                                                            className="mt-2">
                                                            {showOptions ? "Advanced Options" : "Advanced Options"}
                                                        </Button>

                                                        {showOptions.showIsAllJuris && (
                                                            <div>
                                                                <h3 style={{ marginBottom: "1rem" }}>How do you want tax determinations to be sourced?</h3>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                                                    <Form.Check
                                                                        type="radio"
                                                                        label="System"
                                                                        name="source"
                                                                        value="system"
                                                                        onChange={formik.handleChange}
                                                                        checked={formik.values.source === "system"}
                                                                        style={{ marginRight: "0.5rem" }}
                                                                    />
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                                                    <Form.Check
                                                                        type="radio"
                                                                        label="Origin"
                                                                        name="source"
                                                                        value="origin"
                                                                        onChange={formik.handleChange}
                                                                        checked={formik.values.source === "origin"}
                                                                        style={{ marginRight: "0.5rem" }}
                                                                    />
                                                                </div>
                                                                <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                                                    <Form.Check
                                                                        type="radio"
                                                                        label="Destination"
                                                                        name="source"
                                                                        value="destination"
                                                                        onChange={formik.handleChange}
                                                                        checked={formik.values.source === "destination"}
                                                                        style={{ marginRight: "0.5rem" }}
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )
                                            }


                                            {
                                                formik.values.ruleType === "exemptEntityRule" && (
                                                    <>
                                                        <Form.Check
                                                            type="radio"
                                                            label="Exemption"
                                                            name="taxTreatment"
                                                            value="exemption"
                                                            onChange={formik.handleChange}
                                                            checked={formik.values.taxTreatment === 'exemption'}
                                                        />

                                                        <Form.Check
                                                            type="radio"
                                                            label="Taxable"
                                                            name="taxTreatment"
                                                            value="taxable"
                                                            onChange={formik.handleChange}
                                                            checked={formik.values.taxTreatment === 'taxable'}
                                                        />
                                                        <hr />
                                                        <Button variant="link"
                                                            onClick={() => toggleOption("showIsAllJuris")}
                                                            className="mt-2">
                                                            {showOptions ? "Advanced Options" : "Advanced Options"}
                                                        </Button>
                                                    </>
                                                )
                                            }
                                            {
                                                formik.values.ruleType === "rateOverrideRule" && (
                                                    <>
                                                        <p style={{ fontSize: "16px" }}>Change tax rate to a percentage you provide</p>
                                                        <div>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label htmlFor='rateValue'>Rate %<span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    id="rateValue"
                                                                    name="rateValue"
                                                                    type="number"
                                                                    value={formik.values.rateValue}
                                                                    onChange={formik.handleChange}
                                                                />
                                                            </Form.Group>
                                                        </div>
                                                        {formik.values.rateType && (
                                                            <>
                                                                <div className="mt-3" style={{ marginTop: "2rem" }}>
                                                                    <Form.Group className="mb-4">
                                                                        <Form.Label htmlFor="specialHandling">
                                                                            SPECIAL HANDLING
                                                                        </Form.Label>
                                                                        <Form.Control
                                                                            as="select"
                                                                            id="specialHandling"
                                                                            name="specialHandling"
                                                                            onChange={formik.handleChange}
                                                                            value={formik.values.specialHandling}
                                                                        >
                                                                            <option value="none">None</option>
                                                                            <option value="setACap">Set a cap</option>
                                                                            <option value="setAThreshold">Set a threshold</option>
                                                                        </Form.Control>
                                                                    </Form.Group>

                                                                </div>
                                                                {formik.values.specialHandling === "setACap" && (
                                                                    <div>
                                                                        {/* CAP VALUE */}
                                                                        <Form.Group className="mb-4">
                                                                            <Form.Label htmlFor="cap">CAP VALUE<span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <p style={{ fontSize: "16px" }}>Enter a cap amount and how you want it to be applied</p>
                                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                                <Form.Control
                                                                                    type="number"
                                                                                    name="cap"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.cap}
                                                                                />
                                                                                <Form.Control
                                                                                    type="number"
                                                                                    name="capAppliedValue"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.capAppliedValue}
                                                                                />
                                                                            </div>
                                                                        </Form.Group>

                                                                        {/* Advanced Cap Options */}
                                                                        <div>
                                                                            <Button
                                                                                variant="link"
                                                                                onClick={() => toggleOption("showCapOptions")}
                                                                                className="mb-2"
                                                                            >
                                                                                Advanced cap options
                                                                            </Button>

                                                                            {showOptions.showCapOptions && (
                                                                                <div>
                                                                                    <h5 className="mt-2 mb-3">OPTIONS</h5>
                                                                                    <Form.Check
                                                                                        type="radio"
                                                                                        label="Cap taxable amount at the document level"
                                                                                        name="capOption"
                                                                                        value="documentLevel"
                                                                                        onChange={formik.handleChange}
                                                                                        checked={formik.values.capOption === "documentLevel"}
                                                                                    />
                                                                                    <Form.Check
                                                                                        type="radio"
                                                                                        label="Limit the tax of the line to the cap amount"
                                                                                        name="capOption"
                                                                                        value="limitTax"
                                                                                        onChange={formik.handleChange}
                                                                                        checked={formik.values.capOption === "limitTax"}
                                                                                    />
                                                                                    <Form.Check
                                                                                        type="radio"
                                                                                        label="Exempt the entire amount after the cap is met"
                                                                                        name="capOption"
                                                                                        value="exemptAfterCap"
                                                                                        onChange={formik.handleChange}
                                                                                        checked={formik.values.capOption === "exemptAfterCap"}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {formik.values.specialHandling === "setAThreshold" && (
                                                                    <div>
                                                                        {/* Threshold Value */}
                                                                        <Form.Group className="mb-3">
                                                                            <Form.Label htmlFor="thresholdValue">
                                                                                THRESHOLD VALUE <span className="text-danger">*</span>
                                                                            </Form.Label>
                                                                            <p style={{ fontSize: "16px" }}>Enter a threshold amount and how you want it to be applied</p>
                                                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                                                <Form.Control
                                                                                    type="number"
                                                                                    name="threshold"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.threshold}
                                                                                />
                                                                                <Form.Control
                                                                                    type="number"
                                                                                    name="thresholdAppliedValue"
                                                                                    onChange={formik.handleChange}
                                                                                    value={formik.values.thresholdAppliedValue}
                                                                                />
                                                                            </div>
                                                                        </Form.Group>

                                                                        {/* Advanced Threshold Options */}
                                                                        <div>
                                                                            <Button
                                                                                variant="link"
                                                                                onClick={() => toggleOption("showThresholdOptions")}
                                                                                className="mb-2"
                                                                            >
                                                                                Advanced threshold options
                                                                            </Button>

                                                                            {showOptions.showThresholdOptions && (
                                                                                <div>
                                                                                    <Form.Check
                                                                                        type="checkbox"
                                                                                        label="Tax the entire amount if threshold met"
                                                                                        name="taxEntireAmount"
                                                                                        onChange={formik.handleChange}
                                                                                        checked={formik.values.taxEntireAmount}
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}

                                                        <hr />
                                                        <Button variant="link"
                                                            onClick={() => toggleOption("showIsAllJuris")}
                                                            className="mt-2">
                                                            {showOptions ? "Advanced Options" : "Advanced Options"}
                                                        </Button>
                                                    </>
                                                )
                                            }

                                            {
                                                formik.values.ruleType === "baseOverrideRule" && (
                                                    <>
                                                        <p style={{ fontSize: "16px" }}>Taxable Base using a percentage</p>
                                                        <div>
                                                            <Form.Group className="mb-3">
                                                                <Form.Label htmlFor='baseValue'>Base Override %<span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    id="baseValue"
                                                                    name="baseValue"
                                                                    type="number"
                                                                    value={formik.values.baseValue}
                                                                    onChange={formik.handleChange}
                                                                />
                                                            </Form.Group>

                                                        </div>
                                                        <hr />
                                                        <Button variant="link"
                                                            onClick={() => toggleOption("showIsAllJuris")}
                                                            className="mt-2">
                                                            {showOptions ? "Advanced Options" : "Advanced Options"}
                                                        </Button>
                                                    </>
                                                )
                                            }
                                            {showOptions.showIsAllJuris && (
                                                <div>
                                                    <div style={{ marginBottom: "2rem" }}>
                                                        <h3 style={{ marginBottom: "1rem" }}>What jurisdictions does this rule apply to?</h3>
                                                        <div style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem" }}>
                                                            <Form.Check
                                                                type="radio"
                                                                name="isAllJuris"
                                                                value="true"
                                                                label="This jurisdiction and all jurisdictions within it"
                                                                onChange={formik.handleChange}
                                                                checked={formik.values.isAllJuris === "true"}
                                                            />
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center" }}>
                                                            <Form.Check
                                                                type="radio"
                                                                label="Only this jurisdiction, not any smaller jurisdiction within it"
                                                                name="isAllJuris"
                                                                value="false"
                                                                onChange={formik.handleChange}
                                                                checked={formik.values.isAllJuris === "false"}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                        </Col>
                                    </Row>
                                    <div className="d-flex justify-content-start mt-4">
                                        <Button type="submit" variant="primary" className="me-2">
                                            Save Tax Rule
                                        </Button>
                                        <Button variant="light" onClick={() => { navigate('/tax-rules') }}>Cancel</Button>
                                    </div>
                                </Form>
                            </div>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )

}

export default EditTaxRule;