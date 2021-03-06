import React, { useContext, useState, useEffect } from "react";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from "../Context/userContext";
import MovieContext from "../Context/movieContext";
import Axios from "axios"

const Header = () => {
    const { userData, setUserData } = useContext(UserContext);
    const { movieData, setMovieData } = useContext(MovieContext);

    const [searchType, setSearchType] = useState("title");
    const [title, setTitle] = useState("");
    const [actor, setActor] = useState("");
    const [genreId, setGenreId] = useState(28);
    const [genres, setgenres] = useState([{
        "id": 28,
        "name": "Action"
    },
    {
        "id": 12,
        "name": "Adventure"
    },
    {
        "id": 16,
        "name": "Animation"
    },
    {
        "id": 35,
        "name": "Comedy"
    },
    {
        "id": 80,
        "name": "Crime"
    },
    {
        "id": 99,
        "name": "Documentary"
    },
    {
        "id": 18,
        "name": "Drama"
    },
    {
        "id": 10751,
        "name": "Family"
    },
    {
        "id": 14,
        "name": "Fantasy"
    },
    {
        "id": 36,
        "name": "History"
    },
    {
        "id": 27,
        "name": "Horror"
    },
    {
        "id": 10402,
        "name": "Music"
    },
    {
        "id": 9648,
        "name": "Mystery"
    },
    {
        "id": 10749,
        "name": "Romance"
    },
    {
        "id": 878,
        "name": "Science Fiction"
    },
    {
        "id": 10770,
        "name": "TV Movie"
    },
    {
        "id": 53,
        "name": "Thriller"
    },
    {
        "id": 10752,
        "name": "War"
    },
    {
        "id": 37,
        "name": "Western"
    }]);

    let history = useHistory();

    const navToLogin = () => history.push("/login");
    const navToSignUp = () => history.push("/sign-up")
    const navToAccount = () => history.push("/account");
    const navToDashboard = () => history.push("/admin");

    const logOutUser = () => {
        setUserData({
            user: undefined
        });
        localStorage.setItem("user", "");
        history.push("/");
        history.go();
    }

    const handleSelect = (e) => {
        setSearchType(e.target.value.toLowerCase());
    }

    const handleGenreSelect = (e) => {
        setGenreId(e.target.value);
    }

    // https://api.themoviedb.org/3/discover/movie?api_key=8fbd2bfef8820b20b271b1213852fe21&with_genres=Horror
    const genreSearch = async () => {
        const axiosResponse = await Axios.get(
            `https://api.themoviedb.org/3/discover/movie?api_key=8fbd2bfef8820b20b271b1213852fe21&with_genres=${genreId}`
        );
        // console.log(axiosResponse.data.results)
        setMovieData({ movies: undefined });
        setMovieData({
            movies: axiosResponse.data.results
        });
        // history.push("/");
        // history.go();
    }

    // `https://api.themoviedb.org/3/search/movie?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&query=${}&page=1&include_adult=false`
    const titleSearch = async () => {
        const axiosResponse = await Axios.get(
            `https://api.themoviedb.org/3/search/movie?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&query=${title}&page=1&include_adult=false`
        );
        // console.log(axiosResponse.data.results);
        setMovieData({ movies: undefined });
        setMovieData({
            movies: axiosResponse.data.results
        });
        // history.push("/");
        // history.go();
    }

    // `https://api.themoviedb.org/3/search/person?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&query=${}%20&page=1&include_adult=false`
    const actorSearch = async () => {
        var movies = [];
        const axiosResponse = await Axios.get(
            `https://api.themoviedb.org/3/search/person?api_key=8fbd2bfef8820b20b271b1213852fe21&language=en-US&query=${actor}%20&page=1&include_adult=false`
        );
        // console.log(axiosResponse.data.results)
        var count = Object.keys(axiosResponse.data.results).length;
        for (let i = 0; i < count; i++) {
            var movieCount = Object.keys(axiosResponse.data.results[i]).length;
            for (let j = 0; j < movieCount; j++) {
                if (axiosResponse.data.results[i].known_for[j]) {
                    movies.push(axiosResponse.data.results[i].known_for[j])
                    // console.log(axiosResponse.data.results[i].known_for[j])
                }
            }
        }
        // console.log(movies)
        setMovieData({ movies: undefined });
        setMovieData({
            movies
        });
        // history.push("/");
        // history.go();
    }

    useEffect(() => {
        const checkLoggedIn = async () => {
          let userId = localStorage.getItem("user");
          
          if (userId === null) {
            console.log(`User Id is Null`)
            localStorage.setItem("user", "");
            userId = "";
          } else {
            const response = await Axios.post(
              `http://localhost:5001/users/isUserIdValid?userId=${userId}&type=loginUserData`,
              {userId}
            );
            if(!userData.user){
                setUserData(response.data)
            }
          }
        }
    
        checkLoggedIn();
      }, [!userData])

    return (
        <header id="header">
            <NavLink id="navBarTitle" to="/">
                <h1>Group 1</h1>
            </NavLink>
            <div id="navButtons">
                {
                    userData.user ?
                        <>
                            {searchType === "title" ?
                                <>
                                    <input placeholder="Search Movie Title" name="search" onChange={(e) => { setTitle(e.target.value) }} />
                                    <button onClick={titleSearch}>Search</button>
                                    <br />
                                </>
                                :
                                <></>
                            }
                            {searchType === "actor" ?
                                <>
                                    <input placeholder="Search Movie By Actor" name="search" onChange={(e) => { setActor(e.target.value) }} />
                                    <button onClick={actorSearch}>Search</button>
                                    <br />
                                </>
                                :
                                <></>
                            }
                            {searchType === "genre" ?
                                <>
                                    <select onChange={(e) => { handleGenreSelect(e) }} name="genres">
                                        {genres.map(function (genre, i) {
                                            return <option value={genre.id} key={i}>{genre.name}</option>
                                        })}
                                    </select>
                                    <button onClick={genreSearch}>Search</button>
                                </>
                                :
                                <></>
                            }

                            <select onChange={(e) => { handleSelect(e) }} name="searchType">
                                <option default value="Title">Title</option>
                                <option value="Actor">Actor</option>
                                <option value="Genre">Genre</option>
                            </select>
                            {
                                userData.user?.admin &&
                                <button onClick={navToDashboard}>
                                    <p>Admin DashBoard</p>
                                </button>
                            }
                            <button onClick={navToAccount}>
                                <p>{userData.user.username}</p>
                            </button>
                            <button onClick={logOutUser}>
                                <p>Log Out</p>
                            </button>

                        </>
                        :
                        <>
                            {searchType === "title" ?
                                <>
                                    <input placeholder="Search Movie Title" name="search" onChange={(e) => { setTitle(e.target.value) }} />
                                    <button onClick={titleSearch}>Search</button>
                                    <br />
                                </>
                                :
                                <></>
                            }
                            {searchType === "actor" ?
                                <>
                                    <input placeholder="Search Movie By Actor" name="search" onChange={(e) => { setActor(e.target.value) }} />
                                    <button onClick={actorSearch}>Search</button>
                                    <br />
                                </>
                                :
                                <></>
                            }
                            {searchType === "genre" ?
                                <>
                                    <select onChange={(e) => { handleGenreSelect(e) }} name="genres">
                                        {genres.map(function (genre, i) {
                                            return <option value={genre.id} key={i}>{genre.name}</option>
                                        })}
                                    </select>
                                    <button onClick={genreSearch}>Search</button>
                                </>
                                :
                                <></>
                            }
                            <select onChange={(e) => { handleSelect(e) }} name="searchType">
                                <option default value="Title">Title</option>
                                <option value="Actor">Actor</option>
                                <option value="Genre">Genre</option>
                            </select>

                            <button onClick={navToLogin}>
                                <p>Login</p>
                            </button>
                            <button onClick={navToSignUp}>
                                <p>Sign Up</p>
                            </button>
                        </>
                }

            </div>
        </header >
    )
};

export default Header;