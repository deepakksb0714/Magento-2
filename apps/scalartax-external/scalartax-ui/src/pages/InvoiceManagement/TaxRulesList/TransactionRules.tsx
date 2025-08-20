import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Dropdown, Form, Row, Nav, Tab, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { useDispatch, useSelector } from 'react-redux';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { createSelector } from 'reselect';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import {
    getTransactionRules as onGetTransactionRules,
    deleteTransactionRule as onDeleteTransactionRule,
} from '../../../slices/thunk';


interface Condition {
    id: string;
    transaction_rule_id: string;
    field: string | null;
    operator: string | null;
    values: any | null;
    created_at: string;
    updated_at: string;
    address_types: string[];
}

interface Address {
    id: string;
    address_line1: string;
    address_line2: string | null;
    city: string | null;
    address_string: string | null;
    state: string | null;
    zip_code: string;
    country: string | null;
    created_at: string;
    updated_at: string;
}

interface Allocation {
    id: string;
    transaction_rule_id: string;
    tax_code: string | null;
    percentage: number | null;
    created_at: string;
    updated_at: string;
    location_id: string;
    address_id: string;
    address: Address;
}

interface TransactionRule {
    id: string;
    name: string;
    effective_date: string;
    expiration_date: string;
    rule_type: string;
    document_types: string[];
    ignore_rule_on_error: boolean;
    inactive: boolean;
    created_by_id: string;
    updated_by_id: string;
    created_at: string;
    updated_at: string;
    entity_id: string;
    allocate_tax_on_single_line: boolean;
    conditions: Condition[];
    allocations: Allocation[];
}


const TransactionRules = () => {
    const primaryEntity = usePrimaryEntity();
    const [transactionRules, setTransactionRules] = useState<TransactionRule[]>([]);
    const [filteredTransactionRules, setFilteredTransactionRules] = useState<TransactionRule[]>(transactionRules);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    //edit TransactionRules
    const handleDetailsClick = (rowData: any) => {
        navigate('/edit-transaction-rule', { state: { rowData } });
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

    const selectTransactionRuleList = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => ({
            transactionRuleList: invoices.transactionRuleList,
        })
    );

    const { transactionRuleList } = useSelector(selectTransactionRuleList);

    useEffect(() => {
        dispatch(onGetTransactionRules());
    }, [dispatch]);

    useEffect(() => {
        if (transactionRuleList && primaryEntity) {

            const filteredTransactionRules = transactionRuleList?.transaction_rules?.filter(
                (transactionRule: any) =>
                    transactionRule?.entity_id === primaryEntity.id
            );
            setTransactionRules(filteredTransactionRules);
            toggleTab('All')
            //  setOriginalTransactionRules(filteredTransactionRules); // Store the original TransactionRules
        } else {
            setTransactionRules([]);
            //  setOriginalTransactionRules([]); // Clear the original TransactionRules when no data
        }
    }, [transactionRuleList, primaryEntity]);


    useEffect(() => {
        const updateTransactionRulesWithStatus = () => {
            if (transactionRules && transactionRules.length > 0) {
                const now = new Date();
    
                const rulesWithStatus = transactionRules.map(rule => {
                    // Rule is explicitly inactive
                    if (rule.inactive) {
                        return { ...rule, status: 'Inactive' };
                    }
    
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
    
                toggleTab('All');
                setTransactionRules(rulesWithStatus);
            }
        };
    
        updateTransactionRulesWithStatus();
    }, [transactionRules]);
    
    

    const handleDeleteId = () => {
        dispatch(onDeleteTransactionRule(deletid.id) as any);
        setDelet(false);
    };

    const toggleTab = (status: string) => {
        if (status === 'All') {
            setFilteredTransactionRules(transactionRules)
        }
        else {
            setFilteredTransactionRules(transactionRules.filter((rule: any) => rule.status === status));
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
                Header: 'EFFECTIVE DATE',
                accessor: 'effective_date',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'EXPIRATION DATE',
                accessor: 'expiration_date',
                Filter: false,
                isSortable: true,
                Cell: (cell: any) => cell.row.original.expiration_date || '-',
            },
            {
                Header: 'RULE TYPE',
                accessor: 'rule_type',
                Filter: false,
                isSortable: true,
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
                    <Button
                        onClick={() => handleDetailsClick(cell.row.original)}
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
        []
    );

    return (

        <React.Fragment>
            <Row className="pb-4 gy-3">
                <Col sm={12}>
                    <Link to="/add-advanced-rule">
                        <i className="las la-plus-circle me-1"></i> Add a Transaction Rule
                    </Link>
                </Col>
            </Row>

            <Row className="pb-4 gy-3">
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
                                {filteredTransactionRules && filteredTransactionRules.length > 0 ? (
                                    <TableContainer
                                        isPagination={true}
                                        columns={columns}
                                        data={filteredTransactionRules || []}
                                        customPageSize={9}
                                        divClassName="table-card table-responsive"
                                        tableClass="table-hover table-nowrap align-middle mb-0"
                                        isBordered={false}
                                        theadClass="table-light"
                                        PaginationClass="align-items-center mt-4 gy-3"
                                    />
                                ) :
                                    <NoSearchResult />}
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
        </React.Fragment>

    )
}

export default TransactionRules;