import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  Col,
  Dropdown,
  Form,
  Row,
  Container,
  Nav,
  Tab,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import TableContainer from '../../Common/Tabledata/TableContainer';
import { useDispatch, useSelector } from 'react-redux';
import {
  getExemptionCertificateList as onGetExemptionCertificateList,
  deleteExemptionCertificateList as onDeleteExemptionCertificateList,
} from '../../slices/thunk';
import { ToastContainer } from 'react-toastify';
import { downloadExemptionCertificate as onDownloadExemptionCertificate } from '../../slices/thunk';
import { createSelector } from 'reselect';
import NoSearchResult from '../../Common/Tabledata/NoSearchResult';
import { DeleteModal } from '../../Common/DeleteModal';
import { handleSearchData } from '../../Common/Tabledata/SorttingData';
import BreadCrumb from '../../Common/BreadCrumb';
import AddCertificate from '../InvoiceManagement/Exemptions/AddCertificate';
import { useLocation } from 'react-router-dom';
import EditExemptionCertificate from '../InvoiceManagement/Exemptions/EditExemptionCertificate';

// Define types
interface ExemptionCertificate {
  id: string;
  exemption_customer_name: string;
  expiration_date: string;
  entity_id: string;
  customer_id: string;
  effective_date: string;
}
interface PrimaryEntity {
  id: string;
  name: string;
  parent_entity_id: string | null;
  created_at: string;
  is_default: boolean;
}
interface CertificateslistTableProps {
  actTab?: string;
}

const CertificateslistTable: React.FC<CertificateslistTableProps> = ({
  actTab,
}) => {
  const dispatch = useDispatch();

  const [exemptionCertificateLists, setExemptionCertificateLists] = useState<
    ExemptionCertificate[]
  >([]);
  const [visibleCustomerIds, setVisibleCustomerIds] = useState<{
    [key: string]: boolean;
  }>({});
  const [visibleIds, setVisibleIds] = useState<{
    [key: string]: { customerId: boolean; certificateId: boolean };
  }>({});

  const [activeTab, setActiveTab] = useState(actTab);

  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  const selectExemptionCertificateList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      exemptionCertificateList: invoices.exemptionCertificateList,
    })
  );

  const { exemptionCertificateList } = useSelector(
    selectExemptionCertificateList
  );
  
  const { entitiesList } = useSelector(selectEntitiesList);
  // Set the primary entity based on the entities list
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

  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state, setActiveTab]);

  // Filter based on the primary entity
  useEffect(() => {
    if (exemptionCertificateList && primaryEntity) {
      const filteredExemptionCertificates = exemptionCertificateList.filter(
        (exemptionCertificate: ExemptionCertificate) =>
          exemptionCertificate.entity_id === primaryEntity.id
      );
      setExemptionCertificateLists(filteredExemptionCertificates);
      setIsLoading(false); // Moved here to only set when filtering is done
    } else {
      setExemptionCertificateLists([]);
      setIsLoading(false); // Set loading to false if there's no valid filter
    }
  }, [exemptionCertificateList, primaryEntity]);

  useEffect(() => {
    dispatch(onGetExemptionCertificateList() as any);
  }, [dispatch, primaryEntity]);

  // Toggle visibility of customer ID and certificate id
  const toggleVisibility = (
    id: string,
    type: 'customerId' | 'certificateId'
  ) => {
    setVisibleIds((prevState) => ({
      ...prevState,
      [id]: {
        ...prevState[id],
        [type]: !prevState[id]?.[type],
      },
    }));
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

  const handleDeleteId = () => {
    dispatch(onDeleteExemptionCertificateList(deletid.id) as any);
    setDelet(false);
  };

  // Handle download
  const handleDownload = (id: string) => {
    dispatch(onDownloadExemptionCertificate(id) as any);
  };


   const [editExemptionCertificate, setEditExemptionCertificate] = useState<boolean>(false);
    const [edit, setEdit] = useState<any>();
    const [showEdit, setShowEdit] = useState(false);
    
      const handleCloseEdit = () => setEditExemptionCertificate(false);
      const handleEditExemptionCertificate = (item: any) => {
        setEditExemptionCertificate(true);
        setEdit(item);
        setShowEdit(true);
      };
  
      const handleCancelClick = () => {
        setShowEdit(false);
      };

  // Search
  const handleSearch = (ele: any) => {
    let item = ele.value;

    if (item === 'All Tasks') {
      setExemptionCertificateLists([...exemptionCertificateList]);
    } else {
      handleSearchData({
        data: exemptionCertificateList,
        item: item,
        setState: setExemptionCertificateLists,
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (dateString) {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    }
    return 'N/A';
  };

  interface ColumnType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => JSX.Element;
  }

  const columns: ColumnType[] = useMemo(
    () => [
      {
        Header: 'Certificate ID',
        accessor: 'id',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const certificateId = cell.row.original.id;
          const isVisible = visibleIds[certificateId]?.certificateId;
          const displayedId = isVisible
            ? certificateId
            : `${certificateId.slice(-6)}`;

          return (
            <>
              {displayedId}
              <Link
                to="#"
                onClick={() => toggleVisibility(certificateId, 'certificateId')}
                className="ms-2"
              >
                <i className={`bi bi-eye${isVisible ? '-slash' : ''}`}></i>
              </Link>
            </>
          );
        },
      },
      {
        Header: 'Customer Id',
        accessor: 'customer_id',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const customerId = cell.row.original.customer_id;
          const certificateId = cell.row.original.id; // Get certificate ID to associate with visibility
          const isVisible = visibleIds[certificateId]?.customerId;
          const displayedId = isVisible
            ? customerId
            : `${customerId.slice(-6)}`;

          return (
            <>
              {displayedId}
              <Link
                to="#"
                onClick={() => toggleVisibility(certificateId, 'customerId')}
                className="ms-2"
              >
                <i className={`bi bi-eye${isVisible ? '-slash' : ''}`}></i>
              </Link>
            </>
          );
        },
      },
      {
        Header: 'Region',
        accessor: 'regions',
        Filter: false,
        isSortable: true,
        Cell: ({ row }: any) => (
          <>{row.original.regions || ''}</>
        ),
      },
      {
        Header: 'Exemption Reason',
        accessor: 'exemption_reason',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>{cell.row.original.exemption_reason || ''}</>
        ),
      },
      {
        Header: 'Effective',
        accessor: 'effective_date',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => (
          <>{formatDate(cell.row.original.effective_date)}</>
        ),
      },
      {
        Header: 'Expiration',
        accessor: 'regions_data',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const regionsData = cell.row.original.regions_data;
          
          if (!regionsData) return <span>N/A</span>;
      
          try {
            const parsedRegions = JSON.parse(regionsData);
            const expirationDates = Object.values(parsedRegions)
              .map((region: any) => region.expiration_date)
              .filter(Boolean);
      
            if (expirationDates.length === 0) return <span>N/A</span>;
      
            // Display earliest expiration date
            const earliestExpiration = expirationDates.sort()[0];
      
            return <span>{earliestExpiration}</span>;
          } catch (error) {
            console.error('Error parsing regions_data:', error);
            return <span>Invalid Data</span>;
          }
        },
      },      
      {
        Header: 'Status',
        accessor: 'is_valid',
        Filter: false,
        isSortable: true,
        Cell: (cell: any) => {
          const value = cell.row.original.is_valid || '';
          let className = '';
          
          if (value === 'valid') {
            className = 'bg-success text-white'; // Success color
          } else if (value === 'paused') {
            className = 'bg-warning text-dark'; // Warning color
          } else if (value === 'invalid') {
            className = 'bg-danger text-white'; // Error color
          }
          
          return (
            <div className={`px-2 py-1 rounded ${className}`} style={{display: 'inline-block', fontWeight: 500}}>
              {value}
            </div>
          );
        },
      },
      {
        Header: 'Action',
        accessor: 'action',
        Filter: false,
        isSortable: false,
        Cell: (cell: any) => (
          <ul className="list-inline hstack gap-2 mb-0">
            <li
              className="list-inline-item"
              onClick={() => handleDownload(cell.row.original.id)}
            >
              <Link
                to="#"
                className="btn btn-soft-danger btn-sm d-inline-block"
              >
                <i className="bi bi-download fs-17 align-middle"></i>
              </Link>
            </li>
            <li
              className="list-inline-item edit"
              onClick={() => {
                const item = cell.row.original;
                handleEditExemptionCertificate(item);
              }}
            >
              <Link to="#" className="btn btn-soft-info btn-sm d-inline-block">
                Details
                {/* <i className="las la-pen fs-17 align-middle"></i> */}
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
        ),
      },
    ],
    [handleDownload, handleDeleteModal]
  );

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  return (
    <React.Fragment>
      <div className="page-content pb-4 gy-3">
        <Container fluid>
          <BreadCrumb pageTitle="Certificates" title="Certificates" />
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
                      eventKey="Certificate List"
                      onClick={() => setActiveTab('Certificate List')}
                    >
                      <i className="las la-th-list me-1"></i>Certificates
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="Add Certificate"
                      onClick={() => setActiveTab('Add Certificate')}
                    >
                      <i className="las la-plus-circle me-1"></i>Add Certificate
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Tab.Container>
            </Col>
          </Row>{' '}
          {activeTab === 'Certificate List' && (
            (!showEdit ? ( 
            <>
              <Row>
                <Col sm={12}>
                  <div
                    className="col-sm-auto ms-auto"
                    style={{ float: 'right' }}
                  >
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
                          className="btn btn-soft-info btn-icon fs-14 arrow-none"
                        >
                          <i className="las la-ellipsis-v fs-18"></i>
                        </Dropdown.Toggle>
                      </Dropdown>
                    </div>
                  </div>
                </Col>
              </Row>

              <Row className="mt-4">
                <Col xl={12}>
                  {exemptionCertificateLists &&
                    exemptionCertificateLists.length > 0 ? (
                    <TableContainer
                      isPagination={true}
                      columns={columns}
                      data={exemptionCertificateLists}
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
                <EditExemptionCertificate onCancel={handleCancelClick} edit={edit} />
              )) 
            )}
          {activeTab === 'Add Certificate' && <AddCertificate />}
        </Container>
      </div>
      <DeleteModal
        show={delet}
        handleClose={handleDeleteModal}
        deleteModalFunction={handleDeleteId}
      />
      <ToastContainer />
    </React.Fragment>
  );
};

export default CertificateslistTable;
