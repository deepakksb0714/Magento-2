import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Modal, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { saveAs } from 'file-saver';
import { getCustomTaxCodes as onGetCustomTaxCodes } from '../../../slices/thunk';

interface ExportCustomTaxCodesModalProps {
  show: boolean;
  handleClose: () => void;
}

const ExportCustomTaxCodesModal: React.FC<ExportCustomTaxCodesModalProps> = ({
  show,
  handleClose,
}) => {
  const [format, setFormat] = useState('xlsx');
  const dispatch = useDispatch();

  const { customTaxCodeList } = useSelector((state: any) => state.Invoice);

  useEffect(() => {
    // Fetch product list when component mounts
    dispatch(onGetCustomTaxCodes());
  }, [dispatch]);

  const handleFormatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormat(e.target.value);
  };

  const exportData = () => {
    //console.log(`Exporting in ${format} format`);
    if (customTaxCodeList && customTaxCodeList.length > 0) {
      if (format === 'xlsx') {
        const ws = XLSX.utils.json_to_sheet(customTaxCodeList);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const dataBlob = new Blob([excelBuffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        saveAs(dataBlob, 'customtaxcodes_export.xlsx');
      } else if (format === 'csv') {
        const csvContent = customTaxCodeList
          .map((row: any) => Object.values(row).join(','))
          .join('\n');
        const csvBlob = new Blob([csvContent], {
          type: 'text/csv;charset=utf-8;',
        });
        saveAs(csvBlob, 'customtaxcodes_export.csv');
      }
    } else {
      console.error('No customtaxcodes data available to export');
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Export Data</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p style={{ fontSize: '15px' }}>
          Select a format for the export. Your file will download automatically
          when the data is ready.
        </p>
        <Form>
          <Form.Group>
            <Form.Label>FORMAT</Form.Label>
            <Form.Check
              type="radio"
              id="xlsx"
              label=".XLSX (EXCEL SPREADSHEET)"
              value="xlsx"
              checked={format === 'xlsx'}
              onChange={handleFormatChange}
            />
            <Form.Check
              type="radio"
              id="csv"
              label=".CSV (COMMA-SEPARATED FILE)"
              value="csv"
              checked={format === 'csv'}
              onChange={handleFormatChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={exportData}>
          Export
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportCustomTaxCodesModal;
