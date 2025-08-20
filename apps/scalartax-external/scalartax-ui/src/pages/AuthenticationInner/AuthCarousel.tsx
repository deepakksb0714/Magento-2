import React from 'react';
import { Carousel, Col } from 'react-bootstrap';
import login from '../../assets/images/login-logo.png';

const AuthCarousel = () => {
  return (
    <React.Fragment>
      <Col lg={6}>
        <div
          className="d-flex h-100 align-items-center"
          style={{
            backgroundImage: `url(${login})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="p-lg-5 p-4">
            <div className="p-0 p-sm-4 px-xl-0 py-5">
              <Carousel indicators={true} controls={false}>
                <Carousel.Item>
                  <div className="testi-contain text-center">
                    <h5 className="fs-20 mb-0">
                      <span style={{ color: 'white' }}>
                        ScalarTax: Our sales tax platform make your sales tax
                        compliance hassle-free
                      </span>
                    </h5>
                    <p className="fs-15 text-white-50 mt-2 mb-0">
                      Ensure seamless compliance with sales tax regulations and
                      focus on growing your business by letting us handle all
                      your sales tax obligations, from collection to filing,
                      leaving you with peace of mind and more time to serve your
                      customers.
                    </p>
                  </div>
                </Carousel.Item>

                <Carousel.Item>
                  <div className="testi-contain text-center">
                    <h5 className="fs-20 text-white mb-0">
                      <span style={{ color: 'white' }}>
                        ScalarBooks: Expert accounting solutions tailored for
                        your e-commerce business
                      </span>
                    </h5>
                    <p className="fs-15 text-white-50 mt-2 mb-0">
                      Transform your e-commerce financial management with our
                      expert accounting services tailored to meet the unique
                      needs of your online business.
                    </p>
                  </div>
                </Carousel.Item>

                <Carousel.Item>
                  <div className="testi-contain text-center">
                    <h5 className="fs-20 text-white mb-0">
                      <span style={{ color: 'white' }}>
                        ScalarComply: Secure your business from fraud through
                        identity verification, fraud prevention
                      </span>
                    </h5>
                    <p className="fs-15 text-white-50 mt-2 mb-0">
                      Elevate your business security with ScalarComply's robust
                      suite of services including Identity Verification, Fraud
                      Prevention, and OFAC Screening.
                    </p>
                  </div>
                </Carousel.Item>
              </Carousel>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};

export default AuthCarousel;
