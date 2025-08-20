import React from 'react';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';
import EntityTable from './EntityTable';

const Entity = () => {
  document.title = 'Entity | Dashboard';
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Entity" title="Entity" />
          <EntityTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Entity;
