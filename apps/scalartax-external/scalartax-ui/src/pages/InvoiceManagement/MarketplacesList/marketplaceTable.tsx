import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Form, Row, Button, Modal, Nav, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { ToastContainer } from 'react-toastify';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { locationData } from '../../../Common/data/location';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import * as XLSX from 'xlsx';
import { createSelector } from 'reselect';
import Papa from 'papaparse';
import EditLocations from '../EntityLocations/EditLocations';
import AddLocations from '../EntityLocations/AddLocations';
import { useDispatch, useSelector } from 'react-redux';

import {
  getEntitiesLocations as onGetEntitiesLocations,
  deleteEntitiesLocations as onDeleteEntitiesLocations,
} from '../../../slices/thunk';

interface LocationAttribute {
  id: string;
  location_id: string;
  attribute_name: string;
  attribute_value: string;
  attribute_unit_of_measure: string;
  created_by_id: string;
  updated_by_id: string;
  created_at: string;
  updated_at: string;
}

interface EntityLocation {
  id: string;
  location_code: string;
  entity_id: string;
  friendly_name: string;
  description: string;
  address_type_id: string;
  address_category_id: string;
  is_marketplace_outside_usa: boolean;
  line1: string;
  line2: string;
  line3: string;
  city: string;
  county: string;
  region: string;
  postal_code: string;
  country: string;
  is_default: boolean;
  is_registered: boolean;
  dba_name: string;
  outlet_name: string;
  start_date: string;
  end_date: string;
  marketplace_remit_tax: string;
  created_by_id: string;
  updated_by_id: string;
  created_at: string;
  updated_at: string;
  location_attributes: LocationAttribute[];
}

interface ColumnDefinition {
  id: string;
  Header: string;
  accessor: string;
}

interface PrimaryEntity {
  id: any;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}

const EntityLocationTable: React.FC = () => {
  const [locations, setLocations] = useState<EntityLocation[]>([]);
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<string>('');
  const [showCustomizeModal, setShowCustomizeModal] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<string>('csv');
  const [activeTab, setActiveTab] = useState('Marketplaces List');

  const initialColumns: ColumnDefinition[] = [
    { id: 'location', Header: 'Location', accessor: 'location_code' },
    { id: 'type', Header: 'Type', accessor: 'address_type_id' },
    { id: 'effective', Header: 'Effective', accessor: 'start_date' },
  ];

  const [shownColumns, setShownColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(0, 5)
  );
  const [hiddenColumns, setHiddenColumns] = useState<ColumnDefinition[]>(
    initialColumns.slice(5)
  );
  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const selectLocationsList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesLocationsList: invoices.entitiesLocationsList,
    })
  );

  const { entitiesLocationsList } = useSelector(selectLocationsList);
  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );
  const { entitiesList } = useSelector(selectEntitiesList);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(onGetEntitiesLocations());
  }, [dispatch]);

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find(
        (entity: any) => entity.is_default
      );
      if (defaultEntity) {
        setPrimaryEntity(defaultEntity);
      } else {
        setPrimaryEntity(entitiesList[0]);
      }
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

  useEffect(() => {
    if (entitiesLocationsList && primaryEntity) {
      const filteredLocations = entitiesLocationsList.filter(
        (location: EntityLocation) => location.address_type_id === 'marketplace'
      );
      setLocations(filteredLocations);
    } else {
      setLocations([]);
    }
  }, [entitiesLocationsList, primaryEntity]);

  const handleDeleteModal = useCallback(
    (id: string) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteEntitiesLocations(deletid));
    setDelet(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
      // Reset to the original list of locations
      if (entitiesLocationsList) {
        const filteredLocations = entitiesLocationsList.filter(
          (location: EntityLocation) =>
            location.address_type_id === 'location' ||
            location.address_type_id === 'salesperson'
        );
        setLocations(filteredLocations);
      }
    } else {
      const filteredData = locations.filter(
        (location: EntityLocation) =>
          location.location_code.toLowerCase().includes(searchTerm) ||
          location.city.toLowerCase().includes(searchTerm) ||
          location.country.toLowerCase().includes(searchTerm) ||
          location.line1.toLowerCase().includes(searchTerm) ||
          location.region.toLowerCase().includes(searchTerm)
      );
      setLocations(filteredData);
    }
  };

  const [editLocations, setEditLocations] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();
  const [showEdit, setShowEdit] = useState(false);

  const handleCloseEdit = () => setEditLocations(false);
  const handleEditLocations = (item: EntityLocation) => {
    setEditLocations(true);
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
                handleEditLocations(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
                {/* <i className="las la-pen fs-17 align-middle"></i> */}
              </Link>
            </li>
            <li
              className="list-inline-item"
              onClick={() => handleDeleteModal(cell.row.original.id)}
            >
              <Link
                to="#"
                className="btn btn-soft-danger btn-sm d-inline-block"
              >
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
    const ws = XLSX.utils.json_to_sheet(locations);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Locations');
    XLSX.writeFile(wb, 'marketplaces.xlsx');
  };

  const handleExportToCsv = () => {
    const csv = Papa.unparse(locations);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'marketolaces.csv';
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
              className="nav-tabs nav-tabs-custom mb-3"
            >
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Marketplaces List"
                  onClick={() => setActiveTab('Marketplaces List')}
                >
                  <i className="las la-th-list me-1"></i>Marketplaces
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Add Marketplace"
                  onClick={() => setActiveTab('Add Marketplace')}
                >
                  <i className="las la-plus-circle me-1"></i>Add Marketplace
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Export Marketplaces"
                  onClick={() => setShowExportModal(true)}
                >
                  <i className="las la-lightbulb me-1"></i>Export Marketplaces
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>{' '}
      {activeTab === 'Marketplaces List' && (
        <>
          {!showEdit ? (
            <>
              <Row className="pb-4 gy-3">
                <Col sm={6}></Col>
                <div className="col-sm-auto ms-auto">
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
                    Save Changes
                  </Button>
                </Modal.Footer>
              </Modal>

              <Row>
                <Col xl={12}>
                  {locations.length > 0 ? (
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={locations}
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
            <EditLocations onCancel={handleCancelClick} edit={edit} />
          )}
          <DeleteModal
            show={delet}
            handleClose={() => setDelet(false)}
            deleteModalFunction={handleDeleteId}
          />
        </>
      )}
      {activeTab === 'Add Marketplace' && <AddLocations flag="hide" />}
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
      <ToastContainer />
    </>
  );
};

export default EntityLocationTable;
