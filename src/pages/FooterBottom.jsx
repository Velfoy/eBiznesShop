import React from "react";
import "../styles/footerBottom.css";
function FooterBottom(){
    return (
        <div className="footer_bottom">
             <div className="left_bottom_footer">
                <p>© 2025, FashionFlow</p>
                <p>All rights reserved</p>
            </div>
            <div className="center_bottom_footer">
                <div className="contact">
                    <i className="fa-solid fa-phone-volume icon"></i>
                    <div>
                        <p className="phone_number">883-589-324</p>
                        <p className="sub_text">Working 8:00 - 22:00</p>
                    </div>
                </div>
                <div className="contact">
                    <i className="fa-solid fa-phone-volume icon"></i>
                    <div>
                        <p className="phone_number">0953246066</p>
                        <p className="sub_text">24/7 Support Center</p>
                    </div>
                </div>
            </div>
            <div className="right_bottom_footer">
                <div className="row_socials">
                    <p className="follow_us">Follow Us</p>
                    <div className="social_icons">
                        <i className="fa-brands fa-facebook-f icon"></i>
                        <i className="fa-brands fa-twitter icon"></i>
                        <i className="fa-brands fa-instagram icon"></i>
                        <i className="fa-brands fa-pinterest-p icon"></i>
                    </div>
                </div>
                
                <p className="discount_text">Up to 15% discount on your first subscribe</p>
            </div>
        </div>
    );
}
export default FooterBottom;