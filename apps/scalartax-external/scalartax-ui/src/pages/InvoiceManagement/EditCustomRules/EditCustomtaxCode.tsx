import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Button, Modal, Container } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import { useNavigate, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { editCustomTaxCode as onEditCustomTaxCode } from '../../../slices/thunk';


const EditCustomTaxCode = () => {

    document.title = 'EDIT CUSTOM TAX CODE  | Dashboard';

    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { rowData } = location.state || {};

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
            entity_id: rowData?.entity_id || '',
            taxCodeType: rowData?.tax_code_type || '',
            code: rowData?.code || '',
            description: rowData?.description || ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            code: Yup.string().required("Code is required."),
        }),
        onSubmit: (values: any) => {
            const data= toSnakeCase(values);
            
            dispatch(onEditCustomTaxCode(data));
            navigate("/tax-rules", { state: { targetTab: "Custom tax codes" } });
        },
    });


    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb pageTitle="Edit custom tax code" title="Edit custom tax code" />
                    <Card>
                        <Card.Body>
                            <div className="p-2">
                                Use a custom tax code for your item when Scalarhub does not provide the Scalarhub tax code you need. Custom tax codes can then be associated with custom tax rules in order to change the taxability or tax rate of your item.
                            </div>

                            <Form onSubmit={formik.handleSubmit}>
                                <Row>
                                    <Col xl={8}>
                                        <div className="mt-4">
                                            <Form.Group className="mt-3">
                                                <Form.Label htmlFor="type">TYPE</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    id="type"
                                                    name="taxCodeType"
                                                    onChange={formik.handleChange}
                                                    onBlur={formik.handleBlur}
                                                    value={formik.values.taxCodeType}
                                                >
                                                    <option value="digital">Digital</option>
                                                    <option value="freight">freight</option>
                                                    <option value="other">Other</option>
                                                    <option value="product">Product</option>
                                                    <option value="service">Service</option>
                                                    <option value="unknown">Unknown</option>
                                                </Form.Control>

                                            </Form.Group>

                                        </div>
                                    </Col>
                                    <Col xl={8}>
                                        <div className="mt-4">
                                            <Form.Label htmlFor="code">
                                                CODE
                                                <span className="text-danger">*</span>
                                            </Form.Label>
                                            <input
                                                id="code"
                                                name="code"
                                                type="text"
                                                className="form-control"
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.code}
                                            />
                                            {formik.errors.code && formik.touched.code ? (
                                                <div className="text-danger">{formik.errors.code ? String(formik.errors.code) : ''}</div>
                                            ) : null}
                                        </div>
                                    </Col>
                                    <Col xl={8}>
                                        <div className="mt-4">
                                            <Form.Label htmlFor="description">
                                                Description of custom tax code
                                            </Form.Label>
                                            <textarea
                                                id="description"
                                                name="description"
                                                className="form-control"
                                                style={{ height: "100px" }}
                                                onChange={formik.handleChange}
                                                onBlur={formik.handleBlur}
                                                value={formik.values.description}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-start mt-4">
                                    <Button type="submit" variant="primary" className="me-2">
                                        Save Custom tax code
                                    </Button>
                                    <Button
                                        variant="light"
                                        onClick={() => {
                                            navigate("/tax-rules", { state: { targetTab: "Custom tax codes" } });
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default EditCustomTaxCode;