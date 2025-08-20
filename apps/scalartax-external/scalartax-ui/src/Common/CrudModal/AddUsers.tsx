import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useFormik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers as onGetUsers, getAccount } from '../../slices/thunk';
import * as Yup from 'yup';
import { addUsers as onAddUsers } from '../../slices/thunk';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import Invoice from '../../pages/InvoiceManagement/Invoice/index';
import { useNavigate } from 'react-router-dom';
import CustomTooltip from '../Tooltip';
import { RiCloseLargeFill } from 'react-icons/ri';

interface UserProps {
  isShow: boolean;
  onCancel: () => void;
  handleShow: () => void;
}

interface Entity {
  id: any;
  name: string;
  parent_entity_id: string | null;
}

const AddUsers: React.FC<UserProps> = ({ onCancel, handleShow }) => {
  const dispatch = useDispatch();

  // const usersList = useSelector((state: any) => state.Invoice.usersList);
  const { entitiesList, usersList } = useSelector(
    (state: any) => state.Invoice
  );
  const [user, setUser] = useState<any>();
  const [roleLevel, setRoleLevel] = useState<any>(1);
  const [permissionObj, setPermissionObj] = useState<any>({});
  const [stateObj, setStateObj] = useState<any>({});
  const navigate = useNavigate();
  
  useEffect(() => {
    dispatch(onGetUsers());
  }, [dispatch]);

  useEffect(() => {
    if (usersList && usersList.length > 0) {
      setUser(usersList[usersList.length - 1]);
      // Set default permission for the user's company as 'rwud' (Admin)
      if (usersList[usersList.length - 1]?.company_name) {
        setPermissionObj({
          [usersList[usersList.length - 1].company_name]: 'rwud'
        });
      }
    }
  }, [usersList]);

  useEffect(() => {
    const temp: any = {};
    if (entitiesList && entitiesList.length > 0) {
      entitiesList.map((entity: Entity) => {
        temp[entity.id] = entity.name;
      });
    }
    setStateObj(temp);
    setRoleLevel(1);
  }, [entitiesList]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
      status: 'enabled',
      username: '',
      entity_id: null,
      role_level: 1,
      permission_obj: {},
    },
    validationSchema: Yup.object({
      first_name: Yup.string().required('First Name is required'),
      last_name: Yup.string().required('Last Name is required'),
      email: Yup.string().email().required('Email is required'),
      username: Yup.string().required('User Name is required'),
      role_level: Yup.string().required('Access Type is required'),
      permission_obj: Yup.object().required('Permission is required'),
    }),

    onSubmit: async (values: any) => {
      const newUser = {
        first_name: values.first_name,
        last_name: values.last_name,
        email: values.email,
        username: values.username,
        status: 'enabled',
        entity_id:
          values.role_level === '"superAdmin"'
            ? values.company_name
            : user
              ? user.company_name
              : 'ScalarHub',
        role_level: 2,
        permission_obj: {},
      };

      const temp: any = {
        ...newUser,
        permission_obj: permissionObj,
        role_level: Number(roleLevel),
      };

      dispatch(onAddUsers(temp));
      formik.resetForm();
      setPermissionObj({});
      setRoleLevel(1);
      navigate('/users', { state: { activeTab: 'User List' } });
      if (newUser === null) {
        handleShow();
        formik.resetForm();
        setPermissionObj({});
        setRoleLevel(1);
      } else {
        onCancel();
        formik.resetForm();
        setPermissionObj({});
        setRoleLevel(1);
      }
    },
  });

  const handleCancelClick = () => {
    // Reset Formik form
    formik.resetForm();

    // Reset local state
    setRoleLevel(1);
    setPermissionObj({});

    // Call the original handleClose function
    onCancel();
  };

  // Set default permission for entity when selected
  const handleEntitySelection = (entityId: string) => {
    setPermissionObj({
      ...permissionObj,
      [entityId]: 'rwud', // Default to Admin ('rwud')
    });
  };

  return (
    <>
      <div className="modal-content border-0">
        <div className="p-4">
          <Form autoComplete="off" onSubmit={formik.handleSubmit}>
            <Row>
              <Col sm={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="first_name-input">
                    First Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="first_name-input"
                    name="first_name"
                    value={formik.values.first_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!formik.errors.first_name && formik.touched.first_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.first_name}
                  </Form.Control.Feedback>
                </div>
              </Col>
              <Col sm={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="last_name-input">
                    Last Name<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="last_name-input"
                    name="last_name"
                    value={formik.values.last_name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!formik.errors.last_name && formik.touched.last_name
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.last_name}
                  </Form.Control.Feedback>
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <div className="mb-3">
                  <Form.Label htmlFor="email-input">
                    Email<span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    id="email-input"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={!!formik.errors.email && formik.touched.email}
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.email}
                  </Form.Control.Feedback>
                </div>
              </Col>
              <Col sm={6}>
                <div className="mb-3">
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
                    placeholder="User Name"
                    value={formik.values.username}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    isInvalid={
                      !!formik.errors.username && formik.touched.username
                    }
                  />
                  <Form.Control.Feedback type="invalid">
                    {formik.errors.username}
                  </Form.Control.Feedback>
                </div>
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
              <Col sm={6}>
                <select
                  className="form-select"
                  name="access_type"
                  value={roleLevel}
                  onChange={(e) => {
                    setRoleLevel(e.target.value);
                    // Reset permissions when changing role level
                    if (e.target.value === "1" && user?.company_name) {
                      // Set default admin permission for account access
                      setPermissionObj({
                        [user.company_name]: 'rwud'
                      });
                    } else {
                      setPermissionObj({});
                    }
                  }}
                >
                  <option value={1}>Account access</option>
                  <option value={2}>Entity access</option>
                </select>
              </Col>
              <Col sm={6}>
                <div>
                  {roleLevel == 2 ? (
                    <div style={{ marginBottom: '20px' }}>
                      <select
                        className="form-select"
                        name="company_name"
                        value=""
                        onChange={(e) => {
                          handleEntitySelection(e.target.value);
                        }}
                      >
                        <option value="">Select a entity...</option>
                        {entitiesList.map((company: Entity) => (
                          <option key={company.id} value={company.id}>
                            {company.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <></>
                  )}
                  {roleLevel == 2 ? (
                    Object.keys(permissionObj).map((key, index) =>
                      stateObj[key] ? (
                        <div key={index} style={{ marginBottom: '2rem' }}>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '2rem',
                            }}
                          >
                            <div style={{ width: '40%', marginLeft: '10px' }}>
                              {stateObj[key]}
                            </div>
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
                              <RiCloseLargeFill
                                style={{
                                  color: 'red',
                                  fontSize: 'large',
                                  margin: 'auto',
                                  cursor: 'pointer',
                                  marginTop: '4px',
                                }}
                                onClick={() => {
                                  const updatedPermissions = {
                                    ...permissionObj,
                                  };
                                  delete updatedPermissions[key];
                                  setPermissionObj(updatedPermissions);
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div key={key}></div>
                      )
                    )
                  ) : (
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
                        name={`permission_obj[${user?.company_name}]`}
                        value="rwud"
                        checked={permissionObj[user?.company_name] === 'rwud'}
                        onChange={() => {
                          setPermissionObj({
                            [user?.company_name]: 'rwud',
                          });
                        }}
                      />
                      <Form.Check
                        type="radio"
                        label="Limited"
                        name={`permission_obj[${user?.company_name}]`}
                        value="r"
                        checked={permissionObj[user?.company_name] === 'r'}
                        onChange={() => {
                          setPermissionObj({
                            [user?.company_name]: 'r',
                          });
                        }}
                      />
                      <Form.Check
                        type="radio"
                        label="None"
                        name={`permission_obj[${user?.company_name}]`}
                        value=""
                        checked={permissionObj[user?.company_name] === ''}
                        onChange={() => {
                          setPermissionObj({
                            [user?.company_name]: '',
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </Col>
            </Row>
            <hr />
            <br />
            <div className="hstack gap-2 justify-content-end">
            <button
              type="button"
              className="btn btn-light gap-3"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
           
              <Button type="submit" className="btn btn-primary">
                Add User
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default AddUsers;