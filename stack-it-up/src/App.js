import './App.css';
import React, { useState } from "react";
import { Switch, Route } from "react-router-dom";
import LogIn from './RoutesPages/logIn';
import UserContext from "./Context/userContext"
import Header from "./PagePart/header"


export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    user: undefined
  });
  return (
    <>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Header />
        <Switch>
          <Route exact path="/">
            <landingPage />
          </Route>
          <Route path="/login">
            <LogIn />
          </Route>
        </Switch>
      </UserContext.Provider>
    </>
  );
}

