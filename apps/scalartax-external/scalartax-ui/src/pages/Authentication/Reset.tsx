import React, { useState, useEffect } from 'react';
import { Form, Button, Alert,Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { userForgetPassword } from '../../slices/forgetpwd/thunk';

interface ResetProps {
  email: string;
  userPoolId: string;
  clientId: string;
}

const Reset: React.FC<ResetProps> = ({ email, userPoolId, clientId }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { forgetError } = useSelector((state: any) => state.ForgetPassword);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
        setSuccessMessage(null);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  useEffect(() => {
    if (forgetError) {
      setErrorMessage(forgetError);
    }
  }, [forgetError]);

  const formik = useFormik({
    initialValues: {
      verification: '',
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      verification: Yup.string().required('Verification code is required'),
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(
          /[!@#$%^&*]/,
          'Password must contain at least one special character'
        )
        .matches(/[0-9]/, 'Password must contain at least one number')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values: any) => {
      setErrorMessage(null);
      setSuccessMessage(null);
      try {
        if (values.newPassword.length > 5 && values.verification.length > 0) {
          const result = await dispatch(
            userForgetPassword(
              email,
              userPoolId,
              clientId,
              values.newPassword,
              values.verification
            )
          );
          setSuccessMessage(
            'Your password has been successfully reset. You can now log in with your new password.'
          );
          setTimeout(() => {
            navigate('/login');
          }, 5000);
        } else {
          setErrorMessage('Invalid verification code or password.');
        }
      } catch (error) {
        setErrorMessage(error instanceof Error ? error.message : String(error));
      }
    },
  });

  return (
    <React.Fragment>
      <Form onSubmit={formik.handleSubmit}>
        {errorMessage && (
          <Alert variant="danger">
            {errorMessage ===
            'Invalid verification code provided, please try again.'
              ? 'This reset link is invalid or has expired. Please request a new password reset.'
              : errorMessage}
          </Alert>
        )}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form.Group className="mb-3">
          <Form.Label>
            Verification code<span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            name="verification"
            className="form-control bg-light border-light"
            id="verification"
            placeholder="Enter verification code"
            value={formik.values.verification}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            isInvalid={
              formik.touched.verification && !!formik.errors.verification
            }
          />
          <Form.Control.Feedback type="invalid">
            {formik.errors.verification}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
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
              value={formik.values.newPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.newPassword && formik.errors.newPassword ? (
              <div className="text-danger">{formik.errors.newPassword}</div>
            ) : null}
            <button
              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <i className="ri-eye-fill align-middle"></i>
            </button>
          </div>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>
            Confirm password<span className="text-danger">*</span>
          </Form.Label>
          <div className="position-relative auth-pass-inputgroup mb-3">
            <Form.Control
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              className="form-control bg-light border-light pe-5 password-input"
              id="confirmPassword"
              placeholder="Confirm new password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-danger">{formik.errors.confirmPassword}</div>
            ) : null}
            <button
              className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted password-addon"
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <i className="ri-eye-fill align-middle"></i>
            </button>
          </div>
          <Row className="mt-3">
            <Col></Col>
          </Row>
        </Form.Group>

        <Button
          type="submit"
          className="btn w-100"
          style={{ backgroundColor: '#363636', color: '#FFFFFF' }}
        >
          Submit
        </Button>
      </Form>
    </React.Fragment>
  );
};

export default Reset;
