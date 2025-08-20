import React, { useState } from 'react';
import { Table, Card, Button, Pagination, Spinner } from 'react-bootstrap';
import { ArrowLeft, Download, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import 'jspdf-autotable';
import { ReportData } from "./reportTypes";
import DocumentLineDetail from './DocumentLineDetail';
import { getStateFullName } from './stateMapping';



declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

interface AggregatedReportData {
  destination_address: {
    region?: string;
    city?: string;
  };
   entity_use_code?: string; 
   tax_code?: string; 
   has_nexus?: string; 
   certificate_id?: string; 
  total_exempt: number;
  original_transactions: ReportData[];
}

interface SelectedDocument {
  documentCode: string;
  documentData: ReportData[];
}



interface ExemptionDetailJurisdictionReportProps {
  reportData: ReportData[];
  loading: boolean;
  onBackClick: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  reportName: string;
  entity: string;
  tax_type: string;
  reason: string;
  Level: string;
  date_option: string;
  custom_date_from: string;
  custom_date_to: string;
}

const ExemptionDetailJurisdictionReport: React.FC<ExemptionDetailJurisdictionReportProps> = ({
  reportData,
  loading,
  onBackClick,
  currentPage,
  totalPages,
  onPageChange,
  reportName,
  entity,
  tax_type,
  reason,
  Level,
  date_option,
  custom_date_from,
  custom_date_to,
}) => {
  const [selectedDocumentData, setSelectedDocumentData] = useState<{
    documentCode: string;
    documentData: ReportData[];  // Changed to ReportData[]
  } | null>(null);

  const handleTotalClick = (transactions: ReportData[], region: string) => {
    // Create a new array with the correct region for all transactions
    const transactionsWithRegion = transactions.map(transaction => ({
      ...transaction,
      destination_address: {
        ...transaction.destination_address,
        region: region
      }
    }));
  
    setSelectedDocumentData({
      documentCode: transactions[0]?.code || 'DEFAULT',
      documentData: transactionsWithRegion
    });
  };

  

  // Add a handler to return to the main view
  const handleBackToList = () => {
    setSelectedDocumentData(null);
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
        const period = date_option === 'other_range'
          ? `${formatDate(custom_date_from)} - ${formatDate(custom_date_to)}`
          : getPeriodDateRange(date_option);
      
        // Get section data
        const section1Data = getSection1Data(reportData);
        const section2Data = getSection2Data(reportData);
        const section3Data = getSection3Data(reportData);
      
        // Create aggregated data for section 1
        const aggregatedSection1Data = aggregateTransactionsByJurisdictionAndCode(section1Data);
        const section1Total = section1Data.reduce((sum, row) => sum + Number(row.total_exempt), 0);
      
        // Create aggregated data for section 2
        const aggregatedSection2Data = aggregateTransactionsByJurisdictionAndCode(section2Data);
        const section2Total = section2Data.reduce((sum, row) => sum + Number(row.total_exempt), 0);
      
        // Create aggregated data for section 3
        const aggregatedSection3Data = aggregateTransactionsByJurisdictionAndCode(section3Data);
        const section3Total = section3Data.reduce((sum, row) => sum + Number(row.total_exempt), 0);
      
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
                .section-header { background-color: #f8f9fa; font-weight: bold; }
                .empty-section { text-align: center; padding: 20px; background-color: #f8f9fa; }
              </style>
            </head>
            <body>
              <h1>${reportName}</h1>
              
              <!-- Summary Table -->
              <table>
                <tbody>
                  <tr><td><strong>Entities:</strong></td><td colspan="3">${entity}</td></tr>
                  <tr><td><strong>Period:</strong></td><td colspan="3">${period}</td></tr>
                  <tr><td><strong>Tax Type:</strong></td><td colspan="3">${tax_type}</td></tr>
                  <tr><td><strong>Country:</strong></td><td colspan="3">UNITED STATES OF AMERICA</td></tr>
                  <tr><td><strong>State/Province:</strong></td><td colspan="3">${reason}</td></tr>
                  <tr><td><strong>Jurisdiction Type:</strong></td><td colspan="3">${Level}</td></tr>
                  <tr><td><strong>Report Date:</strong></td><td colspan="3">${createdAt}</td></tr>
                </tbody>
              </table>
      
              <!-- Section 1 -->
              <h3>SECTION 1: EXEMPT SALES (Entity and Use based exemption)</h3>
              ${section1Data.length > 0 ? `
                <table>
                  <thead>
                    <tr><th colspan="6">Customer is Exempt</th></tr>
                    <tr><td colspan="6">${Level}: ${reportData[0]?.destination_address?.region || ''}</td></tr>
                    <tr>
                      <th></th>
                      <th>Jurisdiction</th>
                      <th>Exempt Reason Id</th>
                      <th>Entity Use Code</th>
                      <th>Certificate Applied</th>
                      <th>Exempt Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${aggregatedSection1Data.map(row => `
                      <tr>
                        <td></td>
                        <td>${getStateFullName(row.destination_address?.region || '')}</td>
                        <td></td>
                        <td>${row.entity_use_code || ''}</td>
                        <td></td>
                        <td class="text-end">${formatCurrency(row.total_exempt)}</td>
                      </tr>
                    `).join('')}
                    <tr>
                      <td colspan="5">TOTAL OF SECTION 1: EXEMPT SALES (Entity and Use based exemption)</td>
                      <td class="text-end">${formatCurrency(section1Total)}</td>
                    </tr>
                  </tbody>
                </table>
              ` : `
                <div class="empty-section">No data found for Entity and Use based exemption</div>
              `}
      
              <!-- Section 2 -->
              <h3>SECTION 2: NON TAXABLE SALES (Product and Services)</h3>
              ${section2Data.length > 0 ? `
                <table>
                  <thead>
                    <tr><td colspan="6">${Level}: ${reportData[0]?.destination_address?.region || ''}</td></tr>
                    <tr>
                      <th></th>
                      <th>Jurisdiction</th>
                      <th>TaxCode</th>
                      <th colspan="2">TaxCode Description</th>
                      <th>Non-Taxable Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${aggregatedSection2Data.map(row => `
                      <tr>
                        <td></td>
                        <td>${getStateFullName(row.destination_address?.region || '')}</td>
                        <td>${row.original_transactions[0]?.line_items[0]?.tax_code || ''}</td>
                        <td colspan="2"></td>
                        <td class="text-end">${formatCurrency(row.total_exempt)}</td>
                      </tr>
                    `).join('')}
                    <tr>
                      <td colspan="5">TOTAL OF SECTION 2: NON TAXABLE SALES (Product and Services)</td>
                      <td class="text-end">${formatCurrency(section2Total)}</td>
                    </tr>
                  </tbody>
                </table>
              ` : `
                <div class="empty-section">No data found for Product and Services</div>
              `}
      
              <!-- Section 3 -->
              <h3>SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)</h3>
              ${section3Data.length > 0 ? `
                <table>
                  <thead>
                    <tr><td colspan="6">${Level}: ${reportData[0]?.destination_address?.region || ''}</td></tr>
                    <tr>
                      <th></th>
                      <th>Jurisdiction</th>
                      <th>TaxCode</th>
                      <th colspan="2">TaxCode Description</th>
                      <th>Non-Taxable Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${aggregatedSection3Data.map(row => `
                      <tr>
                        <td></td>
                        <td>${getStateFullName(row.destination_address?.region || '')}</td>
                        <td>${row.original_transactions[0]?.line_items[0]?.tax_code || ''}</td>
                        <td colspan="2"></td>
                        <td class="text-end">${formatCurrency(row.total_exempt)}</td>
                      </tr>
                    `).join('')}
                    <tr>
                      <td colspan="5">TOTAL OF SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)</td>
                      <td class="text-end">${formatCurrency(section3Total)}</td>
                    </tr>
                  </tbody>
                </table>
              ` : `
                <div class="empty-section">No data found for No Nexus Jurisdictions</div>
              `}
            </body>
          </html>
        `;
      
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(printContent.innerHTML);
          printWindow.document.close();
          printWindow.focus();
      
          setTimeout(() => {
            printWindow.print();
            printWindow.onafterprint = () => {
              printWindow.close();
            };
          }, 500);
        }
      };
      
      const handleDownloadPDF = () => {
        const doc = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a4'
        });
      
        const period = date_option === 'other_range'
          ? `${formatDate(custom_date_from)} - ${formatDate(custom_date_to)}`
          : getPeriodDateRange(date_option);
      
        // Get section data
        const section1Data = getSection1Data(reportData);
        const section2Data = getSection2Data(reportData);
        const section3Data = getSection3Data(reportData);
      
        // Create aggregated data
        const aggregatedSection1Data = aggregateTransactionsByJurisdictionAndCode(section1Data);
        const aggregatedSection2Data = aggregateTransactionsByJurisdictionAndCode(section2Data);
        const aggregatedSection3Data = aggregateTransactionsByJurisdictionAndCode(section3Data);
      
        // Title
        doc.setFontSize(16);
        doc.text('Exemption Detail by Jurisdiction Report', 15, 15);
      
        // Summary table
        doc.autoTable({
          body: [
            ['Entities:', entity],
            ['Period:', period],
            ['Tax Type:', tax_type],
            ['Country:', 'UNITED STATES OF AMERICA'],
            ['State/Province:', reason],
            ['Jurisdiction Type:', Level],
            ['Report Date:', createdAt],
            ['SECTION 1: EXEMPT SALES (Entity and Use based exemption)', ''],
            ['SECTION 2: NON TAXABLE SALES (Product and Services)', ''],
            ['SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)', ''],
          ],
          startY: 25,
          theme: 'grid',
          styles: { fontSize: 10 },
          columnStyles: {
            0: { cellWidth: 80 },
            1: { cellWidth: 140 }
          }
        });
      
        let currentY = (doc.autoTable as any).previous.finalY + 10;
      
        // Section 1
        if (section1Data.length > 0) {
          // Section 1 Header
          doc.autoTable({
            body: [
              ['SECTION 1: EXEMPT SALES (Entity and Use based exemption)'],
              ['Customer is Exempt'],
              [`${Level}: ${reportData[0]?.destination_address?.region || ''}`]
            ],
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 10, fontStyle: 'bold' }
          });
      
          currentY = (doc.autoTable as any).previous.finalY;
      
          // Section 1 Data
          doc.autoTable({
            head: [[
              '',
              'Jurisdiction',
              'Exempt Reason Id',
              'Entity Use Code',
              'Certificate Applied',
              'Exempt Amount'
            ]],
            body: [
              ...aggregatedSection1Data.map(row => [
                '',
                getStateFullName(row.destination_address?.region || ''),
                '',
                row.entity_use_code || '',
                '',
                formatCurrency(row.total_exempt)
              ]),
              ['', '', '', '', '', ''],
              [
                '',
                '',
                '',
                '',
                'Total:',
                formatCurrency(section1Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
              ],
              ['', '', '', '', '', ''],
              [
                'TOTAL OF SECTION 1: EXEMPT SALES (Entity and Use based exemption)',
                '',
                '',
                '',
                '',
                formatCurrency(section1Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
              ]
            ],
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 60 },
              2: { cellWidth: 40 },
              3: { cellWidth: 40 },
              4: { cellWidth: 40 },
              5: { cellWidth: 40, halign: 'right' }
            }
          });
      
          currentY = (doc.autoTable as any).previous.finalY + 10;
        } else {
          doc.autoTable({
            body: [['No data found for Entity and Use based exemption']],
            startY: currentY,
            styles: { fontSize: 10, halign: 'center' }
          });
          currentY = (doc.autoTable as any).previous.finalY + 10;
        }
      
        // Section 2
        if (section2Data.length > 0) {
          // Section 2 Header
          doc.autoTable({
            body: [
              ['SECTION 2: NON TAXABLE SALES (Product and Services)'],
              [`${Level}: ${reportData[0]?.destination_address?.region || ''}`]
            ],
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 10, fontStyle: 'bold' }
          });
      
          currentY = (doc.autoTable as any).previous.finalY;
      
          // Section 2 Data
          doc.autoTable({
            head: [[
              '',
              'Jurisdiction',
              'TaxCode',
              'TaxCode Description',
              '',
              'Non-Taxable Amount'
            ]],
            body: [
              ...aggregatedSection2Data.map(row => [
                '',
                getStateFullName(row.destination_address?.region || ''),
                row.original_transactions[0]?.line_items[0]?.tax_code || '',
                row.original_transactions[0]?.code || '',
                '',
                formatCurrency(row.total_exempt)
              ]),
              ['', '', '', '', '', ''],
              [
                '',
                '',
                '',
                '',
                'Total:',
                formatCurrency(section2Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
              ],
              ['', '', '', '', '', ''],
              [
                'TOTAL OF SECTION 2: NON TAXABLE SALES (Product and Services)',
                '',
                '',
                '',
                '',
                formatCurrency(section2Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
              ]
            ],
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 60 },
              2: { cellWidth: 40 },
              3: { cellWidth: 40 },
              4: { cellWidth: 40 },
              5: { cellWidth: 40, halign: 'right' }
            }
          });
      
          currentY = (doc.autoTable as any).previous.finalY + 10;
        } else {
          doc.autoTable({
            body: [['No data found for Product and Services']],
            startY: currentY,
            styles: { fontSize: 10, halign: 'center' }
          });
          currentY = (doc.autoTable as any).previous.finalY + 10;
        }
      
        // Section 3
        if (section3Data.length > 0) {
          // Section 3 Header
          doc.autoTable({
            body: [
              ['SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)'],
              [`${Level}: ${reportData[0]?.destination_address?.region || ''}`]
            ],
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 10, fontStyle: 'bold' }
          });
      
          currentY = (doc.autoTable as any).previous.finalY;
      
          // Section 3 Data
          doc.autoTable({
            head: [[
              '',
              'Jurisdiction',
              'TaxCode',
              'TaxCode Description',
              '',
              'Non-Taxable Amount'
            ]],
            body: [
              ...aggregatedSection3Data.map(row => [
                '',
                getStateFullName(row.destination_address?.region || ''),
                row.original_transactions[0]?.line_items[0]?.tax_code || '',
                row.original_transactions[0]?.code || '',
                '',
                formatCurrency(row.total_exempt)
              ]),
              ['', '', '', '', '', ''],
              [
                '',
                '',
                '',
                '',
                'Total:',
                formatCurrency(section3Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
              ],
              ['', '', '', '', '', ''],
              [
                'TOTAL OF SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)',
                '',
                '',
                '',
                '',
                formatCurrency(section3Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
              ]
            ],
            startY: currentY,
            theme: 'grid',
            styles: { fontSize: 9 },
            columnStyles: {
              0: { cellWidth: 15 },
              1: { cellWidth: 60 },
              2: { cellWidth: 40 },
              3: { cellWidth: 40 },
              4: { cellWidth: 40 },
              5: { cellWidth: 40, halign: 'right' }
            }
          });
        } else {
          doc.autoTable({
            body: [['No data found for No Nexus Jurisdictions']],
            startY: currentY,
            styles: { fontSize: 10, halign: 'center' }
          });
        }
      
        doc.save(`${reportName}.pdf`);
      };
      
      
      const handleDownloadXLSX = () => {
        const period = date_option === 'other_range'
          ? `${formatDate(custom_date_from)} - ${formatDate(custom_date_to)}`
          : getPeriodDateRange(date_option);
      
        // Get section data
        const section1Data = getSection1Data(reportData);
        const section2Data = getSection2Data(reportData);
        const section3Data = getSection3Data(reportData);
      
        // Create aggregated data
        const aggregatedSection1Data = aggregateTransactionsByJurisdictionAndCode(section1Data);
        const aggregatedSection2Data = aggregateTransactionsByJurisdictionAndCode(section2Data);
        const aggregatedSection3Data = aggregateTransactionsByJurisdictionAndCode(section3Data);
      
        const wsData = [
          // Header information
          ['Exemption Detail by Jurisdiction Report'],
          [''],
          ['Entities:', entity],
          ['Period:', period],
          ['Tax Type:', tax_type],
          ['Country:', 'UNITED STATES OF AMERICA'],
          ['State/Province:', reason],
          ['Jurisdiction Type:', Level],
          ['Report Date:', createdAt],
          [''],
          ['SECTION 1: EXEMPT SALES (Entity and Use based exemption)'],
          ['SECTION 2: NON TAXABLE SALES (Product and Services)'],
          ['SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)'],
          [''],
      
          // Section 1
          ['SECTION 1: EXEMPT SALES (Entity and Use based exemption)'],
          ['Customer is Exempt'],
          section1Data.length > 0 ? [`${Level}: ${reportData[0]?.destination_address?.region || ''}`] : [],
          [''],
        ];
      
        if (section1Data.length > 0) {
          wsData.push([
            '',
            'Jurisdiction',
            'Exempt Reason Id',
            'Entity Use Code',
            'Certificate Applied',
            'Exempt Amount'
          ]);
      
          aggregatedSection1Data.forEach(row => {
            wsData.push([
              '',
              getStateFullName(row.destination_address?.region || ''),
              '',
              row.entity_use_code || '',
              '',
              formatCurrency(row.total_exempt)
            ]);
          });
      
          wsData.push(
            ['', '', '', '', '', ''],
            [
              'TOTAL OF SECTION 1: EXEMPT SALES (Entity and Use based exemption)',
              '',
              '',
              '',
              '',
              formatCurrency(section1Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
            ]
          );
        } else {
          wsData.push(['No data found for Entity and Use based exemption']);
        }
      
        // Add spacing between sections
        wsData.push([''], ['']);
      
        // Section 2
        wsData.push(
          ['SECTION 2: NON TAXABLE SALES (Product and Services)'],
          section2Data.length > 0 ? [`${Level}: ${reportData[0]?.destination_address?.region || ''}`] : [],
          ['']
        );
      
        if (section2Data.length > 0) {
          wsData.push([
            '',
            'Jurisdiction',
            'TaxCode',
            'TaxCode Description',
            '',
            'Non-Taxable Amount'
          ]);
      
          aggregatedSection2Data.forEach(row => {
            wsData.push([
              '',
              getStateFullName(row.destination_address?.region || ''),
              row.original_transactions[0]?.line_items[0]?.tax_code || '',
              row.original_transactions[0]?.code || '',
              '',
              formatCurrency(row.total_exempt)
            ]);
          });
      
          wsData.push(
            ['', '', '', '', '', ''],
            [
              'TOTAL OF SECTION 2: NON TAXABLE SALES (Product and Services)',
              '',
              '',
              '',
              '',
              formatCurrency(section2Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
            ]
          );
        } else {
          wsData.push(['No data found for Product and Services']);
        }
      
        // Add spacing between sections
        wsData.push([''], ['']);
      
        // Section 3
        wsData.push(
          ['SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)'],
          section3Data.length > 0 ? [`${Level}: ${reportData[0]?.destination_address?.region || ''}`] : [],
          ['']
        );
      
        if (section3Data.length > 0) {
          wsData.push([
            '',
            'Jurisdiction',
            'TaxCode',
            'TaxCode Description',
            '',
            'Non-Taxable Amount'
          ]);
      
          aggregatedSection3Data.forEach(row => {
            wsData.push([
              '',
              getStateFullName(row.destination_address?.region || ''),
              row.original_transactions[0]?.line_items[0]?.tax_code || '',
              row.original_transactions[0]?.code || '',
              '',
              formatCurrency(row.total_exempt)
            ]);
          });
      
          wsData.push(
            ['', '', '', '', '', ''],
            [
              'TOTAL OF SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)',
              '',
              '',
              '',
              '',
              formatCurrency(section3Data.reduce((sum, row) => sum + Number(row.total_exempt), 0))
            ]
          );
        } else {
          wsData.push(['No data found for No Nexus Jurisdictions']);
        }
      
        const ws = XLSX.utils.aoa_to_sheet(wsData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Report');
        XLSX.writeFile(wb, `${reportName}.xlsx`);
      };
      
      const aggregateTransactionsByJurisdictionAndCode = (data: ReportData[]): AggregatedReportData[] => {
        const aggregatedMap = data.reduce((acc, curr) => {
          const jurisdiction = curr.destination_address?.region || '';
          let key: string;
          
          // For Section 1 (Entity Use Code)
          if (curr.entity_use_code) {
            key = `${jurisdiction}-${curr.entity_use_code}`;
          }
          // For Section 2 (Tax Code)
          else if (curr.line_items?.[0]?.tax_code) {
            key = `${jurisdiction}-${curr.line_items[0].tax_code}`;
          }
          // For Section 3 (Has Nexus)
          else if (curr.has_nexus) {
            key = `${jurisdiction}-${curr.has_nexus}`;
          }
          else {
            key = jurisdiction;
          }
          
          if (!acc.has(key)) {
            acc.set(key, {
              destination_address: curr.destination_address,
              entity_use_code: curr.entity_use_code,
              tax_code: curr.line_items?.[0]?.tax_code,
              has_nexus: curr.has_nexus,
              certificate_id: curr.certificate_id,
              total_exempt: curr.total_exempt,
              original_transactions: [curr]
            });
          } else {
            const existing = acc.get(key)!;
            existing.total_exempt += curr.total_exempt;
            existing.original_transactions.push(curr);
          }
          
          return acc;
        }, new Map<string, AggregatedReportData>());
    
        return Array.from(aggregatedMap.values());
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

   if (selectedDocumentData) {
    return (
      <DocumentLineDetail
        documentCode={selectedDocumentData.documentCode}
        documentData={selectedDocumentData.documentData}
        entity={entity}
        reportName={reportName}
        onBackClick={handleBackToList}
        reason={reason}
        date_option={date_option}
        date_type={tax_type}
        status="Committed"
        custom_date_from={custom_date_from}
        custom_date_to={custom_date_to}
        document_code="All"
      />
    );
  }

  const isEmpty = !loading && (!reportData || reportData.length === 0);

 // Update the section filter functions
 const getSection1Data = (data: ReportData[]) => {
  return data.filter(row => row.certificate_id || row.entity_use_code);
};

const getSection2Data = (data: ReportData[]) => {
  return data.filter(row => 
    row.line_items?.some(item => item.tax_code && item.tax_code.trim() !== '') &&
    !row.certificate_id && !row.entity_use_code
  );
};

const getSection3Data = (data: ReportData[]) => {
  return data.filter(row => {
    const hasNexus = row.has_nexus === "false" ? false : Boolean(Number(row.has_nexus));
    
    // Check if 'certificate_id', 'entity_use_code', and 'tax_code' are not present
    const noCertificateIdOrEntityUseCode = !row.certificate_id && !row.entity_use_code;
    const noTaxCode = !row.line_items?.some(item => item.tax_code);

    return hasNexus === false && noCertificateIdOrEntityUseCode && noTaxCode;
  });
};







const section1Data = getSection1Data(reportData);
  const section2Data = getSection2Data(reportData);
  const section3Data = getSection3Data(reportData);


  const getLocationValue = (row: ReportData) => {
    if (Level === 'City') {
      return row.destination_address?.city || '';
    }
    return getStateFullName(row.destination_address?.region || '');
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
                No results found based on the selected criteria.
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
                <h4 className="text-center">Exemption Detail by Jurisdiction Report</h4>
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
                      <td className="fw-bold">tax type:</td>
                      <td colSpan={3}>{tax_type}</td>
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
                      <td className="fw-bold">Jurisdiction Type:</td>
                      <td colSpan={3}>{Level}</td>
                    </tr>
                    <tr>
                      <td className="fw-bold">Report Date:</td>
                      <td colSpan={3}>
                        {reportData.length > 0
                          ? formatDateWithTime(reportData[0].created_at)
                          : ''}
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                      SECTION 1: EXEMPT SALES (Entity and Use based exemption)
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                      SECTION 2: NON TAXABLE SALES (Product and Services)
                      </td>
                    </tr>
                    <tr>
                      <td colSpan={2}>
                       SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>
    
              {getSection1Data(reportData).length > 0 && (
         <Table bordered className="summary-table">
        <thead>
          <tr>
          <td colSpan={6}>SECTION 1: EXEMPT SALES (Entity and Use based exemption)</td>
          </tr>
          <tr>
            <tr>
              <td colSpan={6}>Customer is Exempt</td>
            </tr>
         
          </tr>
            {reportData.length > 0 && (
            <tr>
              <td>{Level}: {reportData[0].destination_address?.region || ''}</td>
              <th></th>
              <th></th>
              <th></th>
              <th colSpan={2}></th>
            </tr>
          )}
          <tr>
            <th></th>
            <th>Jurisdiction</th>
            <th>Exempt Reason Id</th>
            <th>Entity Use Code</th>
            <th>Certificate Applied</th>
            <th>Exempt Amount</th>
          </tr>
        
        </thead>
        <tbody>
        {aggregateTransactionsByJurisdictionAndCode(getSection1Data(reportData)).map((row: AggregatedReportData, index: number) => (
          <tr key={index}>
            <td></td>
            <td>{getStateFullName(row.destination_address?.region || '')}</td>
            <td></td>
            <td>{row.entity_use_code || ''}</td>
            <td>{row.certificate_id ? 'Yes' : 'No'}</td>
            <td>
              <Button
                variant="link"
                className="p-0 text-primary text-decoration-underline"
                onClick={() => {
                  handleTotalClick(row.original_transactions, row.original_transactions[0]?.destination_address?.region || '');
                }}
              >
                {formatCurrency(row.total_exempt)}
              </Button>
            </td>

          </tr>
        ))}
      <tr>
        <th colSpan={5}></th>
        <th>
          {formatCurrency(
            getSection1Data(reportData).reduce((sum, row) => sum + Number(row.total_exempt), 0)
          )}
        </th>
      </tr>
      <tr>
        <th colSpan={6}></th>
      </tr>
      <tr>
        <th colSpan={5}>TOTAL OF SECTION 1: EXEMPT SALES (Entity and Use based exemption)</th>
        <th>
          {formatCurrency(
            getSection1Data(reportData).reduce((sum, row) => sum + Number(row.total_exempt), 0)
          )}
        </th>
      </tr>
    </tbody>
  </Table>
)}

            {section1Data.length > 0 ? (
              <Table bordered className="summary-table">
                {/* ... (existing Section 1 table code) */}
              </Table>
            ) : (
              <div className="font-semibold mb-2">SECTION 1: EXEMPT SALES (Entity and Use based exemption)
              <p className="text-center py-4 border rounded bg-gray-50">
                No data found for Entity and Use based exemption
              </p>
              </div>
            )}

{getSection2Data(reportData).length > 0 && (
      <Table bordered className="summary-table">
        <thead>
          <tr>
          <td colSpan={6}>SECTION 2: NON TAXABLE SALES (Product and Services)</td>
          </tr>
            {reportData.length > 0 && (
            <tr>
              <td>{Level}: {reportData[0].destination_address?.region || ''}</td>
              <th></th>
              <th></th>
              <th colSpan={2}></th>
              <th></th>
            </tr>
          )}
          <tr>
            <th></th>
            <th>Jurisdiction</th>
            <th>TaxCode</th>
            <th colSpan={2}>TaxCode Description</th>
            <th>Non-Taxable Amount</th>
          </tr>
        
        </thead>
        <tbody>
        {aggregateTransactionsByJurisdictionAndCode(getSection2Data(reportData)).map((row: AggregatedReportData, index: number) => (
          <tr key={index}>
            <td></td>
            <td>{getStateFullName(row.destination_address?.region || '')}</td>
            <td>{row.original_transactions[0]?.line_items[0]?.tax_code || ''}</td>
            <td colSpan={2}></td>
            <td>
              <Button
                variant="link"
                className="p-0 text-primary text-decoration-underline"
                onClick={() => {
                  handleTotalClick(row.original_transactions, row.original_transactions[0]?.destination_address?.region || '');
                }}
              >
                {formatCurrency(row.total_exempt)}
              </Button>
            </td>
          </tr>
         ))}
          <tr>
            <th colSpan={5}></th>
            <th>
            {formatCurrency(
              getSection2Data(reportData).reduce((sum, row) => sum + Number(row.total_exempt), 0)
            )}
            </th>
          </tr>
          <tr>
            <th colSpan={6}></th>
          </tr>
          <tr>
            <th colSpan={5}>TOTAL OF SECTION 2: NON TAXABLE SALES (Product and Services)</th>
            <th>
            {formatCurrency(
              getSection2Data(reportData).reduce((sum, row) => sum + Number(row.total_exempt), 0)
            )}
            </th>
          </tr>
        </tbody>
      </Table>
)}
          {/* Section 2 */}
          <div className="mb-4">
            {section2Data.length > 0 ? (
              <Table bordered className="summary-table">
                {/* ... (existing Section 2 table code) */}
              </Table>
            ) : (
              <div className="font-semibold mb-2">SECTION 2: NON TAXABLE SALES (Product and Services)
              <p className="text-center py-4 border rounded bg-gray-50">
                No data found for Product and Services
              </p>
              </div>
            )}
          </div>

{getSection3Data(reportData).length > 0 && (
      <Table bordered className="summary-table">
        <thead>
          <tr>
          <td colSpan={6}>SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)</td>
          </tr>
            {reportData.length > 0 && (
            <tr>
              <td>{Level}: {reportData[0].destination_address?.region || ''}</td>
              <th></th>
              <th></th>
              <th colSpan={2}></th>
              <th></th>
            </tr>
          )}
          <tr>
            <th></th>
            <th>Jurisdiction</th>
            <th>TaxCode</th>
            <th colSpan={2}>TaxCode Description</th>
            <th>Non-Taxable Amount</th>
          </tr>
        
        </thead>
        <tbody>
        {aggregateTransactionsByJurisdictionAndCode(getSection3Data(reportData)).map((row: AggregatedReportData, index: number) => (
          <tr key={index}>
            <td></td>
            <td>{getStateFullName(row.destination_address?.region || '')}</td>
            <td>{row.original_transactions[0]?.line_items[0]?.tax_code || ''}</td>
            <td colSpan={2}></td>
            <td>
              <Button
                variant="link"
                className="p-0 text-primary text-decoration-underline"
                onClick={() => {
                  handleTotalClick(row.original_transactions, row.original_transactions[0]?.destination_address?.region || '');
                }}
              >
                {formatCurrency(row.total_exempt)}
              </Button>
            </td>
          </tr>
         ))}
          <tr>
            <th colSpan={5}></th>
            <th>
            {formatCurrency(
              getSection3Data(reportData).reduce((sum, row) => sum + Number(row.total_exempt), 0)
            )}
            </th>
          </tr>
          <tr>
            <th colSpan={6}></th>
          </tr>
          <tr>
            <th colSpan={5}>TOTAL OF SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)</th>
            <th>
            {formatCurrency(
              getSection3Data(reportData).reduce((sum, row) => sum + Number(row.total_exempt), 0)
            )}
            </th>
          </tr>
        </tbody>
      </Table>
)}

          <div className="mb-4">
            {section3Data.length > 0 ? (
              <Table bordered className="summary-table">
                {/* ... (existing Section 3 table code) */}
              </Table>
            ) : (
              <div className="font-semibold mb-2">SECTION 3: NON TAXABLE SALES (No Nexus Jurisdictions)
              <p className="text-center py-4 border rounded bg-gray-50">
                No data found for No Nexus Jurisdictions
              </p>
              </div>
            )}
          </div>

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

export default ExemptionDetailJurisdictionReport;
