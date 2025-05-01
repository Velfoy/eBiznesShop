import React from "react";
import { Link } from "react-router-dom";
import arrowright from "../assets/arrow.png";
import "../styles/RecommendedProducts.css";

const products = [
  {
    id: 1,
    image: "/assets/product.jpeg", 
    name: "Angie’s Boomchickapop Sweet & Salty Kettle Corn",
    brand: "Starkist",
    price: 2499,
    oldPrice: 4999,
    rating: 5.0,
    isNew: true,
  },
  {
    id: 2,
    image: "/assets/product.jpeg", 
    name: "Angie’s Boomchickapop Sweet & Salty Kettle Corn",
    brand: "Starkist",
    price: 2499,
    oldPrice: 4999,
    rating: 5.0,
    isNew: true,
  },
  {
    id: 3,
    image: "/assets/product.jpeg",
    name: "Angie’s Boomchickapop Sweet & Salty Kettle Corn",
    brand: "Starkist",
    price: 2499,
    oldPrice: 4999,
    rating: 5.0,
    isNew: true,
  },
  {
    id: 4,
    image: "/assets/product.jpeg", 
    name: "Angie’s Boomchickapop Sweet & Salty Kettle Corn",
    brand: "Starkist",
    price: 2499,
    oldPrice: 4999,
    rating: 5.0,
    isNew: true,
  },
];

const RecommendedProducts = () => {
  return (
    <div className="recommended_container">
      <div className="recommended_header">
        <h2>Recommended products</h2>
        <a href="/" className="all_deals">All Details →</a>
      </div>
      <div className="recommended_grid">
        {products.map((product) => (
          <div className="product_card" key={product.id}>
            <div className="image_section">
              {product.isNew && <span className="badge">New</span>}
              <img src={product.image} alt={product.name} />
              <button className="cart_btn">
                <i className="fa-solid fa-cart-shopping"></i>
              </button>
            </div>
            <div className="product_info">
                <div className="best_naming">
                    <h3>{product.name}</h3>
                    <Link to={`/product/${product.id}`} className="best_card_link">
                        <img alt="button_for_info" src={arrowright} />
                    </Link>
                </div>
              <p className="brand">By {product.brand}</p>
              <div className="rating">★★★★★ <span>({product.rating})</span></div>
              <div className="price">
                ${product.price.toFixed(2)}{" "}
                <span className="old_price">${product.oldPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedProducts;
