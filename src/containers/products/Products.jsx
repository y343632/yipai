import React from 'react';
import './Products.css';
import { Link } from 'react-router-dom';
const Products = () => {
  return (
  <>
  <div className="yipai__navbar-menu_container-links">
  <div id="Products">Products</div>
  <div>
  <button>
  <Link to="../products/productsDetail/ProductsDetail">123</Link>
  </button>
  </div>
  </div>
  </>

    );
};

export default Products;
