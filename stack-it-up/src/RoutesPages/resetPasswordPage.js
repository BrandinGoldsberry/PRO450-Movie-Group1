import React, { useState, useContext } from "react";
import { useParams, useHistory, Redirect } from "react-router-dom";
import Axios from "axios";

const ResetPasswordPage = () => {
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [error, setError] = useState();

    const { token } = useParams();

    const history = useHistory();

    Axios.get(`http://localhost:5001/users/validate-reset-token?token=${token}`)
    .then(res => {
        console.log(res.data);
        if (!res.data) return history.push('/');
    });

    const submitResetForm = evt => {
        evt.preventDefault();
        console.log(`${password} ${confirm} ${password == confirm}`);
        if (password == confirm) {
            if (password.length >= 6) {
                setError('');
                let body = {
                    token,
                    password: document.getElementById('password').value
                }
                Axios.put('http://localhost:5001/users/update-password', body)
                .then(res => {
                    if (!res.data.success) setError("Could not reset password");
                    else {
                        alert('Your password has been reset. You will be redirected in 5 seconds');
                        setTimeout(() => {
                            history.push("/");
                        }, 5000);
                    }
                });
            } else setError('Passwords must be at least 6 characters');
        } else setError('Passwords do not match');
    }

    return (<>
        <form className="formWrapper" onSubmit={submitResetForm}>
            <h2>Change Password</h2>
            
            <label htmlFor="password">Password: </label>
            <input id="password"
                name="password"
                className="inputBox"
                type="password"
                onChange={evt => setPassword(evt.target.value)} />
            <br />

            <label htmlFor="confirm">Confirm: </label>
            <input id="confirm"
                name="confirm"
                className="inputBox"
                type="password"
                onChange={evt => setConfirm(evt.target.value)} />
            <br />
            
            <br />
            <input type="submit" value="Reset Password" className="inputButton" />

            { error ? <>
                <br />
                <span className="errorMessage">{error}</span>
            </> : <></> }

        </form>
    </>);
}

export default ResetPasswordPage;