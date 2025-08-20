import React from 'react'
import { Container } from 'react-bootstrap';
import BreadCrumb from '../../Common/BreadCrumb';

const Dashboard = () => {
  document.title = "Dashboard | scalarHub Admin & Dashboard Template";

  return (
    <React.Fragment>
      <div className="page-content">
            <Container fluid>
                <BreadCrumb pageTitle="Dashboard" title="Dashboard" />
                </Container>
                </div>
    </React.Fragment>
  )
}

export default Dashboard