import React from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../styles/loginRegister.css";

function LoginRegister() {
    return (
        <div className="login-register login-register-container">
            <LoginForm />
            <RegisterForm />
        </div>

    );
}

export default LoginRegister;
