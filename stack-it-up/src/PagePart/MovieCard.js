import React, { useState, useEffect, useContext } from 'react';

import UserContext from "../Context/userContext";

import Stars from './Stars';
import Axios from 'axios';

const movieUrl = "https://image.tmdb.org/t/p/w500";

const Review = props => {
    const [isEdit, setIsEdit] = useState();
    const [reviewText, setReviewText] = useState(props.reviewText);
    const [rating, setRating] = useState(props.rating);

    var curTextEntry = "";
    var curRating = 0;

    const postReview = () => {
        // Submit review to API
        var res = Axios.put('http://localhost:5001/reviews/update-review', {
            reviewText: curTextEntry,
            rating: curRating,
            reviewId: props.reviewId
        });
        setReviewText(curTextEntry);
        setRating(curRating);
        setIsEdit(false);
    }

    const onNewText = (e) => {
        curTextEntry = e.target.value;
    }
    const onNewRating = (e) => {
        curRating = e;
    }

    return(
        <div>
            {
                isEdit &&
                <div>
                    <Stars 
                    edit={true}
                    rating={rating}
                    onChange={onNewRating}
                    />
                    <input placeholder={reviewText} onChange={onNewText} type="text"/>
                    <button onClick={postReview}>Post Review</button>
                </div>
            } {
                !isEdit &&
                <div>
                    <Stars 
                    edit={false}
                    rating={rating}
                    />
                    <p>"{reviewText}"</p>
                    <p> - {props.reviewer}</p>
                    {
                        props.isOwned &&
                        <button onClick={() => setIsEdit(true)}>Edit Review</button>
                    }
                </div>
            }
        </div>
    )
}

const MovieCard = props => {
    const movie = props.movie;
    const [rating, setRating] = useState();
    const [reviewCount, setReviewCount] = useState(0);
    const [userReview, setUserReview] = useState();
    const [userReviews, setUserReviews] = useState();
    const [showReviews, setShowReviews] = useState(false);
    
    const { userData, setUserData } = useContext(UserContext);

    var curTextEntry = "";
    var curRating = 0;

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
                        className={review.review}
                        data-username={review.username}
                        data-id={review._id}
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
                setUserReview(userReview.data.reviews[0]);
            }
        }
    }

    const postReview = () => {
        // Submit review to API
        Axios.post('http://localhost:5001/reviews/post-review', {
            email: userData.user.email,
            reviewText: curTextEntry,
            rating: curRating,
            movieId: movie.id,
            username: userData.user.username
        });
    }

    const onNewText = (e) => {
        curTextEntry = e.target.value;
    }
    const onNewRating = (e) => {
        curRating = e;
    }

    useEffect(() => {
        getRatings();
    }, [!rating, !reviewCount, !userReview]);

    return (
        <div className="movie-card">
            <div className="title-wrap">
                <h3 className="movie-title">{movie.title}</h3>
            </div>
            <p>{movie.release_date}</p>
            <img className="movie-poster" src={movieUrl + movie.poster_path} alt="Movie Poster" />
            <p className="movie-description">{movie.overview.slice(0, 65)}...</p>
            <div className="overall-rating">
                <Stars
                    edit={userData.user != undefined}
                    rating={rating}
                />
                <p className="ml-2 mb-0" style={ {lineHeight: "32px"} }>({reviewCount || '0'} ratings)</p>
                <button onClick={() => setShowReviews(!showReviews)}>{showReviews ? "Hide" : "Show"} Reviews</button>
                {/* {userData?.user && userReview?.review ? <>
                    <p>Change your review ({userReview.review})</p>
                </> : <>
                    <p>Make a review</p>
                </>} */}
            </div>
            <div>
            {
                showReviews &&
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
                        return(
                           <Review
                            rating={review.props.rating.$numberDecimal}
                            reviewText={review.props.className}
                            reviewer={review.props["data-username"]}
                            isOwned={userData.user?.username === review.props["data-username"]}
                            reviewId={review.props["data-id"]}
                           />
                        )
                    })
                    }
                </>
            }
            </div>
            {
                userData.user != undefined && showReviews &&
                <div>
                    <Stars 
                    edit={true}
                    rating={0}
                    onChange={onNewRating}
                    />
                    <input onChange={onNewText} type="text"/>
                    <button onClick={postReview}>Post Review</button>
                </div>
            }
        </div>
    );
}

export default MovieCard;
//This pain is eternal help me