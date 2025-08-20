import React, { useState, useEffect } from 'react';
import { Card, Col, Container, Row, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BreadCrumb from '../../../Common/BreadCrumb';

const ImportProductHistory: React.FC = () => {
  const [history, setHistory] = useState<any[]>([]);

  // Example data fetching, replace with actual data fetching logic
  useEffect(() => {
    // Fetch import history data from an API or other source
    // For demonstration, using static data
    const fetchHistory = async () => {
      const data = [
        {
          id: 1,
          date: '2024-07-20',
          fileName: 'locations_july.xlsx',
          status: 'Success',
        },
        {
          id: 2,
          date: '2024-07-19',
          fileName: 'locations_june.csv',
          status: 'Failed',
        },
      ];
      setHistory(data);
    };

    fetchHistory();
  }, []);

  return (
    <div className="page-content">
      <Container fluid>
        <BreadCrumb pageTitle="Locations" title="Import History" />
        <Row>
          <Col xl={12}>
            <Card>
              <Card.Body>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>File Name</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((item) => (
                      <tr key={item.id}>
                        <td>{item.date}</td>
                        <td>
                          <Link
                            to={`/imports/${item.id}`}
                            className="text-blue-500"
                          >
                            {item.fileName}
                          </Link>
                        </td>
                        <td>{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ImportProductHistory;
