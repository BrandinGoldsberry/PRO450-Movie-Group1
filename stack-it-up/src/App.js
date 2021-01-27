import React, { useState } from "react";
import { Switch, BrowserRouter as Router, Route } from "react-router-dom";

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import UserContext from "./Context/userContext"
import MovieContext from "./Context/movieContext"

import Header from "./PagePart/header"
import LandingPage from './RoutesPages/landingpage';
import LogIn from './RoutesPages/logIn';
import SignUp from './RoutesPages/signUp';
import EditAccount from './RoutesPages/editAccount';
import MoviePage from './RoutesPages/movieDetailPage';
import ResetPasswordPage from './RoutesPages/resetPasswordPage';

export default function App() {
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
              <Route path="/reset-password/:userId">
                <ResetPasswordPage/>
              </Route>
              <Route exact path="/">
                <LandingPage />
              </Route>
              <Route path="/login">
                <LogIn />
              </Route>
              <Route path="/sign-up">
                <SignUp />
              </Route>
              <Route path="/account">
                <EditAccount />
              </Route>
              <Route path="/movie/:movieId">
                <MoviePage/>
              </Route>
            </Switch>
          </MovieContext.Provider>
        </UserContext.Provider>
      </Router>
    </>
  );
}

