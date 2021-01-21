import React, { useState, useEffect, useContext } from 'react';

import UserContext from "../Context/userContext";

import Stars from './Stars';
import Axios from 'axios';

const movieUrl = "https://image.tmdb.org/t/p/w200";

const MovieCard = props => {
    const movie = props.movie;
    const [rating, setRating] = useState();
    const [reviewCount, setReviewCount] = useState(0);
    const [userReview, setUserReview] = useState();
    const [userReviews, setUserReviews] = useState();
    
    const { userData, setUserData } = useContext(UserContext);

    const getRatings = async () => {
        let reviews = await Axios.get(`http://localhost:5001/reviews/reviews-by-movie?movieId=${movie.id}`);
        reviews = reviews.data.reviews || [];
        setReviewCount(reviews.length);
        if (reviews.length > 0) {
            //This is the list I generate
            //Can I use it render?
            //no
            //Can I loop through it in render?
            //Yeah
            //Can I insert them directly?
            //no
            //Can I pick them apart and reassemble them?
            //Yeah
            //Did I want to?
            //no
            //Did I have to?
            //Yeah
            let reviewList = [];
            reviews.map((review, i) => {
                reviewList.push(
                    <Stars
                        className={review.review || "User did not enter review"}
                        key={i}
                        edit={false}
                        rating={review.rating}
                    />
                );
            })
            setUserReviews(reviewList);
            const ratings = Object.values(reviews).map(review => parseFloat(review.rating.$numberDecimal));
            let avgRating = Math.round((ratings.reduce((r1, r2) => r1 + r2) / ratings.length) * 2) / 2;
            setRating(avgRating);
            // console.log(avgRating);
        }

        if (userData?.user) {
            let userReview = await Axios.get(`http://localhost:5001/reviews/user-reviewed-movie?movieId=${movie.id}&userId=${userData.user.id}`);
            if (userReview.data.reviews?.length > 0) {  // Allow user to change review
                console.log(userReview.data.reviews[0]);
                setUserReview(userReview.data.reviews[0]);
            }
        }
    }

    useEffect(() => {
        getRatings();
    }, [!rating, !reviewCount, !userReview]);

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
                {userData?.user && userReview?.review ? <>
                    <p>Change your review ({userReview.review})</p>
                </> : <>
                    <p>Make a review</p>
                </>}
            </div>
            <div>
                <>
                    {
                    //So I have to iterate of a collection of components to get it to even render, 
                    //but, if I try and render them directly, it throws fucking fit, 
                    //so I have to stick with this jank shit before I look like kurt kobain
                    //I'm fucking done with this bullshittery
                    //"Objects are not valid react components, use an array instead"
                    //Not an object, was an array
                    //Can't even pass an object into a component for that to work
                    //Because it just throiws an error
                    //Functions are awful
                    //Seriously who made this?
                    userReviews &&
                    userReviews.map((review) => {
                        console.log(review);
                        return(
                            <div>
                                <Stars 
                                edit={false}
                                rating={review.props.rating.$numberDecimal}
                                />
                                <p>{review.props.className}</p>
                            </div>
                        )
                    })
                    }
                </>
            </div>
        </div>
    );
}

export default MovieCard;
//This pain is eternal help me