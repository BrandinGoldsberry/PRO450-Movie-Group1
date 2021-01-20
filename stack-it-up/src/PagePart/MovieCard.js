import React, { useState, useEffect } from 'react';
import Stars from './Stars';

import Axios from 'axios';

const movieUrl = "https://image.tmdb.org/t/p/w200";

const MovieCard = props => {
    const movie = props.movie;
    const [rating, setRating] = useState();
    const [reviewCount, setReviewCount] = useState(0);

    const getRatings = async () => {
        let reviews = await Axios.get(`http://localhost:5001/reviews/reviews-by-movie?movieId=${movie.id}`);
        reviews = reviews.data.reviews || {};
        setReviewCount(reviews.length);
        if (reviews.length > 0) {
            const ratings = Object.values(reviews).map(review => parseFloat(review.rating.$numberDecimal));
            let avgRating = Math.round((ratings.reduce((r1, r2) => r1 + r2) / ratings.length) * 2) / 2;
            setRating(avgRating);
            console.log(avgRating);
        }
    }

    useEffect(() => {
        getRatings();
    }, [!rating, !reviewCount]);

    return (
        <div className="movie-card">
            <h3>{movie.title}</h3>
            <p>{movie.release_date}</p>
            <img src={movieUrl + movie.poster_path} />
            <p>{movie.overview.slice(0, 65)}...</p>
            <div style={ {display: "flex", flexDirection: "row"} } >
                <Stars
                    edit={false}
                    rating={rating}
                />
                <p className="ml-2 mb-0" style={ {lineHeight: "32px"} }>({reviewCount || '0'} ratings)</p>
            </div>
        </div>
    );
}

export default MovieCard;