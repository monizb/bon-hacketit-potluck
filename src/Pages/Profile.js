import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import bowl from "../Assets/pot3.png";
import AppBar from "@material-ui/core/AppBar";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    console.log(user);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        <div>
            <AppBar position="static" className="mainappbar" style={{ background: "none", boxShadow: "none", display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div className='appbarhead'>
                        <img src={bowl} className="bowl" />
                        <p>PotLuck</p>
                    </div>
                    <div>
                        <button className='profilebutton' onClick={() => window.location.href = "/profile"}>Profile</button>
                    </div>
                </div>
            </AppBar>
            {isAuthenticated ? <div style={{ padding: 50, widht: "100%", textAlign: "center" }}>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div> : <div>
                <h1>You are not logged in</h1>
            </div>}
        </div>

    );
};

export default Profile;