import React, { useState } from 'react';
import MarketplaceTable from './marketplaceTable';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';

const MarketPlacesList = () => {
  document.title = 'Location | Scalarhub';

  const [isShow, setIsShow] = useState(false);

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Locations" title="Marketplaces" />
          <MarketplaceTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default MarketPlacesList;
