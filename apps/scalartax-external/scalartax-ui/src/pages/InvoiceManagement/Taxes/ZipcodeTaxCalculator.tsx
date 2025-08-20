import React, { useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import MonochromePie from '../../components/MonochromePie';
interface TaxBreakdownItem {
  jurisdiction: string;
  tax_region_name: string;
  estimated_combined_rate: string;
  state_rate: string;
  estimated_county_rate: string;
  estimated_city_rate: string;
  estimated_special_rate: string;
  taxable_amount: number;
  tax_amount: string;
}

interface TaxResponse {
  tax_breakdown: TaxBreakdownItem[];
  total_tax_amount: string;
  total_amount_after_tax: string;
}

const TaxCalculator: React.FC = () => {
  const [zipCode, setZipCode] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [response, setResponse] = useState<TaxResponse | null>(null);
  const [seriesData, setSeriesData] = useState<number[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const siteConfig = process.env.REACT_APP_SITE_CONFIG
        ? JSON.parse(process.env.REACT_APP_SITE_CONFIG)
        : null;

      const url = siteConfig
        ? `${siteConfig.apiUrl}/taxes/calculate`
        : `http://localhost:3004/taxes/calculate`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ zip_code: zipCode, amount: amount }),
      });

      if (response.status === 200) {
        const data: TaxResponse = await response.json();
        setResponse(data);

        // Extracting series data from tax breakdown
        const extractedSeriesData = data.tax_breakdown.map((item) => ({
          stateRate: parseFloat(item.state_rate),
          countyRate: parseFloat(item.estimated_county_rate),
          cityRate: parseFloat(item.estimated_city_rate),
          specialRate: parseFloat(item.estimated_special_rate),
        }));

        const ratesArray = extractedSeriesData
          .map((item) => [
            item.stateRate,
            item.countyRate,
            item.cityRate,
            item.specialRate,
          ])
          .flat();
        setSeriesData(ratesArray);
        console.log('extractedSeriesData after set: ', extractedSeriesData);
        console.log('seriesData after set: ', seriesData);
        console.log(data);
      } else {
        console.error('Failed to calculate tax:', response.statusText);
      }
    } catch (error) {
      console.error('Error calculating tax:', error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Invoice" title="Tax calculator" />
          <Row className="justify-content-center">
            <Col xxl={9}>
              <Card>
                <div className="container">
                  <div>
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label className="form-label">Zip Code:</label>
                        <input
                          className="form-control"
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                        />
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Amount:</label>
                        <input
                          type="number"
                          className="form-control"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                        />
                      </div>
                      <button
                        className="btn"
                        style={{ backgroundColor: 'black', color: '#ffffff' }}
                        type="submit"
                      >
                        Calculate
                      </button>
                    </form>

                    <div>
                      {response && (
                        <div className="row">
                          <div className="col-md-6">
                            <div>
                              <h4>Calculated Tax:</h4>
                              {response.tax_breakdown.map(
                                (item: TaxBreakdownItem, index: number) => (
                                  <div
                                    key={index}
                                    style={{
                                      border: '1px solid black',
                                      padding: '10px',
                                      marginBottom: '10px',
                                    }}
                                  >
                                    <div>
                                      <strong>State:</strong>{' '}
                                      {item.jurisdiction}
                                    </div>
                                    <div>
                                      <strong>Tax Region Name:</strong>{' '}
                                      {item.tax_region_name}
                                    </div>
                                    <div>
                                      <strong>State Tax:</strong>{' '}
                                      {item.state_rate}
                                    </div>
                                    <div>
                                      <strong>County Tax:</strong>{' '}
                                      {item.estimated_county_rate}
                                    </div>
                                    <div>
                                      <strong>City Tax:</strong>{' '}
                                      {item.estimated_city_rate}
                                    </div>
                                    <div>
                                      <strong>Special Tax:</strong>{' '}
                                      {item.estimated_special_rate}
                                    </div>
                                    <div>
                                      <strong>Total Tax:</strong>{' '}
                                      {item.estimated_combined_rate}
                                    </div>
                                    <div>
                                      <strong>Taxable Amount:</strong>{' '}
                                      {item.taxable_amount}
                                    </div>
                                    <div>
                                      <strong>Tax Amount:</strong>{' '}
                                      {item.tax_amount}
                                    </div>
                                  </div>
                                )
                              )}
                              <div>
                                <strong>Total Tax Amount:</strong>{' '}
                                {response.total_tax_amount}
                              </div>
                              <div>
                                <strong>Total Amount After Tax:</strong>{' '}
                                {response.total_amount_after_tax}
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <MonochromePie seriesData={seriesData} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TaxCalculator;
