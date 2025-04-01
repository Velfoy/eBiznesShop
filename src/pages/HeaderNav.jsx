import React from "react";
import {Link,Routes, Route} from "react-router-dom";
import "../styles/header.css";
import logo from "../assets/logo.png";
import SearchBar from "./SearchBar";
import RightLinks from "./RightLinks";
function HeaderNav(){
    return (
        <div className="headerClass">
            <div className="hight_header">
                <div className="leftside_high_header">
                    <p className="need_help">Need help? Call us: +48883589324</p>
                </div>
                <div className="rightside_high_header">
                    <p className="money">
                        USD
                    </p>
                </div>
            </div>
           
            <nav className="links_header">
                <Link to="/" className="mr-4"><img src={logo} alt="logo" className="image_logo"/></Link>
                <SearchBar></SearchBar>
                <RightLinks></RightLinks>

            </nav>
        </div>
    );
}
export default HeaderNav;