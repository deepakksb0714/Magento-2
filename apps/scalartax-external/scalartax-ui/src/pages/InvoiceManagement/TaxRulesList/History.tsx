import React, { useState } from 'react'
import { Card, Col, Dropdown, Form, Row, Nav, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';

const History = () => {

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [filename, setFilename] = useState("");
    const [searchText, setSearchText] = useState("");
    const [importStatus, setImportStatus] = useState("All");


    const handleApply = () => {
      
    };

    const handleReset = (e: any) => {
        e.preventDefault()
        setStartDate("");
        setEndDate("");
        setFilename("");
        setSearchText("");
        setImportStatus("All");
    };

    return (
        <React.Fragment>
            <Form>
                <Row className="mt-4">
                    <Col sm={4}>
                        <Form.Group>
                            <Form.Label htmlFor='startDate'>FROM</Form.Label>

                            <Form.Control
                                id="startDate"
                                name="startDate"
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                            />

                        </Form.Group>

                    </Col>

                    {/* End Date Input */}
                    <Col sm={4}>
                        <Form.Group>
                            <Form.Label htmlFor='endDate'>TO</Form.Label>

                            <Form.Control
                                id="endDate"
                                name="endDate"
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                            />

                        </Form.Group>
                    </Col>
                </Row>

                {/* <Row className="pb-4 gy-3 mt-4 d-flex flex-wrap">
                    <Col md={4} >
                        <Form.Group>
                            <Form.Label htmlFor="search">SEARCH</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    as="select" id="search" name="search"
                                    style={{ maxWidth: "150px" }}
                                >
                                    <option value="Filename">Filename</option>
                                    <option value="Import ID">Import ID</option>
                                </Form.Control>
                                <Form.Control
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label htmlFor="status">Import Status</Form.Label>
                            <Form.Select id="status" name="status"
                                value={importStatus}
                                onChange={(e) => setImportStatus(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Completed">Completed</option>
                                <option value="Errors">Erros</option>
                                <option value="Processing">Processing</option>
                                <option value="Waiting">Waiting</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>



                    <Col className="d-flex align-items-end justify-content-center">
                        <button
                            type="button"
                            className="btn btn-primary me-2"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                        <button type="submit" className="btn btn-light" onClick={handleReset}>
                            Reset
                        </button>

                    </Col>
                </Row> */}
                <Row className="pb-4 gy-3 mt-4 d-flex flex-wrap">
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label htmlFor="search">SEARCH</Form.Label>
                            <div className="d-flex">
                                <Form.Control
                                    as="select" id="search" name="search"
                                    style={{ maxWidth: "150px" }}
                                >
                                    <option value="Filename">Filename</option>
                                    <option value="Import ID">Import ID</option>
                                </Form.Control>
                                <Form.Control
                                    type="text"
                                    value={searchText}
                                    onChange={(e) => setSearchText(e.target.value)}
                                />
                            </div>
                        </Form.Group>
                    </Col>

                    <Col md={4}>
                        <Form.Group>
                            <Form.Label htmlFor="status">Import Status</Form.Label>
                            <Form.Control
                                as="select"
                                id="status"
                                name="importStatus"
                                value={importStatus}
                                style={{ maxWidth: "300px" }}
                                onChange={(e) => setImportStatus(e.target.value)}
                            >
                                <option value="All">All</option>
                                <option value="Completed">Completed</option>
                                <option value="Errors">Errors</option>
                                <option value="Processing">Processing</option>
                                <option value="Waiting">Waiting</option>
                            </Form.Control>

                        </Form.Group>
                    </Col>

                    <Col className="d-flex align-items-end justify-content-center">
                        <button
                            type="button"
                            className="btn btn-primary me-2"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                        <button type="submit" className="btn btn-light" onClick={handleReset}>
                            Reset
                        </button>
                    </Col>
                </Row>

            </Form>
            <Row className='mt-4'>
                <NoSearchResult />
            </Row>
        </React.Fragment>
    )
}

export default History;


