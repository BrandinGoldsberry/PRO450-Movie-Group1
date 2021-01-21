import React, { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import userContext from "../Context/userContext";

const SignUp = () => {
    const [error, setError] = useState();
    const [isLoading, setLoading] = useState(false);

    const [displayName, setDisplayName] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [passwordConfirm, setPasswordConfirm] = useState();

    const { setUserData } = useContext(userContext);
    const history = useHistory();

    const submitSignInForm = async (e) => {
        setLoading(true);
        e.preventDefault();
        const newUser = { email, password, passwordConfirm, displayName };
        const registerUserRes = await Axios.post(
            "http://localhost:5001/users/sign-up",
            newUser
        ).catch(
            (err) => {
                setLoading(false);
                setError(err.response.data);
            }
        );

        if (registerUserRes) {
            const loginUserRes = await Axios.post(
                "http://localhost:5001/users/login",
                { email, password }
            );
            setUserData({
                token: loginUserRes.data.token,
                user: loginUserRes.data.user
            });
            localStorage.setItem("auth-token", loginUserRes.data.token);
            setLoading(false);
            history.push("/");
        }
    }

    if (isLoading) {
        return (
            <div className="loadingDiv">
                <h1>Loading...</h1>
            </div>
        )
    }

    return (
        <>
            <form className="formWrapper" onSubmit={submitSignInForm}>
                <h2>Sign Up</h2>

                {
                    error
                        ?
                        <span className="errorMessage">{error}</span>
                        :
                        <></>
                }

                <label htmlFor="registerDisplayName">Display Name</label>
                <input
                    value={displayName}
                    id="registerDisplayName"
                    type="text"
                    name="displayName"
                    className="inputBox"
                    onChange={(e) => { setDisplayName(e.target.value); }}
                />

                <br />

                <label htmlFor="registerEmail">Email</label>
                <input
                    value={email}
                    id="registerEmail"
                    type="text"
                    name="email"
                    className="inputBox"
                    onChange={(e) => { setEmail(e.target.value); }}
                />

                <br />

                <label htmlFor="registerPassword">Password</label>
                <input
                    id="registerPassword"
                    type="password"
                    name="password"
                    className="inputBox"
                    onChange={(e) => { setPassword(e.target.value); }}
                />

                <br />

                <label htmlFor="registerConfirmPassword">Confirm Password</label>
                <input
                    id="registerConfirmPassword"
                    type="password"
                    name="confPassword"
                    className="inputBox"
                    onChange={(e) => { setPasswordConfirm(e.target.value); }}
                />
                <br />

                <p>Already have an account? <br /><NavLink to="/login">Log In</NavLink></p>
                <br />
                <input type="submit" value="Sign Up" class="inputButton" />

            </form>
        </>
    );
}

export default SignUp;