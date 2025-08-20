import React, { useState } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import PaymentActivityData from './PaymentActivitydata';

const PaymentActivity: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState<'1W' | '1M' | '6M' | '1Y'>('1M');

  const handleTimeFilterChange = (filter: '1W' | '1M' | '6M' | '1Y') => {
    setTimeFilter(filter);
  };

  return (
    <Row>
      <Col xl={12}>
        <Card>
          <Card.Header className="border-0 align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">Transaction Activity</h4>
            <div className="d-flex gap-1">
              {['1W', '1M', '6M', '1Y'].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className={`btn btn-${timeFilter === filter ? 'info' : 'soft-info'} btn-sm`}
                  onClick={() => handleTimeFilterChange(filter as '1W' | '1M' | '6M' | '1Y')}
                >
                  {filter}
                </button>
              ))}
            </div>
          </Card.Header>
          <Card.Body className="py-1">
            <PaymentActivityData
              className="apex-charts"
              showOutcome={true}
              timeFilter={timeFilter}
            />
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default PaymentActivity;
