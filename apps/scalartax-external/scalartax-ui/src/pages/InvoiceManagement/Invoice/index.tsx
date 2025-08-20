import React from 'react';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';
import InvoiceTable from './InvoiceTable';

const Invoice = () => {
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="" title="ScalarHub" />
          <InvoiceTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Invoice;
