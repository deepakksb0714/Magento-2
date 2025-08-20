import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { createSelector } from 'reselect';
import {
  Button,
  Col,
  Form,
  Modal,
  Row,
  FormGroup,
  FormLabel,
} from 'react-bootstrap';
import { editProductList as onEditProductList } from '../../slices/thunk';

interface ProductEditProps {
  isShow: boolean;
  handleClose: () => void;
  edit: any;
}

interface PrimaryEntity {
  id: any;
  name: string;
}

const EditProductList = ({ isShow, handleClose, edit }: ProductEditProps) => {
  const [showTaxCode, setShowTaxCode] = useState(false);
  const dispatch = useDispatch();

  const [primaryEntity, setPrimaryEntity] = useState<PrimaryEntity | null>(
    null
  );
  const selectEntitiesList = createSelector(
    (state: any) => state.Invoice,
    (invoices: any) => ({
      entitiesList: invoices.entitiesList,
    })
  );
  const { entitiesList } = useSelector(selectEntitiesList);

  useEffect(() => {
    if (entitiesList && entitiesList.length > 0) {
      const defaultEntity = entitiesList.find(
        (entity: any) => entity.is_default
      );
      if (defaultEntity) {
        setPrimaryEntity(defaultEntity);
      } else {
        setPrimaryEntity(entitiesList[0]);
      }
    } else {
      setPrimaryEntity(null);
    }
  }, [entitiesList]);

  useEffect(() => {
    if (edit) {
      // Update the form fields directly
      Object.keys(edit).forEach((key) => {
        formik.setFieldValue(key, edit[key]);
      });

      edit.product_attributes?.forEach((attr: any) => {
        formik.setFieldValue(`${attr.attribute_name}`, attr.attribute_value);
        if (attr.attribute_unit_of_measure) {
          formik.setFieldValue(
            `${attr.attribute_name}_unit`,
            attr.attribute_unit_of_measure
          );
        }
      });
    }
  }, [edit]);

  const attributes = edit?.product_attributes?.reduce((acc: any, attr: any) => {
    acc[attr.attribute_name] = attr.attribute_value;
    if (attr.attribute_unit_of_measure) {
      acc[`${attr.attribute_name}_unit`] = attr.attribute_unit_of_measure;
    }
    return acc;
  }, {});

  const formik = useFormik({
    enableReinitialize: true,

    initialValues: {
      id: edit?.id || '',
      product_code: edit?.product_code || '',
      entity_id: (primaryEntity && primaryEntity.id) || '',
      tax_code: edit?.tax_code || '',
      price: edit?.price || '',
      product_group: edit?.product_group || '',
      category: edit?.category || '',
      description: edit?.description || '',
      ...attributes,
    },

    validationSchema: Yup.object({
      product_code: Yup.string().required('Product code is required'),
      description: Yup.string().required('Product description is required'),
      tax_code: Yup.string().required('Tax code is required'),
    }),

    onSubmit: (values: any) => {
      const attributes = [
        'age_group',
        'asin',
        'availability',
        'color',
        'condition',
        'ean',
        'gender',
        'google_product_category',
        'gtin',
        'height',
        'hs_hint',
        'image_link',
        'link',
        'material',
        'mpn',
        'price',
        'sale_price',
        'sale_price_effective_date',
        'shipping',
        'shipping_weight',
        'size',
        'sku',
        'summary',
        'upc',
        'width',
      ]
        .filter((attr) => values[attr] || values[`${attr}_unit`])
        .map((attr) => ({
          attribute_name: attr,
          attribute_value: values[attr],
          attribute_unit_of_measure: values[`${attr}_unit`] || '',
        }));

      const product = {
        product_code: values.product_code,
        product_group: values.product_group,
        category: values.category,
        description: values.description,
        tax_code: values.tax_code,
        entity_id:
          sessionStorage.getItem('entity') ||
          (primaryEntity && primaryEntity.id) ||
          null,
        product_attributes: attributes,
      };

      const updateProduct = {
        products: [product],
      };

      dispatch(onEditProductList({ id: edit.id, product: updateProduct }));
      handleClose();
    },
  });

  const handleNextClick = () => {
    setShowTaxCode(true);
  };

  useEffect(() => {
    if (edit) {
    }
  }, [edit]);

  return (
    <React.Fragment>
      <Modal
        centered
        show={isShow}
        onHide={handleClose}
        style={{ display: 'block' }}
        tabIndex={-1}
      >
        <div className="modal-content border-0">
          <Modal.Header className="p-4 pb-0">
            <Modal.Title as="h5">Edit Product</Modal.Title>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </Modal.Header>
          <Modal.Body className="p-4">
            <Form autoComplete="off" onSubmit={formik.handleSubmit}>
              <div>
                <Row>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label htmlFor="product_code">
                        Product code<span style={{ color: 'red' }}>*</span>
                      </Form.Label>
                      <Form.Control
                        id="product_code"
                        name="product_code"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.product_code}
                        isInvalid={
                          formik.touched.product_code &&
                          !!formik.errors.product_code
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.product_code}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>

                  <Col md={4}>
                    <Form.Group>
                      <Form.Label htmlFor="product_group">
                        Product group
                      </Form.Label>
                      <Form.Control
                        id="product_group"
                        name="product_group"
                        type="text"
                        placeholder="Look for a specific product group"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.product_group}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label htmlFor="category">Category</Form.Label>
                      <Form.Control
                        id="category"
                        name="category"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.category}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mt-4">
                  <Col md={12}>
                    <FormGroup>
                      <FormLabel htmlFor="description">
                        Product Description
                        <span style={{ color: 'red' }}>*</span>
                      </FormLabel>
                      <Form.Control
                        id="description"
                        name="description"
                        as="textarea"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.description}
                        isInvalid={
                          formik.touched.description &&
                          !!formik.errors.description
                        }
                      />
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.description}
                      </Form.Control.Feedback>
                    </FormGroup>
                  </Col>
                </Row>
              </div>
              <div>
                <hr />
                <h3>Classification attributes</h3>

                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="age_group">Attribute</Form.Label>
                    <Form.Control
                      id="age_group"
                      name="age_group"
                      type="text"
                      disabled
                      value="Age group"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="age_group">Value</Form.Label>
                    <Form.Control
                      as="select"
                      id="age_group"
                      name="age_group"
                      onChange={formik.handleChange}
                      value={formik.values.age_group}
                    >
                      <option value="">Select</option>
                      <option value="Adults">Adults</option>
                      <option value="Children">Children</option>
                      <option value="Infants">Infants</option>
                      <option value="Kids">Kids</option>
                      <option value="Toddler">Toddler</option>
                    </Form.Control>
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="asin">Attribute</Form.Label>
                    <Form.Control
                      id="asin"
                      name="asin"
                      type="text"
                      disabled
                      value="Asin"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="asin">Value</Form.Label>
                    <Form.Control
                      id="asin"
                      name="asin"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.asin}
                    />
                  </Col>
                </Row>

                <hr />

                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="availability">Attribute</Form.Label>
                    <Form.Control
                      id="availability"
                      name="availability"
                      type="text"
                      disabled
                      value="Availability"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="availability">Value</Form.Label>
                    <Form.Control
                      as="select"
                      id="availability"
                      name="availability"
                      onChange={formik.handleChange}
                      value={formik.values.availability}
                    >
                      <option value="">Select</option>
                      <option value="In stock">In stock</option>
                      <option value="Out of stock">Out of stock</option>
                      <option value="Preorder">Preorder</option>
                    </Form.Control>
                  </Col>
                </Row>
                <hr />

                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="color">Attribute</Form.Label>
                    <Form.Control
                      id="color"
                      name="color"
                      type="text"
                      disabled
                      value="Color"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="color">Value</Form.Label>
                    <Form.Control
                      id="color"
                      name="color"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.color}
                    />
                  </Col>
                </Row>
                <hr />

                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="condition">Attribute</Form.Label>
                    <Form.Control
                      id="condition"
                      name="condition"
                      type="text"
                      disabled
                      value="Condition"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="condition">Value</Form.Label>
                    <Form.Control
                      as="select"
                      id="condition"
                      name="condition"
                      onChange={formik.handleChange}
                      value={formik.values.condition}
                    >
                      <option value="">Select</option>
                      <option value="New">New</option>
                      <option value="Refurbished">Refurbished</option>
                      <option value="Used">Used</option>
                    </Form.Control>
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="ean">Attribute</Form.Label>
                    <Form.Control
                      id="ean"
                      name="ean"
                      type="text"
                      disabled
                      value="Ean"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="color">Value</Form.Label>
                    <Form.Control
                      id="ean"
                      name="ean"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.ean}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="gender">Attribute</Form.Label>
                    <Form.Control
                      id="gender"
                      name="gender"
                      type="text"
                      disabled
                      value="Gender"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="gender">Value</Form.Label>
                    <Form.Control
                      as="select"
                      id="gender"
                      name="gender"
                      onChange={formik.handleChange}
                      value={formik.values.gender}
                    >
                      <option value="">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unisex">Unisex</option>
                    </Form.Control>
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="google_product_category">
                      Attribute
                    </Form.Label>
                    <Form.Control
                      id="google_product_category"
                      name="google_product_category"
                      type="text"
                      disabled
                      value="Google product category"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="google_product_category">
                      Value
                    </Form.Label>
                    <Form.Control
                      id="google_product_category"
                      name="google_product_category"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.google_product_category}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="gtin">Attribute</Form.Label>
                    <Form.Control
                      id="gtin"
                      name="gtin"
                      type="text"
                      disabled
                      value="Gtin"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="gtin">Value</Form.Label>
                    <Form.Control
                      id="gtin"
                      name="gtin"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.gtin}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={4}>
                    <Form.Label htmlFor="height">Attribute</Form.Label>
                    <Form.Control
                      id="height"
                      name="height"
                      type="text"
                      disabled
                      value="Height"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label htmlFor="height">Value</Form.Label>
                    <Form.Control
                      id="height"
                      name="height"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.height}
                    />
                  </Col>

                  <Col md={4}>
                    <FormGroup>
                      <Form.Label htmlFor="height_unit">
                        Unit of measure
                      </Form.Label>
                      <Form.Control
                        as="select"
                        id="height_unit"
                        name="height_unit"
                        onChange={formik.handleChange}
                        value={formik.values.height_unit}
                      >
                        <option value="">Select</option>
                        <option value="Centimeter">Centimeter</option>
                        <option value="Chain">Chain</option>
                        <option value="Femtometer">Femtometer</option>
                        <option value="Foot">Foot</option>
                        <option value="Foot_UsSurvey">Foot_UsSurvey</option>
                        <option value="FrenchGauge">FrenchGauge</option>
                        <option value="Inch">Inch</option>
                        <option value="Kilometer">Kilometer</option>
                        <option value="Link">Link</option>
                        <option value="Meter">Meter</option>
                        <option value="Micrometre">Micrometre</option>
                        <option value="Mil">Mil</option>
                        <option value="Mile">Mile</option>
                        <option value="Mile_UsSurvey">Mile_UsSurvey</option>
                        <option value="Millimeter">Millimeter</option>
                        <option value="Nanometre">Nanometre</option>
                        <option value="Picometre">Picometre</option>
                        <option value="Rod">Rod</option>
                        <option value="THOU">THOU</option>
                        <option value="Yard">Yard</option>
                      </Form.Control>
                    </FormGroup>
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="hs_hint">Attribute</Form.Label>
                    <Form.Control
                      id="hs_hint"
                      name="hs_hint"
                      type="text"
                      disabled
                      value="Hs hint"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="hs_hint">Value</Form.Label>
                    <Form.Control
                      id="hs_hint"
                      name="hs_hint"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.hs_hint}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="image_link">Attribute</Form.Label>
                    <Form.Control
                      id="image_link"
                      name="image_link"
                      type="text"
                      disabled
                      value="Image link"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="image_link">Value</Form.Label>
                    <Form.Control
                      id="image_link"
                      name="image_link"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.image_link}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="link">Attribute</Form.Label>
                    <Form.Control
                      id="link"
                      name="link"
                      type="text"
                      disabled
                      value="Link"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="link">Value</Form.Label>
                    <Form.Control
                      id="link"
                      name="link"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.link}
                    />
                  </Col>
                </Row>
                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="material">Attribute</Form.Label>
                    <Form.Control
                      id="material"
                      name="material"
                      type="text"
                      disabled
                      value="Material"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="material">Value</Form.Label>
                    <Form.Control
                      id="material"
                      name="material"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.material}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="mpn">Attribute</Form.Label>
                    <Form.Control
                      id="mpn"
                      name="mpn"
                      type="text"
                      disabled
                      value="Mpn"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="mpn">Value</Form.Label>
                    <Form.Control
                      id="mpn"
                      name="mpn"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.mpn}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="price">Attribute</Form.Label>
                    <Form.Control
                      id="price"
                      name="price"
                      type="text"
                      disabled
                      value="Price"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="price">Value</Form.Label>
                    <Form.Control
                      id="price"
                      name="price"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.price}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="sale_price">Attribute</Form.Label>
                    <Form.Control
                      id="sale_price"
                      name="sale_price"
                      type="text"
                      disabled
                      value="Sale price"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="sale_price">Value</Form.Label>
                    <Form.Control
                      id="sale_price"
                      name="sale_price"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.sale_price}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="sale_price_effective_date">
                      Attribute
                    </Form.Label>
                    <Form.Control
                      id="sale_price_effective_date"
                      name="sale_price_effective_date"
                      type="text"
                      disabled
                      value="Sale  price effective date"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="sale_price_effective_date">
                      Value
                    </Form.Label>
                    <Form.Control
                      id="sale_price_effective_date"
                      name="sale_price_effective_date"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.sale_price_effective_date}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="shipping">Attribute</Form.Label>
                    <Form.Control
                      id="shipping"
                      name="shipping"
                      type="text"
                      disabled
                      value="Shipping"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="shipping">Value</Form.Label>
                    <Form.Control
                      id="shipping"
                      name="shipping"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shipping}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={4}>
                    <Form.Label htmlFor="shippingWeight">Attribute</Form.Label>
                    <Form.Control
                      id="shippingWeight"
                      name="shippingWeight"
                      type="text"
                      disabled
                      value="Shipping Weight"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label htmlFor="shipping_weight">Value</Form.Label>
                    <Form.Control
                      id="shipping_weight"
                      name="shipping_weight"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.shipping_weight}
                    />
                  </Col>

                  <Col md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="shipping_weight_unit">
                        Unit of measure
                      </FormLabel>
                      <Form.Control
                        as="select"
                        id="shipping_weight_unit"
                        name="shipping_weight_unit"
                        onChange={formik.handleChange}
                        value={formik.values.shipping_weight_unit}
                      >
                        <option value="">Select</option>
                        <option value="Carat">Carat</option>
                        <option value="Centigram">Centigram</option>
                        <option value="Dram_ApothecaryTroy">
                          Dram_ApothecaryTroy
                        </option>
                        <option value="Dram_Avoirdupois">
                          Dram_Avoirdupois
                        </option>
                        <option value="Grain">Grain</option>
                        <option value="Gram">Gram</option>
                        <option value="hundredweight(short); cental">
                          hundredweight(short); cental
                        </option>
                        <option value="kg_of_tobacco_content">
                          kg_of_tobacco_content
                        </option>
                        <option value="Kilogram">Kilogram</option>
                        <option value="Kip">Kip</option>
                        <option value="Megagram">Megagram</option>
                        <option value="Microgram">Microgram</option>
                        <option value="Milligram">Milligram</option>
                        <option value="Ounce">Ounce</option>
                        <option value="Ounce_ApothecaryTroy">
                          Ounce_ApothecaryTroy
                        </option>
                        <option value="Ounce_UsNutrition">
                          Ounce_UsNutrition
                        </option>
                        <option value="Pound">Pound</option>
                        <option value="Pound_Troy">Pound_Troy</option>
                        <option value="Tola">Tola</option>
                        <option value="Ton_Imperial">Ton_Imperial</option>
                        <option value="Ton_UsCustomary">Ton_UsCustomary</option>
                      </Form.Control>
                    </FormGroup>
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="size">Attribute</Form.Label>
                    <Form.Control
                      id="size"
                      name="size"
                      type="text"
                      disabled
                      value="size"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="size">Value</Form.Label>
                    <Form.Control
                      id="size"
                      name="size"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.size}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="sku">Attribute</Form.Label>
                    <Form.Control
                      id="sku"
                      name="sku"
                      type="text"
                      disabled
                      value="Sku"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="sku">Value</Form.Label>
                    <Form.Control
                      id="sku"
                      name="sku"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.sku}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="summary">Attribute</Form.Label>
                    <Form.Control
                      id="summary"
                      name="summary"
                      type="text"
                      disabled
                      value="Summary"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="sku">Value</Form.Label>
                    <Form.Control
                      id="summary"
                      name="summary"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.summary}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={6}>
                    <Form.Label htmlFor="upc">Attribute</Form.Label>
                    <Form.Control
                      id="upc"
                      name="upc"
                      type="text"
                      disabled
                      value="Upc"
                    />
                  </Col>

                  <Col md={6}>
                    <Form.Label htmlFor="upc">Value</Form.Label>
                    <Form.Control
                      id="upc"
                      name="upc"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.upc}
                    />
                  </Col>
                </Row>

                <hr />
                <Row className="mt-4">
                  <Col md={4}>
                    <Form.Label htmlFor="width">Attribute</Form.Label>
                    <Form.Control
                      id="width"
                      name="width"
                      type="text"
                      disabled
                      value="Width"
                    />
                  </Col>

                  <Col md={4}>
                    <Form.Label htmlFor="width">Value</Form.Label>
                    <Form.Control
                      id="width"
                      name="width"
                      type="text"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.width}
                    />
                  </Col>

                  <Col md={4}>
                    <FormGroup>
                      <FormLabel htmlFor="width_unit">
                        Unit of measure
                      </FormLabel>
                      <Form.Control
                        as="select"
                        id="width_unit"
                        name="width_unit"
                        onChange={formik.handleChange}
                        value={formik.values.width_unit}
                      >
                        <option value="">Select</option>
                        <option value="Centimeter">Centimeter</option>
                        <option value="Chain">Chain</option>
                        <option value="Femtometer">Femtometer</option>
                        <option value="Foot">Foot</option>
                        <option value="Foot_UsSurvey">Foot_UsSurvey</option>
                        <option value="FrenchGauge">FrenchGauge</option>
                        <option value="Inch">Inch</option>
                        <option value="Kilometer">Kilometer</option>
                        <option value="Link">Link</option>
                        <option value="Meter">Meter</option>
                        <option value="Micrometre">Micrometre</option>
                        <option value="Mil">Mil</option>
                        <option value="Mile">Mile</option>
                        <option value="Mile_UsSurvey">Mile_UsSurvey</option>
                        <option value="Millimeter">Millimeter</option>
                        <option value="Nanometre">Nanometre</option>
                        <option value="Picometre">Picometre</option>
                        <option value="Rod">Rod</option>
                        <option value="THOU">THOU</option>
                        <option value="Yard">Yard</option>
                      </Form.Control>
                    </FormGroup>
                  </Col>
                </Row>
              </div>

              <hr />
              <Row className="mt-4">
                <Col md={12}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleNextClick}
                  >
                    Next
                  </button>
                </Col>
              </Row>

              <div>
                <Row className="mt-4">
                  <Col className="d-flex align-items-center" md={12}>
                    <h1 className="mb-0 me-2">2</h1>
                    <h2 className="mb-0">Assign tax codes</h2>
                  </Col>
                </Row>
              </div>

              <div>
                {showTaxCode && (
                  <Row className="mt-4">
                    <hr />

                    <Col md={6}>
                      <Form.Label htmlFor="tax_code">
                        Scalar tax code
                      </Form.Label>
                      <Form.Control
                        id="tax_code"
                        autoComplete="off"
                        name="tax_code"
                        type="text"
                        placeholder="type a tax code description"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.tax_code}
                      />
                    </Col>
                  </Row>
                )}
              </div>

              <br />
              <hr />

              <div className="hstack gap-2 justify-content-end">
                <Button
                  type="button"
                  className="btn btn-light"
                  onClick={handleClose}
                >
                  Close
                </Button>

                <Button
                  type="submit"
                  className="btn btn-success"
                  onClick={handleClose}
                >
                  Save
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </div>
      </Modal>
    </React.Fragment>
  );
};

export default EditProductList;
