import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Table } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BreadCrumb from '../../Common/BreadCrumb';

// Define types for subscription and plan data
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

const PriceDisplayCard: React.FC<{
  title: string;
  id: string;
  listPrice: string;
  effectivePrice: string;
  maxUsers: number;
  billingCycle: string;
}> = ({ title, id, listPrice, effectivePrice, maxUsers, billingCycle }) => {
  return (
    <div
      className="flex flex-col grow px-4 py-5 border shadow-sm rounded-lg"
      data-testid="price-display-card"
    >
      <div className="mt-0.5 flex flex-row items-center cursor-pointer">
        <div className="mr-2" data-testid="price-toggle-button">
          <ChevronRight className="w-5 h-5 text-blue-500 group-hover:text-gray-600" />
        </div>
        <div className="flex items-center gap-2">
          <h4 className="text-base text-blue-800 font-semibold">{title}</h4>
          <div data-testid="price-card-id">
            <span className="text-sm text-gray-500">({id})</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col grow px-7">
        <div className="flex flex-col">
          <div className="grid gap-x-6 mt-4 grid-cols-3">
            <div className="col-span-1 border-r pr-4">
              <label className="flex items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    List Price
                  </span>
                </div>
              </label>
              <div className="mt-1">
                <span className="text-sm text-gray-700">${listPrice}</span>
              </div>
            </div>
            <div className="col-span-1 border-r pr-4">
              <label className="flex items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    Effective Price
                  </span>
                </div>
              </label>
              <div className="mt-1">
                <span className="text-sm text-gray-700">${effectivePrice}</span>
              </div>
            </div>
            <div className="col-span-1 pr-4">
              <label className="flex items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    Max Users
                  </span>
                </div>
              </label>
              <div className="mt-1">
                <span className="text-sm text-gray-700">{maxUsers}</span>
              </div>
            </div>
            <div className="col-span-1 border-r pr-4 mt-4">
              <label className="flex items-center">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 font-medium">
                    Billing Cycle
                  </span>
                </div>
              </label>
              <div className="mt-1">
                <span className="text-sm text-gray-700">{billingCycle}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubscriptionDetails: React.FC = () => {
  const location = useLocation();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [activeTab, setActiveTab] = useState<string>('Overview');
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Extract subscription data passed from previous page
    const subscriptionData = location.state?.subscription;
    if (subscriptionData) {
      setSubscription(subscriptionData);
    }
  }, [location.state]);

  const handleTabClick = (tab: string | null) => {
    if (tab) {
      setActiveTab(tab);
    }
  };

  // Function to get features based on the plan name
  const getFeatures = (planName: string): string[] => {
    switch (planName) {
      case 'starter':
        return ['Dashboard', 'Tax Calculation', 'Transaction'];
      case 'enterprise':
        return [
          'Report',
          'Dashboard',
          'Integration',
          'Customer',
          'Transaction',
        ];
      case 'pro':
        return [
          'Report',
          'Dashboard',
          'Integration',
          'Returns',
          'Tax Calculation',
          'Customer',
          'Transaction',
        ];
      default:
        return [];
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb
            pageTitle={`Subscription`}
            title={`Subscription Details`}
          />

          {/* Navigation Bar */}
          <Nav
            variant="pills"
            activeKey={activeTab}
            onSelect={handleTabClick}
            className="mb-4"
          >
            <Nav.Item>
              <Nav.Link
                eventKey="Overview"
                onClick={() => handleTabClick('Overview')}
              >
                Overview
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="Subscriptions"
                onClick={() => handleTabClick('Subscriptions')}
              >
                Subscriptions
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                eventKey="Features"
                onClick={() => handleTabClick('Features')}
              >
                Features
              </Nav.Link>
            </Nav.Item>
          </Nav>

          {/* Overview Tab Content */}
          {activeTab === 'Overview' && subscription && (
            <>
              <Row>
                <Col md={12}>
                  <Card>
                    <Card.Body>
                      <h5>Subscription Details</h5>
                      <table className="striped bordered hover responsive">
                        <tbody>
                          <tr>
                            <td>
                              <strong>Status</strong>
                            </td>
                            <td>
                              <span
                                className={`badge ${subscription.status === 'ACTIVE' ? 'bg-success-subtle text-success' : 'bg-danger-subtle text-danger'} p-2`}
                              >
                                {subscription.status}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Description</strong>
                            </td>
                            <td>{subscription.plan.description || '-'}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Start Date</strong>
                            </td>
                            <td>
                              {new Date(
                                subscription.start_date
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>End Date</strong>
                            </td>
                            <td>
                              {new Date(
                                subscription.end_date
                              ).toLocaleDateString()}
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Remaining Days</strong>
                            </td>
                            <td>{subscription.remaining_days}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Currency</strong>
                            </td>
                            <td>USD</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Net terms</strong>
                            </td>
                            <td>Due on issue</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Billing mode</strong>
                            </td>
                            <td>In advance</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>List Price</strong>
                            </td>
                            <td>${subscription.plan.list_price}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Effective Price</strong>
                            </td>
                            <td>${subscription.plan.effective_price}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Max Users</strong>
                            </td>
                            <td>{subscription.plan.max_users}</td>
                          </tr>
                          <tr>
                            <td>
                              <strong>Billing Cycle</strong>
                            </td>
                            <td>{subscription.plan.billing_cycle}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Card.Body>
                  </Card>

                          
                </Col>
              </Row>
            </>
          )}

          {/* Subscriptions Tab Content */}
          {activeTab === 'Subscriptions' && subscription && (
            <Row>
              <Col md={12}>
                    <Table striped bordered hover responsive>
                      <thead>
                      </thead>
                      <tbody>
                        <tr>
                          <td><strong>Plan Name</strong></td>
                          <td>{subscription.plan.name}</td>
                        </tr>
                        <tr>
                          <td><strong>Description</strong></td>
                          <td>{subscription.plan.description}</td>
                        </tr>
                        <tr>
                          <td><strong>List Price</strong></td>
                          <td>${subscription.plan.list_price}</td>
                        </tr>
                        <tr>
                          <td><strong>Effective Price</strong></td>
                          <td>${subscription.plan.effective_price}</td>
                        </tr>
                        <tr>
                          <td><strong>Max Users</strong></td>
                          <td>{subscription.plan.max_users}</td>
                        </tr>
                        <tr>
                          <td><strong>Billing Cycle</strong></td>
                          <td>{subscription.plan.billing_cycle}</td>
                        </tr>
                      </tbody>
                    </Table>
              </Col>
            </Row>
          )}

          {/* Features Tab Content */}
          {activeTab === 'Features' && subscription && (
            <Row>
              <Col md={12}>
                    <ul>
                      {getFeatures(subscription.plan.name).map(
                        (feature, index) => (
                          <li key={index}>{feature}</li>
                        )
                      )}
                    </ul>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default SubscriptionDetails;
