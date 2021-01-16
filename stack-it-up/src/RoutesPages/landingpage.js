import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import UserContext from "../Context/userContext";

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
        // var count = Object.keys(movies).length;
        var movieCards = [];
        
        console.log(movies);
        
        if (movies) {
            movies.map((movie, i) => {
                var movieSrc = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
                movieCards.push(
                    <div key={i}>
                        <h3>{movie.title}</h3>
                        <img src={"" + movieSrc + ""}></img>
                        <h4>{movie.release_date}</h4>
                        {
                            userData.user ?
                            <>
                                <p>{movie.overview.slice(0, 65)}...</p>
                                <input id={"reviewText" + i} type="text" placeholder="Type a review..." />
                                <ReactStars
                                    data-movie-id={movie.id}
                                    count={5}
                                    size={24}
                                    isHalf={true}
                                    emptyIcon={<i className="far fa-star"></i>}
                                    halfIcon={<i className="fa fa-star-half-alt"></i>}
                                    fullIcon={<i className="fa fa-star"></i>}
                                    activeColor="#ffd700"
                                    onChange={(rating) => {
                                        const reviewText = document.getElementById("reviewText" + i).value;
                                        Axios.post('http://localhost:5001/reviews/post-review', {
                                            email: userData.user.email,
                                            reviewText,
                                            rating,
                                            movieId: movie.id
                                        });
                                    }}
                                />
                            </> : <></>
                        }
                    </div>
                );
            });
        }
        setMovieCards(movieCards);
    }

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
