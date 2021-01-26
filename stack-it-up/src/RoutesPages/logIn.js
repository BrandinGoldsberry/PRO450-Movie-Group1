import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import userContext from "../Context/userContext";

const LogIn = () => {
    const [error, setError] = useState();
    const [isLoading, setLoading] = useState(false);

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const { setUserData } = useContext(userContext);
    const history = useHistory();

    const submitLogInForm = async (e) => {
        setLoading(true);
        e.preventDefault();
        const loggedInUser = { username, password };
        const loginUserRes = await Axios.post(
            "http://localhost:5001/users/login",
            loggedInUser
        ).catch(
            (err) => {
                setLoading(false);
                setError(err.response.data);
            }
        );
        if (loginUserRes) {
            setUserData({
                user: loginUserRes.data.user
            });
            localStorage.setItem("user", loginUserRes.data.user);
            setLoading(false);
            history.push("/");
        }
    }

    return (
        <form className="formWrapper" onSubmit={submitLogInForm}>
            <h2>Log In</h2>

            {
                error
                    ?
                    <span className="errorMessage">{error}</span>
                    :
                    <></>
            }

            <label htmlFor="loginUsername">Username</label>
            <input
                value={username}
                id="loginUsername"
                type="text"
                name="username"
                className="inputBox"
                onChange={(e) => { setUsername(e.target.value); }}
            />

            <br />

            <label htmlFor="loginPassword">Password</label>
            <input
                id="loginPassword"
                type="password"
                name="password"
                className="inputBox"
                onChange={(e) => { setPassword(e.target.value); }}
            />
            <br />
            <input type="submit" name="Log In" className="inputButton" />
        </form>
    );
}

export default LogIn;