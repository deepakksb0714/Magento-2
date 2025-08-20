import React, { useState, useMemo } from 'react';
import { Card, Col, Form, Row, Button } from 'react-bootstrap';
import TableContainer from '../../../Common/Tabledata/TableContainer';

const UserDefinedFields = () => {
    const initialFields = Array.from({ length: 8 }, (_, i) => ({
        id: i + 1,
        name: `User-defined field ${i + 1}`,
        dataType: "String",
        fieldLevel: i % 2 === 0 ? "Document" : "Line",
    }));

    const [fields, setFields] = useState(initialFields);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingFieldId, setEditingFieldId] = useState<number | null>(null);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleFieldLevelChange = (e: any) => {
        const selectedLevel = e.target.value;
        if (selectedLevel === "All") {
            setFields(initialFields);
        } else {
            setFields(initialFields.filter((field) => field.fieldLevel === selectedLevel));
        }
    };


    const handleEditClick = (id: number) => {
        setEditingFieldId(id);
    };

    const handleFieldChange = (id: number, key: string, value: string) => {
        setFields((prevFields) =>
            prevFields.map((field) =>
                field.id === id ? { ...field, [key]: value } : field
            )
        );
    };


    const handleSaveClick = () => {
        setEditingFieldId(null);
    };

    const filteredFields = useMemo(() => {
        return fields.filter((field) =>
            Object.values(field).some((value) =>
                typeof value === "string" && value.toLowerCase().includes(searchTerm)
            )
        );
    }, [fields, searchTerm]);

    const columns = useMemo(
        () => [
            {
                Header: "User-defined field",
                accessor: "name",
                Filter: false,
                isSortable: true,
                Cell: ({ row }: any) => {
                    const { id, name } = row.original;
                    return editingFieldId === id ? (
                        <Form.Control
                            type="text"
                            value={name}
                            onChange={(e) => handleFieldChange(id, "name", e.target.value)}
                            className="form-control form-control-sm"
                        />
                    ) : (
                        name 
                    );
                },
            },
            {
                Header: "Data type",
                accessor: "dataType",
                Filter: false,
                isSortable: true,
                Cell: ({ row }: any) => {
                    const { id, dataType } = row.original;
                    return editingFieldId === id ? (
                        <Form.Group>
                            <Form.Control
                                as="select"
                                name="dataType"
                                value={dataType}
                                // disabled={!isEditing}
                                onChange={(e) => handleFieldChange(id, "dataType", e.target.value)}
                                className="form-select form-select-sm"
                            >
                                <option value="String">String</option>
                                <option value="Date">Date</option>
                                <option value="Number">Number</option>
                                <option value="Boolean">Boolean</option>
                            </Form.Control>
                        </Form.Group>

                    ) : (
                       dataType
                    );
                },
            },
            {
                Header: 'Field level',
                accessor: 'fieldLevel',
                Filter: false,
                isSortable: true,
            },
            {
                Header: "Action",
                accessor: "edit",
                Filter: false,
                isSortable: false,
                Cell: ({ row }: any) => {
                    const { id } = row.original;
                    return editingFieldId === id ? (
                        <Button
                            className="btn btn-success btn-sm"
                            onClick={handleSaveClick}
                        >
                            Done
                        </Button>
                    ) : (
                        <Button
                            className="btn btn-primary btn-sm"
                            onClick={() => handleEditClick(id)}
                            disabled={editingFieldId !== null}
                        >
                            Edit
                        </Button>
                    );
                },
            },
        ],
        [editingFieldId]
    );

    return (
        <React.Fragment>
            <p className="mt-4">Customize user-defined fields to use on transactions passed to ScalarTax from your integration.</p>

            <Row className="pb-4 gy-4 mt-4">
                <Col md={6}>
                    <Form.Label htmlFor='search'>Search</Form.Label>
                    <Form.Control
                        id="search"
                        name="search"
                        type="text"
                        placeholder='Search For a Field'
                        onChange={handleSearch}
                        disabled={editingFieldId !== null}
                        className={` ${editingFieldId !== null ? 'bg-light text-muted' : ''}`}
                    />
                </Col>
                <Col md={6}>
                    <Form.Group>
                        <Form.Label htmlFor="field-level">Field level</Form.Label>
                        <Form.Control
                            as="select"
                            id="field-level"
                            name="field-level"
                            onChange={handleFieldLevelChange}
                            disabled={editingFieldId !== null}
                            className={` ${editingFieldId !== null ? 'bg-light text-muted' : ''}`}
                        >
                            <option value="All">All</option>
                            <option value="Document">Document</option>
                            <option value="Line">Line</option>
                        </Form.Control>
                    </Form.Group>
                </Col>

                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            {filteredFields && filteredFields.length > 0 ? (
                                <TableContainer
                                    isPagination={true}
                                    columns={columns}
                                    data={filteredFields}
                                    customPageSize={9}
                                    divClassName="table-card table-responsive"
                                    tableClass="table-hover table-nowrap align-middle mb-0"
                                    isBordered={false}
                                    theadClass="table-light"
                                    PaginationClass="align-items-center mt-4 gy-3"
                                />
                            ) : (
                                <p>No fields found.</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UserDefinedFields;
