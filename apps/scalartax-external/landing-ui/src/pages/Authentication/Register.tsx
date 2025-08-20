import React, { useEffect, useState } from 'react'
import { Card, Col, Container, Row, Form, Alert, Button, InputGroup, Spinner} from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { getSgAccounts as onGetSgAccounts } from '../../slices/thunk';
import logoDark from "../../assets/images/logo-dark.png";
import { useFormik } from 'formik'
import * as Yup from "yup";
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios'; 
import ThankYou from './ThankYou';
import { createSelector } from 'reselect';

const siteConfig = {
  apiUrl: "https://api.scalarhub.ai",
  domain: "app.scalarhub.ai"
}

const Register = () => {
    document.title = "Register | ScalarHub Admin Dashboard";

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [companyNameError, setCompanyNameError] = useState('');
    const [loader, setLoader] = useState<boolean>(false);
    
    const selectSgAccounts = createSelector(
        (state: any) => state.Invoice,
        (invoices: any) => ({
            sgAccounts: invoices?.sgAccounts || []  // Provide a default empty array
        })
    );
  
    const { sgAccounts } = useSelector(selectSgAccounts);

    useEffect(() => {
        dispatch(onGetSgAccounts());
    }, [dispatch]);

    const onSubmit = async (formData: any) => {
        const API_URL = `${siteConfig.apiUrl}/register`;
        const domain = siteConfig.domain;

        const isCompanyNameTaken = (sgAccounts || []).some(
            (account: any) => 
                account?.name && 
                formData.companyName && 
                account.name.toLowerCase() === formData.companyName.toLowerCase()
        );

        if (isCompanyNameTaken) {
            setCompanyNameError('Entity name is already taken. Please choose a different name.');
            return;
        }

        const user = {
            ...formData,
            customDomain: domain,
        };

        try {
            setSubmitting(true);
            const response = await axios.post(API_URL, user);
            setSuccess(true);
            setLoader(true);
            setTimeout(() => {
                setLoader(false);
            }, 5000);
            navigate('/thankyou');
            setError(false);
            setCompanyNameError('');
        } catch (err) {
            console.error('Registration error:', err);  // Add error logging
            setError(true);
            setSuccess(false);
            // Optionally, set a more specific error message
            if (axios.isAxiosError(err)) {
                setCompanyNameError(err.response?.data?.message || 'Registration failed');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Clear company name error immediately when user starts typing
        if (e.target.name === 'companyName') {
            setCompanyNameError('');
        }
        validation.handleChange(e);
    };

    const getTenantUrl = () => {
        const companyName = validation.values.companyName || ''; 
        const re = /[\W\s]+/g;
        const tenantId = companyName.replace(re, '').toLowerCase();
    
        const [subdomain, domain] = siteConfig.domain.split('.');
        const modifiedSubdomain = subdomain.replace("landing", "app");
    
        return `https://${tenantId}.${modifiedSubdomain}.${domain}.com`;
    };

    const validation: any = useFormik({
        enableReinitialize: true,
        initialValues: {
            firstName: '',
            lastName: '',
            email: '',
            companyName: '',
            mobile: '',
            address: '',
            plan: 'starter',
            billing_cycle: 'monthly',
        },
        validationSchema: Yup.object({
            firstName: Yup.string().required("Please enter first name"),
            lastName: Yup.string().required("Please enter last name"),
            email: Yup.string().email("Invalid email").required("Please enter email"),
            companyName: Yup.string().required("Please enter entity name"),
            mobile: Yup.string().required("Please enter mobile number"),
            plan: Yup.string().required("Please select a plan"),
            billing_cycle: Yup.string().required("Please select billing cycle"),
        }),
        onSubmit: onSubmit
    });

    return (
        <React.Fragment>
            <div className="account-pages">
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8}>
                            <Card className="my-auto overflow-hidden">
                                <div className="text-center mt-3">
                                    <Link to="/">
                                        <span className="logo-lg">
                                            <img src={logoDark} alt="" height="60" />
                                        </span>
                                    </Link>
                                </div>
                                <Row className="g-0">
                                    <div className="p-lg-5 p-4">
                                        <div className="text-center">
                                            <h5 className="mb-0"><span style={{color:"rgb(250, 70, 22)"}}>Create New Account</span></h5>
                                            <p className="text-muted mt-2">Get your free ScalarHub account now</p>
                                        </div>
                                    
                                        <div>
                                            {success && <ThankYou />}
                                            <Form 
                                                className="needs-validation"
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    validation.handleSubmit(e);
                                                }}
                                            >
                                                {/* Rest of the form remains the same as in the original code */}
                                                {/* Add company name error display */}
                                                {companyNameError && (
                                                    <Alert variant="danger" className="mt-2">
                                                        {companyNameError}
                                                    </Alert>
                                                )}

                                                            <Row>
                                                                <Col md='6'>
                                                                <Form.Group className="mb-3" controlId="firstName">
                                                                <Form.Label>First Name <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='firstName'
                                                                    className="form-control bg-light border-light"
                                                                    placeholder="Enter first name"
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.firstName || ""}
                                                                    isInvalid={
                                                                        validation.touched.firstName && validation.errors.firstName ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.firstName && validation.errors.firstName ? (
                                                                    <Form.Control.Feedback type="invalid">{validation.errors.firstName}</Form.Control.Feedback>
                                                                ) : null}
                                                            </Form.Group>
                                                            </Col>

                                                            <Col md='6'>
                                                            <Form.Group className="mb-3" controlId="lastName">
                                                                <Form.Label>Last Name <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='lastName'
                                                                    className="form-control bg-light border-light"
                                                                    placeholder="Enter last name"
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.lastName || ""}
                                                                    isInvalid={
                                                                        validation.touched.lastName && validation.errors.lastName ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.lastName && validation.errors.lastName ? (
                                                                    <Form.Control.Feedback type="invalid">{validation.errors.lastName}</Form.Control.Feedback>
                                                                ) : null}
                                                            </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md='6'>
                                                            <Form.Group className="mb-3" controlId="useremail">
                                                                <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    type="email"
                                                                    name='email'
                                                                    className="form-control bg-light border-light"
                                                                    placeholder="Enter email address"
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.email || ""}
                                                                    isInvalid={
                                                                        validation.touched.email && validation.errors.email ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.email && validation.errors.email ? (
                                                                    <Form.Control.Feedback type="invalid">{validation.errors.email}</Form.Control.Feedback>
                                                                ) : null}

                                                               </Form.Group>
                                                                </Col>

                                                                <Col md='6'>
                                                                <Form.Group className="mb-3" controlId="companyName">
                                                                <Form.Label>Entity <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='companyName'
                                                                    className="form-control bg-light border-light"
                                                                    placeholder="Enter company name"
                                                                    onChange={handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.companyName || ""}
                                                                    isInvalid={
                                                                        (validation.touched.companyName && validation.errors.companyName) || 
                                                                        !!companyNameError
                                                                    }
                                                                />
                                                                {validation.touched.companyName && validation.errors.companyName ? (
                                                                    <Form.Control.Feedback type="invalid">{validation.errors.companyName}</Form.Control.Feedback>
                                                                ) : null}
                                                            </Form.Group>
                                                            </Col>
                                                        </Row>

                                                        <Row>
                                                            <Col md='6'>
                                                            <Form.Group className="mb-3" controlId="mobile">
                                                                <Form.Label>Mobile <span className="text-danger">*</span></Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='mobile'
                                                                    className="form-control bg-light border-light"
                                                                    placeholder="Enter mobile number"
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.mobile || ""}
                                                                    isInvalid={
                                                                        validation.touched.mobile && validation.errors.mobile ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.mobile && validation.errors.mobile ? (
                                                                    <Form.Control.Feedback type="invalid">{validation.errors.mobile}</Form.Control.Feedback>
                                                                ) : null}
                                                            </Form.Group>
                                                            </Col>

                                                            <Col md='6'>
                                                            <Form.Group className="mb-3" controlId="address">
                                                                <Form.Label>Address</Form.Label>
                                                                <Form.Control
                                                                    type="text"
                                                                    name='address'
                                                                    className="form-control bg-light border-light"
                                                                    placeholder="Enter address"
                                                                    onChange={validation.handleChange}
                                                                    onBlur={validation.handleBlur}
                                                                    value={validation.values.address || ""}
                                                                    isInvalid={
                                                                        validation.touched.address && validation.errors.address ? true : false
                                                                    }
                                                                />
                                                                {validation.touched.address && validation.errors.address ? (
                                                                    <Form.Control.Feedback type="invalid">{validation.errors.address}</Form.Control.Feedback>
                                                                ) : null}
                                                            </Form.Group>
                                                            </Col>
                                                        </Row>
                                                        <hr />

                                                        <Row>
                                                            <h4>ScalarHub Subscriptions</h4>
                                                        </Row>
                                                        
                                                        <Row mt-3>
                                                        <Col md='6'>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Billing Cycle<span className="text-danger">*</span></Form.Label>
                                                            <select
                                                                id="billing_cycle"
                                                                name="billing_cycle"
                                                                className={`form-select bg-light border-light ${validation.touched.billing_cycle && validation.errors.billing_cycle ? 'is-invalid' : ''}`}
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.billing_cycle || ""}
                                                            >
                                                                <option value="monthly">Monthly</option>
                                                                <option value="annual">Annually</option>
                                                            </select>
                                                            {validation.touched.billing_cycle && validation.errors.billing_cycle && (
                                                                <div className="invalid-feedback">{validation.errors.billing_cycle}</div>
                                                            )}
                                                        </Form.Group>
                                                        </Col>
                                                        
                                                            <Col md='6'>
                                                            <Form.Group className="mb-3">
                                                            <Form.Label>Plans<span className="text-danger">*</span></Form.Label>
                                                            <select
                                                                id="plan"
                                                                name="plan"
                                                                className={`form-select bg-light border-light ${validation.touched.plan && validation.errors.plan ? 'is-invalid' : ''}`}
                                                                onChange={validation.handleChange}
                                                                onBlur={validation.handleBlur}
                                                                value={validation.values.plan || ""}
                                                            >
                                                                <option value="starter">Starter</option>
                                                                <option value="enterprise">Enterprise</option>
                                                                <option value="pro">Pro</option>
                                                            </select>
                                                            {validation.touched.plan && validation.errors.plan && (
                                                                <div className="invalid-feedback">{validation.errors.plan}</div>
                                                            )}
                                                        </Form.Group>
                                                        </Col>
                                                    </Row>                 
                                                                <div className="fs-16 pb-2">
                                                                    <p className="mb-0 fs-14 text-muted fst-italic">By registering you agree to the ScalarHub <Link to="https://scalarhub.ai/pricing/" className="text-primary text-decoration-underline fst-normal fw-medium"><span style={{color:"rgb(250, 70, 22)"}}>Terms of Use</span></Link></p>
                                                                </div>

                                                                <Row className="mt-3">
                                                                    <Col md={{ span: 2, offset: 10 }} className="d-flex justify-content-end">
                                                                        <button 
                                                                            className="btn w-100" 
                                                                            type="submit"  // Change to type="submit"
                                                                            style={{background:"#363636"}}
                                                                        >
                                                                            {loader && <Spinner size="sm" animation="border" />}
                                                                            <span style={{color:"white"}}> Sign Up</span>
                                                                        </button>
                                                                    </Col>
                                                                </Row>
                                                            </Form>
                                                        </div>
                                                    </div>      
                                                </Row>
                                            </Card>
                                        </Col>
                                    </Row>  
                                </Container>   
                            </div>
                </React.Fragment>
       )
    }
export default Register
