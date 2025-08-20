import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Nav, Tab, Button, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import * as XLSX from 'xlsx';
import { DeleteModal } from '../../../Common/DeleteModal';
import Papa from 'papaparse';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import ExportTaxRulesModal from '../../InvoiceManagement/AddTaxRule/ExportTaxRulesData'
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import {countryData} from '../../../Common/data/countryState';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import {
    getTaxRules as onGetTaxRules,
    deleteTaxRule as onDeleteTaxRule,
} from '../../../slices/thunk';

interface TaxRule {
    name: string;
    entity_id: string;
    effective_date: string;
    expiration_date: string;
    rule_type: string;
    country: string;
    tax_type: string;
    tax_sub_type: string;
    rate_type: string;
    jurisdiction_type: string;
    region: string;
    jurisdiction_name: string;
    entity_use_code: string;
    unit_of_basis: boolean;
    tax_code: string;
    tariff_code: string;
    tax_treatment: string;
    special_handling: string;
    is_all_jurs: string;
    source: string;
    cap: string;
    cap_applied_value: string;
    cap_option: string;
    threshold: string;
    threshold_applied_value: string;
    tax_entire_amount: boolean;
    base_value: string;
    rate_value: string;
    status: string;
}


const TaxRules: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const primaryEntity = usePrimaryEntity();
    const [showExportModal, setShowExportModal] = useState(false);

    const handleShowExportModal = () => setShowExportModal(true);
    const handleCloseExportModal = () => setShowExportModal(false);


    const [filters, setFilters] = useState({
        ruleType: "All",
        country: "All",
        region: "All",
        jurisdictionType: "",
        entityUseCode: "All",
        search: "",
    });

    const [taxRules, setTaxRules] = useState<TaxRule[]>([]);
    const [taxRulesWithStaus, setTaxRulesWithStaus] = useState<TaxRule[]>([]);

    //Apply filters
    const [filteredTaxRules, setFilteredTaxRules] = useState<TaxRule[]>(taxRules);

    const handleFilterChange = (e: any) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        const filtered = taxRulesWithStaus.filter((rule) => {
         
            return (
                (filters.ruleType === "All" || rule.rule_type === filters.ruleType) &&
                (filters.country === "All" || rule.country === filters.country) &&
                (filters.region === "All" || rule.region === filters.region) &&
                (filters.jurisdictionType === "" || rule.jurisdiction_type.includes(filters.jurisdictionType)) &&
                (filters.entityUseCode === "All" || filters.entityUseCode === "All") &&
                (filters.search === "" || rule.jurisdiction_name.includes(filters.search))
            );
        });
        setFilteredTaxRules(filtered);
    };

    const resetFilters = () => {
        setFilters({
            ruleType: "All",
            country: "All",
            region: "All",
            jurisdictionType: "",
            entityUseCode: "All",
            search: "",
        });
        setFilteredTaxRules(taxRulesWithStaus);
    };

    //edit taxrules
    const handleDetailsClick = (rowData: any) => {
        navigate('/edit-tax-rule', { state: { rowData } });
    };

    // Delete modal
    const [delet, setDelet] = useState<boolean>(false);
    const [deletid, setDeletid] = useState<any>();
    const handleDeleteModal = useCallback(
        (id: any) => {
            setDelet(!delet);
            setDeletid(id);
        },
        [delet]
    );


    const selectTaxRuleList = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => ({
            taxRuleList: invoices.taxRuleList,
        })
    );

    const { taxRuleList } = useSelector(selectTaxRuleList);
    useEffect(() => {
        dispatch(onGetTaxRules());
    }, [dispatch]);

    useEffect(() => {
        if (taxRuleList && primaryEntity) {

            const filteredTaxRule = taxRuleList.filter(
                (taxRule: any) =>
                    taxRule?.entity_id === primaryEntity.id
            );
            setTaxRules(filteredTaxRule);
            toggleTab('All')
            //  setOriginalTaxRuleCodes(filteredTaxRuleCodes); // Store the original TaxRuleCodes
        } else {
            setTaxRules([]);

            //  setOriginalTaxRuleCodes([]); // Clear the original TaxRuleCodes when no data
        }
    }, [taxRuleList, primaryEntity]);

    useEffect(() => {
        const updateTaxRulesWithStatus = () => {
            if (taxRules && taxRules.length > 0) {
                const now = new Date();
    
                const rulesWithStatus = taxRules.map(rule => {
                    // Check if effective_date is in the future
                    const effectiveDate = rule.effective_date ? new Date(rule.effective_date) : null;
                    if (effectiveDate && effectiveDate > now) {
                        return { ...rule, status: 'Inactive' };
                    }
    
                    // Check if expiration_date is in the past
                    const expirationDate = rule.expiration_date ? new Date(rule.expiration_date) : null;
                    if (expirationDate && expirationDate <= now) {
                        return { ...rule, status: 'Inactive' };
                    }
    
                    // Default to Active
                    return { ...rule, status: 'Active' };
                });
    
                setTaxRulesWithStaus(rulesWithStatus);
            }
        };
    
        updateTaxRulesWithStatus();
    }, [taxRules]);
    
    


    useEffect(() => {
        if (taxRulesWithStaus) {
            toggleTab('All')
        }
    }, [taxRulesWithStaus]);


    const handleDeleteId = () => {
        dispatch(onDeleteTaxRule(deletid.id) as any);
        setDelet(false);
    };

    // Toggle between status tabs
    const toggleTab = (status: string) => {
        if (status === 'All') {
            setFilteredTaxRules(taxRulesWithStaus);
        } else {
            setFilteredTaxRules(taxRulesWithStaus.filter((rule) => rule.status === status));
        }
    };

    const columns = useMemo(
        () => [
            {
                Header: 'NAME',
                accessor: 'name',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'JURISDICTION',
                accessor: 'jurisdiction_name',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'REGION',
                accessor: 'region',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'TAX RULE TYPE',
                accessor: 'rule_type',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'SCALARHUB TAX CODE',
                accessor: 'tax_code',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'EXPIRATION',
                accessor: 'expiration_date',
                Filter: false,
                isSortable: true,
                Cell: (cell: any) => cell.row.original.expiration_date || '-',
            },
            {
                Header: 'STATUS',
                accessor: 'status',
                isSortable: true,
                Filter: false,
                Cell: (cell: any) => (
                    <span
                        className={`badge ${cell.row.original.status === 'Active'
                            ? 'bg-success-subtle text-success'
                            : 'bg-secondary-subtle text-secondary'
                            } p-2`}
                    >
                        {cell.row.original.status}
                    </span>
                ),
            },
            {
                Header: 'ACTION',
                accessor: 'action',
                Filter: false,
                isSortable: false,
                Cell: (cell: any) => (
                    <Button onClick={() => handleDetailsClick(cell.row.original)}
                        className="btn btn-primary btn-sm"
                    >
                        Details
                    </Button>
                ),
            },
            {
                Header: 'DELETE',
                accessor: 'delete',
                Filter: false,
                isSortable: false,
                Cell: (cell: any) => (
                    <Button
                        className="btn btn-danger btn-sm"
                        onClick={() => {
                            const item = cell.row.original;
                            handleDeleteModal(item);
                        }}
                    >
                        <i className="las la-trash-alt"></i>
                    </Button>
                ),
            },
        ],
        [filteredTaxRules]
    );
  
    return (
        <React.Fragment>
            <Row className="pb-4 gy-3">
                <Col sm={12}>
                    <Link to="/add-tax-rule">
                        <i className="las la-plus-circle me-1"></i> Add a tax rule
                    </Link>
                    <span style={{ paddingLeft: '20px' }}></span>
                    <Link to="/import-tax-rule">
                        <i className="las la-file-import me-1"></i> Import tax rules
                    </Link>
                    <span style={{ paddingLeft: '20px' }}></span>
                    <button
                        className="btn addPayment-modal"
                        onClick={handleShowExportModal}
                    >
                        <span style={{ color: '#477bf9' }}>
                            <i className="las la-lightbulb me-1"></i>Export tax rules
                        </span>{' '}
                    </button>
                </Col>
            </Row>

            <Form>
                <div>
                    <Row className="d-flex flex-wrap">
                        <Col md={2}>
                            <Form.Group>
                                <Form.Label>TAX RULE TYPE</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="ruleType"
                                    value={filters.ruleType}
                                    onChange={handleFilterChange}
                                >
                                    <option>All</option>
                                    <option value="productTaxabilityRule">Product Taxability Rule</option>
                                    <option value="exemptEntityRule">Exempt Entity Rule</option>
                                    <option value="rateOverrideRule">Rate Override Rule</option>
                                    <option value="baseOverrideRule">Base Override Rule</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={2}>
                            <Form.Group>
                                <Form.Label htmlFor="country">COUNTRY</Form.Label>
                                <Form.Control
                                    as="select"
                                    id="country"
                                    name="country"
                                    value={filters.country}
                                    onChange={handleFilterChange}
                                >
                                    <option>Select Country</option>
                                    <option value="US">United States</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={2}>
                            <Form.Group>
                                <Form.Label htmlFor="region">REGION</Form.Label>
                                <Form.Control
                                    as="select"
                                    id="region"
                                    name="region"
                                    value={filters.region}
                                    onChange={handleFilterChange}
                                >
                                    <option>Select a region</option>
                                    {countryData.USA.map((region: string) => (
                                        <option key={region} value={region}>
                                            {region}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label htmlFor="jurisdictionType">JURISDICTION TYPE</Form.Label>
                                <Form.Control
                                    as="select"
                                    id="jurisdictionType"
                                    name="jurisdictionType"
                                    value={filters.jurisdictionType}
                                    onChange={handleFilterChange}
                                >
                                    <option value="special tax authority">Special Tax Authority</option>
                                    <option value="state">State</option>
                                    <option value="city">City</option>
                                    <option value="country">Country</option>
                                    <option value="county">County</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        <Col md={3}>
                            <Form.Group>
                                <Form.Label htmlFor="entityUseCode">ENTITY USE CODE</Form.Label>
                                <Form.Control
                                    as="select"
                                    id="entityUseCode"
                                    name="entityUseCode"
                                    value={filters.entityUseCode}
                                    onChange={handleFilterChange}
                                >
                                    <option value="All">All</option>
                                    <option value="None">None</option>
                                    <option value="A - Federal Government">A - Federal Government</option>
                                    <option value="B - State Government">B - State Government</option>
                                    <option value="C - Tribal Government">C - Tribal Government</option>
                                    <option value="D - Foreign Diplomat">D - Foreign Diplomat</option>
                                    <option value="E - Charitable/Exempt Organization">
                                        E - Charitable/Exempt Organization
                                    </option>
                                    <option value="F - Religious Organization">F - Religious Organization</option>
                                    <option value="G - Resale">G - Resale</option>
                                    <option value="H - Agriculture">H - Agriculture</option>
                                    <option value="I - Industrial Prod/Manufacturer">
                                        I - Industrial Prod/Manufacturer
                                    </option>
                                    <option value="J - Direct Pay">J - Direct Pay</option>
                                    <option value="K - Direct Mail">K - Direct Mail</option>
                                    <option value="M - Educational Organization">M - Educational Organization</option>
                                    <option value="N - Local Government">N - Local Government</option>
                                    <option value="P - Commercial Aquaculture">P - Commercial Aquaculture</option>
                                    <option value="Q - Commercial Fishery">Q - Commercial Fishery</option>
                                    <option value="R - Non-Resident">R - Non-Resident</option>
                                    <option value="TaxableOverrideExemption">Taxable - Override Exemption</option>
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row className="mt-4">
                        <Col md={6}>
                            <Form.Label htmlFor="search">Attribute</Form.Label>
                            <Form.Control
                                id="search"
                                name="search"
                                type="text"
                                placeholder="Name or jurisdiction"
                                value={filters.search} onChange={handleFilterChange}
                            />
                        </Col>

                        <Col className="d-flex align-items-end justify-content-center">
                            <button
                                type="button"
                                className="btn btn-primary me-2" onClick={applyFilters}
                            >
                                Apply
                            </button>
                            <button type="reset" className="btn btn-light" onClick={resetFilters}>
                                Reset
                            </button>

                        </Col>
                    </Row>


                </div>
            </Form>

            <Row className="pb-4 gy-3 mt-4">
                <Col xl={12}>

                    <Tab.Container defaultActiveKey="All">
                        <Nav
                            as="ul"
                            variant="tabs"
                            className="nav-tabs nav-tabs-custom nav-success mb-3"
                        >
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="All"
                                    onClick={() => {
                                        toggleTab('All');
                                    }}
                                >
                                    All
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="Active"
                                    onClick={() => {
                                        toggleTab('Active');
                                    }}
                                >
                                    Active
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                                <Nav.Link
                                    eventKey="Inactive"
                                    onClick={() => {
                                        toggleTab('Inactive');
                                    }}
                                >
                                    Inactive
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>

                        <Card>
                            <Card.Body>
                                {filteredTaxRules && filteredTaxRules.length > 0 ? (
                                    <TableContainer
                                        isPagination={true}
                                        columns={columns}
                                        data={filteredTaxRules || []}
                                        customPageSize={9}
                                        divClassName="table-card table-responsive"
                                        tableClass="table-hover table-nowrap align-middle mb-0"
                                        isBordered={false}
                                        theadClass="table-light"
                                        PaginationClass="align-items-center mt-4 gy-3"
                                    />
                                ) : <NoSearchResult />}
                            </Card.Body>
                        </Card>
                    </Tab.Container>
                </Col>
            </Row>


            <DeleteModal
                show={delet}
                handleClose={handleDeleteModal}
                deleteModalFunction={handleDeleteId}
            />
            <ExportTaxRulesModal
                show={showExportModal}
                handleClose={handleCloseExportModal}
            />
           
        </React.Fragment>

    );
};

export default TaxRules;
