import React, { useState, useContext } from "react";
import { useHistory, NavLink } from "react-router-dom";
import Axios from "axios";
import userContext from "../Context/userContext";

const LogIn = () => {
    const [error, setError] = useState("");

    const [username, setUsername] = useState();
    const [password, setPassword] = useState();

    const [email, setEmail] = useState('');

    const { setUserData } = useContext(userContext);
    const history = useHistory();

    const submitLogInForm = async (e) => {
        e.preventDefault();
        setError("");
        Axios.post('http://localhost:5001/users/login', {
            username,
            password
        }).then((res) => {
            if (res.data.success) {
                setUserData({
                    user: res.data.user
                });
                localStorage.setItem("user", res.data.user.id);
                history.push("/");
            } else {
                setError(res.data.message);
            }
        });
    }

    const submitResetForm = evt => {
        evt.preventDefault();
        setError("");
        console.log(email);
        Axios.post('http://localhost:5001/email/reset-password', {
            email
        }).then(res => {
            if (!res.data) setError("Could not find email");
            else alert(`A password reset email has been sent to ${email}`);
        });
    }

    return (
        <form className="formWrapper" onSubmit={submitLogInForm}>
            <h2>Log In</h2>

            <label htmlFor="loginUsername">Username: </label>
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

            <label htmlFor="loginPassword">Password: </label>
            <input
                id="loginPassword"
                required
                type="password"
                name="password"
                className="inputBox"
                onChange={(e) => { setPassword(e.target.value); }}
            />

            {/* <p>Need an Account? <br /><NavLink to="/sign-up">Sign Up</NavLink></p> */}
            <br />
            <input type="submit" name="Log In" className="inputButton" />

            {/* Forgot password */}

            <h2>Forgot password?</h2>

            <label htmlFor="email">Email: </label>
            <input
                value={email}
                id="email"
                type="text"
                name="email"
                className="inputBox"
                onChange={evt => { setEmail(evt.target.value); }}
            />

            <br />
            <input type="button" value="Reset Password" className="inputButton" onClick={evt => submitResetForm(evt)} />

            { error ? <>
                <br />
                <span className="errorMessage">{error}</span>
            </> : <></> }
        </form>
    );
}

export default LogIn;