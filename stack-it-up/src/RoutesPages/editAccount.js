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
            setEmail(user.email);
            setStreet(user.street);
            setCity(user.city);
            setState(user.state);
            setZipCode(user.zip_code);
            setPhone(user.phone);
        });
    }
    if (userData.user) getUserInfo();

    const submitEditForm = async evt => {
        evt.preventDefault();
        let body = {
            userId: userData.user.id,
            fname: document.getElementById('fname').value,
            lname: document.getElementById('lname').value,
            username: document.getElementById('username').value,
            email: document.getElementById('email').value,
            street: document.getElementById('street').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zip_code: document.getElementById('zipCode').value,
            phone: document.getElementById('phone').value
        };
        Axios.put('http://localhost:5001/users/update-user', body)
        .then(res => {
            getUserInfo();
        });
    }

    const submitResetForm = evt => {
        evt.preventDefault();
        Axios.post('http://localhost:5001/email/reset-password', {
            userId: userData.user.id
        }).then(res => {
            alert(`A password reset email has been sent to ${userData.user.email}`);
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
                    defaultValue={fname} />
                <br />

                <label htmlFor="lname">Last Name: </label>
                <input id="lname"
                    name="lname"
                    className="inputBox"
                    type="text"
                    defaultValue={lname} />
                <br />

                <label htmlFor="username">Username: </label>
                <input id="username"
                    name="username"
                    className="inputBox"
                    type="text"
                    defaultValue={username} />
                <br />

                <label htmlFor="email">Email: </label>
                <input id="email"
                    name="email"
                    className="inputBox"
                    type="text"
                    defaultValue={email} />
                <br />

                <label htmlFor="street">Street: </label>
                <input id="street"
                    name="street"
                    className="inputBox"
                    type="text"
                    defaultValue={street} />
                <br />

                <label htmlFor="city">City: </label>
                <input id="city"
                    name="city"
                    className="inputBox"
                    type="text"
                    defaultValue={city} />
                <br />

                <label htmlFor="state">State: </label>
                <input id="state"
                    name="state"
                    className="inputBox"
                    type="text"
                    defaultValue={state} />
                <br />

                <label htmlFor="zipCode">Zip Code: </label>
                <input id="zipCode"
                    name="zipCode"
                    className="inputBox"
                    type="text"
                    defaultValue={zipCode} />
                <br />

                <label htmlFor="phone">Phone: </label>
                <input id="phone"
                    name="phone"
                    className="inputBox"
                    type="text"
                    defaultValue={phone} />
                <br />

                <br />
                <input type="submit" value="Save Changes" className="inputButton" />
                <input type="button" value="Reset Password" className="inputButton" onClick={evt => submitResetForm(evt)} />

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