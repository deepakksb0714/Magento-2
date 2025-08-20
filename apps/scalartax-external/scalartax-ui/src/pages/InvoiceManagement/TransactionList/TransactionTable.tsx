import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Button, Modal, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { ToastContainer } from 'react-toastify';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as XLSX from 'xlsx';
import { createSelector } from 'reselect';
import Papa from 'papaparse';
import { useDispatch, useSelector } from 'react-redux';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import { getTransactions as onGetTransactions } from '../../../slices/thunk';
import Index from '../SalesInvoiceTransaction/index.edit';
import { FaFilter, FaCog } from 'react-icons/fa';
import SalesInvoiceTransaction from '../../InvoiceManagement/SalesInvoiceTransaction';
import TaxImports from '../../InvoiceManagement/ImportTransaction';
import { useLocation } from 'react-router-dom';
import { useCustomerDetails } from '../../../Common/useTaxDetails';
interface Transaction {
  id: string;
  parent_transaction_id?: string | null;
  product_id?: string | null;
  account_id?: string | null;
  entity_id: string;
  customer_id?: string | null;
  origin_address_id: string;
  destination_address_id: string;
  code: string;
  transaction_type: string;
  date: string;
  status: string;
  customer_code: string;
  vendor_code?: string | null;
  total_discount?: string | null;
  exchange_rate_currency_code?: string | null;
  transaction_code?: string | null;
  entity_use_code?: string | null;
  exempt_no?: string | null;
  customer_vat_number?: string | null;
  customer_vendor_code?: string | null;
  vendor_vat_number?: string | null;
  description?: string | null;
  reconciled: boolean;
  sales_person_code?: string | null;
  tax_override_type?: string | null;
  tax_override_amount: string;
  tax_override_reason?: string | null;
  total_amount?: string | null;
  total_discount_amount?: string | null;
  total_exempt: string;
  total_tax: string;
  total_taxable: string;
  total_tax_calculated: string;
  adjustment_reason: string;
  adjustment_description: string;
  locked: boolean;
  region: string;
  country: string;
  version: string;
  exchange_rate_effective_date?: string | null;
  exchange_rate: string;
  is_seller_importer_of_record: string;
  tax_date: string;
  created_by_id?: string | null;
  updated_by_id?: string | null;
  created_at: string;
  updated_at: string;
  currency_code: string;
  line_items: LineItem[];
  origin_address: Address;
  destination_address: Address;
}

interface LineItem {
  id: string;
  product_id?: string | null;
  transaction_id: string;
  line_number: number;
  boundary_override_id?: string | null;
  entity_use_code?: string | null;
  description?: string | null;
  destination_address_id?: string | null;
  origin_address_id?: string | null;
  discount_amount: string;
  discount_type_id?: string | null;
  exempt_amount?: string | null;
  exempt_cert_id?: string | null;
  exempt_no?: string | null;
  is_item_taxable: boolean;
  is_sstp: boolean;
  item_code: string;
  line_amount: string;
  quantity: number;
  ref1?: string | null;
  ref2?: string | null;
  reporting_date?: string | null;
  rev_account?: string | null;
  sourcing?: string | null;
  tax: string;
  taxable_amount: string;
  tax_calculated: string;
  tax_code: string;
  tax_date: string;
  tax_engine?: string | null;
  tax_override_type?: string | null;
  tax_override_amount: string;
  tax_override_reason?: string | null;
  tax_included?: boolean | null;
  created_at: string;
  updated_at: string;
  traffic_code?: string | null;
  customer_vat_number?: string | null;
}

interface Address {
  id: string;
  address_line1: string;
  address_line2: string;
  address_line3: string;
  city: string;
  region: string;
  country: string;
  postal_code: string;
  created_at: string;
  updated_at: string;
}
interface ColumnDefinition {
  id: string;
  Header: string;
  accessor: string | ((row: any) => any);
}

const TransactionTable: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [originalTransactions, setOriginalTransactions] = useState<
    Transaction[]
  >([]); // Store the original transactions here
  const [activeTab, setActiveTab] = useState('Transaction List');
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<string>('');
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [filteredTransactions, setFilteredTransactions] = useState<
    Transaction[]
  >([]);
  const { customersWithCertificates } = useCustomerDetails();
  const [initialColumns, setInitialColumns] = useState<ColumnDefinition[]>([])
  const [edittransactions, setEdittransactions] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();
  const [showEdit, setShowEdit] = useState(false);
  useEffect(() => {
    const columns: ColumnDefinition[] = [
      { id: 'code', Header: 'Document Code', accessor: 'code' },
      {
        id: 'transaction_type',
        Header: 'Document Type',
        accessor: 'transaction_type',
      },
      { id: 'date', Header: 'Date', accessor: 'date' },
      { id: 'status', Header: 'Status', accessor: 'status' },
      {
        id: 'customer_code',
        Header: 'Customer Code',
        accessor: (row) => {
          const customer = customersWithCertificates.find(c => c.id === row.customer_id);
          return customer ? customer.customer_code : 'N/A';
        },
      },

      { id: 'vendor_code', Header: 'Vendor Code', accessor: 'vendor_code' },
      {
        id: 'total_discount',
        Header: 'Total Discount',
        accessor: 'total_discount',
      },
      {
        id: 'exchange_rate_currency_code',
        Header: 'Exchange Rate Currency Code',
        accessor: 'exchange_rate_currency_code',
      },
      {
        id: 'transaction_code',
        Header: 'Transaction Code',
        accessor: 'transaction_code',
      },
      {
        id: 'entity_use_code',
        Header: 'Entity Use Code',
        accessor: 'entity_use_code',
      },
      { id: 'exempt_no', Header: 'Exempt No', accessor: 'exempt_no' },
      {
        id: 'customer_vat_number',
        Header: 'Customer VAT Number',
        accessor: 'customer_vat_number',
      },
      {
        id: 'customer_vendor_code',
        Header: 'Customer Vendor Code',
        accessor: 'customer_vendor_code',
      },
      {
        id: 'vendor_vat_number',
        Header: 'Vendor VAT Number',
        accessor: 'vendor_vat_number',
      },
      { id: 'description', Header: 'Description', accessor: 'description' },
      { id: 'reconciled', Header: 'Reconciled', accessor: 'reconciled' },
      {
        id: 'sales_person_code',
        Header: 'Salesperson Code',
        accessor: 'sales_person_code',
      },
      {
        id: 'tax_override_type',
        Header: 'Tax Override Type',
        accessor: 'tax_override_type',
      },
      {
        id: 'tax_override_amount',
        Header: 'Tax Override Amount',
        accessor: 'tax_override_amount',
      },
      {
        id: 'tax_override_reason',
        Header: 'Tax Override Reason',
        accessor: 'tax_override_reason',
      },
      // { id: 'total_amount', Header: 'Total Amount', accessor: 'total_amount' },
      {
        id: 'total_discount_amount',
        Header: 'Total Discount Amount',
        accessor: 'total_discount_amount',
      },
      { id: 'total_exempt', Header: 'Total Exempt', accessor: 'total_exempt' },
      { id: 'total_tax', Header: 'Total Tax', accessor: 'total_tax' },
      { id: 'total_taxable', Header: 'Total Taxable', accessor: 'total_taxable' },
      {
        id: 'total_tax_calculated',
        Header: 'Total Tax Calculated',
        accessor: 'total_tax_calculated',
      },
      {
        id: 'adjustment_reason',
        Header: 'Adjustment Reason',
        accessor: 'adjustment_reason',
      },
      {
        id: 'adjustment_description',
        Header: 'Adjustment Description',
        accessor: 'adjustment_description',
      },
      { id: 'locked', Header: 'Locked', accessor: 'locked' },
      { id: 'region', Header: 'Region', accessor: 'region' },
      { id: 'country', Header: 'Country', accessor: 'country' },
      { id: 'version', Header: 'Version', accessor: 'version' },
      {
        id: 'exchange_rate_effective_date',
        Header: 'Exchange Rate Effective Date',
        accessor: 'exchange_rate_effective_date',
      },
      { id: 'exchange_rate', Header: 'Exchange Rate', accessor: 'exchange_rate' },
      {
        id: 'is_seller_importer_of_record',
        Header: 'Is Seller Importer of Record',
        accessor: 'is_seller_importer_of_record',
      },
      { id: 'tax_date', Header: 'Tax Date', accessor: 'tax_date' },
      { id: 'created_by_id', Header: 'Created By ID', accessor: 'created_by_id' },
      { id: 'updated_by_id', Header: 'Updated By ID', accessor: 'updated_by_id' },
      { id: 'created_at', Header: 'Created At', accessor: 'created_at' },
      { id: 'updated_at', Header: 'Updated At', accessor: 'updated_at' },
      { id: 'currency_code', Header: 'Currency Code', accessor: 'currency_code' },
      { id: 'line_items', Header: 'Line Items', accessor: 'line_items' },
      {
        id: 'origin_address',
        Header: 'Origin Address',
        accessor: 'origin_address',
      },
      {
        id: 'destination_address',
        Header: 'Destination Address',
        accessor: 'destination_address',
      },
    ];
    setInitialColumns(columns)
  }, [customersWithCertificates])
  const primaryEntity = usePrimaryEntity();


  const [shownColumns, setShownColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(0, 5)
  );
  const [hiddenColumns, setHiddenColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(5)
  );
  useEffect(() => {
    setShownColumns(initialColumns.slice(0, 5))
    setHiddenColumns(initialColumns.slice(5))
  }, [initialColumns])
  const selectTransactionList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      transactionList: invoices.transactionList,
    })
  );
  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  useEffect(() => {
    if (activeTab == 'Transaction List') {
      setShowEdit(false)
    }
  }, [activeTab]);

  const { transactionList } = useSelector(selectTransactionList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetTransactions());
  }, [dispatch, primaryEntity, activeTab, showEdit]);

  useEffect(() => {
    if (transactionList && primaryEntity) {
      const filteredtransactions = transactionList.filter(
        (transaction: Transaction) =>
          transaction?.entity_id === primaryEntity.id
      );
      setTransactions(filteredtransactions);
      setOriginalTransactions(filteredtransactions); // Store the original transactions
    } else {
      setTransactions([]);
      setOriginalTransactions([]); // Clear the original transactions when no data
    }
  }, [transactionList, primaryEntity, activeTab, showEdit]);



  const handleDeleteModal = useCallback(
    (id: string) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
      setTransactions(originalTransactions); // Restore original transactions
    } else {
      const filteredData = originalTransactions.filter(
        (transaction: Transaction) =>
          transaction?.date?.toLowerCase().includes(searchTerm) ||
          transaction?.code?.toLowerCase().includes(searchTerm) ||
          transaction?.country?.toLowerCase().includes(searchTerm) ||
          transaction?.transaction_type?.toLowerCase().includes(searchTerm) ||
          transaction?.region?.toLowerCase().includes(searchTerm)
      );
      setTransactions(filteredData);
    }
  };

  const filterTransactionsByDateRange = (
    transactions: Transaction[],
    startDate: string,
    endDate: string
  ): Transaction[] => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };

  const handleFilter = () => {
    if (startDate && endDate) {
      const result = filterTransactionsByDateRange(
        originalTransactions,
        startDate,
        endDate
      ); // Filter the original transactions
      setTransactions(result); // Set the filtered transactions
    } else {
      setTransactions(originalTransactions); // Restore the original transactions when no filter is applied
    }
  };
  const handleEdittransactions = (item: Transaction) => {
    setEdittransactions(true);
    setEdit(item);
    setShowEdit(true);
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    let updatedShownColumns = [...shownColumns];
    let updatedHiddenColumns = [...hiddenColumns];

    // Remove item from the source list
    if (result.source.droppableId === 'shownColumns') {
      const [removed] = updatedShownColumns.splice(result.source.index, 1);
      // Add item to the destination list
      if (result.destination.droppableId === 'shownColumns') {
        updatedShownColumns.splice(result.destination.index, 0, removed);
      } else {
        updatedHiddenColumns.splice(result.destination.index, 0, removed);
      }
    } else {
      const [removed] = updatedHiddenColumns.splice(result.source.index, 1);
      // Add item to the destination list
      if (result.destination.droppableId === 'shownColumns') {
        updatedShownColumns.splice(result.destination.index, 0, removed);
      } else {
        updatedHiddenColumns.splice(result.destination.index, 0, removed);
      }
    }

    setShownColumns(updatedShownColumns);
    setHiddenColumns(updatedHiddenColumns);
  };

  const columns = useMemo(
    () => [
      ...shownColumns.map((col) => ({
        Header: col.Header,
        accessor: col.accessor,
        Filter: false,
        isSortable: true,
      })),
      {
        Header: 'Action',
        accessor: 'action',
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEdittransactions(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
              </Link>
            </li>
          </ul>
        ),
      },
    ],
    [shownColumns, handleDeleteModal]
  );

  const draggableItemStyle: React.CSSProperties = {
    userSelect: 'none',
    padding: '8px 16px',
    margin: '0 8px',
    backgroundColor: 'rgba(173, 216, 230, 0.3)', // Light blue with transparency
    color: 'black',
    borderRadius: '4px',
    cursor: 'grab',
    backdropFilter: 'blur(10px)', // Glass-like appearance
    border: '1px solid rgba(173, 216, 230, 0.5)', // Optional: border to enhance effect
  };

  const droppableContainerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const handleExportToXlsx = () => {
    const ws = XLSX.utils.json_to_sheet(transactions);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Transactions');
    XLSX.writeFile(wb, 'transactions.xlsx');
  };

  const handleExportToCsv = () => {
    const csv = Papa.unparse(transactions);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'transactions.csv';
    link.click();
  };

  const handleExport = () => {
    if (exportFormat === 'csv') {
      handleExportToCsv();
    } else {
      handleExportToXlsx();
    }
    setShowExportModal(false);
  };

  const handleCancelClick = () => {
    setShowEdit(false);
  };

  return (
    <>
      <Row className="gy-3 mt-1">
        <Col sm={12}>
          <Tab.Container activeKey={activeTab}>
            <Nav
              as="ul"
              variant="tabs"
              className="nav-tabs nav-tabs-custom  mb-3"
            >
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Transaction List"
                  onClick={() => setActiveTab('Transaction List')}
                >
                  <i className="las la-th-list me-1"></i>Transactions
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Add Transaction"
                  onClick={() => setActiveTab('Add Transaction')}
                >
                  <i className="las la-plus-circle me-1"></i>Add Transaction
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Import Transaction"
                  onClick={() => setActiveTab('Import Transaction')}
                >
                  <i className="las la-file-import me-1"></i>Import Transaction
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Export Transaction"
                  onClick={() => setShowExportModal(true)}
                >
                  <i className="las la-lightbulb me-1"></i>Export Transaction
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>{' '}
      {activeTab === 'Transaction List' &&
        (!showEdit ? (
          <>
            <Row className="pb-4 gy-3 mt-2 mb-2">
              <Col sm={12}>
                <Row>
                  {/* Left Section: Date Inputs & Filter Button */}
                  <Col sm={6} className="d-flex gap-2 align-items-center">
                    <input
                      type="date"
                      id="startDate"
                      className="form-control form-control-sm"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      style={{ maxWidth: "140px" }}
                    />
                    <span>To</span>
                    <input
                      type="date"
                      id="endDate"
                      className="form-control form-control-sm"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      style={{ maxWidth: "140px" }}
                    />
                    <Button
                      size="sm"
                      onClick={handleFilter}
                      className="border-0 p-1 d-flex align-items-center"
                      style={{ background: "none", color: "inherit" }}
                    >
                      <FaFilter />
                    </Button>
                  </Col>

                  {/* Right Section: Search Box & Settings Button */}
                  <Col sm={6} className="d-flex gap-2 justify-content-end align-items-center">
                    <div className="search-box position-relative">
                      <Form.Control
                        type="text"
                        id="searchMemberList"
                        placeholder="Search..."
                        className="form-control form-control-sm pe-4"
                        onChange={handleSearch}
                        style={{ maxWidth: "200px" }}
                      />
                      <i className="las la-search search-icon position-absolute top-50 end-0 translate-middle-y pe-2"></i>
                    </div>
                    <Button
                      onClick={() => setShowCustomizeModal(true)}
                      className="border-0 p-1 d-flex align-items-center"
                      style={{ background: "none", color: "inherit" }}
                    >
                      <FaCog />
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>

            <Modal
              show={showCustomizeModal}
              onHide={() => setShowCustomizeModal(false)}
              size="lg"
            >
              <Modal.Header closeButton>
                <Modal.Title>Customize Columns</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Row>
                    <Col>
                      <h5>Columns Shown in Grid</h5>
                      <Droppable
                        droppableId="shownColumns"
                        direction="vertical"
                      >
                        {(provided: any) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={droppableContainerStyle}
                          >
                            {shownColumns.length > 0 ? (
                              shownColumns.map((column, index) => (
                                <Draggable
                                  key={column.id}
                                  draggableId={column.id}
                                  index={index}
                                >
                                  {(provided: any) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...draggableItemStyle,
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {column.Header}
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            ) : (
                              <div>No columns available</div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Col>
                    <Col>
                      <h5>Columns Not Shown in Grid</h5>
                      <Droppable
                        droppableId="hiddenColumns"
                        direction="vertical"
                      >
                        {(provided: any) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={droppableContainerStyle}
                          >
                            {hiddenColumns.length > 0 ? (
                              hiddenColumns.map((column, index) => (
                                <Draggable
                                  key={column.id}
                                  draggableId={column.id}
                                  index={index}
                                >
                                  {(provided: any) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      style={{
                                        ...draggableItemStyle,
                                        ...provided.draggableProps.style,
                                      }}
                                    >
                                      {column.Header}
                                    </div>
                                  )}
                                </Draggable>
                              ))
                            ) : (
                              <div>No columns available</div>
                            )}
                            {provided.placeholder}
                          </div>
                        )}
                      </Droppable>
                    </Col>
                  </Row>
                </DragDropContext>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  variant="secondary"
                  onClick={() => setShowCustomizeModal(false)}
                >
                  Close
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShownColumns([...shownColumns]);
                    setHiddenColumns([...hiddenColumns]);
                    setShowCustomizeModal(false);
                  }}
                >
                  Done
                </Button>
              </Modal.Footer>
            </Modal>

            <Row>
              <Col xl={12}>
                {transactions.length > 0 ? (
                  <TableContainer
                    isPagination={true}
                    columns={columns}
                    data={transactions}
                    customPageSize={8}
                    divClassName="table-card table-responsive"
                    tableClass="table-hover table-nowrap align-middle mb-0"
                    isBordered={false}
                    PaginationClass="align-items-center mt-4 gy-3"
                  />
                ) : (
                  <NoSearchResult />
                )}
              </Col>
            </Row>
          </>
        ) : (
          <Index editData={edit} onCancel={handleCancelClick} />
        ))}
      {activeTab === 'Add Transaction' && <SalesInvoiceTransaction />}
      {activeTab === 'Import Transaction' && <TaxImports />}
      <ToastContainer />
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Export transactions</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Check
              type="radio"
              label="Export as CSV"
              name="exportFormat"
              id="csv"
              checked={exportFormat === 'csv'}
              onChange={() => setExportFormat('csv')}
            />
            <Form.Check
              type="radio"
              label="Export as XLSX"
              name="exportFormat"
              id="xlsx"
              checked={exportFormat === 'xlsx'}
              onChange={() => setExportFormat('xlsx')}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-light"
            onClick={() => setShowExportModal(false)}
          >
            Close
          </button>
          <Button variant="primary" onClick={handleExport}>
            Export
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TransactionTable;
