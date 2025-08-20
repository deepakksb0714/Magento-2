import React, { useState } from 'react';
import { Table, Card, Button, Pagination, Spinner } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import SalesTaxDocumentDetail from './SalesTaxDocumentDetail';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface SelectedDocument {
  documentCode: string;
  documentData: ReportData[];
}

export type ReportData = {
  id: string;
  product_id?: string;
  account_id?: string;
  entity_id?: string;
  customer_id?: string;
  origin_address_id?: string;
  destination_address_id?: string;
  code: string;
  transaction_type: string;
  date: string;
  status: string;
  customer_code: string; // Mandatory based on transform function
  vendor_code?: string;
  total_discount: number;
  exchange_rate_currency_code?: string;
  location_code?: string;
  entity_use_code?: string;
  exempt_no?: string;
  customer_vat_number?: string;
  vendor_vat_number?: string;
  description?: string;
  reconciled?: boolean;
  sales_person_code?: string;
  tax_override_type?: string;
  tax_override_amount?: number;
  tax_override_reason?: string;
  total_amount: number;
  total_discount_amount?: number;
  total_exempt: number;
  total_tax: number;
  total_taxable: number;
  total_tax_calculated?: number;
  adjustment_reason?: string;
  adjustment_description?: string;
  locked?: boolean;
  region: string; // Mandatory based on transform function
  country: string; // Mandatory based on transform function
  version?: string;
  exchange_rate_effective_date?: string;
  exchange_rate?: number;
  is_seller_importer_of_record?: boolean;
  tax_date?: string;
  created_by_id?: string;
  updated_by_id?: string;
  created_at: string;
  updated_at: string;
  currency_code?: string;

  destination_address: {
    street: string;
    street2: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
  };

  origin_address: {
    street: string;
    street2: string;
    city: string;
    region: string;
    country: string;
    postal_code: string;
  };

  // Line item details
  line_items: {
    item_code: string;
    tax_code: string;
    line_number: number;
    quantity: number;
    line_amount: number;
    tax: number;
    taxable_amount: number;
    discount_amount: number;
    destination_address: {
      street: string;
      street2: string;
      city: string;
      region: string;
      country: string;
      postal_code: string;
    };
    origin_address: {
      street: string;
      street2: string;
      city: string;
      region: string;
      country: string;
      postal_code: string;
    };
  }[];

  internal_addresses?: {
    street?: string;
    street2?: string;
    city?: string;
    region?: string;
    country?: string;
    postal_code?: string;
  };
};

interface SalesTransactionReportProps {
  reportData: ReportData[];
  loading: boolean;
  onBackClick: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  reportName: string;
  entity: string;
  date_type: string;
  status: string;
  reason: string;
  document_code: string;
  date_option: string;
  custom_date_from: string;
  custom_date_to: string;
}

const SalesTransactionReport: React.FC<SalesTransactionReportProps> = ({
  reportData,
  loading,
  onBackClick,
  currentPage,
  totalPages,
  onPageChange,
  reportName,
  entity,
  date_type,
  status,
  reason,
  document_code,
  date_option,
  custom_date_from,
  custom_date_to,
}) => {
  const [sortColumn, setSortColumn] = useState<keyof ReportData | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedDocument, setSelectedDocument] =
    useState<SelectedDocument | null>(null);

  // Update the handleDocumentClick function
  const handleDocumentClick = (documentCode: string) => {
    const documentData = reportData.filter((row) => row.code === documentCode);
    if (documentData.length > 0) {
      setSelectedDocument({
        documentCode,
        documentData: reportData,
      });
    }
  };

  // Add a handler to return to the main view
  const handleBackToList = () => {
    setSelectedDocument(null);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatDateWithTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getPeriodDateRange = (period: string) => {
    const now = new Date();

    if (period === 'previous_month') {
      // Set the date to the first day of the previous month
      now.setMonth(now.getMonth() - 1);
      now.setDate(1);
      const startDate = new Date(now);
      now.setMonth(now.getMonth() + 1);
      now.setDate(0);
      const endDate = new Date(now);

      return `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`;
    }

    if (period === 'other_range') {
      // When period is 'other_range', use custom date range
      const startDate = new Date(custom_date_from);
      const endDate = new Date(custom_date_to);

      return `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`;
    }

    // Default case for 'current_month'
    now.setDate(1); // Set to the first day of the current month
    const startOfCurrentMonth = new Date(now);
    now.setMonth(now.getMonth() + 1);
    now.setDate(0);
    const endOfCurrentMonth = new Date(now);

    return `${formatDate(startOfCurrentMonth.toISOString())} - ${formatDate(endOfCurrentMonth.toISOString())}`;
  };

  const createdAt =
    reportData.length > 0
      ? formatDateWithTime(reportData[0].created_at)
      : 'N/A';
  const handlePrint = () => {
    const printContent = document.createElement('div');
    const period =
      date_option === 'other_range'
        ? `${formatDate(custom_date_from)} - ${formatDate(custom_date_to)}`
        : getPeriodDateRange(date_option);

    printContent.innerHTML = `
      <html>
        <head>
          <title>${reportName}</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .text-end { text-align: right; }
            h1 { font-size: 24px; margin-bottom: 20px; }
            h3 { text-align: center; margin-top: 0; }
          </style>
        </head>
        <body>
          <h1>${reportName}</h1>
          <table border="1" cellspacing="0" cellpadding="8">
            <tr>
              <td><strong>Entities:</strong></td>
              <td colspan="3">${entity}</td>
            </tr>
            <tr>
              <td><strong>Period:</strong></td>
              <td colspan="3">${period}</td>
            </tr>
            <tr>
              <td><strong>Date Type:</strong></td>
              <td colspan="3">${date_type}</td>
            </tr>
            <tr>
              <td><strong>Document Status:</strong></td>
              <td colspan="3">${status}</td>
            </tr>
            <tr>
              <td><strong>Country:</strong></td>
              <td colspan="3">UNITED STATES OF AMERICA</td>
            </tr>
            <tr>
              <td><strong>State/Province:</strong></td>
              <td colspan="3">${reason}</td>
            </tr>
            <tr>
              <td><strong>Document Code:</strong></td>
              <td colspan="3">${document_code}</td>
            </tr>
            <tr>
              <td><strong>Report Date:</strong></td>
              <td colspan="3">${createdAt}</td>
            </tr>
          </table>
  
          <table>
            <thead>
              <tr>
                <th>Document Code Count</th>
                <th>Total Amount</th>
                <th>Tax Amount</th>
                <th>Taxable Amount</th>
                <th>Exempt Amount/Non Taxable</th>
                <th>Discount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>${reportData.length}</td>
                <td class="text-end">${formatCurrency(aggregateTransactions(reportData).totalAmount)}</td>
                <td class="text-end">${formatCurrency(aggregateTransactions(reportData).totalTax)}</td>
                <td class="text-end">${formatCurrency(aggregateTransactions(reportData).totalTaxable)}</td>
                <td class="text-end">${formatCurrency(aggregateTransactions(reportData).totalExempt)}</td>
                <td class="text-end">${aggregateTransactions(reportData).totalDiscount}</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent.innerHTML);
      printWindow.document.close();
      printWindow.focus();
      printWindow.onload = () => {
        printWindow.print();
        printWindow.onafterprint = () => {
          printWindow.close();
        };
      };
    }
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    const period =
      date_option === 'other_range'
        ? `${formatDate(custom_date_from)} - ${formatDate(custom_date_to)}`
        : getPeriodDateRange(date_option);

    const createdAt =
      reportData.length > 0
        ? formatDateWithTime(reportData[0].created_at)
        : 'N/A';

    doc.setFontSize(16);
    doc.text(reportName, 14, 15);

    // Summary table
    doc.autoTable({
      body: [
        ['Entities:', entity],
        ['Period:', period],
        ['Date Type:', date_type],
        ['Document Status:', status],
        ['Country:', 'UNITED STATES OF AMERICA'],
        ['State/Province:', reason],
        ['Document Code:', document_code],
        ['Report Date:', createdAt],
      ],
      startY: 25,
      styles: { fontSize: 10, cellPadding: 3 },
      theme: 'grid',
    });

    const aggregated = aggregateTransactions(reportData);

    // Aggregate table
    doc.autoTable({
      head: [
        [
          'Document Code Count',
          'Total Amount',
          'Tax Amount',
          'Taxable Amount',
          'Exempt Amount/Non Taxable',
          'Discount',
        ],
      ],
      body: [
        [
          reportData.length.toString(),
          formatCurrency(aggregated.totalAmount),
          formatCurrency(aggregated.totalTax),
          formatCurrency(aggregated.totalTaxable),
          formatCurrency(aggregated.totalExempt),
          aggregated.totalDiscount.toString(),
        ],
      ],
      startY: (doc.autoTable as any).previous.finalY + 10,
      theme: 'grid',
    });

    doc.save(`${reportName}.pdf`);
  };

  const handleDownloadXLSX = () => {
    const aggregated = aggregateTransactions(reportData);

    const wsData = [
      {
        'Report Name': reportName,
        Entities: entity,
        Period:
          date_option === 'other_range'
            ? `${formatDate(custom_date_from)} - ${formatDate(custom_date_to)}`
            : getPeriodDateRange(date_option),
        'Date Type': date_type,
        'Document Status': status,
        Country: 'UNITED STATES OF AMERICA',
        'State/Province': reason,
        'Document Code': document_code,
        'Report Date': createdAt,
      },
      {}, // Blank row for separation
      {
        'Document Code Count': reportData.length,
        'Total Amount': aggregated.totalAmount,
        'Tax Amount': aggregated.totalTax,
        'Taxable Amount': aggregated.totalTaxable,
        'Exempt Amount/Non Taxable': aggregated.totalExempt,
        Discount: aggregated.totalDiscount,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Report');
    XLSX.writeFile(wb, `${reportName}.xlsx`);
  };

  // New function to aggregate all transactions
  const aggregateTransactions = (data: ReportData[]) => {
    return data.reduce(
      (acc, curr) => {
        return {
          documentCount: (acc.documentCount || 0) + 1,
          totalAmount: (acc.totalAmount || 0) + curr.total_amount, // This line sums total_amount for ALL transactions
          totalTax: (acc.totalTax || 0) + curr.total_tax,
          totalTaxable: (acc.totalTaxable || 0) + curr.total_taxable,
          totalExempt: (acc.totalExempt || 0) + curr.total_exempt,
          totalDiscount: (acc.totalDiscount || 0) + curr.total_discount,
        };
      },
      {
        documentCount: 0,
        totalAmount: 0,
        totalTax: 0,
        totalTaxable: 0,
        totalExempt: 0,
        totalDiscount: 0,
      }
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  // If a document is selected, show the detail view
  if (selectedDocument) {
    return (
      <SalesTaxDocumentDetail
        documentCode={selectedDocument.documentCode}
        documentData={selectedDocument.documentData}
        entity={entity}
        reportName={reportName}
        onBackClick={handleBackToList}
        reason={reason}
        status={status}
        document_code={document_code}
        date_type={date_type}
        custom_date_from={custom_date_from}
        custom_date_to={custom_date_to}
        date_option={date_option}
      />
    );
  }

  const isEmpty = !loading && (!reportData || reportData.length === 0);

  return (
    <div className="w-full">
      <Card className="shadow-sm">
        <Card.Header className="bg-white">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <Button
                variant="link"
                className="text-primary p-0 me-3"
                onClick={onBackClick}
              >
                <ArrowLeft className="me-1" size={20} />
                Back to report criteria
              </Button>
            </div>
            <div>
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={handlePrint}
              >
                <Printer className="me-1" size={16} />
                Print
              </Button>
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={handleDownloadPDF}
              >
                <Download className="me-1" size={16} />
                Download PDF
              </Button>
              <Button variant="outline-secondary" onClick={handleDownloadXLSX}>
                <Download className="me-1" size={16} />
                Download XLSX
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <h3 className="mb-3">{reportName}</h3>
          {isEmpty ? (
            <div className="text-center py-5">
              <h1 className="text-muted mb-3">
                No transaction data found based on the selected criteria.
              </h1>
              <p className="text-muted">
                Try adjusting your search criteria or date range to see more
                results.
              </p>
              <Button
                variant="outline-primary"
                onClick={onBackClick}
                className="mt-3"
              >
                Modify Search Criteria
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h4 className="text-center"> Top Line</h4>
                <Table
                  bordered
                  className="summary-table"
                  style={{ maxWidth: '800px' }}
                >
                  <tbody>
                    <tr>
                      <td className="fw-bold" style={{ width: '200px' }}>
                        Entities:
                      </td>
                      <td colSpan={3}>{entity}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Period:</td>
                      <td colSpan={3}>{getPeriodDateRange(date_option)}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Date Type:</td>
                      <td colSpan={3}>{date_type}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Document Status:</td>
                      <td colSpan={3}>{status}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Country:</td>
                      <td colSpan={3}>UNITED STATES OF AMERICA</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">State/Province:</td>
                      <td colSpan={3}>{reason}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Document Code:</td>
                      <td colSpan={3}>{document_code}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Report Date:</td>
                      <td colSpan={3}>
                        {reportData.length > 0
                          ? formatDateWithTime(reportData[0].created_at)
                          : 'N/A'}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
              <Table responsive striped hover id="report-table">
                <thead>
                  <tr>
                    <td colSpan={3} className="text-center"></td>
                    <td colSpan={8} className="text-center">
                      Top Line Reconciliation
                    </td>
                  </tr>
                  <tr>
                    <th className="text-center">Entity</th>
                    <th className="text-center">Document Code Count</th>
                    <th className="text-center">Total Sales</th>
                    <th className="text-center">Discounts</th>
                    <th className="text-center">Exempt Amount/Non Taxable</th>
                    <th className="text-center">Taxable Sales</th>
                    <th className="text-center">Tax Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    const aggregated = aggregateTransactions(reportData);
                    return (
                      <>
                        <tr>
                          <td className="text-center">{entity}</td>
                          <td className="text-center">
                            <Button
                              variant="link"
                              className="p-0 text-primary text-decoration-underline"
                              onClick={() =>
                                handleDocumentClick(reportData[0].code)
                              }
                            >
                              {reportData.length}
                            </Button>
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalAmount)}
                          </td>
                          <td className="text-center">
                            {aggregated.totalDiscount}
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalExempt)}
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalTaxable)}
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalTax)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={8}></td>
                        </tr>
                        <tr className="fw-bold">
                          <td className="text-center">Grand Totals</td>
                          <td className="text-center"></td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalAmount)}
                          </td>
                          <td className="text-center">
                            {aggregated.totalDiscount}
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalExempt)}
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalTaxable)}
                          </td>
                          <td className="text-center">
                            {formatCurrency(aggregated.totalTax)}
                          </td>
                        </tr>
                      </>
                    );
                  })()}
                </tbody>
              </Table>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div>
                  Page {currentPage} of {totalPages}
                </div>
                <Pagination>
                  <Pagination.First
                    onClick={() => onPageChange(1)}
                    disabled={currentPage === 1}
                  />
                  <Pagination.Prev
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((page) => Math.abs(page - currentPage) <= 2)
                    .map((page) => (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => onPageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                  <Pagination.Next
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                  <Pagination.Last
                    onClick={() => onPageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </Pagination>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesTransactionReport;
