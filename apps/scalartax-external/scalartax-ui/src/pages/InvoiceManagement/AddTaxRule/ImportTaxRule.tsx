import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import Dropzone, { DropzoneState } from 'react-dropzone';
import { useNavigate, Link } from 'react-router-dom'
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import * as XLSX from 'xlsx';
import { createSelector } from 'reselect';
import { importTaxRule as onImportTaxRule } from '../../../slices/thunk';

const convertExcelDate = (serial: any) => {
    const utcDays = serial - 25567;
    const date = new Date(utcDays * 86400 * 1000);
    return date.toISOString().split('T')[0];
};

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

const ImportTaxRules = () => {
    document.title = 'IMPORT TAX RULE  | Dashboard';

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [validationErrors, setValidationErrors] = useState<string[]>([]);

    const formik = useFormik({
        initialValues: {
            description: '',
            files: [] as any[],
        },
        validationSchema: Yup.object({
            files: Yup.array().of(
                Yup.mixed().test('fileType', 'File must be an object', (value: any) => {
                    return value && typeof value === 'object';
                })
            ),
        }),

        onSubmit: (values: any) => {
            const errors: string[] = [];
            const transformedRules: any[] = [];

            selectedFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const data = new Uint8Array(e.target?.result as ArrayBuffer);
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    // Remove the header row
                    const [header, ...rows] = jsonData;

                    rows.forEach((row: any) => {
                        if (row.length >= 15) {
                            const rule = {
                                name: row[0] || '',
                                entityId: row[1] || '',
                                effectiveDate: convertExcelDate(row[2]) || '',
                                expirationDate: convertExcelDate(row[3]) || '',
                                ruleType: row[4] || '',
                                country: row[5] || '',
                                taxType: row[6] || '',
                                taxSubType: row[7] || '',
                                rateType: row[8] || '',
                                jurisdictionType: row[9] || '',
                                region: row[10] || '',
                                jurisdictionName: row[11] || '',
                                entityUseCode: row[12] || 'none',
                                taxCode: row[13] || '',
                                tariffCode: row[14] || '',
                                jurisdictionsRule: row[15] || '',
                                source: row[16] || '',
                                isAllJuris: row[17] || false,
                                cap: row[18] || '',
                                capAppliedValue: row[19] || '',
                                capOption: row[20] || '',
                                threshold: row[21] || '',
                                thresholdAppliedValue: row[22] || '',
                                taxEntireAmount: row[23] || false,
                            };

                            transformedRules.push(rule);

                            if (!row[0])
                                errors.push(
                                    `Row ${rows.indexOf(row) + 2}: Name is required`
                                );
                            if (!row[1])
                                errors.push(
                                    `Row ${rows.indexOf(row) + 2}: Entity id is required`
                                );
                            if (!row[2])
                                errors.push(
                                    `Row ${rows.indexOf(row) + 2}: Effective Date is required`
                                );
                            if (!row[3])
                                errors.push(
                                    `Row ${rows.indexOf(row) + 2}: Rule Type is required`
                                );
                        } else {
                            errors.push(`Row ${rows.indexOf(row) + 2}: Missing data`);
                        }
                    });
                    setValidationErrors(errors);
                    const importData = {
                        tax_rules: toSnakeCase(transformedRules)
                    }
                    dispatch(onImportTaxRule(importData));
                    navigate("/tax-rules", { state: { targetTab: "Tax rules" } });
                };

                reader.readAsArrayBuffer(file);
            });
        },
    });

    const handleAcceptedFiles = (files: any) => {
        const file = files[0];
        setValidationErrors([]);

        files.map((file: any) =>
            Object.assign(file, {
                preview: URL.createObjectURL(file),
                formattedSize: formatBytes(file.size),
            })
        );
        setSelectedFiles(files);
        formik.setFieldValue('files', files);
    };

    const formatBytes = (bytes: any, decimals = 2) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    };

    const handleDiscard = () => {
        setSelectedFiles([]);
        setValidationErrors([]);
        formik.setFieldValue('files', []);
    };

    return (
        <React.Fragment>
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb pageTitle="Tax Rule " title="Import Tax Rule " />
                    <Card>
                        <Card.Body>
                            <div>
                                <h1>Import Tax Rule</h1>
                            </div>
                            <Row className="mt-3">
                                <Col md={12}>
                                    <Form.Label>
                                        For best results and fewer errors, use the template in
                                        our TaxRuleImportToolkit
                                    </Form.Label>
                                </Col>
                            </Row>

                            <Form onSubmit={formik.handleSubmit}>
                                <a href="/ImportTaxRulesTemplate-CrossBorder.xlsx" download>
                                    Download the TaxRule import toolkit
                                </a>

                                <Dropzone
                                    onDrop={(acceptedFiles: any) =>
                                        handleAcceptedFiles(acceptedFiles)
                                    }
                                >
                                    {({ getRootProps, getInputProps }: any) => (
                                        <div
                                            className="dropzone dz-clickable text-center"
                                            {...getRootProps()}
                                        >
                                            <input {...getInputProps()} />
                                            <div className="dz-message needsclick">
                                                <div className="mb-3">
                                                    <i className="display-4 text-muted ri-upload-cloud-2-fill" />
                                                </div>
                                                <h4>Drag and drop</h4>
                                                <h4>Upload your .csv, .xls, or .xlsx file</h4>
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>

                                {formik.errors.files && formik.touched.files ? (
                                    <div className="text-danger">{formik.errors.files}</div>
                                ) : null}

                                <div className="list-unstyled mb-0" id="file-previews">
                                    {selectedFiles.map((f: any, i: number) => (
                                        <Card
                                            className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
                                            key={i + '-file'}
                                        >
                                            <div className="p-2">
                                                <Row className="align-items-center">
                                                    <Col className="col-auto">
                                                        <img
                                                            data-dz-thumbnail=""
                                                            height="80"
                                                            className="avatar-sm rounded bg-light"
                                                            alt={f.name}
                                                            src={f.preview}
                                                        />
                                                    </Col>
                                                    <Col>
                                                        <Link
                                                            to="#"
                                                            className="text-muted font-weight-bold"
                                                        >
                                                            {f.name}
                                                        </Link>
                                                        <p className="mb-0">
                                                            <strong>{f.formattedSize}</strong>
                                                        </p>
                                                    </Col>
                                                </Row>
                                            </div>
                                        </Card>
                                    ))}
                                </div>
                                {validationErrors.length > 0 && (
                                    <div className="alert alert-danger mt-4">
                                        <ul>
                                            {validationErrors.map((error, index) => (
                                                <li key={index}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="hstack gap-2 mt-4">
                                    <button
                                        type="button"
                                        className="btn btn-light gap-2"
                                        onClick={() => window.history.back()}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Submit
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-light gap-2"
                                        onClick={() => handleDiscard()}
                                    >
                                        Discard
                                    </button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Container>
            </div>
        </React.Fragment>
    )
}

export default ImportTaxRules;