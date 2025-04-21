import React,{useState} from "react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "../styles/loginRegister.css";
import login_image from "../assets/login_image.png";
import register_image from "../assets/register_image.png";
function LoginRegister() {
    const [isLogin,setIsLogin]=useState(true);
    function setStatus(){
        setIsLogin(prev => !prev);
    }
    return (
        <div className="login-register login-register-container">
            {isLogin?<LoginForm/>:<RegisterForm/>}
            <button onClick={setStatus} className="toggle-button">
                <div className="divInsideButton">
                    <img
                        src={isLogin ? login_image : register_image}
                        alt="Toggle icon"
                        className="button-image"
                    />
                    {isLogin ? <p className="text_register">Need an account? Register</p> : <p className="text_register">Have an account? Login</p>} 
                </div>
                
            </button>
        </div>

    );
}

export default LoginRegister;
