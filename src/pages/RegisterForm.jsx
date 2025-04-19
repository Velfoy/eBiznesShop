import React from "react";

function RegisterForm() {
    return (
        <div className="form-section">
            <h2>Register</h2>
            <form className="form">
                <input
                    type="text"
                    placeholder="Enter username..."
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Enter password..."
                    className="input-field"
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm password..."
                    className="input-field"
                    required
                />
                <button type="submit" className="btn primary-btn">
                    <i className="fas fa-lock icon"></i> Register
                </button>
            </form>
            <div className="social-login">
                <button className="btn google-btn">
                    <i className="fab fa-google icon"></i> Sign in with Google
                </button>
                <button className="btn facebook-btn">
                    <i className="fab fa-facebook-f icon"></i> Sign in with Facebook
                </button>
            </div>
        </div>
    );
}

export default RegisterForm;
