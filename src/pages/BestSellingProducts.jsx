import React from "react";
import "../styles/BestSellingProducts.css";
import imageb from "../assets/shoes.png";
import arrowright from "../assets/arrow.png";

const getProducts = () => {
  return Array(8).fill({
    title: "Angie’s Boomchickapop Sweet & Salty Kettle Corn",
    price: 2499.0,
    originalPrice: 4999.0,
    image: imageb,
    rating: 5,
    link:"./products/is",
    owner:"StarKist",
  });
};

const ProductCard = ({ product }) => (
  <div className="best_card">
    <span className="best_badge">New</span>
    <button className="cart_add"><i class="fa-solid fa-cart-shopping"></i></button>
    <img src={product.image} alt={product.title} className="best_image" />
    <div className="best_card_content">
      <div className="best_card_name_div">
        <h3 className="best_card_title">{product.title}</h3>
        <a href={product.link} className="best_card_link"><img alt="button_for_info" src={arrowright}/></a>
      </div>
      <div className="best_rating_d">
        <div className="best_rating">{"★".repeat(product.rating)}</div>
        <div className="best_rating_num">({product.rating}.0)</div>
      </div>
     <div className="best_owner">By <span>{product.owner}</span></div>
    
      <div className="best_price_row">
        <span className="best_price">${product.price.toFixed(2)}</span>
        <span className="best_original_price">${product.originalPrice.toFixed(2)}</span>
      </div>
    </div>
  </div>
);

const BestSellingProducts = () => {
  const products = getProducts();
  const tabs = ['All', 'Shoes', 'Accessories', 'T-shirts', 'Pants', 'Skirts', 'Hats'];

  return (
    <div className="best_container">
        <div className="best_headerr">
            <h2 className="best_title">Best selling products</h2>
            <div className="best_tabs">
                {tabs.map((tab) => (
                <button className="best_tab_button" key={tab}>{tab}</button>
                ))}
            </div>
        </div>
        <div className="best_grid">
            {products.map((product, idx) => (
            <ProductCard key={idx} product={product} />
            ))}
        </div>
      
    </div>
  );
};

export default BestSellingProducts;
