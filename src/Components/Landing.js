import React from 'react'
import AppBar from "@material-ui/core/AppBar";
import LoginButton from './Loginbtn';
import bowl from "../Assets/pot3.png";
import landimg from "../Assets/pablo-1041.png";
import "../Styles/Landing.css"

function Landing() {
    return (
        <div>
            <AppBar position="static" className="mainappbar" style={{ background: "none", boxShadow: "none" }}>
                <div className='appbarhead'>
                    <img src={bowl} className="bowl" />
                    <p>PotLuck</p>
                </div>
            </AppBar>
            <div className="landing-content" style={{ display: "flex" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ width: "70%" }}>
                        <h1>Meet Foodies Over Food </h1>
                        <img src={landimg} className="landimg" />
                    </div>
                    <LoginButton />
                </div>
            </div>
        </div >
    )
}

export default Landing
