import React from "react";
import FooterLeft from "./FooterLeft";
import "../styles/footer.css";
import FooterLeft2 from "./FooterLeft2";
import FooterCenter from "./FooterCenter";
import FooterRight from "./FooterRight";
import FooterBottom from "./FooterBottom";
function Footer(){
    return (
        <div className="footer_all">
            <div className="footer_main">
                <FooterLeft></FooterLeft>
                <FooterLeft2></FooterLeft2>
                <FooterCenter></FooterCenter>
                <FooterRight></FooterRight>
            </div>
            <FooterBottom></FooterBottom>
        </div>
        

    );
}
export default Footer;