import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Button, Modal, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { ToastContainer } from 'react-toastify';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { NexusDeleteModal } from '../../../Common/DeleteModal';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as XLSX from 'xlsx';
import { createSelector } from 'reselect';
import Papa from 'papaparse';
import EditNexus from '../EditNexusLocations/EditNexus';
import { useDispatch, useSelector } from 'react-redux';
import { usePrimaryEntity } from '../../../Common/usePrimaryEntity';
import {
  getNexus as onGetNexus,
  deleteNexus as onDeleteNexus,
} from '../../../slices/thunk';

import SelectStates from '../AddNexusLocations/SelectStates';
import { useLocation } from 'react-router-dom';


interface LocalJurisdiction {
  id: string;
  nexus_id: string;
  name: string;
  jurisdiction_type: "county" | "city";
}

interface LocalTaxes {
  counties: LocalJurisdiction[];
  cities: LocalJurisdiction[];
}

interface StateData {
  id: string;
  name: string;
  entity_id: string;
  region_code: string;
  jurisdiction_type: "region";
  effective_date: string;
  expiration_date: string | null;
  nexus_type: string;
  short_name?: string; // Optional if not provided in the JSON
  locals: LocalTaxes;
}

interface ColumnDefinition {
  id: string;
  Header: string;
  accessor: string;
}

const NexusStateTable: React.FC = () => {
  const [nexus, setNexus] = useState<StateData[]>([]);
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<string>('');
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [activeTab, setActiveTab] = useState('State List');
  const [editNexus, setEditNexus] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();
  const [showEdit, setShowEdit] = useState(false);
  const primaryEntity = usePrimaryEntity();
  const initialColumns: ColumnDefinition[] = [
    { id: 'name', Header: 'name', accessor: 'name' },
    { id: 'nexus_type', Header: 'Tax type', accessor: 'nexus_type' },
    // { id: 'local_taxes', Header: 'Local taxes', accessor: 'local taxes' },
    {
      id: 'effective_date',
      Header: 'Effective date',
      accessor: 'effective_date',
    },
    { id: 'expiration_date"', Header: 'Expiration date', accessor: 'expiration_date' },
    { id: 'updated_at', Header: 'Last modified', accessor: 'updated_at' },
  ];

  const [shownColumns, setShownColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(0, 6)
  );
  const [hiddenColumns, setHiddenColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(6)
  );

  const selectNexusList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      nexusList: invoices.nexusList,
    })
  );

  const { nexusList } = useSelector(selectNexusList);

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetNexus());
  }, [dispatch, primaryEntity, showEdit, activeTab]);

  useEffect(() => {
    if (nexusList && primaryEntity) {
      const filteredLocations = nexusList.filter(
        (nexus: StateData) =>
          nexus.entity_id === primaryEntity.id &&
          (nexus.jurisdiction_type === 'region')
      );
      setNexus(filteredLocations);
    } else {
      setNexus([]);
    }
  }, [nexusList, primaryEntity, showEdit, activeTab]);

  const handleDeleteModal = useCallback(
    (id: string) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteNexus(deletid));
    setDelet(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === '') {
      // Reset to the original list of locations
      if (nexusList && primaryEntity) {
        const filteredLocations = nexusList.filter(
          (nexus: StateData) =>
            nexus.entity_id === primaryEntity.id &&
            nexus.jurisdiction_type === 'region'
        );
        setNexus(filteredLocations);
      }
    } else {
      const filteredData = nexus.filter((item: StateData) => {
        return (
          (item.name &&
            item.name.toLowerCase().includes(searchTerm)) ||
          (item.nexus_type &&
            item.nexus_type.toLowerCase().includes(searchTerm)) ||
          (item.jurisdiction_type &&
            item.jurisdiction_type.toLowerCase().includes(searchTerm)) ||
          (item.effective_date &&
            item.effective_date.toLowerCase().includes(searchTerm)) ||
          (item.expiration_date && item.expiration_date.toLowerCase().includes(searchTerm))
        );
      });
      setNexus(filteredData);
    }
  };

  const handleEditLocations = (item: StateData) => {
    setEditNexus(true);
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
        Cell: (cell: any) => {
          if (col.accessor === "nexus_type") {
            return cell.value.replace(/_/g, " ").replace(/\b\w/g, (char: any) => char.toUpperCase());
          }
          return cell.value;
        },
      })),
      {
        Header: "Action",
        accessor: "action",
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEditLocations(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
              </Link>
            </li>
            <li
              className="list-inline-item"
              onClick={() => handleDeleteModal(cell.row.original.id)}
            >
              <Link to="#" className="btn btn-soft-danger btn-sm d-inline-block">
                <i className="bi bi-trash fs-17 align-middle"></i>
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
    const ws = XLSX.utils.json_to_sheet(nexus);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Locations');
    XLSX.writeFile(wb, 'Nexus.xlsx');
  };

  const handleExportToCsv = () => {
    const csv = Papa.unparse(nexus);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Nexus.csv';
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
      {' '}
      <Row className="gy-3 mt-1">
        <Col sm={12}>
          <Tab.Container activeKey={activeTab}>
            <Nav
              as="ul"
              variant="tabs"
              className="nav-tabs nav-tabs-custom mb-3"
            >
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="State List"
                  onClick={() => setActiveTab('State List')}
                >
                  <i className="las la-th-list me-1"></i>States
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Add State"
                  onClick={() => setActiveTab('Add State')}
                >
                  <i className="las la-plus-circle me-1"></i>Add State
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Export States"
                  onClick={(e) => {
                    e.preventDefault();
                    setShowExportModal(true);
                  }}
                >
                  <i className="las la-lightbulb me-1"></i>Export States
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>
      {activeTab === 'State List' &&
        (!showEdit ? (
          <>
            <Row className="pb-4 gy-3">
              <Col sm={12}>
                <div className="col-sm-auto ms-auto" style={{ float: 'right' }}>
                  <div className="d-flex gap-3">
                    <div className="search-box">
                      <Form.Control
                        type="text"
                        id="searchMemberList"
                        placeholder="Search..."
                        onChange={handleSearch}
                      />
                      <i className="las la-search search-icon"></i>
                    </div>
                    <Button onClick={() => setShowCustomizeModal(true)}>
                      Customize Columns
                    </Button>
                  </div>
                </div>
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
                        {(provided) => (
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
                                  {(provided) => (
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
                        {(provided) => (
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
                                  {(provided) => (
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
                {nexus.length > 0 ? (
                  <TableContainer
                    isPagination={true}
                    columns={columns}
                    data={nexus}
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
          <EditNexus onCancel={handleCancelClick} region={edit} />
        ))}
      {activeTab === 'Add State' && <SelectStates />}
      <NexusDeleteModal
        show={delet}
        handleClose={() => setDelet(false)}
        deleteModalFunction={handleDeleteId}
      />
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Export Locations</Modal.Title>
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
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleExport}>
            Export
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default NexusStateTable;
