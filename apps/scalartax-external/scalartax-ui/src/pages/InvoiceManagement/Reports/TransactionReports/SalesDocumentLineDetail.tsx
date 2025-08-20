import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import SalesDocumentLineAddress from './SalesDocumentLineAddress';

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


interface SalesDocumentLineDetailProps {
  documentCode: string;
  documentData: ReportData;
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

const SalesDocumentLineDetail: React.FC<SalesDocumentLineDetailProps> = ({
  documentCode,
  documentData,
  entity,
  reportName,
  onBackClick,
  date_option = 'current_month',
  date_type,
  status,
  reason,
  custom_date_from = '',
  custom_date_to = '',
  document_code,
}) => {
  const [showLineDetailAddress, setShowLineDetailAddress] = useState(false);
  const [selectedLineItem, setSelectedLineItem] = useState<any>(null); // To store clicked line item data

  const [selectedLineNumber, setSelectedLineNumber] = useState<
    number | 'all' | null
  >(null);

  const handleLineClick = (item: any) => {
    setSelectedLineNumber(item.line_number); // Store the specific line number
    setShowLineDetailAddress(true);
  };

  const handleDocumentClick = () => {
    setSelectedLineNumber('all'); // Set to 'all' when document code is clicked
    setShowLineDetailAddress(true);
  };

  const handleBackToDetail = () => {
    setShowLineDetailAddress(false);
    setSelectedLineItem(null); // Reset selected line item data
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
    const {
      totalAmount,
      totalTaxableSales,
      totalDiscounts,
      totalExempt,
      totalTaxAmount,
    } = calculateGrandTotals();

    printContent.innerHTML = `
      <html>
        <head>
          <title>${reportName} - Line Detail</title>
          <style>
            @media print {
              body { font-family: Arial, sans-serif; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
              th { background-color: #f4f4f4; }
              .text-end { text-align: right; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              h3 { text-align: center; margin-top: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${reportName} - Document Line Detail</h1>
          <div>
            <h3>Document Line Detail</h3>
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
                  <td colspan="3">${documentCode} to ${documentCode}</td>
                </tr>
                <tr>
                  <td><strong>Report Date:</strong></td>
                  <td colspan="3">${formatDateWithTime(documentData.created_at)}</td>
                </tr>
              </tbody>
            </table>
  
            <h3>Document Line Detail Reconciliation</h3>
             <table>
              <thead>
                <tr>
                  <th>Document Code</th>
                  <th>Document Date</th>
                  <th>Line</th>
                  <th>Item Code</th>
                  <th>Tax Code</th>
                  <th>Qty</th>
                  <th>Total Sales</th>
                  <th>Discounts</th>
                  <th>Exempt Amount/Non Taxable</th>
                  <th>Taxable Sales</th>
                  <th>Tax Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${documentCode}</td>
                  <td>${formatDate(documentData.date)}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td>${formatCurrency(totalAmount)}</td>
                  <td>${formatCurrency(totalDiscounts)}</td>
                  <td>${formatCurrency(totalExempt)}</td>
                  <td>${formatCurrency(totalTaxableSales)}</td>
                  <td>${formatCurrency(totalTaxAmount)}</td>
                </tr>
                ${documentData.line_items
                  .map(
                    (item) => `
                  <tr>
                    <td>${documentCode}</td>
                    <td>${formatDate(documentData.date)}</td>
                    <td>${item.line_number || 'N/A'}</td>
                    <td>${item.item_code || 'N/A'}</td>
                    <td>${item.tax_code || 'N/A'}</td>
                    <td>${item.quantity || 'N/A'}</td>
                    <td>${formatCurrency(item.line_amount)}</td>
                    <td>${formatCurrency(item.discount_amount)}</td>
                    <td></td>
                    <td>${formatCurrency(item.taxable_amount)}</td>
                    <td>${formatCurrency(item.tax)}</td>
                  </tr>
                `
                  )
                  .join('')}
                <tr>
                  <td colspan="6"><strong>Grand Totals</strong></td>
                  <td><strong>${formatCurrency(totalAmount)}</strong></td>
                  <td><strong>${formatCurrency(totalDiscounts)}</strong></td>
                  <td><strong>${formatCurrency(totalExempt)}</strong></td>
                  <td><strong>${formatCurrency(totalTaxableSales)}</strong></td>
                  <td><strong>${formatCurrency(totalTaxAmount)}</strong></td>
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
    const doc = new jsPDF('landscape');
    const period = getPeriodDateRange(date_option);
    const {
      totalAmount,
      totalTaxableSales,
      totalDiscounts,
      totalExempt,
      totalTaxAmount,
    } = calculateGrandTotals();

    // Add title
    doc.setFontSize(16);
    doc.text(`${reportName} - Document Line Detail`, 14, 15);

    // Add Document Summary section
    const summaryTitle = 'Document Line Detail';
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
        ['Document Code:', `${documentCode} to ${documentCode}`],
        ['Report Date:', formatDateWithTime(documentData.created_at)],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { halign: 'left', fontStyle: 'bold' },
        1: { halign: 'left' },
      },
      theme: 'grid',
    });

    const firstTableFinalY = (doc.autoTable as any).previous.finalY;

    // Second table for line detail data
    doc.autoTable({
      startY: firstTableFinalY + 10,
      head: [
        [
          'Document Code',
          'Document Date',
          'Line',
          'Item Code',
          'Tax Code',
          'Qty',
          'Total Sales',
          'Discounts',
          'Exempt Amount/Non Taxable',
          'Taxable Sales',
          'Tax Amount',
        ],
      ],
      body: [
        // Summary row
        [
          documentCode,
          formatDate(documentData.date),
          '',
          '',
          '',
          '',
          formatCurrency(totalAmount),
          formatCurrency(totalDiscounts),
          formatCurrency(totalExempt),
          formatCurrency(totalTaxableSales),
          formatCurrency(totalTaxAmount),
        ],
        // Line items
        ...documentData.line_items.map((item) => [
          documentCode,
          formatDate(documentData.date),
          item.line_number || 'N/A',
          item.item_code || 'N/A',
          item.tax_code || 'N/A',
          item.quantity || 'N/A',
          formatCurrency(item.line_amount),
          formatCurrency(item.discount_amount),
          '',
          formatCurrency(item.taxable_amount),
          formatCurrency(item.tax),
        ]),
        // Grand totals row
        [
          'Grand Totals',
          '',
          '',
          '',
          '',
          '',
          formatCurrency(totalAmount),
          formatCurrency(totalDiscounts),
          formatCurrency(totalExempt),
          formatCurrency(totalTaxableSales),
          formatCurrency(totalTaxAmount),
        ],
      ],
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        6: { halign: 'right' },
        7: { halign: 'right' },
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' },
      },
    });

    doc.save(`${documentCode}_line_detail.pdf`);
  };

  const handleDownloadExcel = () => {
    const excelData = [
      // Summary row
      {
        'Document Code': documentCode,
        'Document Date': formatDate(documentData.date),
        Line: '',
        'Item Code': '',
        'Tax Code': '',
        Qty: '',
        'Total Sales': totalAmount,
        Discounts: totalDiscounts,
        'Exempt Amount/Non Taxable': totalExempt,
        'Taxable Sales': totalTaxableSales,
        'Tax Amount': totalTaxAmount,
      },
      // Line items
      ...documentData.line_items.map((item) => ({
        'Document Code': documentCode,
        'Document Date': formatDate(documentData.date),
        Line: item.line_number || 'N/A',
        'Item Code': item.item_code || 'N/A',
        'Tax Code': item.tax_code || 'N/A',
        Qty: item.quantity || 'N/A',
        'Total Sales': item.line_amount,
        Discounts: item.discount_amount,
        'Exempt Amount/Non Taxable': '',
        'Taxable Sales': item.taxable_amount,
        'Tax Amount': item.tax,
      })),
      // Grand totals row
      {
        'Document Code': 'Grand Totals',
        'Document Date': '',
        Line: '',
        'Item Code': '',
        'Tax Code': '',
        Qty: '',
        'Total Sales': totalAmount,
        Discounts: totalDiscounts,
        'Exempt Amount/Non Taxable': totalExempt,
        'Taxable Sales': totalTaxableSales,
        'Tax Amount': totalTaxAmount,
      },
    ];

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Line Detail');
    XLSX.writeFile(wb, `${documentCode}_line_detail.xlsx`);
  };

  const calculateGrandTotals = () => {
    let totalAmount = 0;
    let totalTaxableSales = 0;
    let totalDiscounts = 0;
    let totalExempt = documentData.total_exempt || 0;
    let totalTaxAmount = 0;

    // Loop through the document line items and sum up the totals
    documentData.line_items.forEach((item) => {
      totalAmount += Number(item.line_amount) || 0;
      totalTaxableSales += Number(item.taxable_amount) || 0;
      totalDiscounts += Number(item.discount_amount) || 0;
      totalTaxAmount += Number(item.tax) || 0;
    });

    return {
      totalAmount,
      totalTaxableSales,
      totalDiscounts,
      totalExempt,
      totalTaxAmount,
    };
  };
  const {
    totalAmount,
    totalTaxableSales,
    totalDiscounts,
    totalExempt,
    totalTaxAmount,
  } = calculateGrandTotals();

  // Generate repeated rows based on total_line_line_number
  const generateRows = () => {
    const rows = [];
    for (let i = 0; i < documentData.line_items.length; i++) {
      const item = documentData.line_items[i]; // Access individual item from the array
      rows.push(
        <tr key={i}>
          <td className="text-center"></td>
          <td className="text-center"></td>
          <td className="text-center clickable-cell">
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleLineClick(item);
              }}
            >
              {item.line_number || 'N/A'}
            </a>
          </td>
          <td className="text-center">{item.item_code || 'N/A'}</td>
          <td className="text-center">{item.tax_code || 'N/A'}</td>
          <td className="text-center">{item.quantity || 'N/A'}</td>
          <td className="text-center">{formatCurrency(item.line_amount)}</td>
          <td className="text-center">
            {formatCurrency(item.discount_amount)}
          </td>
          <td className="text-center"></td>
          <td className="text-center">{formatCurrency(item.taxable_amount)}</td>
          <td className="text-center">{formatCurrency(item.tax)}</td>
        </tr>
      );
    }
    return rows;
  };

  if (showLineDetailAddress) {
    return (
      <SalesDocumentLineAddress
        documentCode={documentCode}
        documentData={documentData}
        entity={entity}
        reportName={reportName}
        onBackClick={handleBackToDetail}
        date_option={date_option}
        date_type={date_type}
        status={status}
        reason={reason}
        custom_date_from={custom_date_from}
        custom_date_to={custom_date_to}
        document_code={document_code}
        selectedLineNumber={selectedLineNumber}
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
              <Button variant="outline-secondary" onClick={handleDownloadExcel}>
                <Download /> Download Excel
              </Button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <h3 className="mb-3">{reportName}</h3>
          <div className="mb-4">
            <h3 className="text-center">Document Line Detail</h3>
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
                  <td className="fw-bold">Period</td>
                  <td colSpan={3}>{getPeriodDateRange(date_option)}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Date Type</td>
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
                  <td colSpan={3}>
                    {documentCode}
                    <span> to </span>
                    {documentCode}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Report Date:</td>
                  <td colSpan={3}>
                    {documentData.created_at
                      ? formatDateWithTime(documentData.created_at)
                      : 'N/A'}
                  </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className="mb-4">
            <Table bordered className="summary-table">
              <tbody>
                <tr>
                  <td colSpan={3} className="text-center">
                    {entity}
                  </td>
                  <td colSpan={8} className="text-center">
                    Document Line Detail Reconciliation
                  </td>
                </tr>
                <tr>
                  <th className="text-center">Document Code</th>
                  <th className="text-center">Document Date</th>
                  <th className="text-center">Line</th>
                  <th className="text-center">Item Code</th>
                  <th className="text-center">Tax Code</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Total Sales</th>
                  <th className="text-center">Discounts</th>
                  <th className="text-center">Exempt Amount/Non Taxable</th>
                  <th className="text-center">Taxable Sales</th>
                  <th className="text-center">Tax Amount</th>
                </tr>
                <tr>
                  <td className="text-center">
                    <Button
                      variant="link"
                      className="p-0 text-primary text-decoration-underline"
                      onClick={handleDocumentClick}
                    >
                      {documentCode}
                    </Button>
                  </td>
                  <td className="text-center">
                    {formatDate(documentData.date)}
                  </td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                  <td className="text-center"></td>
                  <td className="text-center">{formatCurrency(totalAmount)}</td>
                  <td className="text-center">
                    {formatCurrency(totalDiscounts)}
                  </td>
                  <td className="text-center">{formatCurrency(totalExempt)}</td>
                  <td className="text-center">
                    {formatCurrency(totalTaxableSales)}
                  </td>
                  <td className="text-center">
                    {formatCurrency(totalTaxAmount)}
                  </td>
                </tr>
                {generateRows()}
                <tr className="fw-bold">
                  <td className="text-center" colSpan={6}>
                    Grand Totals
                  </td>
                  <td className="text-center">{formatCurrency(totalAmount)}</td>
                  <td className="text-center">
                    {formatCurrency(totalDiscounts)}
                  </td>
                  <td className="text-center">{formatCurrency(totalExempt)}</td>
                  <td className="text-center">
                    {formatCurrency(totalTaxableSales)}
                  </td>
                  <td className="text-center">
                    {formatCurrency(totalTaxAmount)}
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

export default SalesDocumentLineDetail;
