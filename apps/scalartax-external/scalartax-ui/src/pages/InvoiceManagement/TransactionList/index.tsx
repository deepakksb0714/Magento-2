import React from 'react';
import TransactionTable from './TransactionTable';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';

const EntityLocationList = () => {
  document.title = 'Transactions | Scalarhub';

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Transactions" title="Transactions" />
          <TransactionTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EntityLocationList;
