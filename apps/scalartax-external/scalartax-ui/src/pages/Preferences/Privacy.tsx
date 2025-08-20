import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
} from 'react-bootstrap';
import {
  AuthenticationDetails,
  CognitoUser,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import useClientDetails from '../Authentication/clientDetails';
import BreadCrumb from '../../Common/BreadCrumb';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { userPoolId, clientId } = useClientDetails();
  const [user, setUser] = useState<any>();
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const authUser: any = sessionStorage.getItem('authUser');

  useEffect(() => {
    const adminUser = {
      username: authUser ? JSON.parse(authUser).idToken.payload.email : null,
      email: authUser ? JSON.parse(authUser).idToken.payload.email : null,
      first_name: authUser
        ? JSON.parse(authUser).idToken.payload['custom:first_name']
        : null,
      last_name: authUser
        ? JSON.parse(authUser).idToken.payload['custom:last_name']
        : null,
    };
    setUser(adminUser);
  }, [authUser]);

  const formik = useFormik({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required('current password is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(
          /[!@#$%^&*]/,
          'Password must contain at least one special character'
        )
        .matches(/[0-9]/, 'Password must contain at least one number')
        .test(
          'not-same-as-old',
          'New password should be different from your old password',
          (value: any, context: any) => value !== context.parent.oldPassword
        )
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Confirm new password must match')
        .required('Confirm new password is required'),
    }),
    onSubmit: async (values: any) => {
      try {
        if (!user || !user.email) {
          setErrorMessage('User not found.');
          return;
        }

        const poolData = {
          UserPoolId: userPoolId || 'default-user-pool-id',
          ClientId: clientId || 'default-client-id',
        };

        const userPool = new CognitoUserPool(poolData);

        const authenticationDetails = new AuthenticationDetails({
          Username: user.email,
          Password: values.oldPassword,
        });

        const userData = {
          Username: user.email,
          Pool: userPool,
        };

        const cognitoUser = new CognitoUser(userData);

        await new Promise((resolve, reject) => {
          cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: resolve,
            onFailure: (err) => {
              reject(err);
            },
          });
        });

        await new Promise((resolve, reject) => {
          cognitoUser.changePassword(
            values.oldPassword,
            values.newPassword,
            (err, result) => {
              if (err) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });

        setSuccessMessage('Password changed successfully.');
        window.location.href = '/login';
      } catch (error: any) {
        // Check for NotAuthorizedException to differentiate between username and password errors
        if (error instanceof Error) {
          if (error.message.includes('Incorrect username or password')) {
            setErrorMessage('current password is incorrect.');
          } else if (error.message.includes('Incorrect password')) {
            setErrorMessage('Password is incorrect.');
          } else {
            setErrorMessage('Incorrect username or password.');
          }
        } else {
          setErrorMessage(
            error.message || 'An error occurred while changing the password.'
          );
        }
      }
    },
  });

  const handleCancel = () => {
    navigate('/preferences/general');
  };

  return (
    <div className="page-content d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card style={{ boxShadow: '0px 0px 10px #204661' }}>
              <Card.Header>
                <h5 className="text-center mb-0" style={{ color: 'rgb(250, 70, 22)' }}>
                  Change Your Password
                </h5>
                {user && (
                  <div className="text-center">
                    <label>{user.email}</label>
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                {successMessage && (
                  <Alert variant="success" className="text-center">
                    {successMessage}
                  </Alert>
                )}
                {errorMessage && (
                  <Alert variant="danger" className="text-center">
                    {errorMessage}
                  </Alert>
                )}
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Current Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type={showOldPassword ? 'text' : 'password'}
                      name="oldPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.oldPassword}
                      isInvalid={!!formik.errors.oldPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.oldPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>New Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type={showNewPassword ? 'text' : 'password'}
                      name="newPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.newPassword}
                      isInvalid={!!formik.errors.newPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.newPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Confirm New Password<span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.confirmPassword}
                      isInvalid={!!formik.errors.confirmPassword}
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.confirmPassword}
                    </Form.Control.Feedback>
                  </Form.Group>
                  <Row>
                    <Col>
                    <Button variant="primary" type="submit">
                      Change Password
                    </Button>
                    </Col>
                    <Col>
                    <button   className="btn btn-light" onClick={handleCancel}>
                      Cancel
                    </button>
                    </Col>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Privacy;