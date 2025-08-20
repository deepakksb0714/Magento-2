import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Card, Col, Dropdown, Form, Nav, Row, Tab } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { createSelector } from 'reselect';
import {
  getUsers as onGetUsers,
  deleteUsers as onDeleteUsers,
} from '../../../slices/thunk';
import TableContainer from '../../../Common/Tabledata/TableContainer';
import { DeleteModal } from '../../../Common/DeleteModal';
import { handleSearchData } from '../../../Common/Tabledata/SorttingData';
import EditUsers from '../../../Common/CrudModal/EditUsers';
import AddUsers from '../../../Common/CrudModal/AddUsers';
import NoSearchResult from '../../../Common/Tabledata/NoSearchResult';
import { useLocation } from 'react-router-dom';

interface userProps {
  isShow: any;
  hideUserModal: any;
}

const UserTable = ({ isShow, hideUserModal }: userProps) => {
  const dispatch = useDispatch();

  const selectUsersList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      usersList: invoices.usersList,
    })
  );

  const { usersList } = useSelector(selectUsersList);

  const [users, setUsers] = useState<any>([]);



  const [activeTab, setActiveTab] = useState('User List');

  useEffect(() => {
    dispatch(onGetUsers());
  }, [dispatch]);

  useEffect(() => {
    setUsers(usersList);
  }, [usersList]);

  // Delete modal

  const [delet, setDelet] = useState<boolean>(false);
  const [deletid, setDeletid] = useState<any>();

  const handleDeleteModal = useCallback(
    (email: any) => {
      setDelet(!delet);
      setDeletid(email);
    },
    [delet]
  );

  const handleDeleteId = () => {
    dispatch(onDeleteUsers(deletid.id));
    setDelet(false);
  };

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  // Forget Password

  const [handleForgetPassword, setForgetPassword] = useState<boolean>(false);
  const [ForgetPasswordid, setForgetPasswordid] = useState<any>();

  const handleForgetPasswordModal = useCallback(
    (id: any) => {
      // Rename the function to avoid conflicts
      setForgetPassword(!handleForgetPassword);
      setForgetPasswordid(id);
    },
    [handleForgetPassword]
  );

  // search
  const handleSearch = (ele: any) => {
    let item = ele.value;

    if (item === 'All Tasks') {
      setUsers([...usersList]);
    } else {
      handleSearchData({ data: usersList, item: item, setState: setUsers });
    }
  };

  const [editUser, setEditUser] = useState<boolean>(false);
  const [edit, setEdit] = useState<any>();
  const [showEdit, setShowEdit] = useState(false);
  
    const handleCloseEdit = () => setEditUser(false);
    const handleEditUser = (item: any) => {
      setEditUser(true);
      setEdit(item);
      setShowEdit(true);
    };

    const handleCancelClick = () => {
      setShowEdit(false);
    };
    
  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => any;
  }

  const columns: columnsType[] = useMemo(
    () => [
      {
        Header: 'Name',
        accessor: 'name',
        Filter: false,
        isSortable: true,
        Cell: ({ row }) =>
          `${row.original.first_name} ${row.original.last_name}`,
      },

      {
        Header: 'Email',
        accessor: 'email',
        Filter: false,
        isSortable: true,
      },

      {
        Header: 'User Name',
        accessor: 'username',
        Filter: false,
        isSortable: true,
        Cell: ({ cell }) => cell.value || 'N/A',
      },

      {
        Header: 'Registered Date',
        accessor: 'created_at',
        Filter: false,
        isSortable: true,
      },
      {
        Header: 'Confirmation',
        accessor: 'last_login',
        Filter: false,
        isSortable: true,
        Cell: ({ cell }) => {
          return cell.value ? 'Verified' : 'Pending';
        },
      }, 
      { 
        Header: 'Status',
        accessor: 'status',
        Filter: false,
        isSortable: true,
        Cell: ({ cell }) => {
          if (!cell.value) return '';
          return cell.value === 'enabled' ? 'Active' : 'Inactive';
        },
      },       
      {
        Header: 'Action',
        accessor: 'action',
        Filter: false,
        style: { width: '12%' },
        isSortable: false,
        Cell: (cell: any) => {
          //if status is null, don't show any action buttons
          if (cell.row.original.status === null) {
            return null;
          }
          
          // If status is not null, show the action buttons
          return (
            <ul className="list-inline hstack gap-2 mb-0">
              <li
                className="list-inline-item edit"
                onClick={() => {
                  const item = cell.row.original;
                  handleEditUser(item);
                }}
              >
                <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                  Details
                </Link>
              </li>
              <li
                className="list-inline-item"
                onClick={() => {
                  const item = cell.row.original;
                  handleDeleteModal(item);
                }}
              >
                <Link
                  to="#"
                  className="btn btn-soft-danger btn-sm d-inline-block"
                >
                  <i className="bi bi-trash fs-17 align-middle"></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    [handleDeleteModal]
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
                  eventKey="User List"
                  onClick={() => setActiveTab('User List')}
                >
                  <i className="las la-th-list me-1"></i>Users
                </Nav.Link>
              </Nav.Item>
              <Nav.Item as="li">
                <Nav.Link
                  eventKey="Add user"
                  onClick={() => setActiveTab('Add user')}
                >
                  <i className="las la-plus-circle me-1"></i>Add User
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Tab.Container>
        </Col>
      </Row>
      {activeTab === 'User List' && (
      (!showEdit ? (      
        <>
          <Row className="pb-4 gy-3">
            <div className="col-sm-auto ms-auto offset-4">
              <div className="d-flex gap-3">
                <div className="search-box">
                  <Form.Control
                    type="text"
                    id="searchMemberList"
                    placeholder="Search..."
                    onChange={(e: any) => handleSearch(e.target)}
                  />
                  <i className="las la-search search-icon"></i>
                </div>
                <Dropdown>
                  <Dropdown.Toggle
                    as="button"
                    variant="info"
                    className="btn btn-soft-info btn-icon fs-14 arrow-none"
                  >
                    <i className="las la-ellipsis-v fs-18"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>All</Dropdown.Item>
                    <Dropdown.Item>Last Week</Dropdown.Item>
                    <Dropdown.Item>Last Month</Dropdown.Item>
                    <Dropdown.Item>Last Year</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </Row>
          <Row>
            <Col xl={12}>
              {users && users.length > 0 ? (
                <TableContainer
                  isPagination={true}
                  columns={columns}
                  data={users || []}
                  customPageSize={9}
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
          <EditUsers onCancel={handleCancelClick} edit={edit} />
        )) 
      )}
      {activeTab === 'Add user' && (
        <Row>
          <Col>
            <AddUsers
              isShow={isShow}
              onCancel={hideUserModal}
              handleShow={isShow}
            />
          </Col>
        </Row>
      )}

      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default UserTable;
