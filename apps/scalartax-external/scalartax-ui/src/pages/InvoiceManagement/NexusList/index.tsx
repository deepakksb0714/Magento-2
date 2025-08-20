import React, { useState } from 'react';
import NexusStateTable from './NexusStateTable';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';

const NexusStateList = () => {
  document.title = 'Where you collect tax | Scalarhub';

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Where you collect tax " title="states" />
          <NexusStateTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default NexusStateList;
