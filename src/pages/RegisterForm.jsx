import React, { useState } from "react";
import googleLogo from "../assets/googleLogo.png";
import facebookLogo from "../assets/facebookLogo.png";

function RegisterForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    return (
        <div className="form-section">
            <h2>Register</h2>
            <form className="form">
                <div className="input-wrapper">
                    <label>Username</label>
                    <input type="text" placeholder="Enter username..." className="input-field" required />
                </div>

                <div className="input-wrapper">
                    <label>Password</label>
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password..."
                        className="input-field"
                        required
                    />
                    <span
                        className="toggle-visibility"
                        onClick={() => setShowPassword(prev => !prev)}
                    >
                        {showPassword?<i class="fa-regular fa-eye"></i>:<i class="fa-regular fa-eye-slash"></i>}
                    </span>
                </div>

                <div className="input-wrapper">
                    <label>Confirm password</label>
                    <input
                        type={showConfirm ? "text" : "password"}
                        placeholder="Enter password..."
                        className="input-field"
                        required
                    />
                    <span
                        className="toggle-visibility"
                        onClick={() => setShowConfirm(prev => !prev)}
                    >
                        {showConfirm?<i class="fa-regular fa-eye"></i>:<i class="fa-regular fa-eye-slash"></i>}
                    </span>
                </div>

                <button type="submit" className="btn primary-btn">
                    <i className="fas fa-lock icon"></i>
                    <span className="btn-label">Register</span>
                </button>
            </form>

            <div className="social-login">
                <button className="btn google-btn">
                    <img src={googleLogo} alt="google-icon"></img>
                    <span className="btn-label-google">Sign in with Google</span>
                </button>
                <button className="btn facebook-btn">
                    <img src={facebookLogo} alt="google-icon"></img>
                    <span className="btn-label-facebook">Sign in with Facebook</span>
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;
