import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { ReportData } from "./reportTypes";
import DocumentLineAddress from './DocumentLineAddress'; 

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface DocumentLineTaxDetailProps {
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

const DocumentLineTaxDetail: React.FC<DocumentLineTaxDetailProps> = ({
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
     const [selectedLineNumber, setSelectedLineNumber] = useState<
        number | 'all' | null
      >(null);

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

  // Get individual Document Line Tax Detail
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

  const handleLineClick = (code: string, lineNumber: number) => {
    const selectedData = documentData.find((doc) => doc.code === code);
    if (selectedData) {
      setSelectedDocumentCode(code);
      setSelectedDocumentData(selectedData);
      setSelectedLineNumber(lineNumber);
      setShowLineDetail(true);
    }
  };

  const handleDocumentClick = () => {
    // Use the first document's code and set line number to 'all'
    if (documentData.length > 0) {
      setSelectedDocumentCode(documentData[0].code);
      setSelectedDocumentData(documentData[0]);
      setSelectedLineNumber('all');
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
            <h3>Document Line Tax Detail</h3>
            <table>
              <tbody>
                <tr>
                  <td><strong>Entities:</strong></td>
                  <td colspan="3">${entity}</td>
                </tr>
                <tr>
                  <td><strong>Country:</strong></td>
                  <td colspan="3">UNITED STATES OF AMERICA</td>
                </tr>
                <tr>
                  <td><strong>State/Province:</strong></td>
                  <td colspan="3">${documentData[0]?.destination_address?.region}</td>
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
  
            <table>
              <thead>
                <tr>
                  <td></td>
                  <td colSpan='14' className="text-center">
                  Document Line Tax Detail
                  </td>
                </tr>
                <tr>
                  <th className="text-center">Document Code</th>
                  <th className="text-center">Document Date</th>
                  <th className="text-center">Line</th>
                  <th className="text-center">Item</th>
                  <th className="text-center">Tax Code</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Jurisdiction Code</th>
                  <th className="text-center">Jurisdiction Type</th>
                  <th className="text-center">Jurisdiction</th>
                  <th className="text-center">Tax Rates</th>
                  <th className="text-center">Total Sales</th>
                  <th className="text-center">Discounts</th>
                  <th className="text-center">Exempt Amount/Non Taxable</th>
                  <th className="text-center">Taxable Sales</th>
                  <th className="text-center">Tax Amount</th>
                </tr>
            
                <tr>
                  <td>
                    ${entity}
                  </td>
                  <td colSpan='15'></td>
                </tr>
                </tr> 
              </thead>
              
              <tbody>
                ${documentData.flatMap((doc) => 
                  doc.line_items.map((lineItem) => `
                     <tr>
                            <td colSpan='2'></td>
                            <td className="text-center">
                          
                              ${lineItem.line_number}
                            
                            </td>
                            <td className="text-center">${lineItem.item_code}</td>
                            <td className="text-center">${lineItem.tax_code}</td>
                            <td className="text-center">${lineItem.quantity}</td>
                            <td colSpan='4'></td>
                            <td className="text-center">${formatCurrency(lineItem.line_amount)}</td>
                            <td className="text-center">${formatCurrency(lineItem.discount_amount)}</td>
                            <td className="text-center">${formatCurrency(0)}</td>
                            <td className="text-center">${formatCurrency(lineItem.taxable_amount)}</td>
                            <td className="text-center">${formatCurrency(lineItem.tax)}</td>
                          </tr>

                      <tr>
                            <td colSpan='6'></td>
                            <td className="text-center">City</td>
                            <td className="text-center">${documentData[0]?.destination_address?.city}</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td colSpan='4'></td>
                            <td className="text-center">${formatCurrency(lineItem.tax / 3)}</td>
                          </tr>
                          <tr>
                            <td colSpan='6'></td>
                            <td className="text-center">County</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td colSpan='4'></td>
                            <td className="text-center">${formatCurrency(lineItem.tax / 3)}</td>
                          </tr>
                          <tr>
                            <td colSpan='6'></td>
                            <td className="text-center">State</td>
                            <td className="text-center">${documentData[0]?.destination_address?.region}</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td colSpan='4'></td>
                            <td className="text-center">${formatCurrency(lineItem.tax / 3)}</td>
                          </tr>
                  `)
                ).join('')}
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
    
    // Title
    doc.setFontSize(16);
    doc.text(reportName, 14, 15);
    
    // Document Line Tax Detail Section
    doc.setFontSize(14);
    doc.text('Document Line Tax Detail', 14, 25);
    
    // Metadata table matching UI structure
    doc.autoTable({
      body: [
        ['Entities:', entity],
        ['Country:', 'UNITED STATES OF AMERICA'],
        ['State/Province:', documentData[0]?.destination_address?.region || ''],
        ['Document Code:', document_code],
        ['Report Date:', documentData[0].created_at ? formatDateWithTime(documentData[0].created_at) : 'N/A'],
      ],
      startY: 30,
      theme: 'grid',
      styles: { fontSize: 10, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 'auto' }
      }
    });
  
    // Main table header matching UI structure exactly
    const mainTableHeaders = [
      [{ content: '', colSpan: 1 }, { content: 'Document Line Tax Detail', colSpan: 14, styles: { halign: 'center' } }],
      [
        'Document Code', 'Document Date', 'Line', 'Item', 'Tax Code', 'Qty',
        'Jurisdiction Code', 'Jurisdiction Type', 'Jurisdiction', 'Tax Rates',
        'Total Sales', 'Discounts', 'Exempt Amount/Non Taxable', 'Taxable Sales', 'Tax Amount'
      ],
      [{ content: entity, colSpan: 1 }, { content: '', colSpan: 14 }]
    ];
  
    // Generate document rows and their corresponding line items
    const tableRows = documentData.flatMap((doc) => {
      const summary = getDocumentSummary(doc);
      const documentRow = [
        document_code,
        formatDate(summary.date),
        '', '', '', '', '', '', '',
        '',
        formatCurrency(summary.totalAmount),
        formatCurrency(summary.totalDiscount),
        formatCurrency(summary.totalExempt),
        formatCurrency(summary.totalTaxable),
        formatCurrency(summary.totalTax)
      ];
  
      // Generate line item rows with jurisdictions
      const lineItemRows = doc.line_items.flatMap((lineItem) => {
        const lineRow = [
          '', '',
          lineItem.line_number,
          lineItem.item_code,
          lineItem.tax_code,
          lineItem.quantity,
          '', '', '', '',
          formatCurrency(lineItem.line_amount),
          formatCurrency(lineItem.discount_amount),
          formatCurrency(0),
          formatCurrency(lineItem.taxable_amount),
          formatCurrency(lineItem.tax)
        ];
  
        // Add jurisdiction rows for each line item
        const jurisdictionRows = [
          ['', '', '', '', '', '', 'City', documentData[0]?.destination_address?.city || '', '', '', '', '', '', '', formatCurrency(lineItem.tax / 3)],
          ['', '', '', '', '', '', 'County', '', '', '', '', '', '', '', formatCurrency(lineItem.tax / 3)],
          ['', '', '', '', '', '', 'State', documentData[0]?.destination_address?.region || '', '', '', '', '', '', '', formatCurrency(lineItem.tax / 3)]
        ];
  
        return [lineRow, ...jurisdictionRows];
      });
  
      return [documentRow, ...lineItemRows];
    });
  
    // Generate the main table
    doc.autoTable({
      head: mainTableHeaders,
      body: tableRows,
      startY: (doc.autoTable as any).previous.finalY + 10,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 2 },
      columnStyles: {
        0: { cellWidth: 25 },
        1: { cellWidth: 25 },
        2: { cellWidth: 15 },
        // Add more column styles as needed
      },
      didDrawCell: (data:any) => {
        // Add custom cell styling if needed
      }
    });
  
    // Save the PDF
    doc.save(`${reportName}_${documentCode}_Detail.pdf`);
  };
  
  const handleDownloadXLSX = () => {
    // Create data rows with individual documents and total entity row
    const documentRows = documentData.flatMap((doc) =>
      doc.line_items.map((lineItem) => ({
        'Document Code': document_code,
        'Item Code': lineItem.item_code,
        'Tax Code': lineItem.tax_code,
        'Qty': lineItem.quantity,
        // 'Jurisdiction Code': lineItem.region,
        'Line Amount': formatCurrency(lineItem.line_amount),
        'Discount Amount': formatCurrency(lineItem.discount_amount),
        'Exempt Amount/Non Taxable': formatCurrency(0),
        'Taxable Amount': formatCurrency(lineItem.taxable_amount),
        'Tax Amount': formatCurrency(lineItem.tax),
      }))
    );
  
    // Add total entity row
    const totalEntityRow = {
      'Document Code': 'Total Entity',
      'Item Code': '',
      'Tax Code': '',
      'Qty': '',
      'Jurisdiction Code': '',
      'Line Amount': formatCurrency(aggregated.totalSales),
      'Discount Amount': formatCurrency(aggregated.totalTaxable),
      'Exempt Amount/Non Taxable': formatCurrency(aggregated.totalExempt),
      'Taxable Amount': formatCurrency(aggregated.totalDiscount),
      'Tax Amount': formatCurrency(aggregated.totalTax),
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
      <DocumentLineAddress 
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
        selectedLineNumber={selectedLineNumber}  // This should now have the correct value
      />
    );
  }

  

  return (
    <div className="w-full">
      <div className="shadow-sm">
      <Card.Body>
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
      
          <h3 className="mb-3">{reportName}</h3>
          <div className="mb-4">
            <h3 className="text-center">Document Line Tax Detail</h3>
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
                  <td className="fw-bold">Country</td>
                  <td colSpan={3}>UNITED STATES OF AMERICA</td>
                </tr>
                <tr>
                  <td className="fw-bold">State/Province</td>
                  <td colSpan={3}>
                    {documentData[0]?.destination_address?.region}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Document Code</td>
                  <td colSpan={3}>{documentCode}</td>
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
              <Table bordered className="summary-table">
              <tbody>
              <tr>
                  <td></td>
                  <td colSpan={14} className="text-center">
                  Document Line Tax Detail
                  </td>
                </tr>
                <tr>
                  <th className="text-center">Document Code</th>
                  <th className="text-center">Document Date</th>
                  <th className="text-center">Line</th>
                  <th className="text-center">Item</th>
                  <th className="text-center">Tax Code</th>
                  <th className="text-center">Qty</th>
                  <th className="text-center">Jurisdiction Code</th>
                  <th className="text-center">Jurisdiction Type</th>
                  <th className="text-center">Jurisdiction</th>
                  <th className="text-center">Tax Rates</th>
                  <th className="text-center">Total Sales</th>
                  <th className="text-center">Discounts</th>
                  <th className="text-center">Exempt Amount/Non Taxable</th>
                  <th className="text-center">Taxable Sales</th>
                  <th className="text-center">Tax Amount</th>
                </tr>
            
                <tr>
                  <td>
                    {entity}
                  </td>
                  <td colSpan={15}></td>
                </tr>
                
                {documentData.map((doc, index) => {
                  const summary = getDocumentSummary(doc);
                  return (
                    <>
                      <tr key={`${doc.code}-${index}`}>
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
                          {formatDate(summary.date)}
                        </td>
                        <td colSpan={8}></td>
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
                {/* Replace the existing jurisdiction rows mapping with this code */}
                  {documentData.map((doc, index) => {
                    const summary = getDocumentSummary(doc);
                    return doc.line_items.map((lineItem, lineIndex) => {
                      // First render the line item row
                      return (
                        <React.Fragment key={`${doc.code}-${lineIndex}`}>
                          {/* Line item row */}
                          <tr>
                            <td colSpan={2}></td>
                            <td className="text-center">
                            <Button
                              variant="link"
                              className="p-0 text-primary text-decoration-underline"
                              onClick={() => handleLineClick(doc.code, lineItem.line_number)}
                            >
                              {lineItem.line_number}
                            </Button>
                            </td>
                            <td className="text-center">{lineItem.item_code}</td>
                            <td className="text-center">{lineItem.tax_code}</td>
                            <td className="text-center">{lineItem.quantity}</td>
                            <td colSpan={4}></td>
                            <td className="text-center">{formatCurrency(lineItem.line_amount)}</td>
                            <td className="text-center">{formatCurrency(lineItem.discount_amount)}</td>
                            <td className="text-center">{formatCurrency(0)}</td>
                            <td className="text-center">{formatCurrency(lineItem.taxable_amount)}</td>
                            <td className="text-center">{formatCurrency(lineItem.tax)}</td>
                          </tr>
                          
                          {/* Render jurisdiction rows only for this line item */}
                          <tr>
                            <td colSpan={6}></td>
                            <td className="text-center">City</td>
                            <td className="text-center">{documentData[0]?.destination_address?.city}</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td colSpan={4}></td>
                            <td className="text-center">{formatCurrency(lineItem.tax / 3)}</td>
                          </tr>
                          <tr>
                            <td colSpan={6}></td>
                            <td className="text-center">County</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td colSpan={4}></td>
                            <td className="text-center">{formatCurrency(lineItem.tax / 3)}</td>
                          </tr>
                          <tr>
                            <td colSpan={6}></td>
                            <td className="text-center">State</td>
                            <td className="text-center">{documentData[0]?.destination_address?.region}</td>
                            <td className="text-center"></td>
                            <td className="text-center"></td>
                            <td colSpan={4}></td>
                            <td className="text-center">{formatCurrency(lineItem.tax / 3)}</td>
                          </tr>
                        </React.Fragment>
                      );
                    });
                  })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </div>
    </div>
  );
};

export default DocumentLineTaxDetail;
