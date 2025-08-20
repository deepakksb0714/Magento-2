import React, { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import withRouter from '../../Common/withRouter';
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from 'react-bootstrap';
import logoDark from '../../assets/images/logo-light.png';
import { Link } from 'react-router-dom';
import AuthCarousel from '../AuthenticationInner/AuthCarousel';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { loginUser, resetLoginFlag, socialLogin } from '../../slices/thunk';
import useClientDetails from './clientDetails';
import { useNavigate } from 'react-router-dom';
import { editUserEmail as onEditUsers } from '../../slices/thunk';
import { addAccount as onAddAccount } from '../../slices/thunk';
import * as Yup from 'yup';
import { toast } from 'react-toastify';

import {
  CognitoUser,
  AuthenticationDetails,
  CognitoUserPool,
} from 'amazon-cognito-identity-js';

const Login = (props: any) => {
  document.title = 'Login | scalarHub Dashboard';

  const { clientId, userPoolId } = useClientDetails();
  const dispatch: any = useDispatch();
  const selectAccountAndLogin = createSelector(
    (state: any) => state.Account,
    (state: any) => state.Login,
    (account: any, login: any) => ({
      user: account.user,
      error: login.error,
      loading: login.loading,
      errorMsg: login.errorMsg,
    })
  );

  const { user, error, loading, errorMsg } = useSelector(selectAccountAndLogin);

  const [userLogin, setUserLogin] = useState<any>([]);
  const [password, setPassword] = useState<any>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [newPasswordRequire, setNewPasswordRequire] = useState<any>(false);
  const [userDetails, setUserDetails] = useState<any>([]);
  const [userAttribute, setUserAttribute] = useState<any>([]);
  const [cognitoUser, setCognitoUser] = useState<any>(null); // State for cognitoUser
  const navigate = useNavigate();
  const [showSignIn, setSignIn] = useState<any>(false);
  const [showPassword, setShowPassword] = useState<any>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(5);
  const [loginAttempts, setLoginAttempts] = useState<number>(0);

  useEffect(() => {
    // Check if there's saved login info in localStorage
    const savedEmail = localStorage.getItem('rememberedEmail');
    const savedPassword = localStorage.getItem('rememberedPassword');
    if (savedEmail && savedPassword) {
      validation.setFieldValue('email', savedEmail);
      validation.setFieldValue('password', savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleRememberMeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setRememberMe(event.target.checked);
  };

  useEffect(() => {
    if (user && user) {
      const updatedUserData =
        process.env.REACT_APP_DEFAULTAUTH === 'firebase'
          ? user.multiFactor.user.email
          : user.email;
      const updatedUserPassword =
        process.env.REACT_APP_DEFAULTAUTH === 'firebase' ? '' : user.password;
      setUserLogin({
        email: updatedUserData,
        password: updatedUserPassword,
      });
    }
  }, [user]);

  const [passwordShow, setPasswordShow] = useState<boolean>(false);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (newPasswordRequire) {
      // New password validation schema
// In the handleSubmit function where newPasswordRequire is true
      const newPasswordSchema = Yup.object().shape({
        newPassword: Yup.string()
          .required('New password is required')
          .min(8, 'Password must be at least 8 characters')
          .matches(
            /[A-Z]/,
            'Password must contain at least one uppercase letter'
          )
          .matches(
            /[a-z]/,
            'Password must contain at least one lowercase letter'
          )
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(
            /[^A-Za-z0-9]/,
            'Password must contain at least one special character'
          )
          .test(
            'not-same-as-old',
            'New password must be different',
            function(value:any) {
              return value !== validation.values.password;
            }
          ),
        confirmPassword: Yup.string()
          .required('Confirm password is required')
          .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
      });

      newPasswordSchema
        .validate({ newPassword: password, confirmPassword })
        .then(() => {
          if (password !== confirmPassword) {
            setErrorMessage('Password does not match');
            return;
          }

          delete userAttribute.email_verified;
          delete userAttribute.email;

          if (userAttribute['custom:tenant-id']) {
            delete userAttribute['custom:tenant-id'];
          }

          const newPassword = password;

          if (newPassword) {
            cognitoUser.completeNewPasswordChallenge(
              newPassword,
              userAttribute,
              {
                onSuccess: (session: any) => {
                  setErrorMessage('');
                  setSuccessMessage('Password changed successfully');
                  setPasswordShow(true);
                  sessionStorage.setItem('authUser', JSON.stringify(session));
                  const authUser: any = sessionStorage.getItem('authUser');
                  const newUser = {
                    company_name: authUser
                      ? JSON.parse(authUser).idToken.payload[
                          'custom:COMPANY_NAME'
                        ]
                      : null,
                    name: authUser
                      ? JSON.parse(authUser).idToken.payload['custom:PLAN'] ||
                        'Trial'
                      : 'Trial',
                    username: authUser
                      ? JSON.parse(authUser).idToken.payload.email
                      : null,
                    email: authUser
                      ? JSON.parse(authUser).idToken.payload.email
                      : null,
                    first_name: authUser
                      ? JSON.parse(authUser).idToken.payload[
                          'custom:first_name'
                        ]
                      : null,
                    last_name: authUser
                      ? JSON.parse(authUser).idToken.payload['custom:last_name']
                      : null,
                    billing_cycle: authUser
                      ? JSON.parse(authUser).idToken.payload[
                          'custom:BILLING_CYCLE'
                        ]
                      : null,
                  };
                  const email = JSON.parse(authUser).idToken.payload.email;
                  const userData = {
                    id: email,
                    last_login: new Date().toISOString()
                  };
                  dispatch(onEditUsers(userData));
                  dispatch(onAddAccount(newUser));
                  let countdown = 3;
                  const timer = setInterval(() => {
                    countdown--;
                    setRedirectCountdown(countdown);
                    if (countdown === 0) {
                      clearInterval(timer);
                      navigate('/dashboard');
                    }
                  }, 1000);
                },
                onFailure: (err: any) => {
                  setErrorMessage(
                    'Failed to change password. Please check the password criteria.'
                  );
                },
              }
            );
          }
        })
        .catch((error: any) => {
          setErrorMessage(error.message);
        });
    } else {
      const poolData = {
        UserPoolId:
          userPoolId || (process.env.REACT_APP_COGNITO_USER_POOL_ID as string),
        ClientId:
          clientId || (process.env.REACT_APP_COGNITO_CLIENT_ID as string),
      };

      const userPool = new CognitoUserPool(poolData);

      const authenticationData = {
        Username: validation.values.email,
        Password: validation.values.password,
      };

      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      );

      const userData = {
        Username: validation.values.email,
        Pool: userPool,
      };
      setUserDetails(userData);
      let cognitoUser = new CognitoUser(userData);
      setCognitoUser(cognitoUser);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          setErrorMessage('');
          sessionStorage.setItem('authUser', JSON.stringify(result));
          const authUser: any = sessionStorage.getItem('authUser');

          const user: any = JSON.stringify(result);
          navigate('/dashboard');
        },
        onFailure: (error) => {
          setErrorMessage(
            'Sign in failed. Please check your credentials and try again.'
          );
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          setErrorMessage('');
          setUserAttribute(userAttributes);
          setNewPasswordRequire(true);
        },
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    // Clear error message when user starts typing
    setErrorMessage('');

    // Update formik value
    validation.handleChange({
      target: {
        name: field,
        value: value,
      },
    });
  };

  const validation: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().required('Please Enter Your Email'),
      password: Yup.string().required('Please Enter Your Password'),
    }),
    onSubmit: (values: any) => {
      const poolData = {
        UserPoolId:
          userPoolId || (process.env.REACT_APP_COGNITO_USER_POOL_ID as string),
        ClientId:
          clientId || (process.env.REACT_APP_COGNITO_CLIENT_ID as string),
      };

      const userPool = new CognitoUserPool(poolData);

      const authenticationData = {
        Username: values.email,
        Password: values.password,
      };

      const authenticationDetails = new AuthenticationDetails(
        authenticationData
      );

      const userData = {
        Username: values.email,
        Pool: userPool,
      };

      setUserDetails(userData);
      let cognitoUser = new CognitoUser(userData);
      setCognitoUser(cognitoUser);

      cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
          sessionStorage.setItem('authUser', JSON.stringify(result));
          const authUser: any = sessionStorage.getItem('authUser');

           // Add this code to update the last_login field
            const email = JSON.parse(authUser).idToken.payload.email;
            const userData = {
              id: email,
              last_login: new Date().toISOString()
            };
            dispatch(onEditUsers(userData));
          navigate('/dashboard');
        },
        onFailure: (error) => {
          if (error.message === 'Incorrect username or password.') {
            const newAttempts = loginAttempts + 1;
            setLoginAttempts(newAttempts);
            
            if (newAttempts >= 3) {
              // Account is now locked
              setErrorMessage('Your account has been locked due to multiple failed attempts. Please reset your password.');
              // toast.error('Account locked. Please reset your password.');
              
              // Optional: After a short delay, redirect to password reset page
              setTimeout(() => {
                navigate('/forgot-password');
              }, 3000);
            } else {
              setErrorMessage(`Incorrect username or password. ${3 - newAttempts} attempts remaining.`);
              // toast.error(`Incorrect username or password. ${3 - newAttempts} attempts remaining.`);
            }
          } else {
            setErrorMessage('Your user has been temporarily disabled. Please contact your administrator');
            // toast.error('Login failed. Please check your username and password and try again.');
          }
        },
        newPasswordRequired: function (userAttributes, requiredAttributes) {
          setUserAttribute(userAttributes);
          setNewPasswordRequire(true);
        },
      });
      // Save or remove login info based on rememberMe state
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', values.email);
        localStorage.setItem('rememberedPassword', values.password);
      } else {
        localStorage.removeItem('rememberedEmail');
        localStorage.removeItem('rememberedPassword');
      }
    },
  });

  const signIn = (type: any) => {
    dispatch(socialLogin(type, props.router.navigate));
  };

  const socialResponse = (type: any) => {
    signIn(type);
  };

  useEffect(() => {
    if (errorMsg) {
      setTimeout(() => {
        dispatch(resetLoginFlag());
      }, 3000);
    }
  }, [dispatch, errorMsg]);
  return newPasswordRequire ? (
    <React.Fragment>
      <div className="account-pages">
        <Container
          className="mb-3"
          style={{ paddingTop: '5%', paddingBottom: '5%', marginTop: '4%' }}
        >
          <div className="d-flex justify-content-center align-items-center">
          <Card className="p-4 w-50 shadow" style={{ boxShadow: '0px 0px 10px #204661' }}>
          <div className="text-center">
            <div className="logo">
              <span className="logo-lg">
                <img src={logoDark} alt="" height="70" />
              </span>
            </div>
          </div>
          <Row className="justify-content-center">
            <Col md="10">
              {showPassword && (
                <div className="text-center">
                  <h1>{successMessage}</h1>
                </div>
              )}

              {errorMessage && <Alert>{errorMessage}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Label>
                  New password<span className="text-danger">*</span>
                </Form.Label>
                <div className="position-relative auth-pass-inputgroup mb-3">
                  <Form.Control
                    type={showNewPassword ? 'text' : 'password'}
                    name="newPassword"
                    className="form-control bg-light border-light pe-5 password-input"
                    id="newPassword"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  {validation.touched.newPassword &&
                    validation.errors.newPassword && (
                      <div className="text-danger mt-1">
                        {validation.errors.newPassword}
                      </div>
                    )}
                  <button
                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    <i className="ri-eye-fill align-middle"></i>
                  </button>
                </div>
                <Form.Label>
                  Confirm new password<span className="text-danger">*</span>
                </Form.Label>
                <div className="position-relative auth-pass-inputgroup mb-3">
                  <Form.Control
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    className="form-control bg-light border-light pe-5 password-input"
                    id="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    required
                  />
                  {validation.touched.confirmPassword &&
                    validation.errors.confirmPassword && (
                      <div className="text-danger mt-1">
                        {validation.errors.confirmPassword}
                      </div>
                    )}
                  <button
                    className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <i className="ri-eye-fill align-middle"></i>
                  </button>
                </div>
                <div className="mt-2">
                  <button className="btn btn-primary" type="submit">
                    Change Password
                  </button>
                </div>
              </Form>
            </Col>
          </Row>
          </Card>
          </div>
        </Container>
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment>
      <div className="account-pages">
        <Container>
          <Row className="justify-content-center">
            <Col md={11}>
              <div className="auth-full-page-content d-flex min-vh-100 py-sm-5 py-4">
                <div className="w-100">
                  <div className="d-flex flex-column h-100 py-0 py-xl-4">
                    {showSignIn && (
                      <div className="text-center">
                        <h1>Sign in Successfully</h1>
                      </div>
                    )}

                    <div className="text-center mb-2">
                      <div>
                        <span className="logo-lg">
                          <img src={logoDark} alt="" height="70" />
                        </span>
                      </div>
                    </div>
                    <Card className="my-auto overflow-hidden" style={{ boxShadow: '0px 0px 10px #204661' }}>
                      <Row className="g-0">
                        <Col lg={6}>
                          <Card.Body className="p-lg-5 p-4">
                            <div className="text-center">
                              <h5 className="mb-0">
                                <span style={{ color: '#204661' }}>
                                  Welcome Back !
                                </span>
                              </h5>
                              <p className="text-muted mt-2">
                                Sign in to continue to ScalarTax.
                              </p>
                            </div>
                            <Row>
                              <Col>
                                {errorMessage && (
                                  <Alert>{errorMessage}</Alert>
                                )}
                              </Col>
                            </Row>
                            <div className="mt-4">
                              <Form
                                action="#"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  validation.handleSubmit();
                                  return false;
                                }}
                              >
                                <Form.Group
                                  className="mb-3"
                                  controlId="username"
                                >
                                  <Form.Label>
                                    Email<span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="position-relative">
                                    <Form.Control
                                      type="email"
                                      name="email"
                                      className="form-control bg-light border-light password-input"
                                      placeholder="Enter username"
                                      onChange={(e) =>
                                        handleInputChange(
                                          'email',
                                          e.target.value
                                        )
                                      }
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
                                    validation.errors.email ? (
                                      <Form.Control.Feedback type="invalid">
                                        {validation.errors.email}
                                      </Form.Control.Feedback>
                                    ) : null}
                                  </div>
                                </Form.Group>
                                <Form.Group
                                  className="mb-3"
                                  controlId="password-input"
                                >
                                  <div className="float-end">
                                    <Link
                                      to="/forgot-password"
                                      className="text-muted"
                                    >
                                      Forgot password?
                                    </Link>
                                  </div>
                                  <Form.Label>
                                    Password{''}
                                    <span className="text-danger">*</span>
                                  </Form.Label>
                                  <div className="position-relative auth-pass-inputgroup mb-3">
                                    <Form.Control
                                      type={showPassword ? 'text' : 'password'}
                                      name="password"
                                      className="form-control bg-light border-light pe-5 password-input"
                                      placeholder="Enter password"
                                      value={validation.values.password || ''}
                                      onChange={(e) =>
                                        handleInputChange(
                                          'password',
                                          e.target.value
                                        )
                                      }
                                      onBlur={validation.handleBlur}
                                    />
                                    {validation.touched.password &&
                                      validation.errors.password && (
                                        <div className="text-danger mt-1">
                                          {validation.errors.password}
                                        </div>
                                      )}
                                    <button
                                      className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
                                      type="button"
                                      id="password-addon"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      <i className="ri-eye-fill align-middle"></i>
                                    </button>
                                  </div>
                                </Form.Group>
                                <Form.Group
                                  className="mb-3"
                                  controlId="auth-remember-check"
                                >
                                  <Form.Check
                                    type="checkbox"
                                    id="remember-me-checkbox"
                                    label="Remember me"
                                    checked={rememberMe}
                                    onChange={handleRememberMeChange}
                                  />
                                </Form.Group>

                                <div className="mt-3">
                                  <Button
                                    className="btn w-100"
                                    type="submit"
                                    disabled={loading}
                                  >
                                    {loading ? (
                                      <Spinner size="sm" animation="border" />
                                    ) : (
                                      'Sign In'
                                    )}
                                  </Button>
                                </div>
                              </Form>
                            </div>
                          </Card.Body>
                        </Col>
                        <AuthCarousel />
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

export default withRouter(Login);
