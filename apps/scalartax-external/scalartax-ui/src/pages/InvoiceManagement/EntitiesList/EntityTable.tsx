import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Dropdown, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getEntities as onGetEntities,
  deleteEntities as onDeleteEntities,
} from '../../../slices/thunk';
import { ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../../Common/DeleteModal';
import { handleSearchData } from '../../../Common/Tabledata/SorttingData';
import EditEntities from '../../../Common/CrudModal/EditEntities';
import ManageEntity from '../AddEntity/ManageEntity';
import { useLocation } from 'react-router-dom';

interface Entity {
  id: any;
  name: string;
  parent_entity_id: string | null;
  phone: string | null;
  tax_id: string | null;
  doBusinessInEU: boolean;
  attributes: [];
  companyType: string | null;
  is_online_marketplace: boolean;
  taxCollection: boolean;
  taxCollectionSeparate: boolean;
}

const EntityTable: React.FC = () => {
  const dispatch = useDispatch();

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const { entitiesList } = useSelector(selectEntitiesList);
  const location = useLocation();
  const [entities, setEntities] = useState<Entity[]>([]);
  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<string>('');
  const [editEntity, setEditEntity] = useState<boolean>(false);
  const [edit, setEdit] = useState<Partial<Entity> | null>(null);
  const [activeTab, setActiveTab] = useState('Entity List');

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      setEntities(entitiesList);
    }
  }, [entitiesList]);

  const handleDeleteModal = useCallback(
    (id: string) => {
      setDelet(!delet);
      setDeletid(id);
    },
    [delet]
  );

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  const handleDeleteId = () => {
    dispatch(onDeleteEntities(deletid));
    setDelet(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const item = e.target.value;
    if (item === 'All Tasks') {
      setEntities([...entitiesList]);
    } else {
      handleSearchData({ data: entitiesList, item, setState: setEntities });
    }
  };

  const handleCloseEdit = () => setEditEntity(false);
  const [showEdit, setShowEdit] = useState(false);
  const handleEditEntity = (item: Entity) => {
    setEditEntity(true);
    setEdit(item);
    setShowEdit(true);
  };

  const handleCancelClick = () => {
    setShowEdit(false);
  };

  const getParentCompanyName = useCallback(
    (parentId: string | null) => {
      if (!parentId) return 'no parent';
      const parentEntity = entities.find((entity) => entity.id === parentId);
      return parentEntity ? parentEntity.name : 'no parent';
    },
    [entities] // Use the local state instead of entitiesList
  );

  interface ColumnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => JSX.Element;
  }

  const columns: ColumnsType[] = useMemo(
    () => [
      {
        Header: 'Entity',
        accessor: 'name',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <div className="d-flex align-items-center">
            <div className="flex-grow-1">
              <h6 className="fs-16 mb-1">{cell.row.original.name}</h6>
            </div>
          </div>
        ),
      },
      {
        Header: 'Parent Entity',
        accessor: 'parent_entity_id',
        Filter: false,
        isSortable: true,
        Cell: ({ value }: { value: string | null }) => (
          <>{getParentCompanyName(value)}</>
        ),
      },
      {
        Header: 'Status',
        accessor: 'status',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <span className="sm bg-success text-white d-inline-block text-center px-2">
            {cell.row.original.status}
          </span>
        ),
      },      
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
                handleEditEntity(item);
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
    [entities, getParentCompanyName, handleDeleteModal]
  );


  return (
    <React.Fragment>
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
                  eventKey="Entity List"
                  onClick={() => setActiveTab('Entity List')}
                >
                  <i className="las la-th-list me-1"></i>Entities
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Add Entity"
                  onClick={() => setActiveTab('Add Entity')}
                >
                  <i className="las la-plus-circle me-1"></i>Add Entity
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>

      {activeTab === 'Entity List' && (
        (!showEdit ? ( 
        <>
          <Row className="pb-4 gy-3">
            <Col sm={4}></Col>
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
                <Dropdown>
                  <Dropdown.Toggle
                    as="button"
                    className="btn btn-soft-info btn-icon fs-14 arrow-none"
                  >
                    <i className="las la-ellipsis-v fs-18"></i>
                  </Dropdown.Toggle>
                </Dropdown>
              </div>
            </div>
          </Row>
          <Row>
            <Col xl={12}>
              {entities && entities.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={entities}
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
          <EditEntities onCancel={handleCancelClick} edit={edit} />
        )) 
      )}
      {activeTab === 'Add Entity' && <ManageEntity />}
      <DeleteModal
            show={delet}
            handleClose={handleDeleteModal}
            deleteModalFunction={handleDeleteId}
          />
      <ToastContainer />
    </React.Fragment>
  );
};

export default EntityTable;
