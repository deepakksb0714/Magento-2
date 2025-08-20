import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Card, Col, Dropdown, Form, Row, Nav, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import { useLocation } from 'react-router-dom';
import TaxRules from './TaxRules';
import TransactionRules from './TransactionRules'
import CustomTaxCodes from './CustomTaxCodes';
import ReferenceLists from './ReferenceLists';
import UserDefinedFields from './UserDefinedFields';
import History from './History'

const CustomRules = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('Tax rules');  

  // Function to toggle active tab
  const toggleTab = (tabName :any) => {
    setActiveTab(tabName);

     // Generate URL-friendly path
     const baseRoute = '/tax-rules';
     const tabRoute = tabName === 'Tax rules' ? baseRoute : `${baseRoute}/${tabName.toLowerCase().replace(/\s+/g, '-')}`;
     
     
     window.history.pushState(null, '', tabRoute);
  };

  useEffect(() => {
    // Check if a specific tab is passed via state
    if (location.state?.targetTab) {
      toggleTab(location.state.targetTab);
    } else {
      // Extract tab from URL and set it as active
      const path = window.location.pathname.split('/')[2]; // Extract the tab from URL
      const tabName = path?.replace(/-/g, ' ') || 'Tax rules'; // Convert URL format back to tab name
      toggleTab(tabName);
    }
  }, [location.state]); // Run whenever location changes
 
  return (
    <Row className="pb-4 gy-3">
      <Col xl={12}>
            <Tab.Container activeKey={activeTab}>
              <Nav as="ul" variant="tabs" className="nav-tabs nav-tabs-custom nav-success mb-3">
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="Tax rules"
                    onClick={() => toggleTab('Tax rules')}
                  >
                    Tax Rules
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="Transaction rules"
                    onClick={() => toggleTab('Transaction rules')}
                  >
                    Transaction Rules
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="Custom tax codes"
                    onClick={() => toggleTab('Custom tax codes')}
                  >
                    Custom Tax Codes
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="Reference lists"
                    onClick={() => toggleTab('Reference lists')}
                  >
                    Reference lists
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="User-defined fields"
                    onClick={() => toggleTab('User-defined fields')}
                  >
                   User-defined fields
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item as="li">
                  <Nav.Link
                    eventKey="History"
                    onClick={() => toggleTab('History')}
                  >
                    History 
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              <Card>
                <Card.Body>
                {activeTab === "Tax rules" && (
                    <>
                      <TaxRules />
                    </>
                  )}
                  {activeTab === 'Transaction rules' && (
                    <>
                      <TransactionRules />
                    </>
                  )}
                    {activeTab === 'Custom tax codes' && (
                    <>
                      <CustomTaxCodes/>
                    </>
                  )}
                  {activeTab === 'Reference lists' && (
                    <>
                      <ReferenceLists/>
                    </>
                  )}
                   {activeTab === 'User-defined fields' && (
                    <>
                      <UserDefinedFields/>
                    </>
                  )}
                  {activeTab === 'History' && (
                    <>
                      <History />
                    </>
                  )}
                  
                </Card.Body>
              </Card>
            </Tab.Container>
       
      </Col>
    </Row>
  );
};

export default CustomRules;
