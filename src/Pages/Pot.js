import React, { useEffect, useState } from 'react'
import bowl from "../Assets/pot3.png";
import AppBar from "@material-ui/core/AppBar";
import { getDatabase, ref, set, onValue, remove, update, push } from "firebase/database";
import Alert from '@material-ui/lab/Alert';
import { useAuth0 } from "@auth0/auth0-react";
import MapPicker from 'react-google-map-picker'
import Snackbar from '@material-ui/core/Snackbar';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';

function Pot() {
    const [pot, setPot] = useState({});
    const [recipe, setRecipe] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [open2, setOpen2] = useState(false);
    const [register, setRegister] = useState({
        name: "",
        email: "",
        phone: "",
        recipe_id: "",
    });
    const { user } = useAuth0();
    useEffect(() => {
        //get pot id from url

        const potId = window.location.pathname.split('/')[2];
        const db = getDatabase();
        const potRef = ref(db, `pots/${potId}`);
        onValue(potRef, (snapshot) => {
            if (snapshot.val()) {
                setPot(snapshot.val());
                //check if user object is initialized
                //wait for user object to be initialized and then get recipe
                if (user) {
                    if (snapshot.val().assign) {

                    }
                }


            }
            else {
                setPot({});
                setError(true);
            }
            setLoading(false);
        });

    }, []);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };


    function deletePot() {
        const db = getDatabase();
        const potRef = ref(db, `pots/${pot.id}`);
        remove(potRef);
        window.location.href = '/dashboard';
    }


    function registerForPot() {
        //add user to pot
        const db = getDatabase();
        const potRef = ref(db, `pots/${pot.id}/attendees`);
        let api = "https://api.edamam.com/api/recipes/v2?app_id=5d1711e6&app_key=450d6e433c71d7418e4a058cf0816e95&cuisineType=Indian&random=true&type=public"
        if (pot.veg) { api += "&health=vegetarian" }
        if (pot.assign) {
            fetch(api).then(res => res.json()).then(data => {
                let recipe = data.hits[0].recipe.uri.split("#")[1]
                push(potRef, {
                    email: register.email,
                    name: register.name,
                    phone: register.phone,
                    recipe: JSON.stringify(data.hits[0].recipe),
                    recipe_id: recipe,
                    recipe_name: data.hits[0].recipe.label,
                    recipe_image: data.hits[0].recipe.image,
                    recipe_url: data.hits[0].recipe.shareAs,
                }).then(() => {
                    setOpen2(true);
                    setOpen(false);
                }
                )
            })
        } else {
            push(potRef, register).then(() => {
                setOpen2(true);
                setOpen(false);
            }
            )
        }
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
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" >
                    Register For This Potluck</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Fill out the below fields to register for this potluck.
                    </DialogContentText>
                    <TextField value={register.name} onChange={event => setRegister({ ...register, name: event.target.value })} variant="outlined" style={{ width: "100%", marginTop: 15 }} placeholder="Your Full Name" />
                    <TextField value={register.email} onChange={event => setRegister({ ...register, email: event.target.value })} variant="outlined" style={{ width: "100%", marginTop: 15 }} placeholder="Your Email Address" />
                    <TextField value={register.phone} onChange={event => setRegister({ ...register, phone: event.target.value })} variant="outlined" style={{ width: "100%", marginTop: 15 }} placeholder="Your Phone Number" />
                </DialogContent>
                <DialogActions>
                    <button className='profilebutton' onClick={() => registerForPot()} >
                        Register
                    </button>
                </DialogActions>
            </Dialog>
            <Snackbar open={open2} autoHideDuration={3000} onClose={() => setOpen2(false)}>
                <Alert severity="success" onClose={() => setOpen2(false)}>
                    You have successfully registered for this potluck!
                </Alert>
            </Snackbar>
            <div style={{
                borderTop: "10px solid #669FBD",
                boxShadow: "rgba(0, 0, 0, 0.09) 0px 3px 12px",
                margin: "50px 130px",
                padding: "30px",
                borderRadius: "3px",
            }}>
                {loading ? <p>Loading...</p> : null}
                {!loading && error ? <p>Error: This Pot doesn't exist</p> : !loading && !error ? <div>
                    {user !== undefined && pot.uid === user.sub ? <Alert severity="warning">
                        You are the host of this pot!
                    </Alert> : null}
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <h2>{pot.name}</h2>
                        {pot.veg ? <p style={{ backgroundColor: "#c6ecc6", color: "#107D0F", padding: 5, height: "fit-content", borderRadius: 3, marginLeft: 10 }}>Vegetarian</p> : <p style={{ backgroundColor: "#fbe2d0", color: "#EE8E4A", padding: 5, height: "fit-content", borderRadius: 3, marginLeft: 10 }}>Veg/Non-Veg</p>}
                    </div>
                    <p>{pot.description}</p>
                    <h4 style={{ backgroundColor: "#edf4f7", color: "#669FBD", padding: 5, height: "fit-content", borderRadius: 3, width: "fit-content" }}>{"Timings: " + pot.time[0] + " to " + pot.time[1]}</h4>
                    <h4 style={{ backgroundColor: "#edf4f7", color: "#669FBD", padding: 5, height: "fit-content", borderRadius: 3, width: "fit-content" }}>{"Date: " + pot.date}</h4>
                    <h4 style={{ backgroundColor: "#edf4f7", color: "#669FBD", padding: 5, height: "fit-content", borderRadius: 3, width: "fit-content" }}>{Object.values(pot.attendees).length + " people attending"}</h4>

                    <h3 style={{ marginTop: 40 }}>{"Location"}</h3>
                    <MapPicker
                        mapTypeId="roadmap"
                        style={{ height: '400px' }}
                        apiKey='AIzaSyDD3fZZpHM8szWgTaOTZYDYGBOwjSF1IWk'
                        defaultLocation={{ lat: pot.location.lat, lng: pot.location.lng }}
                    />

                    {/* {pot.assign ? <div>
                        <h3 style={{ marginTop: 40 }}>{"Dish Assigned To You"}</h3>
                        {pot.attendees.map((attendee) => {
                            return (
                                <h1>{JSON.parse(attendee.recipe.label)}</h1>
                            )
                        })}
                    </div> : null} */}



                    <h3 style={{ marginTop: 40 }}>{"Attendees And Assigned Dishes"}</h3>
                    {Object.values(pot.attendees).map((attendee) => {
                        return (
                            <div style={{ display: "flex", alignItems: "center", marginTop: 20 }}>

                                <div style={{ marginLeft: 10 }}>
                                    <h4>{attendee.name}</h4>
                                    <p>{attendee.recipe_name}</p>
                                    <img src={attendee.recipe_image} />
                                    <p>{"Recipe Link: "}<a href={attendee.recipe_url}>{attendee.recipe_url}</a></p>
                                </div>
                            </div>
                        )
                    })}


                    {
                        user !== undefined && pot.uid === user.sub ? <button className='profilebutton' style={{ marginTop: 30 }} onClick={() => deletePot()}>Delete This Pot</button> : <button className='profilebutton' style={{ marginTop: 30 }} onClick={handleClickOpen}>Register For This Pot Luck</button>
                    }



                </div> : null}

            </div>
        </div>
    )
}

export default Pot
