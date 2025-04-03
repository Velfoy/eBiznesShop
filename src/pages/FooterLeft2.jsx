import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import "../styles/footerLeft2.css";

function FooterLeft2() {
    return (
        <div className="footer_left_2">
            <h3 className="footer_heading">Important</h3>
            <ul className="footer_links">
                <li><Link to="/about-us">About Us</Link></li>
                <li><Link to="/delivery-info">Delivery Information</Link></li>
                <li><Link to="/privacy-policy">Privacy Policy</Link></li>
                <li><Link to="/terms-conditions">Terms & Conditions</Link></li>
                <li><Link to="/contact-us">Contact Us</Link></li>
                <li><Link to="/support-center">Support Center</Link></li>
                <li><Link to="/careers">Careers</Link></li>
            </ul>
        </div>
    );
}
export default FooterLeft2;