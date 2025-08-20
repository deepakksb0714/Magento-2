import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Card, Col, Dropdown, Form, Row, Nav, Tab, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { DeleteModal } from '../../../Common/DeleteModal';
import ExportCustomTaxCodesModal from '../../InvoiceManagement/AddTaxRule/ExportCustomTaxCodesData'
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import {
    getCustomTaxCodes as onGetCustomTaxCodes,
    deleteCustomTaxCode as onDeleteCustomTaxCode,
} from '../../../slices/thunk';

const CustomTaxCodes = () => {

    document.title = 'CUSTOM TAX CODES  | Dashboard';

    const [customTaxCodes, setCustomTaxCodes] = useState([]);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const primaryEntity = usePrimaryEntity();
    //edit taxrules
    const handleDetailsClick = (rowData: any) => {
        navigate('/edit-custom-tax-code', { state: { rowData } });
    };

    const [showExportModal, setShowExportModal] = useState(false);

    const handleShowExportModal = () => setShowExportModal(true);
    const handleCloseExportModal = () => setShowExportModal(false);

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


    const selectCustomTaxCodeList = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => ({
            customTaxCodeList: invoices.customTaxCodeList,
        })
    );

    const { customTaxCodeList } = useSelector(selectCustomTaxCodeList);
    useEffect(() => {
        dispatch(onGetCustomTaxCodes());
    }, [dispatch]);

    useEffect(() => {
        if (customTaxCodeList && primaryEntity) {
            const filteredCustomTaxCodes = customTaxCodeList.filter(
                (customTaxCode: any) =>
                    customTaxCode?.entity_id === primaryEntity.id
            );
            setCustomTaxCodes(filteredCustomTaxCodes);
            //  setOriginalcustomTaxCodes(filteredcustomTaxCodes); // Store the original customTaxCodes
        } else {
            setCustomTaxCodes([]);
            //  setOriginalcustomTaxCodes([]); // Clear the original customTaxCodes when no data
        }
    }, [customTaxCodeList, primaryEntity]);


    const handleDeleteId = () => {
        dispatch(onDeleteCustomTaxCode(deletid.id) as any);
        setDelet(false);
    };

    const [showOption, setShowOption] = useState(true);

    const toggleOption = () => {
        setShowOption(prev => !prev);
    }

    const columns = useMemo(
        () => [
            {
                Header: 'TYPE',
                accessor: 'tax_code_type',
                Filter: false,
                isSortable: true,
                Cell: (cell: any) => cell.row.original.tax_code_type || '-',
            },
            {
                Header: 'CODE',
                accessor: 'code',
                Filter: false,
                isSortable: true,
            },
            {
                Header: 'DESCRIPTION',
                accessor: 'description',
                Filter: false,
                isSortable: true,
                Cell: (cell: any) => cell.row.original.description || '-',
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
            <Row className="pb-4 mb-4">
                <Col>
                    <h2 style={{ fontSize: "20px" }}>About custom tax codes</h2>
                    <p style={{ fontSize: "16px" }}>
                        You can create custom tax codes for items that have special taxability that cannot be handled by an existing ScalarHub tax code.
                    </p>
                    <p style={{ fontSize: "16px" }}>
                        For the special taxability to be applied to a custom tax code, you need to assign a tax rule to it. Any item with an ScalarHub tax code assigned to it will be taxed according to the tax rule you have associated with it.
                    </p>
                    <Button variant="link" className="text-primary d-block mb-2" onClick={toggleOption}>
                        How do I find out if ScalarHub already has the ScalarHub tax code I need?
                    </Button>
                    {
                        showOption && (<Link to="#" className="text-primary d-block">
                            📂 Download ScalarHub tax code list (.xls)
                        </Link>)
                    }
                </Col>
            </Row>

            <Row className="pb-4 gy-4 mb-4">
                <Col sm={12}>
                    <Link to="/add-custom-tax-code">
                        <i className="las la-plus-circle me-1"></i> Add a custom tax code
                    </Link>
                    <span style={{ paddingLeft: '20px' }}></span>
                    <Link to="#" className='disabled' onClick={handleShowExportModal}>
                        <i className="las la-file-import me-1"></i> Export custom tax code
                    </Link>
                    <span style={{ paddingLeft: '20px' }}></span>
                </Col>

            </Row>

            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            {customTaxCodes && customTaxCodes.length > 0 ? (
                                <TableContainer
                                    isPagination={true}
                                    columns={columns}
                                    data={customTaxCodes || []}
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
                </Col>
            </Row>
            <DeleteModal
                show={delet}
                handleClose={handleDeleteModal}
                deleteModalFunction={handleDeleteId}
            />

            <ExportCustomTaxCodesModal
                show={showExportModal}
                handleClose={handleCloseExportModal}
            />
        </React.Fragment >
    )
}

export default CustomTaxCodes