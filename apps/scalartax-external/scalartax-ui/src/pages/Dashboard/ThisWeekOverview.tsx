import React, { useEffect } from 'react';
import { Card, Col, Dropdown, Row } from 'react-bootstrap';
import CountUp from 'react-countup';
import { Donut1, Donut2, Donut3 } from './ThisWeekOverviewData';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions as onGetTransactions } from '../../slices/thunk';

const ThisWeekOverview = () => {
  const selectTransactionList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      transactionList: invoices.transactionList,
    })
  );

  const { transactionList } = useSelector(selectTransactionList);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(onGetTransactions());
  }, [dispatch]);

  // Calculate totals for the last week
  const getLastWeekTotals = () => {
    if (!transactionList || !transactionList.length) {
      return { totalTax: 0, totalAmount: 0, transactionCount: 0 };
    }
  
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  
    const lastWeekTransactions = transactionList.filter((transaction: { date: string }) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= lastWeek && transactionDate <= today;
    });
  
    const totals = lastWeekTransactions.reduce(
      (
        acc: { totalTax: number; totalAmount: number; transactionCount: number },
        transaction: { total_tax: string; total_amount: string }
      ) => ({
        totalTax: acc.totalTax + parseFloat(transaction.total_tax || "0"),
        totalAmount: acc.totalAmount + parseFloat(transaction.total_amount || "0"),
        transactionCount: acc.transactionCount + 1,
      }),
      { totalTax: 0, totalAmount: 0, transactionCount: 0 }
    );
  
    return totals;
  };
  

  const { totalTax, totalAmount, transactionCount } = getLastWeekTotals();

  return (
    <React.Fragment>
      <Col xl={7}>
        <Card className="dash-mini">
          <div className="card-header border-0 align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">This Week's Overview</h4>
            {/* <div className="flex-shrink-0">
              <Dropdown className="card-header-dropdown">
                <Dropdown.Toggle as="a" className="text-reset arrow-none">
                  <span className="fw-semibold text-uppercase fs-14">Sort by: </span>
                  <span className="text-muted">
                    Current Week<i className="las la-angle-down fs-12 ms-2"></i>
                  </span>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu-end">
                  <Dropdown.Item href="#">Today</Dropdown.Item>
                  <Dropdown.Item href="#">Last Week</Dropdown.Item>
                  <Dropdown.Item href="#">Last Month</Dropdown.Item>
                  <Dropdown.Item href="#">Current Year</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div> */}
          </div>

          <Card.Body className="pt-1">
            <Row>
              <Col lg={4} className="mini-widget pb-3 pb-lg-0">
                <div className="d-flex align-items-end">
                  <div className="flex-grow-1">
                    <h2 className="mb-0 fs-24">
                      <CountUp end={totalTax} decimals={2} prefix="$" />
                    </h2>
                    <h5 className="text-muted fs-16 mt-2 mb-0">Total Tax</h5>
                    <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                      <span className="badge bg-info me-1">1.15%</span> since last week
                    </p>
                  </div>
                  <Donut1 dataColors='["--in-primary", "--in-light"]' className="apex-charts" />
                </div>
              </Col>

              <Col lg={4} className="mini-widget pb-3 pb-lg-0">
                <div className="d-flex align-items-end">
                  <div className="flex-grow-1">
                    <h2 className="mb-0 fs-24">
                      <CountUp end={totalAmount} decimals={2} prefix="$" />
                    </h2>
                    <h5 className="text-muted fs-16 mt-2 mb-0">Total Transaction Amount</h5>
                    <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                      <span className="badge bg-danger me-1">1.15%</span> since last week
                    </p>
                  </div>
                  <Donut2 dataColors='["--in-primary", "--in-light"]' className="apex-charts" />
                </div>
              </Col>

              <Col lg={4} className="mini-widget pb-3 pb-lg-0">
                <div className="d-flex align-items-end">
                  <div className="flex-grow-1">
                    <h2 className="mb-0 fs-24">
                      <CountUp end={transactionCount} />
                    </h2>
                    <h5 className="text-muted fs-16 mt-2 mb-0">Total Transaction Count</h5>
                    <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                      <span className="badge bg-info me-1">3.14%</span> since last week
                    </p>
                  </div>
                  <Donut3 dataColors='["--in-primary", "--in-light"]' className="apex-charts" />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    </React.Fragment>
  );
};

export default ThisWeekOverview;