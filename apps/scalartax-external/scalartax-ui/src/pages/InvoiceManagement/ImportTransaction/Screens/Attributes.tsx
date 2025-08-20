import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Form, Button, Row, Col, Modal } from 'react-bootstrap';
import { useFormik } from 'formik';
import { baseAttributesColumns, attributes } from '../data';

// Define the props interface for the Attributes component
interface Props {
  data: any;
  uploadData: string[][];
  initialValues: any;
  updateData: (data: any) => void;
  updateValues: (values: any) => void;
}
// AttributesModal Component
const AttributesModal = ({
  show,
  onHide,
  attributes,
  selectedColumns,
  onColumnSelect,
  onSave,
  baseAttributesColumns,
}: {
  show: boolean;
  onHide: () => void;
  attributes: string[]; // Update type to be a flat array of strings
  selectedColumns: string[];
  onColumnSelect: (column: string) => void;
  onSave: () => void;
  baseAttributesColumns: string[];
}) => {
  // Render each attribute as a checkbox
  const renderAttributes = () => {
    return attributes.map((attribute) => (
      <Form.Check
        key={attribute}
        type="checkbox"
        id={`modal-checkbox-${attribute}`}
        label={attribute}
        checked={
          selectedColumns.includes(attribute) ||
          baseAttributesColumns.includes(attribute)
        }
        onChange={() => onColumnSelect(attribute)}
        className="mb-2"
      />
    ));
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add or edit attributes</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div
          className="modal-content-scroll"
          style={{ maxHeight: '60vh', overflowY: 'auto' }}
        >
          {renderAttributes()}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSave}>
          Add Selected Columns
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

// Main Component
const Attributes = forwardRef((props: Props, ref) => {
  const { data, initialValues, uploadData, updateData, updateValues } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<string[]>([]);
  const [attributesColumns, setAttributesColumns] = useState<string[]>([
    ...(initialValues?.attributesColumns || baseAttributesColumns),
  ]);
  const columnHeaders = uploadData[0] || [];
  const dataRows = uploadData.slice(1);

  // Initialize formik with proper types
  const formik = useFormik({
    initialValues: {
      attributesColumns: attributesColumns.reduce<{ [key: string]: string }>(
        (acc, column) => {
          acc[column] = initialValues?.values.attributesColumns?.[column] || '';
          return acc;
        },
        {}
      ),
    },
    onSubmit: (values: any) => {
      const mappedData = dataRows.map((row) => {
        const mappedRow: { [key: string]: string | null } = {};

        // Type-safe iteration over attributesColumns values
        Object.entries(values.attributesColumns).forEach(
          ([column, selectedHeader]) => {
            if (selectedHeader && typeof selectedHeader === 'string') {
              const headerIndex = columnHeaders.indexOf(selectedHeader);
              mappedRow[column] = headerIndex !== -1 ? row[headerIndex] : null;
            }
          }
        );

        return mappedRow;
      });
      const newValues = {
        values,
        attributesColumns,
      };
      updateData(mappedData);
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

  const handleAttributeSelect = (column: string) => {
    setSelectedAttributes((prev) =>
      prev.includes(column)
        ? prev.filter((col) => col !== column)
        : [...prev, column]
    );
  };

  const handleModalSave = () => {
    const newAttributesColumns = [
      ...baseAttributesColumns,
      ...selectedAttributes,
    ];
    setAttributesColumns(newAttributesColumns);

    // Update formik values to include new columns with empty strings
    const updatedAttributesColumns = { ...formik.values.attributesColumns };
    selectedAttributes.forEach((column) => {
      if (!updatedAttributesColumns[column]) {
        updatedAttributesColumns[column] = '';
      }
    });

    formik.setFieldValue('attributesColumns', updatedAttributesColumns);
    setShowModal(false);
  };

  // New function to handle removal of an attributes column
  const handleRemoveColumn = (column: string) => {
    const newAttributesColumns = attributesColumns.filter(
      (col) => col !== column
    );
    setAttributesColumns(newAttributesColumns);

    // Update formik values to remove the column
    const updatedAttributesColumns = { ...formik.values.attributesColumns };
    delete updatedAttributesColumns[column]; // Remove the column from Formik's state
    formik.setFieldValue('attributesColumns', updatedAttributesColumns);
  };

  return (
    <div className="p-4 uploadScreen mt-2">
      <Row>
        <Col>
          <h2>Add attributes</h2>
          <p className="mt-2 mb-4 custom-paragraph">
            Attributes are needed to calculate tax types other than sales and
            use. You can skip this step now and add attributes later in AvaTax.
            Based on your products, we’ve added some attributes that you might
            need.
          </p>
        </Col>
      </Row>

      <Form onSubmit={formik.handleSubmit}>
        <Row className="mb-4">
          {attributesColumns.map((column) => (
            <Form.Group key={column} className="mb-3 d-flex align-items-center">
              <Form.Label className="mb-0 me-2" style={{ width: '40%' }}>
                {column}:
              </Form.Label>
              <Form.Select
                name={`attributesColumns.${column}`}
                value={formik.values.attributesColumns[column]}
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
              className="btn btn-light"
              size="sm"
            >
              + Add More Attributes
            </Button>
          </Col>
        </Row>
      </Form>

      <AttributesModal
        show={showModal}
        onHide={() => setShowModal(false)}
        attributes={attributes}
        selectedColumns={selectedAttributes}
        onColumnSelect={handleAttributeSelect}
        onSave={handleModalSave}
        baseAttributesColumns={
          initialValues?.attributesColumns || baseAttributesColumns
        }
      />
    </div>
  );
});

export default Attributes;
