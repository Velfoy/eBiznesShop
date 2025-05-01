import React from "react";
import "../styles/FeaturedCategories.css";

const categories = [
  { name: "Jeans", items: 26, image: "/assets/jeans.png" },
  { name: "Shorts", items: 23, image: "/assets/shorts.png" },
  { name: "T-shirts", items: 54, image: "/assets/tshirts.png" },
  { name: "Suits", items: 51, image: "/assets/suits.png" },
  { name: "Leggings", items: 56, image: "/assets/leggings.png" },
  { name: "Cardigans", items: 72, image: "/assets/cardigans.png" },
  { name: "Sneakers", items: 36, image: "/assets/sneakers.png" },
  { name: "Sandals", items: 123, image: "/assets/sandals.png" },
  { name: "Jackets", items: 34, image: "/assets/jackets.png" },
  { name: "Accessories", items: 89, image: "/assets/accessories.png" },
];

const FeaturedCategories = () => {
  return (
    <div className="featured_container">
      <div className="featured_header">
        <h2>Featured Categories</h2>
        <div className="featured_tabs">
          <button className="active">Hats</button>
          <button>Shoes</button>
          <button>T-shirts</button>
          <button>Pants</button>
        </div>
      </div>
      <div className="featured_scroll">
        {categories.map((cat, index) => (
          <div className="featured_card" key={index}>
            <img src={cat.image} alt={cat.name} />
            <h4>{cat.name}</h4>
            <p>{cat.items} Items</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedCategories;
