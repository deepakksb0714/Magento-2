import React from 'react';
import TaxRuleTable from './TaxRuleTable';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
const TaxRulesList = () => {
  document.title = 'Tax Rules | Scalarhub';

  return (
    <React.Fragment>
      <div className="page-content">
        <ToastContainer />
        <Container fluid>
          <BreadCrumb pageTitle="Custom Rules" title="Custom Rules" />
          <TaxRuleTable/>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default TaxRulesList;
