import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();
    console.log(user);

    if (isLoading) {
        return <div>Loading ...</div>;
    }

    return (
        <div>
            {isAuthenticated ? <div>
                <img src={user.picture} alt={user.name} />
                <h2>{user.name}</h2>
                <p>{user.email}</p>
                <h1>lol</h1>
            </div> : <div>
                <h1>You are not logged in</h1>
            </div>}
        </div>

    );
};

export default Profile;