import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Button, Modal, Container, Row, Col, FormCheck, FormControl, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSgNexuses as onGetSgNexuses } from "../../../slices/thunk";
import RegionDetails from "./RegionDetails";
import { Region } from "./types";
import { createSelector } from 'reselect';
import { getNexus as onGetNexus } from '../../../slices/thunk';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import { ArrowRight } from "lucide-react";


const SelectStates: React.FC = () => {
    const [states, setStates] = useState<Region[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [showStatesPage, setShowStatesPage] = useState(false);
    const dispatch = useDispatch();
    const [registeredNexuses, setRegisteredNexuses] = useState<any[]>([]); // Ensure it's always an array
    const primaryEntity = usePrimaryEntity();



    const selectNexusList = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => ({
            nexusList: invoices.nexusList,
        })
    );

    const { nexusList } = useSelector(selectNexusList);

    useEffect(() => {
        dispatch(onGetNexus());
    }, [dispatch, primaryEntity]);
    useEffect(() => {
        if (nexusList?.length > 0 && primaryEntity) {
            const filteredNexuses = nexusList.filter((nexus: any) => nexus.entity_id === primaryEntity.id);
            setRegisteredNexuses(filteredNexuses);
        }
    }, [nexusList, primaryEntity]);

    useEffect(() => {
        dispatch(onGetSgNexuses());
    }, [dispatch]);

    // Select local taxes list from the store
    const selectSgNexusesList = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => invoices.sgNexusList || []
    );
    const sgNexusList = useSelector(selectSgNexusesList);

    useEffect(() => {
        if (sgNexusList.length) {
            setStates([...sgNexusList]);
        }
    }, [sgNexusList]);

    // Formik Instance
    const formik = useFormik({
        initialValues: {
            selected: [], // Do not preselect any states
            stateSearch: "",
        },
        validationSchema: Yup.object({
            selected: Yup.array().min(1, "Select at least one state"),
        }),
        onSubmit: (values: any) => {
            setShowModal(true);
        },
    });

    // Handle search
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const searchTerm = e.target.value.toLowerCase();
        setStates(sgNexusList.filter((state: Region) => state.name.toLowerCase().includes(searchTerm)));
    };

    // Handle select all
    const handleSelectAll = () => {
        const selectableStates = states.filter(
            (state: any) => !registeredNexuses?.some((nexus: any) => nexus.name?.toLowerCase() === state.name?.toLowerCase())
        );

        const allSelected = selectableStates.every((state) =>
            formik.values.selected.some((s: Region) => s.id === state.id)
        );

        if (allSelected) {
            // Deselect only manually selected states
            formik.setFieldValue("selected", []);
        } else {
            // Select all manually selectable states (excluding preselected ones)
            formik.setFieldValue("selected", selectableStates);
        }
    };

    return (
        <React.Fragment>

            {!showStatesPage ? (
                <>
                    <Form onSubmit={formik.handleSubmit}>
                        <h5>Select states where you're registered to report tax</h5>
                        <p>
                            Be sure to select any state where you’re already
                            registered. If you’re not sure about a particular state,
                            check your registration documents or check with the
                            state’s tax department.
                        </p>
                        <Row className="mb-3 align-items-center">
                            <Col>
                                <Link to="#" onClick={handleSelectAll}>
                                    {formik.values.selected.length === states.length ? "Deselect all states" : "Select all states"}
                                    <p className="mt-2">States selected {formik.values.selected.length}</p>
                                </Link>
                            </Col>
                            <Col xs="auto">
                                <div className="search-box">
                                    <FormControl type="text" placeholder="Search..." onChange={handleSearch} style={{ width: '200px' }} />
                                </div>
                            </Col>
                        </Row>

                        <Row className="g-3"> {/* Adds spacing between columns */}
                            {states.map((state) => {
                                const isPreSelected = registeredNexuses?.some((pre) => pre.name === state.name);

                                return (
                                    <Col key={state.id} md={3}>
                                        <div
                                            className="state-box d-flex align-items-center justify-content-between p-3"
                                            style={{
                                                border: "1px solid #ddd",
                                                borderRadius: "6px",
                                                backgroundColor: isPreSelected ? "#f0f0f0" : "#ffffff",
                                                cursor: isPreSelected ? "not-allowed" : "pointer",
                                                color: isPreSelected ? "#888" : "#000",
                                                transition: "all 0.2s ease-in-out",
                                                height: "15px"
                                            }}
                                            onClick={() => {
                                                if (!isPreSelected) {
                                                    const updatedSelection = formik.values.selected.some((s: Region) => s.id === state.id)
                                                        ? formik.values.selected.filter((s: Region) => s.id !== state.id) // Deselect
                                                        : [...formik.values.selected, state]; // Select

                                                    formik.setFieldValue("selected", updatedSelection);
                                                }
                                            }}
                                        >
                                            <span>{state.name}</span>
                                            <FormCheck
                                                type="checkbox"
                                                disabled={isPreSelected}
                                                checked={isPreSelected || formik.values.selected.some((s: Region) => s.id === state.id)}
                                                onChange={(e) => e.stopPropagation()} // Prevents click event from firing twice
                                            />
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                        <div className="mt-4 d-flex justify-content-end me-4">
                            <Button type="submit" size="sm" className="w-auto px-4" disabled={!formik.isValid || !formik.dirty}>
                                <ArrowRight size={16} />
                            </Button>
                        </div>

                    </Form>
                    <Modal
                        show={showModal} onHide={() => setShowModal(false)}
                        centered
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                Are you registered to report tax in this state?
                            </Modal.Title>
                        </Modal.Header>

                        <hr />

                        <Modal.Body>
                            {' '}
                            {/* Centering the text */}
                            <p>
                                You’ve indicated that you’re registered and intend to
                                file tax returns with 1 state. If you aren’t sure if
                                you’re registered to report taxes in a state, consider
                                removing it for now. You can always add more states
                                later. If you need help figuring out where you should be
                                registered, consult a tax advisor or{' '}
                                <span>
                                    <Link to="#">ScalarHub Professional Services.</Link>
                                </span>
                            </p>
                        </Modal.Body>

                        <hr />

                        <Modal.Footer className="justify-content-start">
                            {' '}
                            {/* Aligning buttons to the left */}
                            <Button
                                variant="outline-primary"
                                onClick={() => setShowStatesPage(true)}
                                className="mt-3"
                            >
                                Yes, I'm Registered
                            </Button>
                            <Button
                                variant="outline-primary"
                                onClick={() => setShowModal(false)}
                                className="mt-3"
                            >
                                Back
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            ) : (
                <RegionDetails
                    selectedStates={formik.values.selected} // No pre-selected states included
                    onCancel={() => {
                        setShowStatesPage(false);
                        setShowModal(false);
                    }}
                />
            )}

        </React.Fragment>
    );
};

export default SelectStates;
