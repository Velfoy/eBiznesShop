import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/heroSlider.css";
import baner1 from "../assets/baner1.jpg";

const slides = [
  {
    title: "Explore the New Collection",
    subtitle: "Trendy styles just arrived for you",
    image: baner1,
    placeholder: "Enter your email",
    buttonText: "Join Now"
  },
  {
    title: "Fast Fashion Big discount",
    subtitle: "Save up to 50% off on your first order",
    image: baner1,
    placeholder: "Get offers in your inbox",
    buttonText: "Get Offers"
  },
  {
    title: "Stay Ahead of Fashion",
    subtitle: "Be the first to know about new drops",
    image: baner1,
    placeholder: "Subscribe to updates",
    buttonText: "Subscribe"
  }
];

export default function HeroSlider() {
  return (
    <div className="hero-slider">
      <Swiper
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        loop
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="slide"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              <div className="slide-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
                <div className="email-input">
                  <input type="email" placeholder={slide.placeholder} />
                  <button>{slide.buttonText}</button>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
