import React, { useEffect, useState } from 'react';
import { createSelector } from 'reselect';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Col, Container, Form, Row, Button } from 'react-bootstrap';
import BreadCrumb from '../../../Common/BreadCrumb';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import {
  getEntities as onGetEntities,
  deleteEntities as onDeleteEntities,
} from '../../../slices/thunk';
import * as Yup from 'yup';
import ValidateAddress from './ValidateAddress';

const ManageEntity = () => {
  document.title = 'ADD ENTITY  | Dashboard';

  const [step, setStep] = useState('manage');
  const [isParentCompany, setIsParentCompany] = useState(false);
  const [entityData, setEntityData] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { entitiesList } = useSelector((state: any) => state.Invoice);

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  interface Entity {
    id: any;
    name: string;
    parent_entity_id: string | null;
  }

  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );

  // const { entitiesList } = useSelector(selectEntitiesList);

  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  // const [selectedCompanyName, setSelectedCompanyName] = useState<string>('');

  useEffect(() => {
    dispatch(onGetEntities());
  }, [dispatch]);

  useEffect(() => {
    if (entitiesList) {
      setEntities(entitiesList);
    }
  }, [entitiesList]);

  const formik = useFormik({
    initialValues: {
      name: '',
      phone: '',
      tax_id: '',
      is_online_marketplace: 'false',
      parent_entity_id: null,
      tax_collection: "parent",
      is_parent_entity: false,
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Entity name is required'),
      phone: Yup.string().required('Phone number is required'),
      tax_id: Yup.string().required('Taxpayer ID is required'),
      
     // Conditional validation for parent entity
      parent_entity_id: Yup.string().when('is_parent_entity', {
        is: true,
        then: () => Yup.string().required('Parent entity is required'),
        otherwise: () => Yup.string().nullable(),
      }),
    }),
    onSubmit: (values: any) => {
      const entityData = {
        ...values,
      };
      setEntityData(entityData);
      setStep('validate');
    },
  });


  const handleFinalSubmit = (addressData: any) => {
    const finalData = {
      ...formik.values,
      address: addressData,
    };
  };

  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedCompanyId(event.target.value as string);
    console.log(event.target.value as string);
    formik.setFieldValue('parent_entity_id', event.target.value as string);
  };

  return (
    <React.Fragment>
      <div className="page-content" style={{ padding: 'unset', paddingBottom:"30px"}}>
        <Container fluid>
          {step === 'manage' && (
            <Row>
              <Col xl={12}>
                <div className="p-2">
                  <h2>
                    To get started, please provide some key information about
                    your business.
                  </h2>
                  <Form onSubmit={formik.handleSubmit}>
                    <Row>
                      <Col sm={6}>
                        <div className="mb-3 mt-4">
                          <Form.Label htmlFor="name">
                            Entity Name
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                          />
                          {formik.touched.name && formik.errors.name ? (
                            <div className="text-danger">
                              {formik.errors.name}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                      <Col sm={6}>
                        <div className="mb-3 mt-4">
                          <Form.Label htmlFor="phone">
                            Phone Number
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <input
                            id="phone"
                            name="phone"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                          />
                          {formik.touched.phone && formik.errors.phone ? (
                            <div className="text-danger">
                              {formik.errors.phone}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <div className="mb-3 mt-4">
                          <Form.Label htmlFor="tax_id">
                            Taxpayer ID (EIN)
                            <span className="text-danger">*</span>
                          </Form.Label>
                          <input
                            id="tax_id"
                            name="tax_id"
                            type="text"
                            className="form-control"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.tax_id}
                          />
                          {formik.touched.tax_id && formik.errors.tax_id ? (
                            <div className="text-danger">
                              {formik.errors.tax_id}
                            </div>
                          ) : null}
                        </div>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm={6}>
                        <div className="mt-4">
                          <Form.Group className="mt-4">
                            <Form.Label htmlFor="tax_id">
                              To configure tax settings, please confirm if this
                              entity is standalone or under a parent entity.
                            </Form.Label>
                            <Form.Check
                              name="is_parent_entity"
                              type="checkbox"
                              onChange={(e) => {
                                setIsParentCompany(e.target.checked);
                                formik.setFieldValue('is_parent_entity', e.target.checked);
                              }}
                              checked={isParentCompany}
                              style={{ color: 'gray' }}
                              label="Organize this entity under a parent entity"
                            />
                          </Form.Group>

                          {isParentCompany && (
                            <div>
                              <div className="mb-3 mt-4">
                                <Form.Label>Parent Entity<span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  as="select"
                                  onChange={handleChange}
                                  value={selectedCompanyId}
                                >
                                  <option value="">Select a entity...</option>
                                  {entitiesList.map((company: Entity) => (
                                    <option key={company.id} value={company.id}>
                                      {company.name}
                                    </option>
                                  ))}
                                </Form.Control>
                                {formik.touched.parent_entity_id &&
                                formik.errors.parent_entity_id ? (
                                  <div className="text-danger">
                                    {formik.errors.parent_entity_id}
                                  </div>
                                ) : null}
                              </div>
                              <hr />
                              <div>
                                <h3>Inherit the tax collection settings?</h3>
                              </div>

                              <p style={{ paddingLeft: '0' }}>
                                This entity can inherit the tax collection
                                settings of its parent entity. We recommend that
                                entities that file taxes together share tax
                                collection settings.
                              </p>                                
                              <div className="form-check">
                                <input
                                  type="radio"
                                  name="tax_collection"
                                  className="form-check-input"
                                  value="parent"
                                  onChange={(e) => formik.setFieldValue('tax_collection', e.target.value)}
                                  checked={formik.values.tax_collection === 'parent'}
                                />
                                <Form.Label htmlFor="form-check-label" style={{ color: 'gray' }}>
                                  Use the tax collection settings of the parent entity{' '}
                                  <span style={{ color: 'red', paddingLeft: '10px' }}>Recommended</span>
                                </Form.Label>
                              </div>
                              <div className="form-check mt-3">
                                <input
                                  type="radio"
                                  name="tax_collection"
                                  className="form-check-input"
                                  value="separate"
                                  onChange={(e) => formik.setFieldValue('tax_collection', e.target.value)}
                                  checked={formik.values.tax_collection === 'separate'}
                                />
                                <Form.Label style={{ color: 'gray' }}>This is a separate reporting entity</Form.Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </Col>
                    </Row>

                    <hr />
                    <div className="mb-3 mt-4">
                      <h3>Is this an online marketplace?</h3>
                      <div className="form-check mt-3">
                        <input
                          type="radio"
                          name="is_online_marketplace"
                          value="true"
                          className="form-check-input"
                          onChange={formik.handleChange}
                          checked={
                            formik.values.is_online_marketplace === 'true'
                          }
                        />
                        <Form.Label style={{ color: 'gray' }}>
                          Yes, this entity is an online marketplace
                        </Form.Label>
                      </div>
                      <div className="form-check">
                        <input
                          type="radio"
                          name="is_online_marketplace"
                          value="false"
                          className="form-check-input"
                          onChange={formik.handleChange}
                          checked={
                            formik.values.is_online_marketplace === 'false'
                          }
                        />
                        <Form.Label style={{ color: 'gray' }}>
                          No, this entity is not an online marketplace
                        </Form.Label>
                      </div>
                    </div>
                    <hr />
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100px' }}
                      >
                        Next
                      </Button>
                    </div>
                  </Form>
                </div>
              </Col>
            </Row>
          )}
          {step === 'validate' && (
            <ValidateAddress
              onSubmit={handleFinalSubmit}
              entityData={entityData}
              setStep={setStep}
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ManageEntity;
