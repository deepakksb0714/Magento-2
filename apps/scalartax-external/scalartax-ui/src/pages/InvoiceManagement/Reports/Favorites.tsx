import React, { useState, useEffect } from 'react';
import {
  Col,
  Container,
  Row,
  Card,
  Form,
  Button,
  Nav,
  Tab,
} from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {
  TbReportAnalytics,
  TbReportMoney,
  TbReportSearch,
} from 'react-icons/tb';
import { HiDocumentReport } from 'react-icons/hi';
import TransactionReports from './TransactionReports/TransactionReports';
import LiabilityReports from './LiabilityReports';
import ExemptionReports from './ExemptionReports/ExemptionReports';

// Type for favorite report
interface FavoriteReport {
  id: string;
  name: string;
  category: string;
  reportName: string;
  dateOption: string;
  dateType?: string;
  documentStatus?: string;
  region?: string;
  company?: string;
  timestamp: Date;
}

const Favorites = () => {
  const navigate = useNavigate();
  document.title = 'Favorites';
  const [favorites, setFavorites] = useState<FavoriteReport[]>([]);
  const [activeTab, setActiveTab] = useState('Favrourites');

  // Load favorites from localStorage on component mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('reportFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const deleteFavorite = (id: string) => {
    const updatedFavorites = favorites.filter((fav) => fav.id !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('reportFavorites', JSON.stringify(updatedFavorites));
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Reports" title="Reports" />
          <Row className="gy-3 mt-1">
            <Col sm={12}>
              <Tab.Container activeKey={activeTab}>
                <Nav
                  as="ul"
                  variant="tabs"
                  className="nav-tabs nav-tabs-custom nav-success mb-3"
                >
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="Favrourites"
                      onClick={() => setActiveTab('Favrourites')}
                    >
                      <TbReportMoney
                        style={{ marginTop: '-4px', marginRight: '4px' }}
                      />
                      Favorites
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="Transactions"
                      onClick={() => setActiveTab('Transactions')}
                    >
                      <TbReportAnalytics
                        style={{ marginTop: '-4px', marginRight: '4px' }}
                      />
                      Transactions
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="Liability & Tax Return"
                      onClick={() => setActiveTab('Liability & Tax Return')}
                    >
                      <HiDocumentReport
                        style={{ marginTop: '-4px', marginRight: '4px' }}
                      />
                      Liability & Tax Return
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item as="li">
                    <Nav.Link
                      eventKey="Exemption"
                      onClick={() => setActiveTab('Exemption')}
                    >
                      <TbReportSearch
                        style={{ marginTop: '-4px', marginRight: '4px' }}
                      />
                      Exemption
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Tab.Container>
            </Col>
          </Row>{' '}
          {activeTab === 'Favrourites' && (
            <Row>
              <Col xl={12}>
                <Form>
                  <h2>Favorite reports</h2>
                  {favorites.length === 0 ? (
                    <div className="text-center p-4">
                      <p className="margin-all-none">
                        There are no favorites yet, add a report to your
                        favorites!
                      </p>
                    </div>
                  ) : (
                    <div className="favorites-grid">
                      {favorites.map((favorite) => (
                        <Card key={favorite.id} className="mb-3 shadow-sm">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start">
                              <div>
                                <h5 className="mb-1">{favorite.name}</h5>
                                <p className="text-muted mb-2">
                                  Category: {favorite.category}
                                </p>
                                <p className="text-muted mb-2">
                                  Report: {favorite.reportName}
                                </p>
                                <p className="text-muted mb-2">
                                  Date Option: {favorite.dateOption}
                                </p>
                                {favorite.dateType && (
                                  <p className="text-muted mb-2">
                                    Date Type: {favorite.dateType}
                                  </p>
                                )}
                                {favorite.documentStatus && (
                                  <p className="text-muted mb-2">
                                    Status: {favorite.documentStatus}
                                  </p>
                                )}
                                {favorite.region && (
                                  <p className="text-muted mb-2">
                                    Region: {favorite.region}
                                  </p>
                                )}
                                {favorite.company && (
                                  <p className="text-muted mb-2">
                                    Company: {favorite.company}
                                  </p>
                                )}
                                <small className="text-muted">
                                  Saved on:{' '}
                                  {new Date(
                                    favorite.timestamp
                                  ).toLocaleDateString()}
                                </small>
                              </div>
                              <div className="d-flex gap-2">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() => {
                                  switch (favorite.category) {
                                    case 'Transaction reports':
                                      navigate('/transaction-reports');
                                      break;
                                    case 'Exemption reports':
                                      navigate('/exemption-reports');
                                      break;
                                    case 'Liability & Tax Return':
                                      navigate('/liability-reports');
                                      break;
                                    default:
                                      // Optional: handle unexpected categories
                                      console.warn('Unknown report category');
                                  }
                                }}
                              >
                                Run Report
                              </button>
                                <button
                                  className="btn btn-outline-danger btn-sm"
                                  onClick={() => deleteFavorite(favorite.id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  )}
                </Form>
              </Col>
            </Row>
          )}
          {activeTab === 'Transactions' && <TransactionReports flag="hide" />}
          {activeTab === 'Liability & Tax Return' && (
            <LiabilityReports flag="hide" />
          )}
          {activeTab === 'Exemption' && <ExemptionReports flag="hide" />}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Favorites;
