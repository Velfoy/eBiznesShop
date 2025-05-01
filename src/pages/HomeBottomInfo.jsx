import React from "react";
import "../styles/HomeBottomInfo.css";

const features = [
  {
    icon: "1.png", 
    title: "Best prices & offers",
    subtitle: "Orders $50 or more",
  },
  {
    icon: "2.png",
    title: "Free delivery",
    subtitle: "24/7 services",
  },
  {
    icon: "3.png",
    title: "Great daily deal",
    subtitle: "When you sign up",
  },
  {
    icon: "4.png",
    title: "Wide assortment",
    subtitle: "Mega Discounts",
  },
  {
    icon: "5.png",
    title: "Easy returns",
    subtitle: "Within 30 days",
  },
];

const HomeBottomInfo = () => {
  return (
    <div className="hero_container">
      <div className="hero_banner">
        <div className="hero_content">
          <h1>Stay home & update your style from our shop</h1>
          <p>Start Your Daily Shopping with <span className="highlight">FashionFlow</span></p>
          <div className="hero_input_group">
            <input type="email" placeholder="✉ Your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </div>

      <div className="features_row">
        {features.map((item, idx) => (
          <div className="feature_card" key={idx}>
            <div className="feature_icon"><img src={`../../assets/${item.icon}`} alt="icon"></img></div>
            <div className="feature_texts">
              <strong>{item.title}</strong>
              <p>{item.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeBottomInfo;
