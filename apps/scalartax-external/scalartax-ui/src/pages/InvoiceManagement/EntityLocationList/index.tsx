import React, { useState } from 'react';
import EntityLocationTable from './EntityLocationTable';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';

const EntityLocationList = () => {
  document.title = 'Location | Scalarhub';

  const [isShow, setIsShow] = useState(false);

  const hideUserModal = () => {
    setIsShow(!isShow);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Locations" title="Locations" />
          <EntityLocationTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EntityLocationList;
