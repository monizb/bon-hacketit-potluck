import React from 'react'
import AppBar from "@material-ui/core/AppBar";
import LoginButton from './Loginbtn';
import bowl from "../Assets/pot3.png";
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
            <div className="landing-content">
                <h1>Meet Foodies Over Food </h1>
                <LoginButton />
            </div>
        </div>
    )
}

export default Landing
