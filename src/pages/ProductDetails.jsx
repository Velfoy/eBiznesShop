import { useParams } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";
import "../styles/productDetails.css";

const ProductDetail = () => {
  const { id } = useParams();

  const images = [
    "/assets/clock_big.jpeg",
    "/assets/clock1.jpeg",
    "/assets/clock2.jpg",
    "/assets/clock3.jpeg",
    "/assets/clock4.jpg",
  ];

  const [selectedSize, setSelectedSize] = useState("S");
  const [quantity, setQuantity] = useState(1);
  const [popupOpen, setPopupOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleSizeClick = (size) => {
    setSelectedSize(size);
  };

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const openPopup = (index) => {
    setCurrentImageIndex(index);
    setPopupOpen(true);
  };

  const closePopup = () => {
    setPopupOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="details_all">
      <div className="top_details">
        <div className="details_images">
        <div className="left_images_details">
            {images.slice(1).map((src, index) => (
              <div className="image_standard" key={index} onClick={() => openPopup(index + 1)}>
                <img src={src} alt={`Clock ${index + 1}`} />
              </div>
            ))}
          </div>
          <div className="right_big_image" onClick={() => openPopup(0)}>
            <img src="/assets/clock_big.jpeg" />
          </div>
        </div>

        <div className="cart_details">
          <div className="cart_info">
            <div className="cart_rating">
              <p className="rating_star">⭐ 4.9 - </p>
              <p className="amount_of_views">149 views</p>
            </div>
            <div className="cart_prising">
              <p className="current_price">$2499.00</p>
              <p className="first_price">$4999.00</p>
            </div>
          </div>

          <p className="size_chosen">Size: {selectedSize}</p>

          <div className="size_div_choose">
            {["S", "M", "L", "XL", "2XL"].map((size) => (
              <div
                key={size}
                className={`size ${selectedSize === size ? "active" : ""}`}
                onClick={() => handleSizeClick(size)}
              >
                {size}
              </div>
            ))}
          </div>

          <div className="add_tocart">
            <div className="amount_to_add">
              <div className="amount_minus" onClick={decreaseQuantity}>-</div>
              <div className="amount_number">{quantity}</div>
              <div className="amount_plus" onClick={increaseQuantity}>+</div>
            </div>
            <button className="add_to_cart_button">
              <i className="fa-brands fa-opencart"></i> Add to cart
            </button>
          </div>

          <div className="price_all">
            <div className="price_item">
              <p className="left">$2499.00</p>
              <p className="right">${(2499 * quantity).toFixed(2)}</p>
            </div>
            <div className="price_tax">
              <p className="left">Tax estimate</p>
              <p className="right">$0.00</p>
            </div>
            <div className="price_total">
              <p className="left">Total</p>
              <p className="right">${(2499 * quantity).toFixed(2)}</p>
            </div>
          </div>
        </div>

        {popupOpen && (
        <div className="image_popup_overlay" onClick={closePopup}>
          <button className="popup_close" onClick={(e) => { e.stopPropagation(); closePopup(); }}>×</button>
          <button className="popup_arrow left" onClick={(e) => { e.stopPropagation(); prevImage(); }}>❮</button>

          <div className="image_popup" onClick={(e) => e.stopPropagation()}>
            <img src={images[currentImageIndex]} alt="Popup" />
          </div>

          <button className="popup_arrow right" onClick={(e) => { e.stopPropagation(); nextImage(); }}>❯</button>
          <div className="popup_counter">{currentImageIndex + 1} / {images.length}</div>
        </div>
      )}
      </div>
      <SecondDetails/>
      <CommentsSection/>
    </div>
    
  );
};
const CommentsSection = () => {
  const [comment, setComment] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = useRef([]);

  const reviews = Array(11).fill({
    name: "Valeriia Zlydar",
    rating: 5,
    text: "Lorem ipsum lorem ipsum lorem ipsum...Lorem ipsum lorem ipsum lorem ipsum.Lorem ipsum lorem ipsum lorem ipsum.Lorem ipsum lorem ipsum lorem ipsum.Lorem ipsum lorem ipsum lorem ipsum.Lorem ipsum lorem ipsum lorem ipsum.Lorem ipsum lorem ipsum lorem ipsum.Lorem ipsum lorem ipsum lorem ipsum.",
    date: "24 marca 2025"
  });

  const toggleDropdown = (index) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        openDropdown !== null &&
        dropdownRefs.current[openDropdown] &&
        !dropdownRefs.current[openDropdown].contains(event.target)
      ) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openDropdown]);

  return (
    <div className="comments_section">
      <div className="comments_header1">
        <div className="comments1">
          <h2>Customer reviews</h2>
          <p>★★★★★ <span>{reviews.length} reviews</span></p>
        </div>
        <button className="add_comment_1">Add comment</button>
    
      </div>
     

      <textarea
        placeholder="Comment"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="comment_input"
      />

      <h3>{reviews.length} reviews</h3>
      {reviews.map((review, i) => (
        <div className="comment_item" key={i}>
          <div className="comment_avatar">
            <img src="/assets/user_avatar.jpeg" alt="User" />
          </div>
          <div className="comment_content">
            <div className="comment_header">
              <strong>{review.name}</strong>
              <span className="stars">★★★★★</span>
              <div
                className="comment_actions"
                ref={(el) => (dropdownRefs.current[i] = el)}
              >
                <i
                  className="fa-solid fa-ellipsis-vertical burger_icon"
                  onClick={() => toggleDropdown(i)}
                ></i>
                {openDropdown === i && (
                  <div className="dropdown_menu">
                    <button>Edit</button>
                    <button>Delete</button>
                  </div>
                )}
              </div>
            </div>
            <p>{review.text}</p>
            <div className="comment_footer">{review.date}</div>
          </div>
        </div>
      ))}

      <button className="load_more_btn">Więcej</button>
    </div>
  );
};
const SecondDetails = () => {
  return (
    <div className="second_details">
      <h1 className="product_title">Black watch Omega yg87JF</h1>
      <p className="product_description">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet finibus...Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet finibusLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet finibusLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet finibusLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet finibusLorem ipsum dolor sit amet, consectetur adipiscing elit. Ut imperdiet finibus
      </p>

      <h3>Details</h3>
      <ul className="product_meta">
        <li><strong>Color:</strong> black</li>
        <li><strong>Material:</strong> leather</li>
        <li><strong>Condition:</strong> max</li>
      </ul>

      <h3>Keywords</h3>
      <div className="product_tags">
        <span className="tag">🧢 men’s fashion</span>
        <span className="tag">❄ winter hat</span>
        <span className="tag">🎨 colorful accessory</span>
        <span className="tag">🔥 warm headwear</span>
      </div>
    </div>
  );
};

export default ProductDetail;
