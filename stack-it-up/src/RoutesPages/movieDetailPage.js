import Axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";


const MoviePage = () => {
    const [movie, setMovie] = useState();
    const [movieMPRAA, setMovieMPAA] = useState();
    const { movieId } = useParams();

    useEffect(() => {

        const getMovie = async () => {
            console.log(movieId)
            const response = await Axios.get(
                "https://api.themoviedb.org/3/movie/" + movieId + "?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US"
            )
            console.log(response.data)
            setMovie(response.data)

            const responseMpaa = await Axios.get(
                `http://api.themoviedb.org/3/movie/${movieId}/release_dates?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US`
            )
            responseMpaa.data.results.forEach(element => {
                if (element.iso_3166_1 == "US") {
                    setMovieMPAA(element.release_dates[0].certification)
                }
            });
            // console.log(movieMPRAA)
        }

        getMovie()
    }, [!movie]);

    return (
        <>
            {
                !movie ?
                    <div id="missingPageDiv">
                        <h1>404 - Recipe Not Found</h1>
                        <Link to="/">Go Back Home</Link>
                    </div>
                    :
                    <div id="moviePageContainer">
                        <div id="moviePoster">
                            <img src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} />
                        </div>
                        <div id="movieInformationWrapper">
                            <div id="movieName">
                                <h2>{movie.title}<em>{` (${(movie.release_date).substring(0, 4)})`}</em></h2>
                            </div>
                            <div id="movieUnderTitleInfo">
                                <p id="movieMPAA">{movieMPRAA}</p>
                                <p id="movieReleaseDate">{`${movie.release_date.substring(5, 7)}/${movie.release_date.substring(8, 10)}/${movie.release_date.substring(0, 4)}`}</p>
                            </div>

                            <div id="movieTagLine">
                                <p>{movie.tagline}</p>
                            </div>
                            <div id="movieOverview">
                                <h4>
                                    Overview
                                    </h4>
                                <p>{movie.overview}</p>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default MoviePage;