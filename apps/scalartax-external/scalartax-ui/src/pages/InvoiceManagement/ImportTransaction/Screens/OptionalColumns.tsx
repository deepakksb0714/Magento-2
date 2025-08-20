import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Row, Col, Modal, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import { Link } from 'react-router-dom';
import { baseOptionalColumns, extraColumns } from '../data';
import { ExtraColumnsSection } from '../types';
// Type definitions
interface Props {
  data: any;
  uploadData: string[][];
  initialValues: any;
  updateData: (data: any) => void;
  updateValues: (values: any) => void;
}

// Add interface for form values
interface FormValues {
  optionalColumns: {
    [key: string]: string;
  };
}

const isStringArray = (value: any): value is string[] => {
  return (
    Array.isArray(value) && value.every((item) => typeof item === 'string')
  );
};

const isNestedObject = (value: any): value is object => {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
};

const ExtraColumnsModal = ({
  show,
  onHide,
  extraColumns,
  selectedColumns,
  onColumnSelect,
  onSave,
  baseOptionalColumns, // New prop for base optional columns
}: {
  show: boolean;
  onHide: () => void;
  extraColumns: ExtraColumnsSection;
  selectedColumns: string[];
  onColumnSelect: (column: string) => void;
  onSave: () => void;
  baseOptionalColumns: string[]; // Add the type for the new prop
}) => {
  const renderContent = (sectionName: string, content: any, level = 0) => {
    if (isStringArray(content)) {
      return content.map((item) => (
        <Form.Check
          key={item}
          type="checkbox"
          id={`modal-checkbox-${item}`}
          label={item}
          checked={
            selectedColumns.includes(item) || baseOptionalColumns.includes(item)
          } // Check against baseOptionalColumns
          onChange={() => onColumnSelect(item)}
          className={`mb-2 ms-${level * 3}`}
        />
      ));
    }

    if (isNestedObject(content)) {
      return Object.entries(content).map(([subSection, subContent]) => (
        <div key={subSection} className={`ms-${level * 3} mb-3`}>
          <h6 className="mb-2">{subSection}</h6>
          {Object.entries(subContent).map(([category, items]) => (
            <div key={category} className="mb-3">
              <strong className="d-block mb-2">{category}</strong>
              {Array.isArray(items) &&
                items.map((item) => (
                  <Form.Check
                    key={item}
                    type="checkbox"
                    id={`modal-checkbox-${item}`}
                    label={item}
                    checked={
                      selectedColumns.includes(item) ||
                      baseOptionalColumns.includes(item)
                    } // Check against baseOptionalColumns
                    onChange={() => onColumnSelect(item)}
                    className="mb-2"
                  />
                ))}
            </div>
          ))}
        </div>
      ));
    }
    return null;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add Extra Columns</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="modal-content-scroll"
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          {Object.entries(extraColumns).map(([section, content]) => (
            <div key={section} className="mb-4">
              <h5 className="mb-3">{section}</h5>
              {renderContent(section, content)}
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-light" onClick={onHide}>
          Cancel
        </button>
        <Button className="btn btn-primary" onClick={onSave}>
          Add Selected Columns
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Main Component
const OptionalColumns = forwardRef((props: Props, ref) => {
  const { data, initialValues, uploadData, updateData, updateValues } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedExtraColumns, setSelectedExtraColumns] = useState<string[]>(
    []
  );
  const [optionalColumns, setOptionalColumns] = useState<string[]>([
    ...(initialValues?.optionalColumns || baseOptionalColumns),
  ]);
  const [showAlert, setShowAlert] = useState(false);
  const columnHeaders = uploadData[0] || [];
  const dataRows = uploadData.slice(1);

  // Initialize formik with proper types
  const formik = useFormik({
    initialValues: {
      optionalColumns: optionalColumns.reduce<{ [key: string]: string }>(
        (acc, column) => {
          acc[column] = initialValues?.values.optionalColumns?.[column] || '';
          return acc;
        },
        {}
      ),
    },
    onSubmit: (values: FormValues) => {
      const mappedData = dataRows.map((row) => {
        const mappedRow: { [key: string]: string | null } = {};

        // Type-safe iteration over optionalColumns values
        Object.entries(values.optionalColumns).forEach(
          ([column, selectedHeader]) => {
            if (selectedHeader && typeof selectedHeader === 'string') {
              const headerIndex = columnHeaders.indexOf(selectedHeader);
              mappedRow[column] = headerIndex !== -1 ? row[headerIndex] : null;
            }
          }
        );

        return mappedRow;
      });
      updateData(mappedData);
      const newValues = {
        values,
        optionalColumns,
      };
      updateValues(newValues);
    },
  });

  // Expose the submit function to the parent component
  useImperativeHandle(ref, () => ({
    submit: async () => {
      await formik.handleSubmit();
      return true; // Adjust based on your submission logic
    },
  }));
  const handleExtraColumnSelect = (column: string) => {
    setSelectedExtraColumns((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleModalSave = () => {
    const newOptionalColumns = [
      ...baseOptionalColumns,
      ...selectedExtraColumns,
    ];
    setOptionalColumns(newOptionalColumns);

    // Update formik values to include new columns with empty strings
    const updatedOptionalColumns = { ...formik.values.optionalColumns };
    selectedExtraColumns.forEach((column) => {
      if (!updatedOptionalColumns[column]) {
        updatedOptionalColumns[column] = '';
      }
    });

    formik.setFieldValue('optionalColumns', updatedOptionalColumns);
    setShowModal(false);
  };

  // New function to handle removal of an optional column
  const handleRemoveColumn = (column: string) => {
    const newOptionalColumns = optionalColumns.filter((col) => col !== column);
    setOptionalColumns(newOptionalColumns);

    // Update formik values to remove the column
    const updatedOptionalColumns = { ...formik.values.optionalColumns };
    delete updatedOptionalColumns[column]; // Remove the column from Formik's state
    formik.setFieldValue('optionalColumns', updatedOptionalColumns);
  };
  const handleLinkClick = () => {
    setShowAlert((prevShowAlert) => !prevShowAlert);
  };

  return (
    <div className="p-4 uploadScreen mt-2 ">
      <Row>
        <Col>
          <h2>Map optional columns</h2>
          <p className="mt-2 mb-4 custom-paragraph">
            These columns are optional and not needed for tax calculation. You
            can skip this step, but mapping them makes your transaction data in
            AvaTax more complete. Any columns you don’t map won’t be imported.
          </p>
          <p className="mt-2 mb-4 custom-paragraph">
            Based on your process code selections, there are a few requirements.{' '}
            <Link to="#" onClick={handleLinkClick}>
              {' '}
              Remind me what those are
            </Link>
          </p>
          {showAlert && (
            <Alert variant="warning">
              <Alert.Heading>
                🚩 Process code specific requirements:
              </Alert.Heading>

              <p>
                <ul>
                  <li>
                    If you select Process code 1, 2, 9, or 10, you need to have
                    a field in your file with the total tax amount for the item
                    and for the date the tax was collected. In the Avalara
                    template, it is the TotalTax field. You need to map Line tax
                    override tax amount to your total tax amount column and Line
                    tax override tax date to your tax date column in your file.
                  </li>
                  <li>
                    Codes 2 and 9 create a new transaction if a transaction
                    doesn't exist.
                  </li>
                  <li>
                    For Process codes 5 and 6, enter the accrued tax amount in
                    the TotalTax field and enter 0 in the Amount field to
                    override the consumer use tax.
                  </li>
                </ul>
              </p>
              <hr />
            </Alert>
          )}
        </Col>
      </Row>

      <Form onSubmit={formik.handleSubmit}>
        <Row className="mb-4">
          {optionalColumns.map((column) => (
            <Form.Group key={column} className="mb-3 d-flex align-items-center">
              <Form.Label className="mb-0 me-2" style={{ width: '40%' }}>
                {column}:
              </Form.Label>
              <Form.Select
                name={`optionalColumns.${column}`}
                value={formik.values.optionalColumns[column]}
                onChange={formik.handleChange}
                className="custom-dropdown"
              >
                <option value="">Select a column</option>
                {columnHeaders.map((header) => (
                  <option key={header} value={header}>
                    {header}
                  </option>
                ))}
              </Form.Select>
              <Button
                variant="danger"
                onClick={() => handleRemoveColumn(column)}
                className="btn btn-soft-danger btn-sm d-inline-block ms-2"
              >
                <i className="bi bi-trash fs-17 align-middle"></i>
              </Button>
            </Form.Group>
          ))}
        </Row>
        <Row className="mb-4">
          <Col className="d-flex mb-3">
            <Button
              onClick={() => setShowModal(true)}
              className="btn btn-primary"
              size="sm"
            >
              + Add More Columns
            </Button>
          </Col>
        </Row>
      </Form>

      <ExtraColumnsModal
        show={showModal}
        onHide={() => setShowModal(false)}
        extraColumns={extraColumns}
        selectedColumns={selectedExtraColumns}
        onColumnSelect={handleExtraColumnSelect}
        onSave={handleModalSave}
        baseOptionalColumns={
          initialValues?.optionalColumns || baseOptionalColumns
        } // Pass the base optional columns
      />
    </div>
  );
});

export default OptionalColumns;
