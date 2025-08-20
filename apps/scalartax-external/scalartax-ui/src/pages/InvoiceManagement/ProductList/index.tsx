import React from 'react';
import BreadCrumb from '../../../Common/BreadCrumb';
import { Container } from 'react-bootstrap';
import ProductlistTable from './ProductlistTable';

const ProductList = () => {
  document.title = 'Product List | Dashboard';
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadCrumb pageTitle="Product" title="Products" />
          <ProductlistTable />
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ProductList;
