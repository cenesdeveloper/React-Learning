// import {useState, useEffect} from "react";
//
// const Card = ({ title }) => {
//     // Having it here allows each card to be managed separately
//     const [count, setCount] = useState(0);
//     const [hasLiked, setHasLiked] = useState(false);
//     useEffect(() => {
//         console.log(`The card ${title} has been liked ${hasLiked}`)
//     }, [hasLiked]);
//
//
//     return (
//         <div className="card" onClick={() => setCount(count + 1)}>
//             <h2>{title} <br/> {count || null}</h2>
//
//             <button onClick={() => setHasLiked(!hasLiked)}>
//                 {hasLiked ? 'Liked' : 'Like'}
//             </button>
//         </div>
//
//     )
// }
//
// const App = () => {
//
//     return (
//         <div className="card-container">
//             <Card title="Star Wars" rating={5} isCool={true} />
//             <Card title="Avatar"/>
//             <Card title="The Lion King"/>
//         </div>
//     )
// }
//
// export default App

import React, {useState, useEffect} from 'react';
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import { useDebounce } from "react-use";
import {updateSearchCount} from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [movieList, setMovieList] = useState([]);
    const[isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

    // Debounce the search term to avoid too many API requests
    // Waits for user to stop writing for 500ms
    useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);
    const fetchMovies = async (query = '') => {

        try {
            const endpoint = query
                ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
                : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            if (!response.ok) {
                throw new Error(`Error fetching movies: ${response.statusText}`);
            }
            const data = await response.json();

            if(data.Response === "False") {
                setErrorMessage(data.Error || 'Error fetching movies. Please try agin later');
                setMovieList([]);
                return;
            }
            setMovieList(data.results || []);

            if(query && data.results.length > 0) {
                await updateSearchCount(query, data.results[0]);
            }
        } catch (e) {
            console.log(`Error fetching movies: ${e}`);
            setErrorMessage('Error fetching movies. Please try agin later');
        } finally {
            setIsLoading(false);
        }
    }
    useEffect(() => {
        fetchMovies(debouncedSearchTerm);
    }, [debouncedSearchTerm]);

    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Banner" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without Hassle</h1>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>
                </header>
                <section className="all-movies">
                    <h2 className="mt-[40px]">All Movies</h2>
                    {isLoading ? (
                        <Spinner />
                    ) : errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ) : (
                        <ul>
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </ul>
                    )}
                </section>
            </div>
        </main>
    )
}
export default App;
