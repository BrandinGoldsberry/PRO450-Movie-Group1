import React, { useState, useContext, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Stars from '../PagePart/Stars';
import Axios from 'axios';
import userContext from "../Context/userContext";

const Review = props => {
    const [isEdit, setIsEdit] = useState();
    const [reviewText, setReviewText] = useState(props.reviewText);
    const [rating, setRating] = useState(props.rating);
    const [pendingDelete, setPendingDelete] = useState(false);

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

    const deleteReview = () => {
        console.log(props.reviewId);
        var res = Axios.delete('http://localhost:5001/reviews/delete-review?reviewId=' + props.reviewId);
        setPendingDelete(true);
    }

    const deleteUser = () => {
        var res = Axios.delete('http://localhost:5001/users/delete-user?userId=' + props.ownerId);
        setPendingDelete(true);
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
                isEdit && !pendingDelete &&
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
                !isEdit && !pendingDelete &&
                <div>
                    <Stars 
                    edit={false}
                    rating={rating}
                    />
                    <p>"{reviewText}"</p>
                    <p> - {props.reviewer}</p>
                    {
                        props.isAdmin &&
                        <button onClick={() => deleteReview()}>Delete Review</button>
                    }
                </div>
            }
        </div>
    )
}

const SearchPanel = (props) => {
    const { userData, setUserData } = useContext(userContext);
    const [ searchBy, setSearchBy ] = useState();
    const [ searchData, setSearchData] = useState([]);

    const getUsersByName = async () => {
        const res = await Axios.get("http://localhost:5001/users/find-users-by-username?search="+searchBy);
        setSearchData({searchData: res.data.users });
    }
    
    return(
        <div id="search-panel" >
            <input placeholder="Search User" name="search" onChange={(e) => setSearchBy(e.target.value) } />
            <button onClick={getUsersByName}>Search</button>
            <div className="table-wrapper">
                <table>
                    <thead>
                        <th>Username</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                    </thead>
                    <tbody>
                        {
                            searchData.searchData?.map((user, i) => {
                                return(
                                    <tr key={i} onClick={() => { props.setSelectedUser(user);}}>
                                        <td>{user.username}</td>
                                        <td>{user.fname}</td>
                                        <td>{user.lname}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

const UserPanel = (props) => {
    const { userData, setUserData } = useContext(userContext);
    const [ pendingDelete, setPendingDelete] = useState(false);
    const [ isAdmin, setIsAdmin ] = useState(false)

    const grantAdmin = async () => {
        var res = await Axios.get('http://localhost:5001/users/make-admin?userId=' + props.selectedUser?._id);
        if(res.status == 200) {
            setIsAdmin(true);
        }
    }
    
    const takeAdmin = async () => {
        var res = await Axios.get('http://localhost:5001/users/take-admin?userId=' + props.selectedUser?._id);
        if(res.status == 200) {
            setIsAdmin(false);
        }
    }

    const deleteUser = async () => {
        var res = await Axios.delete('http://localhost:5001/users/delete-user?userId=' + props.selectedUser?._id);
        if(res.status == 200) {
            setPendingDelete(true);
        }
    }

    useEffect(() => {
        setIsAdmin(props.selectedUser?.admin);
    })

    return (
        <div id="user-panel">
        {
            props.selectedUser != undefined &&
            <div>
                <div id="user-header">
                    <h3>{props.selectedUser?.fname + " " + props.selectedUser?.lname}</h3>
                </div>
                <div id="admin-controls">
                    {
                        (userData.user.superAdmin && (isAdmin)) &&
                        <button onClick={() => takeAdmin()}>Remove Admin Perms</button>
                    }
                    {
                        (!isAdmin) &&
                        <button onClick={() => grantAdmin()}>Grant Admin Perms</button>
                    }
                    {
                        (!isAdmin || pendingDelete) &&
                        <button onClick={() => deleteUser()}>Delete User</button>
                    }
                    <p>{pendingDelete && "User will be deleted!"}</p>
                </div>
                <div id="user-reviews">
                    {
                        props.userReviews?.map((review, i) => {
                            return(
                                <Review
                                    rating={review.props.rating.$numberDecimal}
                                    reviewText={review.props.className}
                                    reviewer={props.selectedUser.username}
                                    isOwned={false}
                                    reviewId={review.props["data-id"]}
                                    ownerId={review.props["data-owner-id"]}
                                    isAdmin={true}
                                />
                            )
                        })
                    }
                </div>
            </div>
        }
        </div>
    )
}

const DashBoard = (props) => {
    const { userData, setUserData } = useContext(userContext);
    const [ selectedUser, setSelectedUser ] = useState();
    const [ userReviews, setUserReviews ] = useState([]);
    const [ needForceUpdate, setNeedForceUpdate ] = useState();
    
    const getRatings = async (user) => {
        setUserReviews({ userReviews: null })
        const reviews = await Axios.get(`http://localhost:5001/reviews/get-reviews-by-user?userId=${user._id}`);

        if (reviews) {
            const reviewResults = reviews.data.result;
            let reviewList = [];
            reviewResults.map((review, i) => {
                reviewList.push(
                    <Stars
                        className={review.review}
                        data-username={review.username}
                        data-id={review._id}
                        data-owner-id={review.userId}
                        key={i}
                        edit={false}
                        rating={review.rating}
                    />
                );
            })
            setUserReviews({ userReviews: reviewList });
        }
    }

    const updateUser = (user) => {
        setSelectedUser({selectedUser: user})
        getRatings(user);
    }

    return (
        <div id="dashboard">
            <SearchPanel setSelectedUser={(user) => updateUser(user)}/>
            <UserPanel selectedUser={selectedUser?.selectedUser} userReviews={userReviews?.userReviews} forceUpdate={() => {setNeedForceUpdate(true)}} fu={needForceUpdate}/>
        </div>
    )
}

export default DashBoard;