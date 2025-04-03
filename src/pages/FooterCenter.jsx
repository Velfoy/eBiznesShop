import React from "react";
import "../styles/footerCenter.css";
import map from "../assets/map.png";
function FooterCenter(){
    return (
        <div className="footer_center">
            <img className="footer_map" src={map} alt="map"/>
        </div>
    );
}
export default FooterCenter;