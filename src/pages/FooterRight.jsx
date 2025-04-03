import React from "react";
import "../styles/footerRight.css";
import visa from "../assets/visa.png";
import mastercard from "../assets/mastercard.png";
import blik from "../assets/blik.png";
import mbank from "../assets/mbank.png";
function FooterRight(){
    return (
        <div className="footer_right">
            <h3 className="footer_heading">Payment</h3>
            <p className="footer_text_right">Secured Payment Gateways</p>
            <div className="payments_logos">
                <img src={visa} alt="visa_logo"/>
                <img src={mastercard} alt="mastercard_logo"/>
                <img src={blik} alt="blik_logo"/>
                <img src={mbank} alt="mbank_logo"/>
            </div>
        </div>
    )
}
export default FooterRight;