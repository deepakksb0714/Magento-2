import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card, Form, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import logoDark from '../../assets/images/logo-light.png';
import { useDispatch } from 'react-redux';
import { userForgetPassword } from '../../slices/forgetpwd/thunk';
import useClientDetails from '../../pages/Authentication/clientDetails';
import AWS from 'aws-sdk';
import Reset from './Reset';

const ForgotPassword: React.FC = () => {
  const dispatch = useDispatch();
  const { userPoolId, clientId} = useClientDetails();

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showResetForm, setShowResetForm] = useState(false);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 15000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (userPoolId && clientId) {
      AWS.config.update({
        accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID  || '',
        secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || '',
        region: process.env.REACT_APP_AWS_REGION || '',
      });
    }
  }, [userPoolId, clientId]);
  const cognito = new AWS.CognitoIdentityServiceProvider();

  const checkEmailExists = async (email: string): Promise<boolean> => {
    if (!userPoolId) {
      throw new Error('User Pool ID is not available.');
    }

    const params = {
      UserPoolId: userPoolId,
      Username: email,
    };

    try {
      await cognito.adminGetUser(params).promise();
      return true; // User exists
    } catch (err: any) {
      if (err.code === 'UserNotFoundException') {
        return false; // User does not exist
      }
      throw err; // Handle other errors
    }
  };

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email')
        .required('Please Enter Your Email'),
    }),
    onSubmit: async (values: { email: string }) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        const emailExists = await checkEmailExists(values.email);
        if (emailExists) {
          if (!userPoolId || !clientId) {
            setErrorMessage('User pool ID or client ID is not set.');
            return;
          }
          await dispatch(
            userForgetPassword(values.email, userPoolId, clientId)
          );
          setSuccessMessage(
            'A password reset code has been sent to your email. Please check your inbox or spam folder.'
          );
          setShowResetForm(true);
        } else {
          setErrorMessage(
            'This email address is not associated with any account.'
          );
        }
      } catch (error: any) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
      }
    },
  });

  return (
    <React.Fragment>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <div className="auth-full-page-content d-flex min-vh-100 py-sm-5 py-4">
                <div className="w-100">
                   <div className="d-flex flex-column h-100 py-0 py-xl-4">
                  <div className="text-center"> {/* Removed margin */}
                    <span className="logo-lg">
                      <img src={logoDark} alt="" height="70" />
                    </span>
                  </div>
                  <Card
                    className="my-auto overflow-hidden"
                    style={{ boxShadow: '0px 0px 10px #204661', height: '65%' }}
                  >
                      <Row className="g-0">
                        <Col lg={12}>
                          <div className="p-lg-5 p-4">
                            <div className="text-center">
                              <h5
                                className="mb-0"
                                style={{ color: '#204661' }}
                              >
                                Forgot Password?
                              </h5>
                            </div>
                            <div className="mt-4">
                              {errorMessage && (
                                <Alert
                                  variant="danger"
                                  style={{ marginTop: '13px' }}
                                >
                                  {errorMessage}
                                </Alert>
                              )}
                              {successMessage && (
                                <Alert
                                  variant="success"
                                  style={{ marginTop: '13px' }}
                                >
                                  {successMessage}
                                </Alert>
                              )}

                              {showResetForm ? (
                                <Reset
                                  email={validation.values.email}
                                  userPoolId={userPoolId!} // Use non-null assertion only if you're sure
                                  clientId={clientId!} // Use non-null assertion only if you're sure
                                />
                              ) : (
                                <Form onSubmit={validation.handleSubmit}>
                                  <Form.Group className="mb-3">
                                    <Form.Label>
                                      Email or username
                                      <span className="text-danger">*</span>
                                    </Form.Label>
                                    <Form.Control
                                      type="email"
                                      name="email"
                                      className="form-control bg-light border-light password-input"
                                      id="email"
                                      placeholder="Enter email or username"
                                      onChange={validation.handleChange}
                                      onBlur={validation.handleBlur}
                                      value={validation.values.email || ''}
                                      isInvalid={
                                        validation.touched.email &&
                                        validation.errors.email
                                          ? true
                                          : false
                                      }
                                    />
                                    {validation.touched.email &&
                                      validation.errors.email && (
                                        <Form.Control.Feedback type="invalid">
                                          {validation.errors.email}
                                        </Form.Control.Feedback>
                                      )}
                                  </Form.Group>
                                  <div className="mt-2">
                                    <button
                                      className="btn btn-primary w-100"
                                      type="submit"
                                    >
                                      Reset password
                                    </button>
                                  </div>
                                  <div className="mt-4 d-flex justify-content-end align-items-center">
                                  <Link to="/login" className="text-muted d-flex align-items-center">
                                    <i className="bi bi-arrow-left me-2"></i> {/* Back icon */}
                                    Back to Login
                                  </Link>
                                </div>
                                </Form>
                              )}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Card>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ForgotPassword;
