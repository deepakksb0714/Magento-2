import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { ReportData } from "./reportTypes";
import DocumentLineTaxDetail from './DocumentLineTaxDetail';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface DocumentLineDetailProps {
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

const DocumentLineDetail: React.FC<DocumentLineDetailProps> = ({
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
  const [showTaxDetail, setShowTaxDetail] = useState(false);
  const [selectedLineNumber, setSelectedLineNumber] = useState<number | 'all' | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<ReportData | null>(null);

  // Get the first document for summary information
  const currentDocument = documentData[0];

  const handleLineClick = (doc: ReportData, item: any) => {
    setSelectedLineNumber(parseInt(item.line_number));
    setSelectedDocument(doc);
    setShowTaxDetail(true);
  };

  const handleDocumentClick = (doc: ReportData) => {
    setSelectedLineNumber('all');
    setSelectedDocument(doc);
    setShowTaxDetail(true);
  };

  const calculateTotalsForDocument = (doc: ReportData) => {
    let totalAmount = 0;
    let totalTaxableSales = 0;
    let totalDiscounts = 0;
    let totalExempt = doc.total_exempt || 0;
    let totalTaxAmount = 0;

    doc.line_items.forEach((item) => {
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

  const calculateGrandTotals = () => {
    return documentData.reduce((acc, doc) => {
      const docTotals = calculateTotalsForDocument(doc);
      return {
        totalAmount: acc.totalAmount + docTotals.totalAmount,
        totalTaxableSales: acc.totalTaxableSales + docTotals.totalTaxableSales,
        totalDiscounts: acc.totalDiscounts + docTotals.totalDiscounts,
        totalExempt: acc.totalExempt + docTotals.totalExempt,
        totalTaxAmount: acc.totalTaxAmount + docTotals.totalTaxAmount,
      };
    }, {
      totalAmount: 0,
      totalTaxableSales: 0,
      totalDiscounts: 0,
      totalExempt: 0,
      totalTaxAmount: 0,
    });
  };

  const grandTotals = calculateGrandTotals();

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

  const generateExportRows = (doc: ReportData) => {
    const docTotals = calculateTotalsForDocument(doc);
    const rows = [];

    // Document header row
    rows.push([
      doc.code,
      formatDate(doc.date),
      'Customer Code: ' + (doc.customer_code || ''),
      '', '', '', '', '',
      formatCurrency(docTotals.totalAmount),
      formatCurrency(docTotals.totalDiscounts),
      formatCurrency(docTotals.totalExempt),
      formatCurrency(docTotals.totalTaxableSales),
      formatCurrency(docTotals.totalTaxAmount),
    ]);

    // Line items
    doc.line_items.forEach(item => {
      rows.push([
        '',
        '',
        item.line_number || '',
        'EXEMPT',
        '',
        item.item_code || '',
        item.tax_code,
        item.quantity || '',
        formatCurrency(item.line_amount),
        formatCurrency(item.discount_amount),
        formatCurrency(docTotals.totalExempt),
        formatCurrency(item.taxable_amount),
        formatCurrency(item.tax),
      ]);
    });

    // Spacer row
    rows.push(Array(13).fill(''));

    return rows;
  };
  
  const handlePrint = () => {
    const printContent = document.createElement('div');
    const period = getPeriodDateRange(date_option);
    const grandTotals = calculateGrandTotals();

    let tableRows = '';
    documentData.forEach((doc) => {
      const exportRows = generateExportRows(doc);
      exportRows.forEach(row => {
        tableRows += `
          <tr>
            ${row.map(cell => `<td class="text-center">${cell}</td>`).join('')}
          </tr>
        `;
      });
    });

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
              .text-center { text-align: center; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              h3 { text-align: center; margin-top: 0; }
            }
          </style>
        </head>
        <body>
          <h1>${reportName} - Document Line Detail</h1>
          <!-- Summary Table -->
          <table>
            <tbody>
              <tr><td><strong>Entities:</strong></td><td colspan="3">${entity}</td></tr>
              <tr><td><strong>Period:</strong></td><td colspan="3">${period}</td></tr>
              <tr><td><strong>Country:</strong></td><td colspan="3">UNITED STATES OF AMERICA</td></tr>
              <tr><td><strong>State/Province:</strong></td><td colspan="3">${currentDocument?.destination_address?.region || ''}</td></tr>
              <tr><td><strong>Document Code:</strong></td><td colspan="3">All</td></tr>
              <tr><td><strong>Report Date:</strong></td><td colspan="3">${formatDateWithTime(currentDocument?.created_at || '')}</td></tr>
            </tbody>
          </table>

          <!-- Detail Table -->
          <table>
            <thead>
              <tr>
                <th>Document Code</th>
                <th>Document Date</th>
                <th>Line</th>
                <th>Exemption No</th>
                <th>Entity Use Code</th>
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
                <td>${entity}</td>
                <td colspan="12"></td>
              </tr>
              ${tableRows}
              <tr><td colspan="13"></td></tr>
              <tr>
                <td>Company Total</td>
                <td colspan="7"></td>
                <td>${formatCurrency(grandTotals.totalAmount)}</td>
                <td>${formatCurrency(grandTotals.totalDiscounts)}</td>
                <td>${formatCurrency(grandTotals.totalExempt)}</td>
                <td>${formatCurrency(grandTotals.totalTaxableSales)}</td>
                <td>${formatCurrency(grandTotals.totalTaxAmount)}</td>
              </tr>
              <tr><td colspan="13"></td></tr>
              <tr>
                <td>Grand Totals</td>
                <td colspan="7"></td>
                <td>${formatCurrency(grandTotals.totalAmount)}</td>
                <td>${formatCurrency(grandTotals.totalDiscounts)}</td>
                <td>${formatCurrency(grandTotals.totalExempt)}</td>
                <td>${formatCurrency(grandTotals.totalTaxableSales)}</td>
                <td>${formatCurrency(grandTotals.totalTaxAmount)}</td>
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
    const doc = new jsPDF('landscape');
    const period = getPeriodDateRange(date_option);
    const grandTotals = calculateGrandTotals();

    // Add title
    doc.setFontSize(16);
    doc.text(`${reportName} - Document Line Detail`, 14, 15);

    // Add Document Summary section
    doc.setFontSize(12);
    doc.text('Document Line Detail', doc.internal.pageSize.getWidth() / 2, 25, { align: 'center' });

    // First table for document summary
    doc.autoTable({
      startY: 35,
      body: [
        ['Entities:', entity],
        ['Period:', period],
        ['Country:', 'UNITED STATES OF AMERICA'],
        ['State/Province:', currentDocument?.destination_address?.region || ''],
        ['Document Code:', 'All'],
        ['Report Date:', formatDateWithTime(currentDocument?.created_at || '')],
      ],
      styles: { fontSize: 10, cellPadding: 3 },
      theme: 'grid',
    });

    const firstTableFinalY = (doc.autoTable as any).previous.finalY;

    // Generate all rows for the detail table
    const detailRows = [];
    detailRows.push([entity, '', '', '', '', '', '', '', '', '', '', '', '']);
    
    documentData.forEach(doc => {
      detailRows.push(...generateExportRows(doc));
    });

    // Add company and grand total rows
    detailRows.push([
      'Company Total', '', '', '', '', '', '', '',
      formatCurrency(grandTotals.totalAmount),
      formatCurrency(grandTotals.totalDiscounts),
      formatCurrency(grandTotals.totalExempt),
      formatCurrency(grandTotals.totalTaxableSales),
      formatCurrency(grandTotals.totalTaxAmount),
    ]);
    
    detailRows.push(Array(13).fill(''));
    
    detailRows.push([
      'Grand Totals', '', '', '', '', '', '', '',
      formatCurrency(grandTotals.totalAmount),
      formatCurrency(grandTotals.totalDiscounts),
      formatCurrency(grandTotals.totalExempt),
      formatCurrency(grandTotals.totalTaxableSales),
      formatCurrency(grandTotals.totalTaxAmount),
    ]);

    // Second table for line detail data
    doc.autoTable({
      startY: firstTableFinalY + 10,
      head: [[
        'Document Code', 'Document Date', 'Line', 'Exemption No',
        'Entity Use Code', 'Item Code', 'Tax Code', 'Qty',
        'Total Sales', 'Discounts', 'Exempt Amount/Non Taxable',
        'Taxable Sales', 'Tax Amount'
      ]],
      body: detailRows,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        8: { halign: 'right' },
        9: { halign: 'right' },
        10: { halign: 'right' },
        11: { halign: 'right' },
        12: { halign: 'right' },
      },
    });

    doc.save(`${documentCode}_line_detail.pdf`);
  };

  const handleDownloadExcel = () => {
    const rows = [];
    const grandTotals = calculateGrandTotals();

    // Add entity row
    rows.push({
      'Document Code': entity,
    });

    // Add document data
    documentData.forEach(doc => {
      const exportRows = generateExportRows(doc);
      exportRows.forEach(row => {
        rows.push({
          'Document Code': row[0],
          'Document Date': row[1],
          'Line': row[2],
          'Exemption No': row[3],
          'Entity Use Code': row[4],
          'Item Code': row[5],
          'Tax Code': row[6],
          'Qty': row[7],
          'Total Sales': row[8],
          'Discounts': row[9],
          'Exempt Amount/Non Taxable': row[10],
          'Taxable Sales': row[11],
          'Tax Amount': row[12],
        });
      });
    });

    // Add totals
    rows.push({
      'Document Code': 'Company Total',
      'Total Sales': formatCurrency(grandTotals.totalAmount),
      'Discounts': formatCurrency(grandTotals.totalDiscounts),
      'Exempt Amount/Non Taxable': formatCurrency(grandTotals.totalExempt),
      'Taxable Sales': formatCurrency(grandTotals.totalTaxableSales),
      'Tax Amount': formatCurrency(grandTotals.totalTaxAmount),
    });

    rows.push({}); // Empty row

    rows.push({
      'Document Code': 'Grand Totals',
      'Total Sales': formatCurrency(grandTotals.totalAmount),
      'Discounts': formatCurrency(grandTotals.totalDiscounts),
      'Exempt Amount/Non Taxable': formatCurrency(grandTotals.totalExempt),
      'Taxable Sales': formatCurrency(grandTotals.totalTaxableSales),
      'Tax Amount': formatCurrency(grandTotals.totalTaxAmount),
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Line Detail');
    XLSX.writeFile(wb, `${documentCode}_line_detail.xlsx`);
  };
  
  const generateDocumentRows = () => {
    const rows: JSX.Element[] = [];
    
    documentData.forEach((doc, docIndex) => {
      const docTotals = calculateTotalsForDocument(doc);
      
      // Add document header row
      rows.push(
        <tr key={`doc-${docIndex}`}>
          <td className="text-center">
            <Button
              variant="link"
              className="p-0 text-primary text-decoration-underline"
              onClick={() => handleDocumentClick(doc)}
            >
              {doc.code}
            </Button>
          </td>
          <td className="text-center">{formatDate(doc.date)}</td>
          <td className="text-center">Customer Code:</td>
          <td colSpan={5}>{doc.customer_code || ''}</td>
          <td className="text-center">{formatCurrency(docTotals.totalAmount)}</td>
          <td className="text-center">{formatCurrency(docTotals.totalDiscounts)}</td>
          <td className="text-center">{formatCurrency(docTotals.totalExempt)}</td>
          <td className="text-center">{formatCurrency(docTotals.totalTaxableSales)}</td>
          <td className="text-center">{formatCurrency(docTotals.totalTaxAmount)}</td>
        </tr>
      );

      // Add line items for this document
      doc.line_items.forEach((item, itemIndex) => {
        rows.push(
          <tr key={`doc-${docIndex}-line-${itemIndex}`}>
            <td className="text-center"></td>
            <td className="text-center"></td>
            <td className="text-center clickable-cell">
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  handleLineClick(doc, item);
                }}
              >
                {item.line_number || ''}
              </a>
            </td>
            <td className="text-center">EXEMPT</td>
            <td className="text-center"></td>
            <td className="text-center">{item.item_code || ''}</td>
            <td className="text-center">{item.tax_code}</td>
            <td className="text-center">{item.quantity || ''}</td>
            <td className="text-center">{formatCurrency(item.line_amount)}</td>
            <td className="text-center">{formatCurrency(item.discount_amount)}</td>
            <td className="text-center">{formatCurrency(docTotals.totalExempt)}</td>
            <td className="text-center">{formatCurrency(item.taxable_amount)}</td>
            <td className="text-center">{formatCurrency(item.tax)}</td>
          </tr>
        );
      });

      // Add spacer row between documents
      if (docIndex < documentData.length - 1) {
        rows.push(
          <tr key={`spacer-${docIndex}`}>
            <td colSpan={13}></td>
          </tr>
        );
      }
    });

    return rows;
  };
  
  if (showTaxDetail && selectedDocument) {
    return (
      <DocumentLineTaxDetail
        documentCode={selectedDocument.code}
        documentData={[selectedDocument]}
        entity={entity}
        reportName={reportName}
        onBackClick={() => setShowTaxDetail(false)}
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
      <div>
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
                <Download /> Download XLSL
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
                  <td className="fw-bold">Country:</td>
                  <td colSpan={3}>UNITED STATES OF AMERICA</td>
                </tr>
                <tr>
                  <td className="fw-bold">State/Province:</td>
                  {/* <td colSpan={3}>{reason}</td> */}
                  <td colSpan={3}>
                  {currentDocument?.destination_address?.region}
                </td>
                  
                </tr>
                <tr>
                  <td className="fw-bold">Document Code:</td>
                  <td colSpan={3}>All</td>
                </tr>
                <tr>
                  <td className="fw-bold">Report Date:</td>
                  <td colSpan={3}>
                  {currentDocument?.created_at
                    ? formatDateWithTime(currentDocument.created_at)
                    : ''}
                </td>
                </tr>
              </tbody>
            </Table>
          </div>

          <div className="mb-4">
            <Table bordered className="summary-table">
              <tbody>
                <tr>
                  <td colSpan={13} className="text-center">
                    Document Line Detail Reconciliation
                  </td>
                </tr>
                <tr>
              <th className="text-center">Document Code</th>
              <th className="text-center">Document Date</th>
              <th className="text-center">Line</th>
              <th className="text-center">Exemption No</th>
              <th className="text-center">Entity Use Code</th>
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
              <td>{entity}</td>
              <td colSpan={12}></td>
            </tr>
            {generateDocumentRows()}

            <tr className="fw-bold">
              <td colSpan={13}></td>
            </tr>

                <tr className="fw-bold">
                  <td colSpan={13}></td>
                </tr>
                
                <tr className="fw-bold">
                  <td className="text-center">
                  Company Total
                  </td>
                  <td colSpan={7}></td>
                  <td className="text-center">{formatCurrency(grandTotals.totalAmount)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalDiscounts)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalExempt)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalTaxableSales)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalTaxAmount)}</td>
                </tr>
                
                <tr className="fw-bold">
                  <td colSpan={13}></td>
                </tr>

                <tr className="fw-bold">
                  <td className="text-center">
                    Grand Totals
                  </td>
                  <td colSpan={7}></td>
                  <td className="text-center">{formatCurrency(grandTotals.totalAmount)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalDiscounts)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalExempt)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalTaxableSales)}</td>
              <td className="text-center">{formatCurrency(grandTotals.totalTaxAmount)}</td>
                </tr>
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </div>
    </div>
  );
};

export default DocumentLineDetail;
