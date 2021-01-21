import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";
import LandingPage from './RoutesPages/landingpage';
import LogIn from './RoutesPages/logIn';
import SignUp from './RoutesPages/signUp';
import UserContext from "./Context/userContext"
import MovieContext from "./Context/movieContext"
import Header from "./PagePart/header"
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState({
    user: undefined
  });
  const [movieData, setMovieData] = useState({
    movies: undefined
  });
  return (
    <>
      <Router>
        <UserContext.Provider value={{ userData, setUserData }}>
          <MovieContext.Provider value={{ movieData, setMovieData }}>
            <Header />
            <Switch>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/login">
                <LogIn />
              </Route>
              <Route path="/sign-up">
                <SignUp />
              </Route>
            </Switch>
          </MovieContext.Provider>
        </UserContext.Provider>
      </Router>
    </>
  );
}

