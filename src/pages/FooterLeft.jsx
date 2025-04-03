import React from "react";
import "../styles/footerLeft.css";
import logo from "../assets/logo.png"
function FooterLeft(){
    return (
        <div className="footer_left">
            <img className="footer_logo" src={logo} alt="logo"/>
            <p className="footer_text">Awesome online shop for your style update</p>
            <div className="info_container">
                <div className="address_container">
                    <i class="fa-solid fa-location-dot"></i>
                    <p className="address_text">Address: ul.Stritenska 74, Kherson</p>
                </div>
                <p className="address_text_2">or ul.Aleje Politechniki 7, Łódź</p>

                <div className="call_container">
                    <i class="fa-solid fa-headphones-simple"></i>
                    <p className="call_text">Call Us: +(380)95 324 6066</p>
                </div>

                <div className="email_container">
                    <i class="fa-solid fa-paper-plane"></i>
                    <p className="email_text">Email: marsonyteam@gmail.com</p>
                </div>

                <div className="hours_container">
                    <i class="fa-solid fa-clock"></i>
                    <p className="hours_text">Hours: 10:00 - 18:00, Mon - Sat</p>
                </div>
            </div>
            

        </div>
    );
}
export default FooterLeft;