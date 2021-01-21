import React, { useEffect } from "react";
import Axios from "axios";
import ReactStars from "react-rating-stars-component";

const Stars = props => {

    // const movieId = props.movieId;
    const edit = !!props.edit;                  // Boolean
    const rating = props.rating || 0;           // Float; rating == value
    const onChange = props.onChange || null;    // Function

    return (
        <ReactStars
            key={Math.random()} //TODO this is terrible
            count={5}
            size={24}
            isHalf={!edit} // Users can make reviews with whole numbers (edit), average total ratings use halves (no edit)
            edit={edit}
            value={rating}
            onChange={onChange} // Not used if edit == false
            emptyIcon={<i className="far fa-star"></i>}
            halfIcon={<i className="fa fa-star-half-alt"></i>}
            fullIcon={<i className="fa fa-star"></i>}
            activeColor="#ffd700"
        />
    );
}

export default Stars;