import React, { useState } from 'react'
import AppBar from "@material-ui/core/AppBar";
import bowl from "../Assets/pot3.png";
import TextField from '@material-ui/core/TextField';
import MapPicker from 'react-google-map-picker'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TimeRangePicker from '@wojtekmaj/react-timerange-picker';
import Checkbox from '@material-ui/core/Checkbox';
import { v4 as uuidv4 } from 'uuid';
import { useAuth0 } from "@auth0/auth0-react";
import { getDatabase, ref, set } from "firebase/database";

function New() {
    const DefaultLocation = { lat: 10, lng: 106 };
    const DefaultZoom = 100;
    const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);
    const [startDate, setStartDate] = useState(new Date());
    const [zoom, setZoom] = useState(DefaultZoom);
    const [value, onChange] = useState(['10:00', '11:00']);
    const { user } = useAuth0();
    console.log(user)

    const [location, setLocation] = useState(defaultLocation);

    const [pot, setPot] = useState({
        name: "",
        description: "",
        veg: true,
        assign: true,
        phone: "",

    });

    function handleChangeLocation(lat, lng) {
        setLocation({ lat: lat, lng: lng });
    }

    function handleChangeZoom(newZoom) {
        setZoom(newZoom);
    }

    function handleResetLocation() {
        setDefaultLocation({ ...DefaultLocation });
        setZoom(DefaultZoom);
    }


    function createEvent() {
        const db = getDatabase();
        let uuid = uuidv4();
        let recipe = ""
        let api = "https://api.edamam.com/api/recipes/v2?app_id=5d1711e6&app_key=450d6e433c71d7418e4a058cf0816e95&cuisineType=Indian&random=true&type=public"
        if (pot.veg) { api += "&health=vegetarian" }
        if (pot.assign) {
            fetch(api).then(res => res.json()).then(data => {
                recipe = data.hits[0].recipe.uri.split("#")[1]
                set(ref(db, "/pots/" + uuid), {
                    email: user.email,
                    id: uuid,
                    uid: user.sub,
                    name: pot.name,
                    description: pot.description,
                    location: location,
                    veg: pot.veg,
                    assign: pot.assign,
                    time: value,
                    date: startDate.toDateString(),
                    picture: user.picture,
                    phone: pot.phone,
                    attendees: [
                        {
                            uid: user.sub,
                            email: user.email,
                            name: user.name,
                            picture: user.picture,
                            recipe_id: recipe,
                            recipe_name: data.hits[0].recipe.label,
                            recipe_image: data.hits[0].recipe.image,
                            recipe_url: data.hits[0].recipe.shareAs,
                        }
                    ]
                }).then(() => {
                    window.location.href = "/pots/" + uuid;
                }
                )
            })
        } else {
            set(ref(db, "/pots/" + uuid), {
                email: user.email,
                id: uuid,
                uid: user.sub,
                name: pot.name,
                description: pot.description,
                location: location,
                veg: pot.veg,
                assign: pot.assign,
                time: value,
                date: startDate,
                picture: user.picture,
                phone: pot.phone,
                attendees: [
                    {
                        uid: user.sub,
                        email: user.email,
                        name: user.name,
                        picture: user.picture
                    }
                ]
            }).then(() => {
                console.log("Created pot")
            }
            )
        }

    }


    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0

    };

    function success(pos) {
        var crd = pos.coords;
        setDefaultLocation({ lat: crd.latitude, lng: crd.longitude });
    }

    function error(err) {
        console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation.getCurrentPosition(success, error, options);


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
            <div style={{
                borderTop: "10px solid #669FBD",
                boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                margin: "50px 130px",
                padding: "30px",
                borderRadius: "3px",
            }}>
                <p style={{ fontWeight: "bolder", fontSize: 20 }}>New PotLuck</p>
                <p>Enter the following details to create a new Pot Luck</p>
                <div style={{ marginTop: 40 }}>
                    <TextField id="outlined-basic" variant="outlined" placeholder="PotLuck Name" style={{ width: 500 }} onChange={(e) => setPot({ ...pot, name: e.target.value })} value={pot.name} style={{ width: "80%" }} />
                    <TextField id="outlined-basic" multiline rows={4} variant="outlined" placeholder="Add a small description" style={{ width: 500 }} onChange={(e) => setPot({ ...pot, description: e.target.value })} value={pot.description} style={{ width: "80%", marginTop: 30 }} />

                    <p style={{ marginTop: 50, marginBottom: 20 }}>Date For The PotLuck</p>
                    <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} style={{ padding: 40 }} customInput={<TextField value={startDate} variant="outlined" style={{ width: "30%" }} placeholder="Enter A Start Date" />} minDate={new Date()} />

                    <p style={{ marginTop: 50, marginBottom: 20 }}>How long does this PotLuck run for?</p>
                    <TimeRangePicker
                        onChange={onChange}
                        value={value}

                    />

                    <p style={{ marginTop: 40, marginBottom: 40 }}>Where is the party happening? Enter a location which is easily accesible to all your attendees</p>
                    <MapPicker
                        mapTypeId="roadmap"
                        style={{ height: '700px' }}
                        apiKey='AIzaSyDD3fZZpHM8szWgTaOTZYDYGBOwjSF1IWk'
                        defaultLocation={defaultLocation}
                        onChangeLocation={handleChangeLocation}
                        onChangeZoom={handleChangeZoom}
                    />
                    <p style={{ marginTop: 50, marginBottom: 20 }}>Your Phone Number</p>
                    <TextField id="outlined-basic" variant="outlined" placeholder="Phone Number" style={{ width: 500 }} onChange={(e) => setPot({ ...pot, phone: e.target.value })} value={pot.phone} style={{ width: "80%" }} />
                    <div style={{ marginTop: 40 }}>
                        <p style={{ marginTop: 50, marginBottom: 20 }}>Other Options:</p>
                        <div style={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                            <Checkbox
                                defaultChecked
                                color="redd"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                onChange={(e) => setPot({ ...pot, assign: !pot.assign })}
                                checked={pot.assign}

                            />
                            <p>Automatically assign dishes to every attendee</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                            <Checkbox
                                defaultChecked
                                color="redd"
                                inputProps={{ 'aria-label': 'secondary checkbox' }}
                                onChange={(e) => setPot({ ...pot, veg: !pot.veg })}
                                checked={pot.veg}

                            />
                            <p>Allow/Assign only Vegetarian Dishes</p>
                        </div>
                        <button className='profilebutton' style={{ marginTop: 40 }} onClick={() => createEvent()}>Create PotLuck!</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default New
