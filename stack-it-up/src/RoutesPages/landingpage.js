import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from "../Context/userContext";
import Stars from '../PagePart/Stars';
import MovieCard from '../PagePart/MovieCard';

const LandingPage = (props) => {
    const [error, setError] = useState();
    const [isLoading, setLoading] = useState(false);
    const [movies, setMovies] = useState();
    const [movieCards, setMovieCards] = useState();

    const { userData, setUserData } = useContext(UserContext);

    const getMovies = async (e) => {
        const movies = await Axios.get(
            "https://api.themoviedb.org/3/movie/popular?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&page=1"
        );
        setMovies(movies.data.results);
    };

    const getMovieCards = async (e) => {
        var movieCards = [];
        
        if (movies) {
            movies.map((movie, i) => {
                movieCards.push(
                    <MovieCard key={movie.id} movie={movie} />
                );
            });
        }
        setMovieCards(movieCards);
    }

    // Submit review to API
    // Axios.post('http://localhost:5001/reviews/post-review', {
    //     email: userData.user.email,
    //     reviewText,
    //     rating,
    //     movieId: movie.id
    // });

    useEffect(() => {
        getMovies();
        getMovieCards();
    }, [!movies]);

    return (
        <>
            <div id="movieContainer">
                <>
                    {movieCards}
                </>
            </div>
        </>
    )
}

export default LandingPage;
