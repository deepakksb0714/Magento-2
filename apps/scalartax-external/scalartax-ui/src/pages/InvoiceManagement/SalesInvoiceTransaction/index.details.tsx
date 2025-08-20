import React from 'react';
import { Card, Col, Row, Table, Button, Badge } from 'react-bootstrap';
import { FaDollarSign, FaUser, FaCalendarAlt, FaTag, FaClipboardCheck, FaReceipt, FaPercentage, FaFileAlt } from "react-icons/fa";
import { useCustomerDetails } from '../../../Common/useTaxDetails';
import { FaPen } from "react-icons/fa";

interface TransactionDetailsProps {
    transaction: any;
    onEdit: () => void; // Function to handle cancel button click
}

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ transaction, onEdit }) => {
    const { taxCodes, customersWithCertificates } = useCustomerDetails();
    return (
        <>
            {/* Transaction Summary */}
            <Card className="mb-4 shadow-sm">
                <Card.Body>
                    <Row>
                        <Col>
                            <h4 className="mb-3 text-primary">Transaction Details</h4>
                        </Col>
                        <Col className="d-flex justify-content-end">
                            <Button variant="btn" size="sm" onClick={onEdit}>
                                <FaPen />
                            </Button>
                        </Col>
                    </Row>

                    <Row className="mb-4">
                        <Col md={12}>
                            <Card className="border rounded shadow-sm bg-white p-3">
                                <Card.Body>
                                    <h4 className="text-primary mb-3 d-flex align-items-center">
                                        <FaReceipt className="me-2" /> Summary
                                    </h4>

                                    <Row className="g-3"> {/* Ensures proper spacing */}
                                        {/* Code */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaTag className="me-2 text-primary" /> <strong className="w-50"> Code:</strong> {transaction.code}
                                            </div>
                                        </Col>

                                        {/* Date */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaCalendarAlt className="me-2 text-primary" /> <strong className="w-50"> Date:</strong> {transaction.date}
                                            </div>
                                        </Col>

                                        {/* Type */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaClipboardCheck className="me-2 text-primary" /> <strong className="w-50"> Type:</strong> {transaction.transaction_type}
                                            </div>
                                        </Col>

                                        {/* Status */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaClipboardCheck className="me-2 text-primary" />
                                                <strong className="w-50"> Status:</strong>
                                                <Badge
                                                    className={`ms-0 ${transaction.status === "committed" ? "bg-success" :
                                                        transaction.status === "uncommitted" ? "bg-danger" :
                                                            transaction.status === "voided" ? "bg-warning" :
                                                                "bg-secondary"
                                                        } text-white`}
                                                >
                                                    {transaction.status}
                                                </Badge>

                                            </div>
                                        </Col>

                                        {/* Customer Code */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaUser className="me-2 text-primary" />
                                                <strong className="w-50"> Customer Code:</strong>
                                                {transaction?.customer_id && (() => {
                                                    const matchedCustomer = customersWithCertificates?.find(
                                                        customer => customer.id === transaction.customer_id
                                                    );
                                                    return matchedCustomer ? matchedCustomer.customer_code : "-";
                                                })()}
                                            </div>
                                        </Col>

                                        {/* Entity Use Code */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaClipboardCheck className="me-2 text-primary" /> <strong className="w-50"> Entity Use Code:</strong> {transaction.entity_use_code || '-'}
                                            </div>
                                        </Col>

                                        {/* Total Amount */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaDollarSign className="me-2 text-primary" /> <strong className="w-50"> Total Amount:</strong> ${transaction.total_amount}
                                            </div>
                                        </Col>

                                        {/* Total Tax */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaPercentage className="me-2 text-primary" /> <strong className="w-50"> Total Tax:</strong> ${transaction.total_tax}
                                            </div>
                                        </Col>

                                        {/* Taxable Amount */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaPercentage className="me-2 text-primary" /> <strong className="w-50"> Taxable Amount:</strong> ${transaction.total_taxable}
                                            </div>
                                        </Col>

                                        {/* Exempt Amount */}
                                        <Col md={4}>
                                            <div className="py-2 px-2 bg-light rounded d-flex align-items-center">
                                                <FaPercentage className="me-2 text-primary" /> <strong className="w-50"> Exempt Amount:</strong> ${transaction.total_exempt}
                                            </div>
                                        </Col>
                                    </Row>

                                    {/* Description Section (If Available) */}
                                    {transaction.description && (
                                        <div className="mt-4 p-3 bg-light rounded">
                                            <h5 className="text-secondary d-flex align-items-center">
                                                <FaFileAlt className="me-2" /> Description
                                            </h5>
                                            <p className="mb-0">{transaction.description}</p>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                </Card.Body>
            </Card>

            {/* Address Details */}
            <Row>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h5 >Origin Address</h5>
                            <p>{transaction.origin_address?.address_line1}, {transaction.origin_address?.city}, {transaction.origin_address?.region}, {transaction.origin_address?.country}, {transaction.origin_address?.postal_code}</p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card className="mb-4 shadow-sm">
                        <Card.Body>
                            <h5 >Destination Address</h5>
                            <p>{transaction.destination_address?.address_line1}, {transaction.destination_address?.city}, {transaction.destination_address?.region}, {transaction.destination_address?.country}, {transaction.destination_address?.postal_code}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Line Items Table */}
            <Card className="shadow-sm">
                <Card.Body>
                    <h4 className="mb-3 text-info">Line Items</h4>
                    <Table bordered striped hover responsive>
                        <thead >
                            <tr>
                                <th className="text-center">Line No</th>
                                <th className="text-center">Item Code</th>
                                <th className="text-center">Tax Code</th>
                                <th className="text-center">Line Amount ($)</th>
                                <th className="text-center">Tax ($)</th>
                                <th className="text-center">Taxable Amount ($)</th>
                                <th className="text-center">Exempt Amount ($)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transaction?.line_items?.map((item: any) => (
                                <tr key={item.id}>
                                    <td className="text-center">{item.line_number}</td>
                                    <td className="text-center">{item.item_code}</td>
                                    <td className="text-center">{item.tax_code || '-'}</td>
                                    <td className="text-center">${item.line_amount}</td>
                                    <td className="text-center">${item.tax}</td>
                                    <td className="text-center">${item.taxable_amount}</td>
                                    <td className="text-center">${item.exempt_amount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>
        </>
    );
};

export default TransactionDetails;
