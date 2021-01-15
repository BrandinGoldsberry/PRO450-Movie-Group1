import './App.css';
import React, { useState } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import LandingPage from './RoutesPages/landingpage';
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
      <Router>
        <UserContext.Provider value={{ userData, setUserData }}>
          <Header />
          <Switch>
            <Route exact path="/">
              {/* <LandingPage /> */}
            </Route>
            <Route path="/login">
              <LogIn />
            </Route>
          </Switch>
        </UserContext.Provider>
      </Router>
    </>
  );
}

