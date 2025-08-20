import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, FormCheck, Accordion } from "react-bootstrap";
import { County, City, CurrentRegion } from "./types";
import { getSgLocalNexuses as onGetSgLocalNexuses } from "../../../slices/thunk";
import { useDispatch } from "react-redux";


interface SelectLocalsProps {
    region: CurrentRegion;
    onDone: (selectedData: { counties: any[]; cities: any[] }) => void;
    onCancel: () => void;
    preSelectedLocals: { counties: any[]; cities: any[] };
    registerdLocals: { counties: any[]; cities: any[] }
}

const SelectLocals: React.FC<SelectLocalsProps> = ({ region, onDone, onCancel, preSelectedLocals, registerdLocals }) => {
    const [responseData, setResponseData] = useState<County[]>([]);
    const [selectedCounties, setSelectedCounties] = useState<Record<string, boolean>>({});
    const [selectedCities, setSelectedCities] = useState<Record<string, boolean>>({});
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = {
                    region_code: region.code,
                    nexus_type: region.nexus_type
                }
                const response = await dispatch(onGetSgLocalNexuses(data));
                const fetchedCounties = response.payload?.counties || [];

                const registeredCountyIds = new Set(registerdLocals.counties.map(county => county.nexus_id));
                const registeredCityIds = new Set(registerdLocals.cities.map(city => city.nexus_id));

                const updatedCounties = fetchedCounties
                    .map((county: County) => {
                        const filteredCities = county.cities.filter(city => !registeredCityIds.has(city.id));

                        // ✅ Remove county only if all of its cities are in registerdLocals.cities
                        const isAllCitiesRegistered = county.cities.length > 0 && filteredCities.length === 0;

                        // ✅ Remove county if it has no cities & is in registerdLocals.counties
                        const isEmptyAndRegistered = county.cities.length === 0 && registeredCountyIds.has(county.id);

                        if (isAllCitiesRegistered || isEmptyAndRegistered) {
                            return null; // Mark for removal
                        }

                        // ✅ Keep county & retain only non-registered cities
                        return { ...county, cities: filteredCities };
                    })
                    .filter(Boolean) as County[]; // Remove `null` values (fully registered counties)

                setResponseData(updatedCounties);
                // Restore previous selections
                const initialCounties = preSelectedLocals.counties.reduce((acc, county) => {
                    acc[county.nexus_id] = true;
                    return acc;
                }, {} as Record<string, boolean>);

                const initialCities = preSelectedLocals.cities.reduce((acc, city) => {
                    acc[city.nexus_id] = true;
                    return acc;
                }, {} as Record<string, boolean>);

                setSelectedCounties(initialCounties);
                setSelectedCities(initialCities);
            } catch (error) {
                console.error("Error fetching data:", error instanceof Error ? error.message : "An unexpected error occurred");
            }
        };

        fetchData();
    }, [region, dispatch]);


    const isCountyIndeterminate = (county: County) => {
        const cityIds = county.cities.map(city => city.id);
        const selectedCitiesCount = cityIds.filter(cityId => selectedCities[cityId]).length;
        return selectedCitiesCount > 0 && selectedCitiesCount < cityIds.length;
    };

    const isCountyChecked = (county: County) => {
        if (county.cities.length === 0) {
            return selectedCounties[county.id] || false; // Only check if manually selected
        }
        return county.cities.every(city => selectedCities[city.id] === true);
    };


    const isCitySelected = (city: City) => {
        return selectedCities[city.id] || false;
    };

    /*** Handle Selection Changes ***/

    const handleCountyChange = (county: County, isChecked: boolean) => {
        setSelectedCounties(prev => ({ ...prev, [county.id]: isChecked }));

        setSelectedCities(prev => {
            const updatedCities = { ...prev };
            county.cities.forEach(city => {
                updatedCities[city.id] = isChecked;
            });
            return updatedCities;
        });
    };

    const handleCityChange = (county: County, city: City, isChecked: boolean) => {
        setSelectedCities(prev => ({ ...prev, [city.id]: isChecked }));

        setSelectedCounties(prev => ({
            ...prev,
            [county.id]: isChecked || county.cities.some(city => selectedCities[city.id])
        }));
    };


    const handleDoneClick = () => {
        if (!responseData || responseData.length === 0) {
            onCancel()
            return;
        }
        const selectedData = responseData.reduce<{ counties: any[]; cities: any[] }>(
            (acc, county) => {
                if (selectedCounties[county.id] || county.cities.some(city => selectedCities[city.id])) {
                    acc.counties.push({
                        id: county.id, nexus_id: county.id, name: county.name,
                        jurisdiction_type: county.jurisdiction_type,
                        effective_date: county.effective_date,
                        expiration_date: county.expiration_date
                    });
                }

                county.cities.forEach(city => {
                    if (selectedCities[city.id]) {
                        acc.cities.push({
                            id: city.id, nexus_id: city.id, name: city.name,
                            jurisdiction_type: city.jurisdiction_type,
                            effective_date: city.effective_date,
                            expiration_date: city.expiration_date
                        });
                    }
                });

                return acc;
            },
            { counties: [], cities: [] }
        );
        onDone(selectedData)
    };

    return (
        <Container fluid>
            <h5 className="mb-3">Add taxes you're registered to report in {region.name}</h5>
            <p>Add local taxes for any boroughs or cities where you're registered to report tax.</p>
            <Row>
                {responseData?.length > 0 ? (
                    responseData.map((county, index) => (
                        <Col key={county.id} md={4} >
                            <Accordion>
                                <Accordion.Item eventKey={String(index)}>
                                    <Accordion.Header>
                                        <FormCheck
                                            type="checkbox"
                                            label={county.name}
                                            checked={isCountyChecked(county)}
                                            ref={(el: any) => el && (el.indeterminate = isCountyIndeterminate(county))}
                                            onChange={(e) => handleCountyChange(county, e.target.checked)}
                                            className="me-2"
                                        />
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <Row>
                                            {county.cities.map((city) => (
                                                <Col key={city.id} md={6}>
                                                    <FormCheck
                                                        type="checkbox"
                                                        label={city.name}
                                                        checked={isCitySelected(city)}
                                                        onChange={(e) => handleCityChange(county, city, e.target.checked)}
                                                    />
                                                </Col>
                                            ))}
                                        </Row>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Accordion>
                        </Col>
                    ))
                ) : (
                    <p>No local nexuses found.</p>
                )}
            </Row>


            <div className="mt-3 d-flex justify-content-between mb-1">
                <Button className="btn bg-white border-0 text-black" size="sm" onClick={onCancel}>
                    Cancel
                </Button>

                <Button type="submit" size="sm" variant="primary" onClick={handleDoneClick}>Save</Button>
            </div>
        </Container>
    );
};

export default SelectLocals;
