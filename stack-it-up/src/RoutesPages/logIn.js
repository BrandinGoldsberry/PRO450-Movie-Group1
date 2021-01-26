import React, { useState, useContext } from "react";
import { useHistory, NavLink } from "react-router-dom";
import Axios from "axios";
import userContext from "../Context/userContext";

const LogIn = () => {
    const [error, setError] = useState();

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const { setUserData } = useContext(userContext);
    const history = useHistory();

    const submitLogInForm = async (e) => {
        e.preventDefault();

        const loginUserRes = await Axios.post(
            "http://localhost:5001/users/login",
            { username, password }
        ).catch(
            (err) => {
                setError(err.response.data);
            }
        );

        if (loginUserRes) {
            setUserData({
                user: loginUserRes.data.user
            });
            localStorage.setItem("user", loginUserRes.data.user.id);
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
                required
                type="text"
                name="username"
                className="inputBox"
                onChange={(e) => { setUsername(e.target.value); }}
            />

            <br />

            <label htmlFor="loginPassword">Password</label>
            <input
                id="loginPassword"
                required
                type="password"
                name="password"
                className="inputBox"
                onChange={(e) => { setPassword(e.target.value); }}
            />

            <p>Need an Account? <br /><NavLink to="/sign-up">Sign Up</NavLink></p>
            <br />
            <input type="submit" name="Log In" className="inputButton" />
        </form>
    );
}

export default LogIn;