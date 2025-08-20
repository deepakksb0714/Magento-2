import { useFormik } from 'formik';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { editUsers as onEditUsers, getUsers as onGetUsers} from '../../slices/thunk';
import { createSelector } from 'reselect';
import { Button, Col, Form, Modal, Row, Container } from 'react-bootstrap';
import CustomTooltip from '../Tooltip';
import VerificationModal from './VerificationModal';
interface usereditProps {
  onCancel: any;
  edit: any;
}

interface Entity {
  id: any;
  name: string;
  parent_entity_id: string | null;
}

const EditUsers = ({ onCancel, edit }: usereditProps) => {
  const { entitiesList } = useSelector((state: any) => state.Invoice);
  const [stateObj, setStateObj] = useState<any>({});
  const [permissionObj, setPermissionObj] = useState<any>({
    ...edit?.permission_obj,
  });
  const [roleLevel, setRoleLevel] = useState<any>('');
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [updatedEmail, setUpdatedEmail] = useState('');
  const [updatedUserData, setUpdatedUserData] = useState<any>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const temp: any = {};
    entitiesList.map((entity: Entity) => {
      temp[entity.id] = entity.name;
    });
    setStateObj(temp);
    setPermissionObj({ ...edit?.permission_obj });
    setRoleLevel(edit?.role_level);
  }, [onCancel, edit, entitiesList]);

  const selectUsersList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      usersList: invoices.usersList,
    })
  );

  const { usersList } = useSelector(selectUsersList);

  useEffect(() => {
    dispatch(onGetUsers());
  }, [dispatch]);
 
  const formik: any = useFormik({
    enableReinitialize: true,
    initialValues: {
      id: (edit && edit.id) || '',
      first_name: (edit && edit.first_name) || '',
      last_name: (edit && edit.last_name) || '',
      email: (edit && edit.email) || '',
      username: (edit && edit.username) || '',
      status: (edit && edit.status) || 'enabled',
      company_name: (edit && edit.company_name) || '',
      role_level: (edit && edit.role_level) || 'superAdmin',
      permission_obj: (edit && edit.permission_obj) || {},
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('Please Enter First Name'),
      last_name: Yup.string().required('Please Enter Last Name'),
      email: Yup.string()
        .email()
        .matches(/^(?!.*@[^,]*,)/)
        .required('Please Enter Your Email'),
      username: Yup.string().required('User Name is required'),
      role_level: Yup.string().required('Access Type is required'),
      permission_obj: Yup.object().required('Permission is required'),
    }),
    onSubmit: (values: any) => {
      // Check if email was changed and open verification modal directly
      if (edit.email !== values.email) {
        setUpdatedEmail(values.email);
        
        // Prepare user data
        let role;
        if (roleLevel === 'superAdmin') {
          role = 0;
        } else if (roleLevel === 'Limited') {
          role = 2;
        } else if (roleLevel === 'Admin') {
          role = 1;
        }
        const UpdateUser = {
          id: edit.id,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          username: values.username,
          status: values.status,
          entity_id:
            values.role_level === '"superAdmin"'
              ? values.company_name
              : edit
                ? edit.company_name
                : 'ScalarHub',
          role_level: role,  // Use the role variable here too
          permission_obj: {},
        };
        // Store the updated data so we can use it after verification
        setUpdatedUserData(UpdateUser);
        setShowVerificationModal(true);
      } else {
        // No email change, proceed with normal update
        let role;
        if (roleLevel === 'superAdmin') {
          role = 0;
        } else if (roleLevel === 'Limited') {
          role = 2;
        } else if (roleLevel === 'Admin') {
          role = 1;
        }
        const UpdateUser = {
          id: edit.id,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          username: values.username,
          status: values.status,
          entity_id:
            values.role_level === '"superAdmin"'
              ? values.company_name
              : edit
                ? edit.company_name
                : 'ScalarHub',
          role_level: role,
          permission_obj: {},
        };
        dispatch(onEditUsers(UpdateUser))
          .then(() => {
            navigate('/users', { state: { activeTab: 'User List' } });
            onCancel();
            formik.resetForm();
          })
          .catch((error: any) => {
            console.error('Error updating user:', error);
          });
      }
    },
  });

  const handleVerificationSuccess = () => {
    if (!updatedUserData) return;
    
    dispatch(onEditUsers(updatedUserData))
      .then(() => {
        navigate('/login');
        onCancel();
        formik.resetForm();
      })
      .catch((error: any) => {
        console.error('Error updating user after verification:', error);
      });
  };
  
  return (
    <React.Fragment>
      <div>
        <Container fluid>
          <Row>
            <Col xl={12}>
            <Form autoComplete="off" onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <Form.Label htmlFor="username-input">User Name</Form.Label>
                <div>{formik.values.username}</div>
              </div>

              <hr />

              <Row className="mb-3">
              <Col sm={6}>
                <Form.Label htmlFor="users">First Name<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  id="first_name"
                  name="first_name"
                  value={formik.values.first_name || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.first_name}
                />
                {formik.errors.first_name && formik.touched.first_name ? (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {formik.errors.first_name}
                  </Form.Control.Feedback>
                ) : null}
                </Col>
                <Col>
                <Form.Label htmlFor="users">Last Name<span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  id="last_name"
                  name="last_name"
                  value={formik.values.last_name || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.last_name}
                />
                {formik.errors.last_name && formik.touched.last_name ? (
                  <Form.Control.Feedback type="invalid" className="d-block">
                    {formik.errors.last_name}
                  </Form.Control.Feedback>
                ) : null}
              </Col>
              </Row>
              <Row className="mb-3">
            <Col sm={6}>
                <Form.Label htmlFor="Email-input">
                  Email<span className="text-danger">*</span>
                  {edit && edit.email !== formik.values.email && (
                    <span className="text-info ms-2">
                      <CustomTooltip
                        text="Changing email will require verification"
                        placement="top"
                      />
                    </span>
                  )}
                </Form.Label>
                <Form.Control
                  type="text"
                  id="Email-input"
                  name="email"
                  value={formik.values.email || ''}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.email}
                />
                {formik.errors.email && formik.touched.email ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                ) : null}
             </Col>
             <Col>
                 <Form.Label htmlFor="username-input">
                    User Name<span className="text-danger">*</span>
                    <CustomTooltip
                      text="Provide a unique identifier for this user. Once it's created, it can't be changed."
                      placement="top"
                    />
                </Form.Label>
                <Form.Control
                  type="text"
                  id="username-input"
                  name="username"
                  disabled
                  value={formik.values.username}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  isInvalid={!!formik.errors.username}
                />
                {formik.errors.email && formik.touched.username ? (
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                ) : null}
            </Col>
            </Row>
              <hr />
              <h4 style={{ color: '#72767e' }}>
              Access level and permissions
              <span>
                <CustomTooltip
                  text="Allow this user to access the entire account or a specific
              company, and assign permissions."
                  placement="top"
                />
              </span>
            </h4>
            <Row>
            <Col sm={6} style={{paddingTop:"15px"}}>
              <select
                className="form-select"
                name="access_level"
                value={
                  roleLevel == 1 ||
                  roleLevel == 'Admin' ||
                  roleLevel == 0 ||
                  roleLevel == 'superAdmin'
                    ? 'Admin'
                    : 'Limited'
                }
                onChange={(e) => setRoleLevel(e.target.value)}
              >
                <option value="Admin">Account access</option>
                <option value="Limited">Company access</option>
              </select>
              </Col>

              <Col sm={6} >
              <div>
                {(roleLevel == 2 || roleLevel == 'Limited') &&
                  permissionObj &&
                  Object.keys(permissionObj).map((key, index) => {
                    if (stateObj[key] !== undefined) {
                      return (
                        <div key={index} style={{ marginBottom: '2rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2rem',
                            }}
                          >
                            <div style={{ width: '40%' }}>{stateObj[key]}</div>
                            <div
                              style={{
                                display: 'flex',
                                gap: '1.5rem',
                              }}
                            >
                              <Form.Check
                                type="radio"
                                label="Limited"
                                name={`permission_obj[${key}]`}
                                value="r"
                                checked={permissionObj[key] === 'r'}
                                onChange={() => {
                                  setPermissionObj({
                                    ...permissionObj,
                                    [key]: 'r',
                                  });
                                }}
                              />
                              <Form.Check
                                type="radio"
                                label="Admin"
                                name={`permission_obj[${key}]`}
                                value="rwud"
                                checked={permissionObj[key] === 'rwud'}
                                onChange={() => {
                                  setPermissionObj({
                                    ...permissionObj,
                                    [key]: 'rwud',
                                  });
                                }}
                               
                              />
                              <Form.Check
                                type="radio"
                                label="None"
                                name={`permission_obj[${key}]`}
                                value=""
                                checked={permissionObj[key] === ''}
                                onChange={() => {
                                  setPermissionObj({
                                    ...permissionObj,
                                    [key]: '',
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    } else {
                      return null;
                    }
                  })}
                {roleLevel === 2 ||
                  (roleLevel === 'Limited' && (
                    <div style={{ marginBottom: '20px', paddingTop:"15px" }}>
                      <select
                        className="form-select"
                        name="company_name"
                        value=""
                        onChange={(e) => {
                          setPermissionObj({
                            ...permissionObj,
                            [e.target.value]: 'rwud',
                          });
                        }}
                      >
                        {entitiesList.map((company: Entity) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                <br />
                {roleLevel === 1 ||
                roleLevel === 'Admin' ||
                roleLevel === 0 ||
                roleLevel === 'superAdmin' ? (
                  <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    marginTop: '5px',
                    paddingTop: '3px',
                    width: '75%',
                    marginLeft: '10%',
                  }}
                  >
                    <Form.Check
                      type="radio"
                      label="Admin"
                      name={`permission_obj[${edit?.company_name}]`}
                      value=""
                      checked={permissionObj[edit?.company_name] === 'rwud'}
                      onChange={() => {
                        setPermissionObj({
                          [edit?.company_name]: 'rwud',
                        });
                      }}
                    />
                    <Form.Check
                      type="radio"
                      label="Limited"
                      name={`permission_obj[${edit?.company_name}]`}
                      value=""
                      checked={permissionObj[edit?.company_name] === 'r'}
                      onChange={() => {
                        setPermissionObj({
                          [edit?.company_name]: 'r',
                        });
                      }}
                    />
                    <Form.Check
                      type="radio"
                      label="None"
                      name={`permission_obj[${edit?.company_name}]`}
                      value=""
                      checked={permissionObj[edit?.company_name] === ''}
                      onChange={() => {
                        setPermissionObj({
                          [edit?.company_name]: '',
                        });
                      }}
                    />
                  </div>
                ) : null}
              </div>
              </Col>
              </Row>
              <hr />
              {edit?.last_login && (
                <Row>
                  <Col>
                    <h3>Pause this user's access</h3>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <Form.Check
                        type="checkbox"
                        name="status"
                        label="Make inactive"
                        checked={formik.values.status === "disabled"}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "status",
                            e.target.checked ? "disabled" : "enabled"
                          )
                        }
                        onBlur={formik.handleBlur}
                      />
                      <span style={{ marginLeft: "8px" }}>
                        <CustomTooltip
                          text="Inactive users cannot log in."
                          placement="top"
                        />
                      </span>
                    </div>
                  </Col>
                </Row>
              )}
              <div className="hstack gap-2 justify-content-end mt-3">
                <button
                  type="button"
                  className="btn btn-light gap-2"
                  onClick={onCancel}
                >
                  Cancel
                </button>
                <Button type="submit" className="btn btn-primary">
                  Save
                </Button>
              </div>
            </Form>
            </Col>
          </Row>
        </Container>
      </div>
      <VerificationModal
        show={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        username={formik.values.username}
        onSuccess={handleVerificationSuccess}
        newEmail={updatedEmail}
      />
    </React.Fragment>
  );
};

export default EditUsers;