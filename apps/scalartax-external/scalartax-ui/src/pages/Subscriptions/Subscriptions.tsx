
import React, { useState, useEffect, useMemo } from "react";
import { Container, Row, Col, Card, Nav, Table, Dropdown, Form } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import BreadCrumb from '../../Common/BreadCrumb';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { getSubscriptions as onGetSubscriptions } from '../../slices/thunk';
import TableContainer from '../../Common/Tabledata/TableContainer';
import NoSearchResult from '../../Common/Tabledata/NoSearchResult';

// Define types for subscription data
interface SubscriptionData {
  id: string;
  plan_id: string;
  account_id: string;
  start_date: string;
  end_date: string;
  due_date: string;
  status: string;
  created_at: string;
  remaining_days: number;
  account: {
    name: string;
    plan_name: string;
    account_status: string;
  };
  plan: {
    id: string;
    name: string;
    description: string;
    list_price: string;
    effective_price: string;
    max_users: number;
    billing_cycle: string;
  };
}

const Subscription = () => {
  const [activeTab, setActiveTab] = useState<string>('Active');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const selectSubscriptions = createSelector(
    (state: any) => state.Invoice, // Ensure 'Invoice' is the correct slice of state
    (invoices: any) => ({
      subscriptions: invoices.subscriptionList || [], // Provide a fallback empty array
    })
  );

  const { subscriptions } = useSelector(selectSubscriptions);
  const [modifiedSubscriptions, setModifiedSubscriptions] = useState<any>([]);

  useEffect(() => {
    dispatch(onGetSubscriptions());
  }, [dispatch]);

  // Function to handle tab click
  const handleTabClick = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
    }
  };

  // Function to handle subscription row click
  const handleSubscriptionClick = (subscription: SubscriptionData) => {
    navigate(`/subscription/${subscription.id}`, { state: { subscription } });
  };

  interface columnsType {
    Header: any;
    accessor: string;
    key?: string;
    Filter: boolean;
    isSortable: boolean;
    Cell?: (cell: any) => any;
  }
  const columns: columnsType[] = [
    {
      Header: 'PLAN',
      accessor: 'plan',
      Filter: false,
      isSortable: true,
    },

    {
      Header: 'START DATE',
      accessor: 'start_date',
      Filter: false,
      isSortable: true,
    },

    {
      Header: 'END DATE',
      accessor: 'end_date',
      Filter: false,
      isSortable: true,
      Cell: ({ cell }) => cell.value || 'N/A',
    },

    {
      Header: 'DUE DATE',
      accessor: 'due_date',
      Filter: false,
      isSortable: true,
    },
    {
      Header: 'REMAINING DAYS',
      accessor: 'remaining_days',
      Filter: false,
      isSortable: false,
    },
    {
      Header: 'STATUS',
      accessor: 'status',
      Filter: false,
      isSortable: true,
      Cell: ({ cell }) => {
        switch (cell.value) {
          case 'ACTIVE':
            return (
              <span className="badge badge-soft-success">{cell.value}</span>
            );
          case 'ARCHIVED':
            return (
              <span className="badge badge-soft-danger">{cell.value}</span>
            );
          default:
            return cell.value;
        }
      },
    },
  ];

  useEffect(() => {
    if (subscriptions && subscriptions.length > 0) {
      const modifiedData = subscriptions.map((item: SubscriptionData) => ({
        ...item,
        plan: item.plan.name,
        start_date: new Date(item.start_date).toLocaleDateString(),
        end_date: new Date(item.end_date).toLocaleDateString(),
        due_date: new Date(item.due_date).toLocaleDateString(),
        remaining_days: item.remaining_days,
        status: item.status,
        id: item.id,
      }));
      setModifiedSubscriptions(modifiedData);
    }
  }, [subscriptions]);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="" title="Subscriptions" />

          {/* Navigation Bar */}
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={handleTabClick}
            className="mb-4"
          >
            <Nav.Item>
              <Nav.Link
                eventKey="Active"
                onClick={() => handleTabClick('Active')}
              >
                Active
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="Archived"
                onClick={() => handleTabClick('Archived')}
              >
                Archived
              </Nav.Link>
            </Nav.Item>
          </Nav>

          <Row className="pb-4 gy-3">
        <div className="col-sm-auto ms-auto">
          <div className="d-flex gap-3">
            <div className="search-box">
              <Form.Control
                type="text"
                id="searchSubscriptionList"
                placeholder="Search for Result"
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


          {/* Content for Active Tab */}
          {activeTab === 'Active' && (
            <Row className="justify-content-center">
              <Col md={12}>
                <Card>
                  <Card.Body>
                    <h5>Subscriptions</h5>
                    <Row style={{ marginTop: '20px' }}>
                      <Col xl={12}>
                        {modifiedSubscriptions &&
                        modifiedSubscriptions.length > 0 ? (
                          <TableContainer
                            isPagination={true}
                            columns={columns}
                            data={modifiedSubscriptions || []}
                            customPageSize={9}
                            divClassName="table-card table-responsive"
                            tableClass="table-hover table-nowrap align-middle mb-0"
                            isBordered={false}
                            PaginationClass="align-items-center mt-4 gy-3"
                            clickFunc={handleSubscriptionClick}
                          >
                            {subscriptions}
                          </TableContainer>
                        ) : (
                          <NoSearchResult />
                        )}
                      </Col>
                    </Row>
                    {/* <Table table-hover table-nowrap align-middle mb-0>

                      <thead>
                        <tr>
                          <th>PLAN</th>
                          <th>START DATE</th>
                          <th>END DATE</th>
                          <th>DUE DATE</th>
                          <th>REMAINING DAYS</th>
                          <th>STATUS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subscriptions.map((item: SubscriptionData) => (
                          <tr
                            key={item.id}
                            onClick={() => handleSubscriptionClick(item)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{item.plan.name}</td>
                            <td>
                              {new Date(item.start_date).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(item.end_date).toLocaleDateString()}
                            </td>
                            <td>
                              {new Date(item.due_date).toLocaleDateString()}
                            </td>
                            <td>{item.remaining_days}</td>
                            <td>
                              {item.status === 'ACTIVE' ? (
                                <span className="badge bg-success-subtle text-success p-2">
                                  {item.status}
                                </span>
                              ) : (
                                <span className="badge bg-danger-subtle text-danger p-2">
                                  {item.status}
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>

                    </Table> */}
                    {/* <div className="d-flex justify-content-between">
                      <span>
                        Showing 1 to {subscriptions.length} of{' '}
                        {subscriptions.length}
                      </span>
                    </div> */}
                  </Card.Body>
                </Card>

              </Col>
            </Row>
          )}

          {/* Content for Archived Tab */}
          {activeTab === 'Archived' && (
            <Row className="justify-content-center">
              <Col md={12}>
                    <Table striped bordered hover responsive>
                      <h6>
                        Archived plans cannot be used when creating new
                        subscriptions. Unarchive them to make them available for
                        use.
                      </h6>
                    </Table>

              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Subscription;
