import React, { useState, useContext, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Stars from '../PagePart/Stars';
import Axios from 'axios';
import userContext from "../Context/userContext";
import searchContext from "../Context/searchContext";

const Review = props => {
    const [isEdit, setIsEdit] = useState();
    const [reviewText, setReviewText] = useState(props.reviewText);
    const [rating, setRating] = useState(props.rating);
    const [pendingDelete, setPendingDelete] = useState(false);

    var curTextEntry = "";
    var curRating = 0;

    const postReview = async () => {
        // Submit review to API
        var res = await Axios.put('http://localhost:5001/reviews/update-review', {
            reviewText: curTextEntry,
            rating: curRating,
            reviewId: props.reviewId
        });
        setReviewText(curTextEntry);
        setRating(curRating);
        setIsEdit(false);
    }

    const deleteReview = async () => {
        // console.log(props.reviewId);
        var res = await Axios.delete('http://localhost:5001/reviews/delete-review?reviewId=' + props.reviewId);
        setPendingDelete(true);
    }

    const onNewText = (e) => {
        curTextEntry = e.target.value;
    }
    const onNewRating = (e) => {
        curRating = e;
    }

    return (
        <div>
            {
                isEdit && !pendingDelete &&
                <div>
                    <Stars
                        edit={true}
                        rating={rating}
                        onChange={onNewRating}
                    />
                    <input placeholder={reviewText} onChange={onNewText} type="text" />
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
    const { search, setSearch } = useContext(searchContext);
    const [searchData, setSearchData] = useState([]);
    const buttonRef = useRef();

    let history = useHistory();

    const getUsersByName = async () => {
        const res = await Axios.get("http://localhost:5001/users/find-users-by-username?search=" + search);
        setSearchData({ searchData: res.data.users });
        localStorage.setItem("search", search)
    }

    useEffect(() => {
        if (!search && localStorage.getItem("search")) {
            setSearch(localStorage.getItem('search'))
        }
    }, [search])

    return (
        <div id="search-panel" >
            <input placeholder="Search User" name="search" value={search} onChange={(e) => {
                setSearch(e.target.value);
            }} />
            <button ref={buttonRef} onClick={getUsersByName}>Search</button>

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
                                return (
                                    <tr key={i} onClick={() => { props.setSelectedUser(user); }}>
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
    const { search, setSearch } = useContext(searchContext);
    const [pendingDelete, setPendingDelete] = useState(false);
    const [isAdmin, setIsAdmin] = useState();
    const userId = localStorage.getItem("user");
    const { searchUser } = useParams();

    let history = useHistory();
    useEffect(() => {
        setIsAdmin(props.selectedUser?.admin);
    }, [props]);

    const grantAdmin = async () => {
        var res = await Axios.get('http://localhost:5001/users/make-admin?userId=' + props.selectedUser?._id);
        if (res.status == 200) {
            setIsAdmin(true);
        }
    }

    const takeAdmin = async () => {
        var res = await Axios.get('http://localhost:5001/users/take-admin?userId=' + props.selectedUser?._id);
        if (res.status == 200) {
            setIsAdmin(false);
        }
    }

    const deleteUser = async () => {
        var res = await Axios.delete('http://localhost:5001/users/delete-user?userId=' + props.selectedUser?._id);
        if (res.status == 200) {
            setPendingDelete(true);
        }

        alert("User has been deleted.\n")
        setTimeout(() => {
            console.log(searchUser)
            history.push(`/admin?searchUser=${search}`)
            history.go()
        }, 2000);
    }

    return (
        <div id="user-panel">
            {/* {console.log(props.selectedUser?._id)} */}
            {
                props.selectedUser && !pendingDelete ?
                    <div>
                        <div id="user-header">
                            <h3>{props.selectedUser?.fname + " " + props.selectedUser?.lname}</h3>
                        </div>
                        <div id="admin-controls">
                            {
                                isAdmin == true && userData.user.superAdmin == true && props.selectedUser?._id != userId &&
                                <button onClick={takeAdmin}>Remove Admin Perms</button>

                            }
                            {
                                (!isAdmin) &&
                                <button onClick={grantAdmin}>Grant Admin Perms</button>
                            }
                            {
                                (!isAdmin && !props.selectedUser?.superAdmin) &&
                                <button onClick={deleteUser}>Delete User</button>
                            }

                        </div>
                        <div id="user-reviews">
                            {
                                props.userReviews?.map((review, i) => {
                                    return (
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
                    :
                    <></>
            }
        </div>
    )
}

const DashBoard = (props) => {
    const { userData, setUserData } = useContext(userContext);
    const { search, setSearch } = useContext(searchContext);
    const [selectedUser, setSelectedUser] = useState();
    const [userReviews, setUserReviews] = useState([]);

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
        setSelectedUser({ selectedUser: user })
        getRatings(user);
    }

    return (
        <div id="dashboard">
            <SearchPanel setSelectedUser={(user) => updateUser(user)} />
            <UserPanel selectedUser={selectedUser?.selectedUser} userReviews={userReviews?.userReviews} />
        </div>
    )
}

export default DashBoard;