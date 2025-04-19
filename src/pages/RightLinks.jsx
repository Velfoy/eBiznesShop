import { Link } from "react-router-dom";
import "../styles/rightLinks.css";

const RightLinks = ({ cartCount }) => {
  return (
    <div className="right_links">
        <Link to="/cart" className="cart-container">
            <i className="fas fa-shopping-cart cart-icon"></i>
            <span className="cart-badge">2</span> {/* Update dynamically */}
            <span className="ml-2 cart_name">Cart</span>
        </Link>
        <Link to="/loginregister" className="login-container">
            <i className="fa-regular fa-user login-icon"></i>
            <span className="ml-2 login_name">Login</span>
        </Link>
    </div>

  );
};

export default RightLinks;
