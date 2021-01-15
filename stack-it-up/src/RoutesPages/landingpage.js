import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { NavLink, useHistory } from "react-router-dom";
import ReactStars from "react-rating-stars-component";
import UserContext from "../Context/userContext";

const LandingPage = (props) => {
    const [error, setError] = useState();
    const [isLoading, setLoading] = useState(false);
    const [movie, setMovie] = useState();
    const [movieCards, setMovieCards] = useState();

    const { userData, setUserData } = useContext(UserContext);

    const getMovies = async (e) => {
        const movies = await Axios.get(
            "https://api.themoviedb.org/3/movie/popular?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&page=1"
        );
        setMovie(movies.data.results);
        console.log(movie)
    };

    const getMovieCards = async (e) => {
        var count = Object.keys(movie).length;
        var movieCards = [];
        
        console.log(movie);
        
        for (var i = 0; i < count; i++) {
            var movieSrc = "https://image.tmdb.org/t/p/w200" + movie[i].poster_path;
            movieCards.push(
                <div>
                    <h3>{movie[i].title}</h3>
                    <img src={"" + movieSrc + ""}></img>
                    <h4>{movie[i].release_date}</h4>
                    <p>{movie[i].overview.slice(0, 65)}...</p>
                    <ReactStars
                        count={5}
                        size={24}
                        isHalf={true}
                        emptyIcon={<i className="far fa-star"></i>}
                        halfIcon={<i className="fa fa-star-half-alt"></i>}
                        fullIcon={<i className="fa fa-star"></i>}
                        activeColor="#ffd700"
                        onChange={(rating) => {
                            console.log(rating, i);
                            // console.log('Rating: ' + movie[index]);
                            // Axios.post('http://localhost:5001/reviews/post-review', {
                            //     email: userData.email,
                            //     rating,
                            //     reviewText: "It's a trash movie",
                            //     movieId: movie[index].id
                            // })
                        }}
                    />
                </div>
            );
        }
        setMovieCards(movieCards);
    }

    useEffect(() => {
        getMovies();
        getMovieCards();
    }, [!movie]);

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
