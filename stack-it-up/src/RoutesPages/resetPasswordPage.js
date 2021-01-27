import React, { useState, useContext } from "react";
import { useParams, Redirect } from "react-router-dom";
import Axios from "axios";

import UserContext from "../Context/userContext";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState();
    const [confirm, setConfirm] = useState();
    const [error, setError] = useState();

    const { userData } = useContext(UserContext);
    
    const { userId } = useParams();

    const submitEditForm = evt => {
        evt.preventDefault();
        if (password === confirm) {
            setError('');
            let body = {
                userId,
                password: document.getElementById('password').value,
                confirm: document.getElementById('confirm').value
            }
            Axios.put('http://localhost:5001/users/update-password', body)
            .then(res => {
                console.log(res);
            });
        } else {
            setError('Passwords do not match');
        }
    }

    return (<>
        <form className="formWrapper" onSubmit={submitEditForm}>
            <h2>Change Password</h2>
            
            <label htmlFor="password">Password: </label>
            <input id="password"
                name="password"
                className="inputBox"
                type="password"
                defaultValue={password} />
            <br />

            <label htmlFor="confirm">Confirm: </label>
            <input id="confirm"
                name="confirm"
                className="inputBox"
                type="password"
                defaultValue={confirm} />
            <br />

            { error ?
                <span className="errorMessage">{error}</span>
            : <></> }

        </form>
    </>);
}

export default ResetPasswordPage;