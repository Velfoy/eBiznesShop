import React from "react";
import "../styles/BestSellingProducts.css";
import { ShoppingCart } from "lucide-react";

const getProducts = () => {
  return Array(8).fill({
    title: "Angie’s Boomchickapop Sweet & Salty Kettle Corn",
    price: 2499.0,
    originalPrice: 4999.0,
    image: "/shoes.png",
    rating: 5,
  });
};

const ProductCard = ({ product }) => (
  <div className="best_card">
    <span className="best_badge">New</span>
    <img src={product.image} alt={product.title} className="best_image" />
    <div className="best_card_content">
      <h3 className="best_card_title">{product.title}</h3>
      <div className="best_price_row">
        <span className="best_price">${product.price.toFixed(2)}</span>
        <span className="best_original_price">${product.originalPrice.toFixed(2)}</span>
      </div>
      <div className="best_rating">{"★".repeat(product.rating)}</div>
      <button className="best_add_button">
        <ShoppingCart style={{ height: 16, width: 16, marginRight: 8 }} />
        Add to Cart
      </button>
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
