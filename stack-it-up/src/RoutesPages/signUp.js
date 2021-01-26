import React, { useState, useContext, useRef } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Axios from "axios";
import userContext from "../Context/userContext";
import ReCAPTCHA from "react-google-recaptcha";

const SignUp = () => {
    const [error, setError] = useState();
    const [isLoading, setLoading] = useState(false);

    const [fname, setFName] = useState("");
    const [lname, setLName] = useState("");
    const [username, setUsername] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [street, setStreet] = useState();
    const [zip_code, setZipCode] = useState();
    const [email, setEmail] = useState();
    const [phone, setPhone] = useState();
    const [password, setPassword] = useState();

    const { setUserData } = useContext(userContext);
    const history = useHistory();
    const captchaRef = useRef();

    const submitSignInForm = async (e) => {
        e.preventDefault();
        const captchaToken = await captchaRef.current.executeAsync();
        const registerUserRes = await Axios.post(
            "http://localhost:5001/users/sign-up",
            {
                fname,
                lname,
                password,
                username: `${fname}${lname.charAt(0)}`,
                street,
                city,
                state,
                zip_code,
                email,
                phone,
                captchaToken
            }
        ).catch(
            (err) => {
                setError(err.response.data);
            }
        );
        if (registerUserRes) {
            const loginUserRes = await Axios.post(
                "http://localhost:5001/users/login",
                {
                    username: `${fname}${lname.charAt(0)}`,
                    password
                }
            );

            setUserData({
                user: loginUserRes.data.user
            });

            if (loginUserRes) {
                setUserData({
                    user: loginUserRes.data.user
                });
                localStorage.setItem("user", loginUserRes.data.user.id);
                history.push("/");
            }
        }
    }

    return (
        <>
            <form className="formWrapper" onSubmit={submitSignInForm}>
                <h2>Sign Up</h2>

                {
                    error
                        ?
                        <>
                            <br />
                            {window.grecaptcha.reset(captchaRef)}
                            <span className="errorMessage">{error}</span>
                            <br />
                        </>
                        :
                        <></>
                }


                <label htmlFor="registerFName">First Name</label>
                <input
                    value={fname}
                    id="registerFName"
                    required
                    type="text"
                    name="fname"
                    className="inputBox"
                    onChange={(e) => { setFName(e.target.value); }}
                />

                <br />

                <label htmlFor="registerLName">Last Name</label>
                <input
                    value={lname}
                    id="registerLName"
                    type="text"
                    required
                    name="lname"
                    className="inputBox"
                    onChange={(e) => { setLName(e.target.value); }}
                />

                <br />

                <label htmlFor="registerEmail">Email</label>
                <input
                    value={email}
                    id="registerEmail"
                    required
                    type="email"
                    name="email"
                    className="inputBox"
                    onChange={(e) => { setEmail(e.target.value); }}
                />

                <br />

                <label htmlFor="registerState">State</label>
                <input
                    value={state}
                    id="registerState"
                    required
                    type="text"
                    name="state"
                    className="inputBox"
                    onChange={(e) => { setState(e.target.value); }}
                />

                <br />

                <label htmlFor="registerStreet">Street</label>
                <input
                    value={street}
                    id="registerStreet"
                    required
                    type="text"
                    name="street"
                    className="inputBox"
                    onChange={(e) => { setStreet(e.target.value); }}
                />

                <br />

                <label htmlFor="registerCity">City</label>
                <input
                    value={city}
                    id="registerCity"
                    required
                    type="text"
                    name="city"
                    className="inputBox"
                    onChange={(e) => { setCity(e.target.value); }}
                />

                <br />

                <label htmlFor="registerZipCode">Zip Code</label>
                <input
                    value={zip_code}
                    id="registerZipCode"
                    required
                    type="text"
                    name="zip_code"
                    className="inputBox"
                    onChange={(e) => { setZipCode(e.target.value); }}
                />

                <br />

                <label htmlFor="registerPhone">Phone Number</label>
                <input
                    value={phone}
                    id="registerPhone"
                    required
                    type="text"
                    name="phone"
                    className="inputBox"
                    onChange={(e) => { setPhone(e.target.value); }}
                />

                <br />

                <label htmlFor="registerPassword">Password</label>
                <input
                    id="registerPassword"
                    required
                    type="password"
                    name="password"
                    className="inputBox"
                    onChange={(e) => { setPassword(e.target.value); }}
                />

                <ReCAPTCHA
                    sitekey="6LfU2zoaAAAAAE8uHnF4kc5vYMqIcNodmLXJymiK"
                    size="invisible"
                    ref={captchaRef} />
                <br />

                <p>Already have an account? <br /><NavLink to="/login">Log In</NavLink></p>

                <br />
                <input type="submit" value="Sign Up" className="inputButton" />

            </form>
        </>
    );
}

export default SignUp;