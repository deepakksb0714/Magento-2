import React, { useState, useEffect } from "react";
import { Container, Button, Row, Col, Card, Form, Badge, OverlayTrigger, Tooltip } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import SelectLocals from "./SelectLocals";
import { Region, CurrentRegion } from "./types";
import { addNexus as onAddNexus } from '../../../slices/thunk';
import { useDispatch } from 'react-redux';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import { useNavigate } from 'react-router-dom';

const RegionDetails: React.FC<{ selectedStates: Region[]; onCancel: () => void }> = ({ selectedStates, onCancel }) => {
    const [selectedRegions, setSelectedRegions] = useState<Region[]>([]);
    const [showLocals, setShowLocals] = useState(false);
    const [currentRegion, setCurrentRegion] = useState<CurrentRegion | null>(null);
    const [selectedLocals, setSelectedLocals] = useState<Record<string, { counties: any[]; cities: any[] }>>({});
    const dispatch = useDispatch();
    const primaryEntity = usePrimaryEntity();
    const navigate = useNavigate();
    useEffect(() => {
        setSelectedRegions(selectedStates);
    }, [selectedStates]);


    const formik = useFormik({
        initialValues: {
            selectedNexus: selectedStates.reduce((acc, region) => {
                const defaultNexus = region.nexus_details.find(nexus => nexus.nexus_type === "sales_tax");
                acc[region.code] = defaultNexus
                    ? { nexus_id: defaultNexus.nexus_id, nexus_type: defaultNexus.nexus_type, region_code: region.code, name: region.name }
                    : { nexus_id: "", nexus_type: "", region_code: region.code, name: region.name };
                return acc;
            }, {} as Record<string, { nexus_id: string; nexus_type: string; region_code: string, name: string }>),
        },
        validationSchema: Yup.object({
            selectedNexus: Yup.object().test("one-selected", "Please select at least one nexus type per region", (value: any) => {
                return Object.values(value).some((v: any) => v.nexus_id !== "");
            })
        }),
        onSubmit: (values: any) => {
            const combinedData = selectedRegions.map(region => ({
                entity_id: primaryEntity?.id,
                ...values.selectedNexus[region.code],
                ...values.selectedNexus[region.name],
                locals: selectedLocals[region.id] || { counties: [], cities: [] },
            }));
            navigate('/nexus', { state: { activeTab: 'State List' } });
            dispatch(onAddNexus({ nexuses: combinedData })); // Wrap in an object
        },

    });
    const handleDone = (selectedData: { counties: any[]; cities: any[] }) => {
        if (!currentRegion) return; // Prevents accessing properties of null

        setSelectedLocals(prev => ({
            ...prev,
            [currentRegion.id]: selectedData, // Store data per region ID
        }));

        setShowLocals(false); // Hide SelectLocals
    };

    return (
        <React.Fragment>
            <div className="page-content" style={{ padding: 'unset' }}>
                <Container fluid>
                    {!showLocals ? (
                        <>
                            <h5 className="mb-3">Where you report tax in the United States</h5>
                            <p>Some states have additional registration options and local taxes. Common options have been selected for you,
                                but you should review this list and make sure it matches how you do business.</p>
                            <Form onSubmit={formik.handleSubmit}>
                                <Row>
                                    {selectedRegions.map((region) => (
                                        <Col md={4} key={region.code} className="mb-2">
                                            <Card className="d-flex flex-column h-100">
                                                <Card.Body className="d-flex flex-column">
                                                    <div className="d-flex justify-content-between align-items-start">
                                                        <h5 className="mb-0">{region.name}</h5>
                                                        {region.nexus_details[0]?.sourcing === "origin" && (
                                                            <Badge bg="info" className="d-inline-flex align-items-center">
                                                                Origin
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip id={`tooltip-${region.code}`}>Tax is calculated based on the originating address.</Tooltip>}
                                                                >
                                                                    <i className="bi bi-info-circle ms-1" style={{ cursor: "pointer" }}></i>
                                                                </OverlayTrigger>
                                                            </Badge>
                                                        )}
                                                    </div>

                                                    {region.code === "AK" && <Badge bg="warning" className="mb-2">No State Tax</Badge>}

                                                    <div className="mt-2">
                                                        <p>Which types of tax are you registered to report in {region.name}?</p>
                                                        {region.nexus_details?.filter(nexus => nexus.nexus_type === "sales_tax").map((nexus, index) => (
                                                            <div key={index} className="p-2 mb-2 rounded d-flex align-items-center">
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    name={`selectedNexus.${region.code}.nexus_id`}
                                                                    label={nexus.nexus_type.replace("_", " ").toUpperCase()}
                                                                    id={`nexus-${nexus.nexus_id}`}
                                                                    value={nexus.nexus_id}
                                                                    disabled={true}
                                                                    checked={formik.values.selectedNexus?.[region.code]?.nexus_id === nexus.nexus_id}
                                                                    onChange={() =>
                                                                        formik.setFieldValue(`selectedNexus.${region.code}`, {
                                                                            nexus_id: nexus.nexus_id,
                                                                            nexus_type: nexus.nexus_type,
                                                                            region_code: region.code,
                                                                            name: region.name
                                                                        })
                                                                    }
                                                                />
                                                                <OverlayTrigger
                                                                    placement="top"
                                                                    overlay={<Tooltip id={`tooltip-sales-tax-${index}`}>This tax type is required and cannot be changed.</Tooltip>}
                                                                >
                                                                    <i className="bi bi-info-circle ms-2" style={{ cursor: "pointer" }}></i>
                                                                </OverlayTrigger>
                                                            </div>
                                                        ))}
                                                    </div>


                                                    {region.nexus_details.some(nexus => nexus.has_local_nexus) && (
                                                        <div className="mt-auto d-flex justify-end">
                                                            <Button
                                                                size="sm"
                                                                style={{ width: "auto", minWidth: "unset", padding: "4px 8px" }}
                                                                onClick={() => {
                                                                    const selectedNexus = formik.values.selectedNexus[region.code];
                                                                    if (selectedNexus.nexus_id) {
                                                                        setShowLocals(true);
                                                                        setCurrentRegion({
                                                                            id: region.id,
                                                                            name: region.name,
                                                                            code: region.code,
                                                                            nexus_id: selectedNexus.nexus_id,
                                                                            nexus_type: selectedNexus.nexus_type, // Dynamically selected tax type
                                                                        });
                                                                    } else {
                                                                        alert("Please select a nexus type first.");
                                                                    }
                                                                }}
                                                            >
                                                                Add Locals
                                                            </Button>
                                                        </div>
                                                    )}
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>
                                <div className="mt-3 d-flex justify-content-between mb-1">
                                    <Button className="btn bg-white border-0 text-black" size="sm" onClick={onCancel}>
                                        Cancel
                                    </Button>

                                    <Button type="submit" size="sm" variant="primary">Submit</Button>
                                </div>

                            </Form>
                        </>
                    ) : (
                        currentRegion && <SelectLocals
                            region={currentRegion}
                            onDone={handleDone}
                            onCancel={() => {
                                setShowLocals(false);
                            }}
                            preSelectedLocals={selectedLocals[currentRegion.id] || { counties: [], cities: [] }}
                            registerdLocals={{ counties: [], cities: [] }}
                        />

                    )
                    }

                </Container >
            </div>
        </React.Fragment>
    );
};

export default RegionDetails;
