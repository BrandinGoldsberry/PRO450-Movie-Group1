import React, { useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from "../Context/userContext";


const Header = () => {
    const { userData, setUserData } = useContext(UserContext);
    let history = useHistory();

    const navToHome = () => history.push("/");
    const navToLogin = () => history.push("/login");
    // const navToAccount = () => history.push("/account");
    const logOutUser = () => {
        setUserData({
            user: undefined
        });
        localStorage.setItem("user", "");
        history.push("/");
        history.go();
    }

    return (
        <header id="header">
            <NavLink id="navBarTitle" to="/">
                <h1>Insert Name</h1>
            </NavLink>
            <div id="navButtons">
                <button onClick={navToHome}>
                    <p>
                        Home
                    </p>
                </button>
                {
                    userData.user ?
                        <>
                            {/* <button onClick={navToAccount}>
                                <p>Account</p>
                            </button> */}
                            <button onClick={logOutUser}>
                                <p>Log Out</p>
                            </button>

                        </>
                        :
                        <>
                            <button onClick={navToLogin}>
                                <p>Login</p>
                            </button>
                        </>
                }

            </div>
        </header>
    )
};

export default Header;