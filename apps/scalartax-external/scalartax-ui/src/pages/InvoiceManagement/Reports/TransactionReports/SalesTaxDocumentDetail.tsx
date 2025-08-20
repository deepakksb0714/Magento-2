import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import SalesDocumentLineDetail from './SalesDocumentLineDetail';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
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


interface SalesTaxDocumentDetailProps {
  documentCode: string;
  documentData: ReportData[];
  entity: string;
  reportName: string;
  onBackClick: () => void;
  date_option: string;
  date_type: string;
  status: string;
  reason: string;
  custom_date_from: string;
  custom_date_to: string;
  document_code: string;
}

const SalesTaxDocumentDetail: React.FC<SalesTaxDocumentDetailProps> = ({
  documentCode,
  documentData,
  entity,
  reportName,
  onBackClick,
  date_option = 'current_month',
  date_type,
  status,
  reason = 'N/A',
  custom_date_from = '',
  custom_date_to = '',
  document_code,
}) => {
  const [showLineDetail, setShowLineDetail] = useState(false);
  const [selectedDocumentCode, setSelectedDocumentCode] = useState<string>('');
  const [selectedDocumentData, setSelectedDocumentData] =
    useState<ReportData | null>(null);

  // Aggregate transaction data
  const aggregated = documentData.reduce(
    (acc, doc) => {
      return {
        totalSales: (acc.totalSales || 0) + doc.total_amount,
        totalDiscount: (acc.totalDiscount || 0) + doc.total_discount,
        totalExempt: (acc.totalExempt || 0) + doc.total_exempt,
        totalTaxable: (acc.totalTaxable || 0) + doc.total_taxable,
        totalTax: (acc.totalTax || 0) + doc.total_tax,
      };
    },
    {
      totalSales: 0,
      totalDiscount: 0,
      totalExempt: 0,
      totalTaxable: 0,
      totalTax: 0,
    }
  );

  // Get individual document summary
  const getDocumentSummary = (doc: ReportData) => ({
    code: doc.code,
    date: doc.date,
    customer_code: doc.customer_code,
    totalAmount: doc.total_amount,
    totalTax: doc.total_tax,
    totalTaxable: doc.total_taxable,
    totalExempt: doc.total_exempt,
    totalDiscount: doc.total_discount,
  });

  const handleDocumentClick = (code: string) => {
    const selectedData = documentData.find((doc) => doc.code === code);
    if (selectedData) {
      setSelectedDocumentCode(code);
      setSelectedDocumentData(selectedData);
      setShowLineDetail(true);
    }
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
    return date.toLocaleString('en-US');
  };

  const getPeriodDateRange = (period: string) => {
    const now = new Date();

    if (period === 'previous_month') {
      now.setMonth(now.getMonth() - 1);
      now.setDate(1);
      const startDate = new Date(now);
      now.setMonth(now.getMonth() + 1);
      now.setDate(0);
      const endDate = new Date(now);

      return `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`;
    }

    if (period === 'other_range' && custom_date_from && custom_date_to) {
      const startDate = new Date(custom_date_from);
      const endDate = new Date(custom_date_to);

      return `${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`;
    }

    now.setDate(1);
    const startOfCurrentMonth = new Date(now);
    now.setMonth(now.getMonth() + 1);
    now.setDate(0);
    const endOfCurrentMonth = new Date(now);

    return `${formatDate(startOfCurrentMonth.toISOString())} - ${formatDate(endOfCurrentMonth.toISOString())}`;
  };

  const handlePrint = () => {
    const printContent = document.createElement('div');
    const period = getPeriodDateRange(date_option);

    printContent.innerHTML = `
      <html>
        <head>
          <title>${reportName} - Document Detail</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f4f4f4; }
              .text-end { text-align: right; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              h3 { text-align: center; margin-top: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${reportName} - Document Detail</h1>
          <div>
            <h3>Document Summary</h3>
            <table>
              <tbody>
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
                  <td colspan="3">${formatDateWithTime(documentData[0].created_at)}</td>
                </tr>
              </tbody>
            </table>
  
            <h3>Document Summary Reconciliation</h3>
            <table>
              <thead>
                <tr>
                <th className="text-center">Document Code</th>
                <th className="text-center">Document Date</th>
                <th className="text-center">Customer Vendor Code</th>
                <th className="text-center">Total Sales</th>
                <th className="text-center">Discounts</th>
                <th className="text-center">Exempt Amount/Non Taxable</th>
                <th className="text-center">Taxable Sales</th>
                <th className="text-center">Tax Amount</th>
                </tr> 
              </thead>
              <tbody>
                ${documentData
                  .map(
                    (doc) => `
                  <tr>
                    <td>${doc.code}</td>
                    <td>${formatDate(doc.date)}</td>
                    <td>${doc.customer_code}</td>
                    <td class="text-center">${formatCurrency(doc.total_amount)}</td>
                    <td class="text-center">${formatCurrency(doc.total_discount)}</td>
                    <td class="text-center">${formatCurrency(doc.total_exempt)}</td>
                    <td class="text-center">${formatCurrency(doc.total_taxable)}</td>  
                    <td class="text-center">${formatCurrency(doc.total_tax)}</td>
                  </tr>
                `
                  )
                  .join('')}
                <tr class="fw-bold">
                  <td class="text-center">Total Entity</td>
                  <td class="text-center"></td>
                  <td class="text-center"></td>
                  <td class="text-center">${formatCurrency(aggregated.totalSales)}</td>
                  <td class="text-center">${formatCurrency(aggregated.totalDiscount)}</td>
                  <td class="text-center">${formatCurrency(aggregated.totalExempt)}</td>
                  <td class="text-center">${formatCurrency(aggregated.totalTaxable)}</td>
                  <td class="text-center">${formatCurrency(aggregated.totalTax)}</td>
                </tr>
              </tbody>
            </table>
          </div>
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
    const period = getPeriodDateRange(date_option);

    // Add title
    doc.setFontSize(16);
    doc.text(`${reportName} - Document Detail`, 14, 15);

    // Add Document Summary section
    const summaryTitle = 'Document Summary';
    const summaryTitleWidth = doc.getTextWidth(summaryTitle);
    const pageWidth = doc.internal.pageSize.getWidth();
    const summaryTitleX = (pageWidth - summaryTitleWidth) / 2;

    doc.setFontSize(12);
    doc.text(summaryTitle, summaryTitleX, 25);

    // First table for document summary
    doc.autoTable({
      startY: 35,
      body: [
        ['Entities:', entity],
        ['Period:', period],
        ['Date Type:', date_type],
        ['Document Status:', status],
        ['Country:', 'UNITED STATES OF AMERICA'],
        ['State/Province:', reason],
        ['Document Code:', document_code],
        ['Report Date:', formatDateWithTime(documentData[0].created_at)],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'left' },
      },
      theme: 'grid',
    });

    const firstTableFinalY = (doc.autoTable as any).previous.finalY;

    // Prepare table rows with total entity row
    const tableRows = [
      ...documentData.map((doc) => [
        doc.code,
        doc.customer_code,
        formatDate(doc.date),
        formatCurrency(doc.total_amount),
        formatCurrency(doc.total_taxable),
        formatCurrency(doc.total_exempt),
        formatCurrency(doc.total_discount),
        formatCurrency(doc.total_tax),
      ]),
      // Total Entity Row
      [
        'Total Entity',
        '',
        '',
        formatCurrency(aggregated.totalSales),
        formatCurrency(aggregated.totalTaxable),
        formatCurrency(aggregated.totalExempt),
        formatCurrency(aggregated.totalDiscount),
        formatCurrency(aggregated.totalTax),
      ],
    ];

    // Second table for reconciliation data
    doc.autoTable({
      startY: firstTableFinalY + 10,
      head: [
        [
          'Document Code',
          'Customer Vendor Code',
          'Document Date',
          'Total Sales',
          'Taxable Sales',
          'Exempt Amount',
          'Discounts',
          'Tax Amount',
        ],
      ],
      body: tableRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        3: { halign: 'right' },
        4: { halign: 'right' },
        5: { halign: 'right' },
        6: { halign: 'right' },
        7: { halign: 'right' },
      },
    });

    doc.save(`${reportName}_${documentCode}_Detail.pdf`);
  };

  const handleDownloadXLSX = () => {
    // Create data rows with individual documents and total entity row
    const documentRows = documentData.map((doc) => ({
      'Document Code': doc.code,
      'Customer Vendor Code': doc.customer_code,
      'Document Date': formatDate(doc.date),
      'Total Sales': doc.total_amount,
      'Taxable Sales': doc.total_taxable,
      'Exempt Amount/Non Taxable': doc.total_exempt,
      Discounts: doc.total_discount,
      'Tax Amount': doc.total_tax,
    }));

    // Add total entity row
    const totalEntityRow = {
      'Document Code': 'Total Entity',
      'Customer Vendor Code': '',
      'Document Date': '',
      'Total Sales': aggregated.totalSales,
      'Taxable Sales': aggregated.totalTaxable,
      'Exempt Amount/Non Taxable': aggregated.totalExempt,
      Discounts: aggregated.totalDiscount,
      'Tax Amount': aggregated.totalTax,
    };

    // Combine document rows with total entity row
    const wsData = [...documentRows, totalEntityRow];

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Document Detail');
    XLSX.writeFile(wb, `${reportName}_${documentCode}_Detail.xlsx`);
  };

  if (showLineDetail && selectedDocumentData) {
    return (
      <SalesDocumentLineDetail
        documentCode={selectedDocumentCode}
        documentData={selectedDocumentData}
        entity={entity}
        reportName={reportName}
        onBackClick={() => setShowLineDetail(false)}
        date_option={date_option}
        date_type={date_type}
        status={status}
        reason={reason}
        custom_date_from={custom_date_from}
        custom_date_to={custom_date_to}
        document_code={document_code}
      />
    );
  }

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
                Back to report list
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
          <div className="mb-4">
            <h3 className="text-center">Document Summary</h3>
            <Table
              bordered
              className="summary-table"
              style={{ maxWidth: '800px' }}
            >
              <tbody>
                <tr>
                  <td className="fw-bold" style={{ width: '200px' }}>
                    Entities
                  </td>
                  <td colSpan={3}>{entity}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Period</td>
                  <td colSpan={3}>{getPeriodDateRange(date_option)}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Date Type</td>
                  <td colSpan={3}>{date_type}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Document Status</td>
                  <td colSpan={3}>{status}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Country</td>
                  <td colSpan={3}>UNITED STATES OF AMERICA</td>
                </tr>
                <tr>
                  <td className="fw-bold">State/Province</td>
                  <td colSpan={3}>{reason}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Document Code</td>
                  <td colSpan={3}>{document_code}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Report Date</td>
                  <td colSpan={3}>
                    {documentData[0].created_at
                      ? formatDateWithTime(documentData[0].created_at)
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className="mb-4">
            <Table responsive striped hover id="report-table">
              <thead>
                <tr>
                  <td colSpan={3} className="text-center">
                    {entity}
                  </td>
                  <td colSpan={8} className="text-center">
                    Document Summary Reconciliation
                  </td>
                </tr>
                <tr>
                  <th className="text-center">Document Code</th>
                  <th className="text-center">Document Date</th>
                  <th className="text-center">Customer Vendor Code</th>
                  <th className="text-center">Total Sales</th>
                  <th className="text-center">Discounts</th>
                  <th className="text-center">Exempt Amount/Non Taxable</th>
                  <th className="text-center">Taxable Sales</th>
                  <th className="text-center">Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                {documentData.map((doc, index) => {
                  const summary = getDocumentSummary(doc);
                  return (
                    <>
                      <tr key={`${doc.code}-${index}`}>
                        <td className="text-center">
                          <Button
                            variant="link"
                            className="p-0 text-primary text-decoration-underline"
                            onClick={() => handleDocumentClick(doc.code)}
                          >
                            {doc.code}
                          </Button>
                        </td>
                        <td className="text-center">
                          {formatDate(summary.date)}
                        </td>
                        <td className="text-center">
                          {summary.customer_code}
                        </td>
                        <td className="text-center">
                          {formatCurrency(summary.totalAmount)}
                        </td>
                        <td className="text-center">
                          {formatCurrency(summary.totalDiscount)}
                        </td>
                        <td className="text-center">
                          {formatCurrency(summary.totalExempt)}
                        </td>
                        <td className="text-center">
                          {formatCurrency(summary.totalTaxable)}
                        </td>
                        <td className="text-center">
                          {formatCurrency(summary.totalTax)}
                        </td>
                      </tr>
                    </>
                  );
                })}
                <tr className="fw-bold">
                  <td className="text-center">Entity Total </td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                  <td className="text-center">
                    {formatCurrency(aggregated.totalSales)}
                  </td>
                  <td className="text-center">
                    {formatCurrency(aggregated.totalDiscount)}
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
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default SalesTaxDocumentDetail;
