import React, { useState, useEffect } from "react";
import { Container, Button, Form, Row, Col, Table } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectLocals from "../AddNexusLocations/SelectLocals";
import { editNexus as onEditNexus } from "../../../slices/thunk";
import { usePrimaryEntity } from "../../../Common/usePrimaryEntity";
import { useDispatch, useSelector } from "react-redux";
import { getSgNexuses as onGetSgNexuses } from "../../../slices/thunk";
import { createSelector } from 'reselect';
import { PencilSquare } from "react-bootstrap-icons";
import { exportToCSV, exportToExcel } from "./exportUtils";
import { Link } from 'react-router-dom';



interface LocalJurisdiction {
    id: string;
    nexus_id: string;
    name: string;
    jurisdiction_type: "county" | "city";
    entity_id: string;
    nexus_type: "sales_tax" | "seller_use_tax_or_sales_tax";
    region_code: string;
    parent_nexus_id: string | null;
    created_by_id: string;
    updated_by_id: string;
    created_at: string;
    updated_at: string;
    effective_date: string | null;
    expiration_date: string | null;
}

interface Locals {
    counties: LocalJurisdiction[];
    cities: LocalJurisdiction[];
}

interface NexusRegion {
    id: string;
    nexus_id: string;
    entity_id: string;
    nexus_type: "sales_tax" | "seller_use_tax_or_sales_tax";
    region_code: string;
    jurisdiction_type: "region";
    name: string;
    parent_nexus_id: string | null;
    created_by_id: string;
    updated_by_id: string;
    created_at: string;
    updated_at: string;
    effective_date: string;
    expiration_date: string;
    locals: Locals;
}



export interface CurrentRegion {
    id: string;
    name: string;
    nexus_id: string;
    code: string;
    nexus_type: string;
}


interface EditNexusProps {
    region: NexusRegion;
    onCancel: () => void;
}

export interface Region {
    id: string;
    name: string;
    jurisdiction_type: string;
    code: string;
    nexus_details: NexusDetail[];
}

export interface NexusDetail {
    nexus_type: string;
    nexus_id: string;
    sourcing: string;
    flat_rate: string;
    has_local_nexus: boolean;
}

const EditNexus: React.FC<EditNexusProps> = ({ region, onCancel }) => {
    const [showLocals, setShowLocals] = useState(false);
    const [currentRegion, setCurrentRegion] = useState<CurrentRegion | null>(null);
    const [selectedLocals, setSelectedLocals] = useState<Record<string, Locals>>({});
    const [registerdLocals, setRegisterdLocals] = useState<Record<string, Locals>>({});
    const [states, setStates] = useState<Region[]>([]);
    const [removeLocals, setRemoveLocals] = useState<string[]>([]);
    const dispatch = useDispatch();


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


    const formik = useFormik({
        initialValues: {
            id: region.id,
            nexus_type: region.nexus_type,
            effective_date: region.effective_date,
            expiration_date: region.expiration_date
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            effective_date: Yup.date().required("Effective date is required"),
            expiration_date: Yup.date().nullable()
        }),

        onSubmit: (values: any) => {
            const prevCounties = region.locals?.counties || [];
            const prevCities = region.locals?.cities || [];

            const selected = selectedLocals[region.id] || { counties: [], cities: [] };

            const removedCounties = prevCounties
                .filter(prev => !selected.counties.some(curr => curr.nexus_id === prev.nexus_id))
                .map(removed => removed.id);

            const removedCities = prevCities
                .filter(prev => !selected.cities.some(curr => curr.nexus_id === prev.nexus_id))
                .map(removed => removed.id);

            setRemoveLocals([...removedCounties, ...removedCities]);

            // Prepare final data with updated local nexuses
            const finalData = {
                ...values,
                remove_locals: removeLocals,
                locals: {
                    counties: selected.counties.map(({ id, nexus_id, name, effective_date, expiration_date }) => ({
                        id,
                        nexus_id,
                        name,
                        effective_date,
                        expiration_date,
                    })),
                    cities: selected.cities.map(({ id, nexus_id, name, effective_date, expiration_date }) => ({
                        id,
                        nexus_id,
                        name,
                        effective_date,
                        expiration_date,
                    })),
                },
            };

            async function handleEdit() {
                try {
                    await dispatch(onEditNexus(finalData));
                    onCancel();
                } catch (error) {
                    console.error("Edit failed:", error);
                }
            }
            handleEdit();
        }

    });
    const [updatedRegion, setUpdatedRegion] = useState(null);

    useEffect(() => {
        if (!region || !region.nexus_id || !region.region_code) return;
        const targetNexusId = region.nexus_id;
        const matchedRegion = sgNexusList.find((item: any) => item.code === region.region_code);

        if (matchedRegion) {
            const filteredDetails = matchedRegion.nexus_details.find((nexus: any) => nexus.nexus_id === targetNexusId);
            if (filteredDetails) {
                setUpdatedRegion({ ...region, ...filteredDetails });
            }
        }
    }, [sgNexusList, region]);

    useEffect(() => {
        if (!region?.locals) return;

        const selectedData = {
            counties: region.locals.counties || [],
            cities: region.locals.cities || []
        };
        setRegisterdLocals(prev => ({
            ...prev,
            [region.id]: selectedData,
        }));
        setSelectedLocals(prev => ({
            ...prev,
            [region.id]: selectedData,
        }));
    }, [region]);


    const handleDone = (selectedData: { counties: any[]; cities: any[] }) => {
        if (!region) return;

        setSelectedLocals(prev => ({
            ...prev,
            [region.id]: selectedData,
        }));

        setShowLocals(false);
    };
    const [searchTerm, setSearchTerm] = useState("");
    const [filterJurisdiction, setFilterJurisdiction] = useState("");
    const [filterNexusType, setFilterNexusType] = useState("");

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value.toLowerCase());
    };

    const handleJurisdictionFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterJurisdiction(e.target.value);
    };

    const handleNexusTypeFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterNexusType(e.target.value);
    };

    // Filtered Data
    const filteredLocals = [...(selectedLocals[region.id]?.counties || []), ...(selectedLocals[region.id]?.cities || [])]
        .filter(local => local.name.toLowerCase().includes(searchTerm))
        .filter(local => (filterJurisdiction ? local.jurisdiction_type === filterJurisdiction : true))
        .filter(local => (filterNexusType ? region.nexus_type === filterNexusType : true));

    const handleDeleteLocal = (regionId: string, localId: string, jurisdictionType: "county" | "city") => {
        setRemoveLocals((prev) => [...prev, localId]);
        setSelectedLocals((prev) => {
            const selected = prev[regionId] || { counties: [], cities: [] };

            // Remove the local from the correct array (county or city)
            const updatedCounties = jurisdictionType === "county"
                ? selected.counties.filter(local => local.id !== localId)
                : selected.counties;

            const updatedCities = jurisdictionType === "city"
                ? selected.cities.filter(local => local.id !== localId)
                : selected.cities;

            return { ...prev, [regionId]: { counties: updatedCounties, cities: updatedCities } };
        });
    };

    const filteredDisplayedLocals = filteredLocals.filter(local => !removeLocals.includes(local.id));


    const [editingField, setEditingField] = useState<{ localId: string; field: "effective_date" | "expiration_date" } | null>(null);

    // State to store edited values before saving
    const [editedValues, setEditedValues] = useState<Record<string, string>>({});


    const handleEdit = (localId: string, field: "effective_date" | "expiration_date", value: string | null) => {
        setEditingField({ localId, field });
        setEditedValues((prev) => ({ ...prev, [`${localId}-${field}`]: value || "" }));
    };

    const handleBlur = (localId: string, field: "effective_date" | "expiration_date") => {
        if (editingField && editedValues[`${localId}-${field}`] !== "") {
            handleUpdateDate(region.id, localId, field, editedValues[`${localId}-${field}`]); // 4 arguments

        }
        setEditingField(null);
    };

    const handleUpdateDate = (
        regionId: string,
        localId: string,
        field: "effective_date" | "expiration_date",
        value: string
    ) => {
        setSelectedLocals((prev) => {
            const selected = prev[regionId] || { counties: [], cities: [] };

            const updatedCounties = selected.counties.map((county) =>
                county.id === localId ? { ...county, [field]: value } : county
            );

            const updatedCities = selected.cities.map((city) =>
                city.id === localId ? { ...city, [field]: value } : city
            );

            return {
                ...prev,
                [regionId]: { counties: updatedCounties, cities: updatedCities },
            };
        });
    };

    return (
        <Container fluid>
            {!showLocals ? (
                <>
                    <div className="mb-3">
                        <h5>How you report tax in {region.name} </h5>
                        <Form onSubmit={formik.handleSubmit} className="mt-5">
                            <Form.Group>
                                <Form.Label>Which types of tax are you registered to report in Alabama?</Form.Label>
                                <div>
                                    <Form.Check
                                        type="checkbox"
                                        label="Sales Tax"
                                        name="nexus_type"
                                        value="sales_tax"
                                        disabled
                                        checked={formik.values.nexus_type === "sales_tax"}
                                        onChange={() => formik.setFieldValue("nexus_type", "sales_tax")}
                                    />
                                    {/* <Form.Check
                                        type="radio"
                                        label="Seller Use Tax or Sales Tax"
                                        name="nexus_type"
                                        value="seller_use_tax_or_sales_tax"
                                        checked={formik.values.nexus_type === "seller_use_tax_or_sales_tax"}
                                        onChange={() => formik.setFieldValue("nexus_type", "seller_use_tax_or_sales_tax")}
                                    /> */}
                                </div>
                            </Form.Group>
                            <Row className="mt-3">
                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="effective_date">
                                            Effective<span className="text-danger">*</span>
                                        </Form.Label>
                                        <Form.Control
                                            id="effective_date"
                                            name="effective_date"
                                            type="date"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.effective_date}
                                            isInvalid={
                                                formik.touched.effective_date &&
                                                !!formik.errors.effective_date
                                            }
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {formik.errors.effective_date}
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Col>

                                <Col md={6}>
                                    <Form.Group>
                                        <Form.Label htmlFor="expiration_date">End Date</Form.Label>
                                        <Form.Control
                                            id="expiration_date"
                                            name="expiration_date"
                                            type="date"
                                            onChange={formik.handleChange}
                                            onBlur={formik.handleBlur}
                                            value={formik.values.expiration_date}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>


                            <Row className="mt-4">
                                <Col>
                                    <Form.Label >Search</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Search"
                                        value={searchTerm}
                                        onChange={handleSearchChange}

                                    />
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label >Jurisdiction Type</Form.Label>
                                        <Form.Select value={filterJurisdiction} onChange={handleJurisdictionFilter}>
                                            <Form.Label >Jurisdiction Type</Form.Label>
                                            <option value="">All</option>
                                            <option value="county">County</option>
                                            <option value="city">City</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label >Tax Type</Form.Label>
                                        <Form.Select value={filterNexusType} onChange={handleNexusTypeFilter}>
                                            <option value="">All</option>
                                            <option value="sales_tax">Sales Tax</option>
                                            <option value="seller_use_tax_or_sales_tax">Seller Use Tax</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                                <Col>

                                    <Button
                                        size="sm"
                                        style={{
                                            marginTop: "45px",
                                            marginLeft: "80px"
                                        }}
                                        onClick={() => {
                                            if (region.nexus_id) {
                                                setShowLocals(true);
                                                setCurrentRegion({
                                                    id: region.id,
                                                    name: region.name,
                                                    code: region.region_code,
                                                    nexus_id: region.nexus_id,
                                                    nexus_type: region.nexus_type, // Dynamically selected tax type
                                                });
                                            } else {
                                                alert("Please select a nexus type first.");
                                            }
                                        }}
                                    >
                                        Add More Locals
                                    </Button>
                                </Col>
                            </Row>
                            {/* Display Local Jurisdictions in Table Format */}
                            {selectedLocals[region.id] && (
                                <div className="mt-4">
                                    <Link to="#" onClick={() => exportToCSV(region)} >Export CSV</Link>
                                    <Link to="$" onClick={() => exportToExcel(region)} className="ms-4">Export XLSX</Link>
                                    <Table bordered striped hover responsive>
                                        <thead>
                                            <tr>
                                                <th>Name</th>
                                                <th>Type</th>
                                                <th>Tax Type</th>
                                                <th>Effective Date</th>
                                                <th>Expiration Date</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredDisplayedLocals.length > 0 ? (
                                                filteredDisplayedLocals?.map((local) => (
                                                    <tr key={local.id}>
                                                        <td>{local.name}</td>
                                                        <td>{local.jurisdiction_type === "county" ? "County" : "City"}</td>
                                                        <td>{region.nexus_type === "sales_tax" ? "Sales Tax" : "Sales And Use Tax"}</td>

                                                        {/* Editable Effective Date with Pencil Icon */}
                                                        <td>
                                                            {editingField?.localId === local.id && editingField?.field === "effective_date" ? (
                                                                <input
                                                                    type="date"
                                                                    value={editedValues[`${local.id}-effective_date`] || ""}
                                                                    onChange={(e) =>
                                                                        setEditedValues((prev) => ({
                                                                            ...prev,
                                                                            [`${local.id}-effective_date`]: e.target.value,
                                                                        }))
                                                                    }
                                                                    onBlur={() => handleBlur(local.id, "effective_date")}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span
                                                                    onClick={() => handleEdit(local.id, "effective_date", local.effective_date)} // ✅ Use `local.effective_date`
                                                                    style={{ cursor: "pointer" }}
                                                                >
                                                                    {local.effective_date || "N/A"} <PencilSquare size={14} />
                                                                </span>
                                                            )}

                                                        </td>

                                                        {/* Editable Expiration Date with Pencil Icon */}
                                                        <td>
                                                            {editingField?.localId === local.id && editingField?.field === "expiration_date" ? (
                                                                <input
                                                                    type="date"
                                                                    value={editedValues[`${local.id}-expiration_date`] || ""}
                                                                    onChange={(e) =>
                                                                        setEditedValues((prev) => ({
                                                                            ...prev,
                                                                            [`${local.id}-expiration_date`]: e.target.value,
                                                                        }))
                                                                    }
                                                                    onBlur={() => handleBlur(local.id, "expiration_date")}
                                                                    autoFocus
                                                                />
                                                            ) : (
                                                                <span onClick={() => handleEdit(local.id, "expiration_date", local.expiration_date)} style={{ cursor: "pointer" }}>
                                                                    {local.expiration_date || "N/A"} <PencilSquare size={14} />
                                                                </span>
                                                            )}
                                                        </td>

                                                        <td>
                                                            <Link
                                                                to="#"
                                                                className="btn btn-soft-danger btn-sm d-inline-block"
                                                                onClick={() => handleDeleteLocal(region.id, local.id, local.jurisdiction_type)}
                                                            >
                                                                <i className="bi bi-trash fs-17 align-middle"></i>
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={6} className="text-center">No records found</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </Table>
                                </div>
                            )}
                            <div className="mt-3 d-flex justify-content-between mb-1">
                                <Button className="btn bg-white border-0 text-black" size="sm" onClick={onCancel}>
                                    Cancel
                                </Button>

                                <Button type="submit" size="sm" variant="primary">Submit</Button>
                            </div>
                        </Form>
                    </div>
                </>
            ) : (
                currentRegion && <SelectLocals
                    region={currentRegion}
                    onDone={handleDone}
                    onCancel={() => {
                        setShowLocals(false);
                    }}
                    preSelectedLocals={selectedLocals[region.id] || { counties: [], cities: [] }}
                    registerdLocals={registerdLocals[region.id] || { counties: [], cities: [] }}
                />

            )}
        </Container>
    );
};

export default EditNexus;
