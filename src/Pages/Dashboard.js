import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue } from "firebase/database";
import AppBar from "@material-ui/core/AppBar";
import bowl from "../Assets/pot3.png";
import { useAuth0 } from "@auth0/auth0-react";
import "../Styles/Dashboard.css"

function Dashboard() {
    const [pots, setPots] = useState([]);
    const db = getDatabase();
    const { user } = useAuth0();
    console.log(user)
    useEffect(() => {
        const potcount = ref(db, '/pots');

        onValue(potcount, (snapshot) => {
            console.log(snapshot.val())
            const data = snapshot.val();
            setPots(data);
        });

    }, []);

    function nav(id) {
        window.location.href = `/pots/${id}`
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
                        <button className='profilebutton'>Profile</button>
                    </div>
                </div>
            </AppBar>
            <div style={{ margin: 50, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3>Currently Running Pot Lucks</h3>

                <div>
                    <button className='profilebutton' style={{ marginRight: 20 }}>My PotLucks</button>
                    <button className='profilebutton' style={{ backgroundColor: "#3AB37D" }} onClick={() => window.location.href = "/new"}>Host A Pot Luck!</button>
                </div>
            </div>
            <div style={{ marginTop: "20px" }}>
                {Object.values(pots).map((pot) => {
                    return (
                        <div className="pot" style={{
                            borderTop: "10px solid #669FBD",
                            boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                            margin: "50px 130px",
                            padding: "30px",
                            borderRadius: "3px",
                        }}>
                            <h2>{pot.name}</h2>
                            <p>{pot.description}</p>
                            <p>{pot.date}</p>
                            <p>{pot.time.join("-")}</p>
                            <button className='profilebutton' style={{ backgroundColor: "#3AB37D" }} onClick={() => nav(pot.id)}>Register</button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Dashboard
