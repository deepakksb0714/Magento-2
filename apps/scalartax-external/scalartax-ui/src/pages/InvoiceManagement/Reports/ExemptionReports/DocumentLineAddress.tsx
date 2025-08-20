import React, { useState } from 'react';
import { Card, Table, Button } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { ReportData } from "./reportTypes";

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface DocumentLineAddressProps {
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
  selectedLineNumber?: number | 'all' | null;
}

const DocumentLineAddress: React.FC<DocumentLineAddressProps> = ({
  documentCode,
  documentData,
  selectedLineNumber,
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
  const formatAddress = (lineItem: any, useInternalAddress: boolean = false) => {
    // If item address is not null, use item's addresses
    if (lineItem.origin_address && lineItem.destination_address) {
      return {
        origin: `${lineItem.origin_address.street || ''}, ${lineItem.origin_address.street2 || ''}, ${lineItem.origin_address.city || ''}, ${lineItem.origin_address.region || ''}, ${lineItem.origin_address.postal_code || ''}, ${lineItem.origin_address.country || ''}`.replace(/^,\s+/, '').replace(/,\s+,/g, '') || 'N/A',
        destination: `${lineItem.destination_address.street || ''}, ${lineItem.destination_address.street2 || ''}, ${lineItem.destination_address.city || ''}, ${lineItem.destination_address.region || ''}, ${lineItem.destination_address.postal_code || ''}, ${lineItem.destination_address.country || ''}`.replace(/^,\s+/, '').replace(/,\s+,/g, '') || 'N/A'
      };
    }
    
    // If item address is null, use transaction's addresses
    return {
      origin: `${documentData.origin_address?.street || ''}, ${documentData.origin_address?.street2 || ''}, ${documentData.origin_address?.city || ''}, ${documentData.origin_address?.region || ''}, ${documentData.origin_address?.postal_code || ''}, ${documentData.origin_address?.country || ''}`.replace(/^,\s+/, '').replace(/,\s+,/g, '') || 'N/A',
      destination: `${documentData.destination_address?.street || ''}, ${documentData.destination_address?.street2 || ''}, ${documentData.destination_address?.city || ''}, ${documentData.destination_address?.region || ''}, ${documentData.destination_address?.postal_code || ''}, ${documentData.destination_address?.country || ''}`.replace(/^,\s+/, '').replace(/,\s+,/g, '') || 'N/A'
    };
  };
 
  const getFilteredLineItems = () => {
    if (selectedLineNumber === 'all') {
      return documentData.line_items;
    }
    return documentData.line_items.filter((item) => item.line_number === selectedLineNumber);
  };

  const filteredLineItems = getFilteredLineItems();


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

    const lineItemsHtml = filteredLineItems
      .map(
        (lineItem) => {
          // Get formatted addresses for the line item
          const addresses = formatAddress(lineItem);
          return `
            <tr>
              <td class="text-center">${lineItem.line_number || 'N/A'}</td>
              <td class="text-left">${addresses.origin}</td>
              <td class="text-left">${addresses.destination}</td>
            </tr>
          `;
        }
      )
      .join('');

    printContent.innerHTML = `
      <html>
        <head>
          <title>${reportName} - Line Address</title>
          <style>
            @media print {
              body { 
                font-family: Arial, sans-serif; 
                margin: 1cm;
              }
              table { 
                width: 100%; 
                border-collapse: collapse; 
                margin-top: 20px; 
              }
              th, td { 
                border: 1px solid #ddd; 
                padding: 8px; 
                text-align: left; 
              }
              th { 
                background-color: #f4f4f4; 
                text-align: center;
              }
              .text-center { text-align: center; }
              .text-left { text-align: left; }
              h1, h3 { text-align: center; }
              h1 { font-size: 24px; margin-bottom: 20px; }
              h3 { font-size: 18px; margin-top: 10px; }
            }
          </style>
        </head>
        <body>
          <h1>${reportName}</h1>
          <h3>Document Line Address</h3>
          <div>
            <table>
              <tbody>
                <tr>
                  <td style="width: 200px;"><strong>Entities:</strong></td>
                  <td>${entity}</td>
                </tr>
                <tr>
                  <td><strong>Line No:</strong></td>
                  <td>
                    ${selectedLineNumber === 'all' ? 'All' : selectedLineNumber || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td><strong>Document Status:</strong></td>
                  <td>${status}</td>
                </tr>
                <tr>
                  <td><strong>Document Code:</strong></td>
                  <td>${document_code}</td>
                </tr>
                <tr>
                  <td><strong>Report Date:</strong></td>
                  <td>${formatDateWithTime(documentData.created_at)}</td>
                </tr>
              </tbody>
            </table>

            <h3>Address Information</h3>
            <table>
              <thead>
                <tr>
                  <th style="width: 100px;">Line No</th>
                  <th>Origin</th>
                  <th>Destination</th>
                </tr>
              </thead>
              <tbody>
                ${lineItemsHtml}
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

    // Add title
    doc.setFontSize(16);
    doc.text(`${reportName}`, 14, 15);

    // Add Document Summary section
    doc.setFontSize(14);
    const summaryTitle = 'Document Line Address';
    const summaryTitleWidth = doc.getTextWidth(summaryTitle);
    const pageWidth = doc.internal.pageSize.getWidth();
    const summaryTitleX = (pageWidth - summaryTitleWidth) / 2;
    doc.text(summaryTitle, summaryTitleX, 25);

    // First table for document summary
    doc.autoTable({
      startY: 35,
      body: [
        ['Entities:', entity],
        [
          'Line No:',
          selectedLineNumber === 'all' ? 'All' : selectedLineNumber || 'N/A',
        ],
        ['Document Status:', status],
        ['Document Code:', document_code],
        ['Report Date:', formatDateWithTime(documentData.created_at)],
      ],
      styles: { 
        fontSize: 10, 
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { 
          fontStyle: 'bold',
          cellWidth: 40
        },
        1: { 
          cellWidth: 'auto'
        }
      },
      theme: 'grid',
      margin: { left: 14 }
    });

    const firstTableFinalY = (doc.autoTable as any).previous.finalY;

    // Add Address Information title
    doc.setFontSize(14);
    doc.text('Address Information', summaryTitleX, firstTableFinalY + 15);

    // Update line items data with proper address formatting
    const lineItemsData = filteredLineItems.map((lineItem) => {
      const addresses = formatAddress(lineItem);
      return [
        lineItem.line_number || 'N/A',
        addresses.origin,
        addresses.destination
      ];
    });

    doc.autoTable({
      startY: firstTableFinalY + 20,
      head: [['Line No', 'Origin', 'Destination']],
      body: lineItemsData,
      theme: 'grid',
      styles: { 
        fontSize: 8, 
        cellPadding: 3,
        overflow: 'linebreak',
        cellWidth: 'wrap'
      },
      columnStyles: {
        0: { 
          halign: 'center',
          cellWidth: 30
        },
        1: { 
          halign: 'left',
          cellWidth: 'auto'
        },
        2: { 
          halign: 'left',
          cellWidth: 'auto'
        }
      },
      margin: { left: 14 }
    });

    doc.save(`${reportName}_${documentCode}_LineAddress.pdf`);
  };

  const handleDownloadXLSX = () => {
    // Prepare data with properly formatted addresses
    const wsData = filteredLineItems.map((lineItem) => {
      const addresses = formatAddress(lineItem);
      return {
        'Line No': lineItem.line_number || 'N/A',
        'Origin Address': addresses.origin,
        'Destination Address': addresses.destination
      };
    });

    // Create worksheet
    const ws = XLSX.utils.json_to_sheet(wsData);
    
    // Set column widths
    const colWidths = [
      { wch: 10 },  // Line No
      { wch: 50 },  // Origin Address
      { wch: 50 }   // Destination Address
    ];
    ws['!cols'] = colWidths;

    // Create header row with merged cells for document info
    const headerData = [
      [`${reportName}`],
      ['Document Line Address'],
      [''],  // Empty row for spacing
      ['Entities:', entity],
      ['Line No:', selectedLineNumber === 'all' ? 'All' : selectedLineNumber || 'N/A'],
      ['Document Status:', status],
      ['Document Code:', document_code],
      ['Report Date:', formatDateWithTime(documentData.created_at)],
      [''],  // Empty row for spacing
      ['Address Information'],
      ['']   // Empty row before the main data
    ];

    // Create a new worksheet with headers
    const fullWs = XLSX.utils.aoa_to_sheet(headerData);
    
    // Append the address data
    XLSX.utils.sheet_add_json(fullWs, wsData, {
      origin: 'A12',  // Start after the header rows
      skipHeader: false
    });

    // Create workbook and add worksheet
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, fullWs, 'Line Address');

    // Save file
    XLSX.writeFile(wb, `${reportName}_${documentCode}_LineAddress.xlsx`);
  };


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
            <h3 className="text-center">Document Line Address</h3>
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
                  <td className="fw-bold">Line No</td>
                  <td colSpan={3}>
                    {selectedLineNumber === 'all' ? 'All' : selectedLineNumber || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td className="fw-bold">Document Status:</td>
                  <td colSpan={3}>{status}</td>
                </tr>
                <tr>
                  <td className="fw-bold">Document Code:</td>
                  <td colSpan={3}>{documentCode}</td>
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
                  <th className="text-center">Line No</th>
                  <th className="text-center">Origin</th>
                  <th className="text-center">Destination</th>
                </tr>
                {filteredLineItems.map((lineItem, index) => {
                  const addressData = formatAddress(lineItem);
                  return (
                    <tr key={index}>
                      <td className="text-center">
                        {lineItem.line_number || 'N/A'}
                      </td>
                      <td className="text-center">
                        {addressData.origin}
                      </td>
                      <td className="text-center">
                        {addressData.destination}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DocumentLineAddress;