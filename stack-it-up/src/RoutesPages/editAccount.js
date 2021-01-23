import React, { useState, useContext } from 'react';
import { NavLink, Redirect } from "react-router-dom";
import Axios from "axios";
import UserContext from "../Context/userContext";

const EditAccount = () => {
    const { userData, setUserData } = useContext(UserContext);
    console.log(userData);

    const [error, setError] = useState();
    const [fname, setFname] = useState();
    const [lname, setLname] = useState();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [street, setStreet] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [zipCode, setZipCode] = useState();
    const [phone, setPhone] = useState();

    const getUserInfo = () => {
        Axios.post(`http://localhost:5001/users/get-user-by-id?userId=${userData.user.id}`)
        .then(res => {
            let user = res.data.user;
            setFname(user.fname);
            setLname(user.lname);
            setUsername(user.username);
            // setPassword(user.password);
            setEmail(user.email);
            setStreet(user.street);
            setCity(user.city);
            setState(user.state);
            setZipCode(user.zip_code);
            setPhone(user.phone);
        });
    }
    if (userData.user) getUserInfo();

    const submitEditForm = evt => {
        evt.preventDefault();
        Axios.put('http://localhost:5001/users/update-user', {
            fname: document.getElementById('fname').value,
            lname: document.getElementById('lname').value,
            username: document.getElementById('username').value,
            // password: document.getElementById('password').value,
            email: document.getElementById('email').value,
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            phone: document.getElementById('phone').value
        })
        .then(res => {
            getUserInfo();
        });
    }

    return (<>
        { userData.user? <>
            <form className="formWrapper" onSubmit={submitEditForm}>
                <h2>Edit Account</h2>

                <label htmlFor="fname">First Name: </label>
                <input id="fname"
                    name="fname"
                    className="inputBox"
                    type="text"
                    defaultValue={fname}
                    // onInput={(evt) => { setFname(evt.target.value); }}
                />
                <br />

                <label htmlFor="lname">Last Name: </label>
                <input id="lname"
                    name="lname"
                    className="inputBox"
                    type="text"
                    defaultValue={lname}
                    // onInput={(evt) => { setLname(evt.target.value); }}
                />
                <br />

                <label htmlFor="username">Username: </label>
                <input id="username"
                    name="username"
                    className="inputBox"
                    type="text"
                    defaultValue={username}
                    // onInput={(evt) => { setUsername(evt.target.value); }}
                />
                <br />

                {/* <label htmlFor="password">Password: </label>
                <input id="password"
                    name="password"
                    className="inputBox"
                    type="text"
                    defaultValue={password}
                    onInput={(evt) => { setPassword(evt.target.value); }}
                />
                <br /> */}

                <label htmlFor="email">Email: </label>
                <input id="email"
                    name="email"
                    className="inputBox"
                    type="text"
                    defaultValue={email}
                    // onInput={(evt) => { setEmail(evt.target.value); }}
                />
                <br />

                <label htmlFor="street">Street: </label>
                <input id="street"
                    name="street"
                    className="inputBox"
                    type="text"
                    defaultValue={street}
                    // onInput={(evt) => { setStreet(evt.target.value); }}
                />
                <br />

                <label htmlFor="city">City: </label>
                <input id="city"
                    name="city"
                    className="inputBox"
                    type="text"
                    defaultValue={city}
                    // onInput={(evt) => { setCity(evt.target.value); }}
                />
                <br />

                <label htmlFor="state">State: </label>
                <input id="state"
                    name="state"
                    className="inputBox"
                    type="text"
                    defaultValue={state}
                    // onInput={(evt) => { setState(evt.target.value); }}
                />
                <br />

                <label htmlFor="zipCode">Zip Code: </label>
                <input id="zipCode"
                    name="zipCode"
                    className="inputBox"
                    type="text"
                    defaultValue={zipCode}
                    // onInput={(evt) => { setZipCode(evt.target.value); }}
                />
                <br />

                <label htmlFor="phone">Phone: </label>
                <input id="phone"
                    name="phone"
                    className="inputBox"
                    type="text"
                    defaultValue={phone}
                    // onInput={(evt) => { setPhone(evt.target.value); }}
                />
                <br />

                <br />
                <input type="submit" value="Save Changes" className="inputButton" />

                { error ?
                    <span className="errorMessage">{error}</span>
                : <></> }

            </form>
        </> : <>
            <Redirect to="/" />
        </> }
    </>);
}

export default EditAccount;