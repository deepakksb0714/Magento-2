import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './SubscriptionExpiredPage.css';  // Import the CSS file

const SubscriptionExpiredPage = () => {
  return (
    <div className="page-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="card-body">
                <div className="icon-container">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    width="60" 
                    height="60" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="#f44336" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                  </svg>
                </div>

                <h2 className="heading">
                  Subscription Expired
                </h2>

                <p className="text">
                  Your current subscription has expired. To continue using our services, 
                  please renew your subscription or contact our support team.
                </p>

                <div className="button-container">
                  <Button 
                    variant="success" 
                    size="lg" 
                    href="/pricing"
                  >
                    Renew Subscription
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Button>

                  <Button 
                    variant="primary" 
                    size="lg" 
                    href="mailto:support@scalarhub.com"
                  >
                    Contact Support
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="20" 
                      height="20" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </Button>
                </div>

                <div className="contact-info">
                  <p>Need help? Call us at</p>
                  <p>
                    +1 (800) SCALAR-HUB
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SubscriptionExpiredPage;
