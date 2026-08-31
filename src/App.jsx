import { Link } from "react-router-dom";

import { useEffect, useState, useRef } from "react";
import {
  TRENDING_URL,
  TOP_RATED_URL,
  ACTION_URL,
  COMEDY_URL,
  IMAGE_BASE_URL,
} from "./api";
import "./App.css";

function App() {

   

    const GENRES = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

const TV_GENRES = {
  10759: "Action & Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  10762: "Kids",
  9648: "Mystery",
  10763: "News",
  10764: "Reality",
  10765: "Sci-Fi & Fantasy",
  10766: "Soap",
  10767: "Talk",
  10768: "War & Politics",
  37: "Western",
};


// helper function (reusable everywhere)
const getGenreNames = (movie, limit = 2) => {
  if (!movie?.genre_ids) return "";
  return movie.genre_ids
    .map((id) => GENRES[id])
    .filter(Boolean)
    .slice(0, limit)
    .join(", ");
};


  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMovie, setSelectedMovie] = useState(null);
{/*
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false); 
  */}

  const [movieDetails, setMovieDetails] = useState(null);
  const [cast, setCast] = useState([]);

  const [selectedActor, setSelectedActor] = useState(null);
  const [actorMovies, setActorMovies] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [expandedReview, setExpandedReview] = useState(null);

  const [recommendations, setRecommendations] = useState([]);

  const [trailerKey, setTrailerKey] = useState(null);
  const [trailerList, setTrailerList] = useState([]);
  const [trailerIndex, setTrailerIndex] = useState(0);
  const [showTrailer, setShowTrailer] = useState(false);

  const [trailerMovie, setTrailerMovie] = useState(null);

  const [selectedGenre, setSelectedGenre] = useState("All");
  const [showGenres, setShowGenres] = useState(false);

  const [selectedMovieGenre, setSelectedMovieGenre] = useState("All");
  const [showMovieGenres, setShowMovieGenres] = useState(false);

const [genreMovies, setGenreMovies] = useState([]);
const [genreMoviePage, setGenreMoviePage] = useState(1);
const [genreMovieLoading, setGenreMovieLoading] = useState(false);
const [hasMoreGenreMovies, setHasMoreGenreMovies] = useState(true);


const [genreTV, setGenreTV] = useState([]);
const [genreTVPage, setGenreTVPage] = useState(1);
const [hasMoreGenreTV, setHasMoreGenreTV] = useState(true);
const [tvGenreLoading, setTvGenreLoading] = useState(false);


  const [trending, setTrending] = useState([]);
  
  const [trendingTV, setTrendingTV] = useState([]);

  const [top10Type, setTop10Type] = useState("movies");

  const [topRated, setTopRated] = useState([]);
  const [trendingPeriod, setTrendingPeriod] = useState("day");

  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);

  const [feedMovies, setFeedMovies] = useState([]);
  const [feedTV, setFeedTV] = useState([]);

  const [page, setPage] = useState(1);
  const [tvPage, setTvPage] = useState(1);

  const [loading, setLoading] = useState(false);
  const [tvLoading, setTvLoading] = useState(false);

  const [hasMore, setHasMore] = useState(true);
  const [hasMoreTV, setHasMoreTV] = useState(true);

  const [heroIndex, setHeroIndex] = useState(0);

  const [isFading, setIsFading] = useState(false);

  const [mode, setMode] = useState("movies"); // 👈 NEW: movies | tv


  const loaderRef = useRef(null);

  const openMovie = async (movie) => {
  setSelectedMovie(movie);

  try {
    // GET FULL DETAILS (rating + overview)
    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/${movie.title ? "movie" : "tv"}/${movie.id}?api_key=5397bbf0a2433675faec26633a785796`
    );
    const detailsData = await detailsRes.json();
    setMovieDetails(detailsData);

    // GET CAST
    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/${movie.title ? "movie" : "tv"}/${movie.id}/credits?api_key=5397bbf0a2433675faec26633a785796`
    );
    const creditsData = await creditsRes.json();

    setCast(creditsData.cast?.slice(0, 8) || []);
    
    // GET REVIEWS
    const reviewsRes = await fetch(
      `https://api.themoviedb.org/3/${movie.title ? "movie" : "tv"}/${movie.id}/reviews?api_key=5397bbf0a2433675faec26633a785796`
    );

    const reviewsData = await reviewsRes.json();

    setReviews(reviewsData.results || []);

    // GET RECOMMENDATIONS
    const recommendationsRes = await fetch(
  `https://api.themoviedb.org/3/${movie.title ? "movie" : "tv"}/${movie.id}/recommendations?api_key=5397bbf0a2433675faec26633a785796`
   );

    const recommendationsData = await recommendationsRes.json();

  setRecommendations(
  recommendationsData.results?.slice(0, 10) || []
   );

  } catch (err) {
    console.error(err);
  }
};

const openActor = async (actor) => {
  try {
    setSelectedActor(actor);

    const detailsRes = await fetch(
      `https://api.themoviedb.org/3/person/${actor.id}?api_key=5397bbf0a2433675faec26633a785796`
    );

    const detailsData = await detailsRes.json();

    setSelectedActor(detailsData);

    const creditsRes = await fetch(
      `https://api.themoviedb.org/3/person/${actor.id}/combined_credits?api_key=5397bbf0a2433675faec26633a785796`
    );

    const creditsData = await creditsRes.json();

    const movies = (creditsData.cast || [])
      .filter((item) => item.poster_path)
      .sort(
        (a, b) =>
          new Date(b.release_date || b.first_air_date || 0) -
          new Date(a.release_date || a.first_air_date || 0)
      );

    setActorMovies(movies);
  } catch (err) {
    console.error("Error loading actor:", err);
  }
};

  const closeModal = () => setSelectedMovie(null);

  {/* TRAILER, TRAILER FALLBACK */}

const openTrailer = async (movie) => {
  try {
    const type = movie.first_air_date ? "tv" : "movie";

    const res = await fetch(
      `https://api.themoviedb.org/3/${type}/${movie.id}/videos?api_key=5397bbf0a2433675faec26633a785796&language=en-US`
    );

    const data = await res.json();

    // 🎬 Get all usable YouTube videos
    const videos = (data.results || [])
      .filter(
        (video) =>
          video.site === "YouTube" &&
          video.key
      );

    // 🎯 Preferred order
    const priority = {
      Trailer: 1,
      Teaser: 2,
      Clip: 3,
      Featurette: 4,
    };

    const sortedVideos = videos.sort((a, b) => {

      // Official videos first
      if (a.official && !b.official) return -1;
      if (!a.official && b.official) return 1;

      // Then by video type
      return (
        (priority[a.type] || 99) -
        (priority[b.type] || 99)
      );
    });


    // 🎥 VIDEO FOUND
    if (sortedVideos.length > 0) {

      setTrailerList(sortedVideos);
      setTrailerIndex(0);
      setTrailerKey(sortedVideos[0].key);
      setShowTrailer(true);
      return;
    }


    // 🖼️ NO VIDEO FOUND
    // Show MovieFlix fallback instead of alert

    setTrailerKey(null);
    setTrailerList([]);
    setTrailerIndex(0);
    setTrailerMovie(movie);
    setShowTrailer(true);

  } catch (error) {

    console.error("Error fetching trailer:", error);

    // 🖼️ FALLBACK IF TMDB REQUEST FAILS

    setTrailerKey(null);
    setTrailerList([]);
    setTrailerIndex(0);
    setTrailerMovie(movie);
    setShowTrailer(true);
  }
};



const searchTMDB = async (query) => {
  if (!query.trim()) {
    setSearchResults([]);
    setIsSearching(false);
    return;
  }

  try {
    setIsSearching(true);

    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=5397bbf0a2433675faec26633a785796&query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`
    );

    const data = await res.json();

    setSearchResults(
      (data.results || []).filter(
        (item) =>
          item.media_type === "movie" ||
          item.media_type === "tv"
      )
    );

  } catch (error) {
    console.error("Search error:", error);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};




{/*
const searchTMDB = async (query) => {
  const trimmedQuery = query.trim();

  if (!trimmedQuery) {
    setSearchResults([]);
    setIsSearching(false);
    return;
  }

  setIsSearching(true);

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/search/multi?api_key=5397bbf0a2433675faec26633a785796&query=${encodeURIComponent(trimmedQuery)}&include_adult=false&language=en-US&page=1`
    );

    const data = await res.json();

    const results = (data.results || []).filter(
      (item) =>
        item.media_type === "movie" ||
        item.media_type === "tv"
    );

    setSearchResults(results);

  } catch (error) {
    console.error("Search error:", error);
    setSearchResults([]);

  } finally {
    setIsSearching(false);
  }
};

*/}

  // FETCH MOVIE DATA
  useEffect(() => {

    fetch(TRENDING_URL)
       .then((res) => res.json())
       .then((data) => setTrending(data.results || []));

    fetch("https://api.themoviedb.org/3/trending/tv/day?api_key=5397bbf0a2433675faec26633a785796")
      .then((res) => res.json())
      .then((data) => setTrendingTV(data.results || []));

    fetch(TOP_RATED_URL)
      .then((res) => res.json())
      .then((data) => setTopRated(data.results || []));

    fetch(ACTION_URL)
      .then((res) => res.json())
      .then((data) => setAction(data.results || []));

    fetch(COMEDY_URL)
      .then((res) => res.json())
      .then((data) => setComedy(data.results || []));
      

      console.log("Trending period:", trendingPeriod);

      fetch(`https://api.themoviedb.org/3/trending/movie/${trendingPeriod}?api_key=5397bbf0a2433675faec26633a785796`)
          .then((res) => res.json())
          .then((data) => {
        
      }); 

  }, [trendingPeriod]);
{/*
  useEffect(() => {
  const delaySearch = setTimeout(() => {
    searchTMDB(searchTerm);
  }, 500);

  return () => clearTimeout(delaySearch);
}, [searchTerm]);

*/}

  // HERO ROTATION
  useEffect(() => {
    if (trending.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [trending]);


  useEffect(() => {
  setIsFading(true);

  const timeout = setTimeout(() => {
    setIsFading(false);
  }, 1200);

  return () => clearTimeout(timeout);
}, [heroIndex]);

  const heroMovie = trending[heroIndex] || {};

  // LOAD MORE MOVIES

  const loadMoreMovies = async () => {
    
    if (loading || !hasMore || mode !== "movies") return;

    setLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/movie/popular?api_key=5397bbf0a2433675faec26633a785796&page=${page}`
      );
      const data = await res.json();

      if (!data.results?.length) {
        setHasMore(false);
        return;
      }

      setFeedMovies((prev) => {
        const existing = new Set(prev.map((m) => m.id));
        const filtered = data.results.filter((m) => !existing.has(m.id));
        return [...prev, ...filtered];
      });

      setPage((p) => p + 1);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };


  const loadMoreGenreMovies = async () => {
  if (genreMovieLoading || !hasMoreGenreMovies || selectedMovieGenre === "All")
    return;

  setGenreMovieLoading(true);

  const nextPage = genreMoviePage + 1;

  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=5397bbf0a2433675faec26633a785796&with_genres=${selectedMovieGenre}&sort_by=popularity.desc&page=${nextPage}`
    );

    const data = await res.json();

    if (!data.results?.length) {
      setHasMoreGenreMovies(false);
      return;
    }

    setGenreMovies((prev) => [...prev, ...data.results]);
    setGenreMoviePage(nextPage);
  } catch (err) {
    console.error(err);
  }

  setGenreMovieLoading(false);
};


  const fetchMoviesByGenre = async (genreId, page = 1) => {
  try {
    const res = await fetch(
      `https://api.themoviedb.org/3/discover/movie?api_key=5397bbf0a2433675faec26633a785796&with_genres=${genreId}&sort_by=popularity.desc&page=${page}`
    );

    const data = await res.json();

    if (page === 1) {
      setGenreMovies(data.results || []);
    } else {
      setGenreMovies((prev) => {
  const existing = new Set(prev.map((m) => m.id));
  const filtered = (data.results || []).filter((m) => !existing.has(m.id));
  return [...prev, ...filtered];
  });
    }

    if (!data.results || data.results.length === 0) {
      setHasMoreGenreMovies(false);
    }
  } catch (err) {
    console.error(err);
  }
};

  // LOAD MORE TV SHOWS

  const loadMoreTV = async () => {

    if (tvLoading || !hasMoreTV || mode !== "tv") return;

    setTvLoading(true);

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/tv/popular?api_key=5397bbf0a2433675faec26633a785796&page=${tvPage}`
      );
      const data = await res.json();

      if (!data.results?.length) {
        setHasMoreTV(false);
        return;
      }

      setFeedTV((prev) => {
        const existing = new Set(prev.map((t) => t.id));
        const filtered = data.results.filter((t) => !existing.has(t.id));
        return [...prev, ...filtered];
      });

      setTvPage((p) => p + 1);
    } catch (err) {
      console.error(err);
    }

    setTvLoading(false);
  };

  const loadMoreGenreTV = async () => {
  if (tvGenreLoading || !hasMoreGenreTV || selectedGenre === "All") return;

  setTvGenreLoading(true);

  const nextPage = genreTVPage + 1;

  await fetchTVByGenre(selectedGenre, nextPage);

  setGenreTVPage(nextPage);

  setTvGenreLoading(false);
};


  {/* FETCH TV BY GENRE */}

  const fetchTVByGenre = async (genreId, page = 1) => {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/tv?api_key=5397bbf0a2433675faec26633a785796&with_genres=${genreId}&page=${page}`
  );

  const data = await res.json();

  if (page === 1) {
    setGenreTV(data.results || []);
  } else {
    setGenreTV((prev) => {
  const existing = new Set(prev.map((t) => t.id));
  const filtered = (data.results || []).filter((t) => !existing.has(t.id));
  return [...prev, ...filtered];
});
  }

  if (!data.results || data.results.length === 0) {
    setHasMoreGenreTV(false);
  }
};

  // INITIAL LOAD
  useEffect(() => {
    loadMoreMovies();
  }, []);

  useEffect(() => {
    if (mode === "tv" && feedTV.length === 0) {
      loadMoreTV();
    }
  }, [mode]);

  // INFINITE SCROLL
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (mode === "movies") {
  if (selectedMovieGenre === "All") {
    loadMoreMovies();
  } else {
    loadMoreGenreMovies();
  }
}

if (mode === "tv") {
  if (selectedGenre === "All") {
    loadMoreTV();
  } else {
    loadMoreGenreTV();
  }
}
      }
    });

    const current = loaderRef.current;
    if (current) observer.observe(current);

    return () => current && observer.unobserve(current);
  }, [loaderRef.current, mode, page, tvPage]);

  // CARD
  const MovieCard = ({ movie, isTV }) => (
    <div className="movie-card">
      <img
        src={
          movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : "https://via.placeholder.com/300x450"
        }
        alt={movie.title || movie.name}
        onClick={() => openMovie(movie)}
      />

      {/* ⭐ ADDED: YEAR + GENRE */}
      <div style={{ padding: "6px 8px", fontSize: "11px", opacity: 0.8 }}>
        {movie.release_date || movie.first_air_date
          ? new Date(movie.release_date || movie.first_air_date).getFullYear()
          : "—"}{" "}
        •{" "}
        {movie.genre_ids?.length
  ? movie.genre_ids
      .map((id) => GENRES[id])
      .filter(Boolean)
      .slice(0, 1)
      .join(", ")
  : "Genre"}
      </div>

      <div className="movie-overlay">
        <button
          className="trailer-btn"
          onClick={(e) => {
            e.stopPropagation();
            openTrailer(movie);
          }}
        >
          ▶ Trailer
        </button>
      </div>
    </div>
  );

  const MovieRow = ({ title, movies }) => (
    <section className="movie-row">
      <h2>{title}</h2>

      <div className="movie-container">
        {movies
          ?.filter((m) =>
            (m.title || m.name || "")
              .toLowerCase()
              .includes(searchTerm.toLowerCase())
          )
          .map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
      </div>
    </section>
  );


  const AdBanner = ({ label = "Advertisement" }) => (
  <div
    style={{
      width: "100%",
      padding: "10px",
      margin: "20px 0",
      textAlign: "center",
      background: "#111",
      border: "1px solid #333",
      color: "#777",
      fontSize: "12px",
      borderRadius: "8px",
    }}
  >
    {label}

    {/* Google AdSense will replace this div later */}
    <div
      style={{
        height: "90px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#444",
        marginTop: "8px",
      }}
    >
      Ad Space (Google AdSense)
    </div>
  </div>
);





const linkStyle = {
  color: "#e50914",
  textDecoration: "none",
  fontSize: "14px",
  transition: "0.2s ease",
};


const filteredTV =
  selectedGenre === "All"
    ? feedTV
    : feedTV.filter((show) =>
        show.genre_ids?.includes(Number(selectedGenre))
      );


const filteredMovies =
  selectedMovieGenre === "All"
    ? feedMovies
    : feedMovies.filter((movie) =>
        movie.genre_ids?.includes(Number(selectedMovieGenre))
      );

const selectedMovieGenreName =
  selectedMovieGenre === "All"
    ? "Popular Movies"
    : GENRES[selectedMovieGenre];


{/* PART 2 STARTS HERE */}


  return (
    <div className="app">

      {/* NAVBAR */}

      <nav className="navbar">

        <h1
          className="logo"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          MOVIEFLIX
        </h1>

        <button
          onClick={() => setMode("tv")}
          style={{
            marginLeft: "20px",
            background: mode === "tv" ? "#e50914" : "transparent",
            color: "white",
            border: "1px solid #e50914",
            padding: "6px 6px",
            borderRadius: "20px",
            cursor: "pointer",
            width: "min(90vw, 500px)" 
          }}
        >
          TV Shows
        </button>


        {/*TV SHOWS GENRE BUTTON*/}

        {mode === "tv" && (
  <div style={{ position: "relative" }}>
    <button
      onClick={() => setShowGenres(!showGenres)}
      style={{
        marginLeft: "10px",
        background: "transparent",
        color: "white",
        border: "1px solid #e50914",
        padding: "6px 6px",
        borderRadius: "20px",
        cursor: "pointer",
        minWidth: "80px ",
      }}
      class="desktop-only"
    >
      Genres
    </button>

    {showGenres && (
  <div
    style={{
      position: "absolute",
      top: "45px",
      left: 0,

      minWidth: "220px",
      maxHeight: "300px",      // height limit
      overflowY: "auto",       // enables scrolling

      background: "rgba(0, 0, 0, 0.75)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",

      border: "1px solid rgba(229, 9, 20, 0.4)",
      borderRadius: "12px",

      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      
      zIndex: 9999,
    }}
  >
        <div
          style={{ padding: "10px", cursor: "pointer" }}
          onClick={() => {
             setSelectedGenre("All");
             setShowGenres(false);

              setGenreTV([]);
              setGenreTVPage(1);
              setHasMoreGenreTV(true);
            }}
        >
          All Genres
        </div>

        {Object.entries(TV_GENRES).map(([id, name]) => (
          <div
            key={id}
            style={{ padding: "10px", cursor: "pointer" }}
            onClick={() => {
  setSelectedGenre(id);
  setShowGenres(false);

  setGenreTV([]);
  setGenreTVPage(1);
  setHasMoreGenreTV(true);

  fetchTVByGenre(id, 1);
}}
          >
            {name}
          </div>
        ))}
      </div>
    )}
  </div>
)}


{/*MOVIES BUTTON */}

        <button
          onClick={() => setMode("movies")}
          style={{
            marginLeft: "0",
            background: mode === "movies" ? "#e50914" : "transparent",
            color: "white",
            border: "1px solid #e50914",
            padding: "6px 6px",
            borderRadius: "20px",
            cursor: "pointer",
            width: "min(90vw, 500px)",
          }}
        >
          Movies
        </button>


{mode === "movies" && (
  <div style={{ position: "relative" }}>
    <button
      onClick={() => setShowMovieGenres(!showMovieGenres)}
      style={{
        marginLeft: "10px",
        background: "transparent",
        color: "white",
        border: "1px solid #e50914",
        padding: "6px 6px",
        borderRadius: "20px",
        cursor: "pointer",
        minWidth: "80px",
      }}
      class="desktop-only"
    >
      Genres
    </button> 


    {showMovieGenres && (
      <div
        className="genre-dropdown"
        style={{
          position: "absolute",
          top: "45px",
          left: 0,

          minWidth: "220px",
          maxHeight: "300px",
          overflowY: "auto",

          background: "rgba(0, 0, 0, 0.75)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",

          border: "1px solid rgba(229,9,20,0.4)",
          borderRadius: "12px",

          boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          zIndex: 9999,
        }}
      >
        <div
          style={{
            padding: "12px 16px",
            cursor: "pointer",
            color: "white",
          }}
          
          onClick={() => {
             setSelectedMovieGenre("All");
             setGenreMovies([]);
             setShowMovieGenres(false);
           }}


          >
          All Genres
        </div>

        {Object.entries(GENRES).map(([id, name]) => (
          <div
            key={id}
            style={{
              padding: "12px 16px",
              cursor: "pointer",
              color: "white",
            }}
            onClick={() => {
  setSelectedMovieGenre(id);
  setShowMovieGenres(false);

  // RESET PAGINATION
  setGenreMoviePage(1);
  setHasMoreGenreMovies(true);

  // CLEAR OLD DATA FIRST
  setGenreMovies([]);

  // FETCH FIRST PAGE
  if (id !== "All") {
    fetchMoviesByGenre(id, 1);
  }
}}

          >
            {name}
          </div>
        ))}
      </div>
    )}
  </div>
)}

{/*     SEARCH BAR     */}

{/*
 <input
  className="search-bar"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search..."
/>

<div style={{ display: "flex", alignItems: "center", gap: "10px"}}>

  </div>

  */}

  <div className="search-wrapper">

  <span className="search-icon">🔎</span>

  <input
    className="search-bar"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    placeholder="Search movies & TV shows..."
  />

  {searchTerm && (
    <button
      className="search-clear"
      onClick={() => setSearchTerm("")}
      aria-label="Clear search"
    >
      ✕
    </button>
  )}

</div>

</nav> 


{showTrailer && (
  <div
    className="trailer-modal"
    onClick={() => {
      setShowTrailer(false);
      setTrailerKey(null);
      setTrailerList([]);
      setTrailerIndex(0);
      setTrailerMovie(null);
    }}
  >

    <div
      className="trailer-content"
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE BUTTON */}

      <button
        className="trailer-close"
        onClick={() => {
          setShowTrailer(false);
          setTrailerKey(null);
          setTrailerList([]);
          setTrailerIndex(0);
          setTrailerMovie(null);
        }}
      >
        ✕
      </button>


      {/* 🎬 TRAILER */}

      {trailerKey ? (

        <iframe
          key={trailerKey}
          width="100%"
          height="500"
          src={`https://www.youtube.com/embed/${trailerKey}`}
          title="Movie Trailer"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => {

            const nextIndex = trailerIndex + 1;

            if (nextIndex < trailerList.length) {

              setTrailerIndex(nextIndex);
              setTrailerKey(trailerList[nextIndex].key);

            } else {

              setTrailerKey(null);

            }

          }}
        />

      ) : (

        /* 🖼️ NO TRAILER FALLBACK */

        <div
          className="trailer-fallback"
          style={{
            backgroundImage: trailerMovie?.backdrop_path
              ? `linear-gradient(
                  rgba(0,0,0,0.45),
                  rgba(0,0,0,0.9)
                ),
                url(https://image.tmdb.org/t/p/w1280${trailerMovie.backdrop_path})`
              : "none"
          }}
        >

          <div className="trailer-fallback-content">

            <div className="fallback-icon">
              🎬
            </div>

            <h2>
              Trailer Unavailable
            </h2>

            <p>
              {trailerMovie?.title ||
                trailerMovie?.name ||
                "This title"}
            </p>

            <span>
              We couldn't find a playable trailer for this title right now.
            </span>

            <button
              className="fallback-close"
              onClick={() => {
                setShowTrailer(false);
                setTrailerKey(null);
                setTrailerList([]);
                setTrailerIndex(0);
                setTrailerMovie(null);
              }}
            >
              Continue Browsing
            </button>

          </div>

        </div>

      )}

    </div>

  </div>
)}

{/*PART 3 STARTS */}

{/* HOMEPAGE CONTENT */}



{mode === "movies" && (



  <section className="hero-section">

    <div className="bg bg-1"
  style={{
    backgroundImage: trending[heroIndex]?.backdrop_path
      ? `url(https://image.tmdb.org/t/p/original${trending[heroIndex].backdrop_path})`
      : `url(https://via.placeholder.com/1280x720)`,
    opacity: isFading ? 0 : 1,
  }}
/>

<div className="bg bg-2"
  style={{
    backgroundImage: trending[(heroIndex + 1) % trending.length]?.backdrop_path
  ? `url(https://image.tmdb.org/t/p/original${trending[(heroIndex + 1) % trending.length].backdrop_path})`
  : `url(https://via.placeholder.com/1280x720)`,
    opacity: isFading ? 1 : 0,
  }}
/>


 <div className="hero-content">

<h1>
  Discover Movies & TV Shows Like Never Before
</h1>

<p>
  Welcome to MovieFlix — your personalized streaming discovery platform.
  Explore trending movies, top-rated films, and popular TV shows all in one place.
</p>
<p>
  We help you find what to watch next by organizing content into clean categories,
  real-time trending lists, and curated recommendations based on popularity and ratings.
</p>
<p>
  Instead of endlessly scrolling through streaming platforms, MovieFlix helps you
  quickly decide what to watch using structured recommendations and clean movie previews.
</p>

<h3> What You Can Do on MovieFlix</h3>


  <li>Discover trending movies updated in real-time</li>
  <li>Explore top-rated films across all genres</li>
  <li>Watch official trailers instantly</li>
  <li>Browse TV shows and movie collections</li>
  <li>Search any movie of your choice</li>
  <li>Click movie of your choice to get movie details, ratings and the the top billed cast</li>


    </div>
  </section>
)}


<div className="editor-picks">
  <h3>Editor’s Picks</h3>

  <div className="editor-grid">
    {trending.slice(0, 3).map((movie) => (
      <div key={movie.id} className="editor-card">

        <img
          src={`https://image.tmdb.org/t/p/w500${movie.backdrop_path}`}
          alt={movie.title}
          onClick={() => openMovie(movie)}
        />

        <div className="editor-info">
          <h4>{movie.title}</h4>
          <p>{movie.release_date?.slice(0, 4)}</p>

          {/* ▶ TRAILER BUTTON */}
          <button
            className="editor-trailer-btn"
            onClick={(e) => {
              e.stopPropagation();
              openTrailer(movie);
            }}
          >
            ▶ Trailer
          </button>
        </div>
      </div>
    ))}
  </div>
</div>

  

{/* HERO */}


{mode === "movies" && (
  <section
    className="hero"
    style={{
      backgroundImage: heroMovie.backdrop_path
        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.9)), url(https://image.tmdb.org/t/p/w1280${heroMovie.backdrop_path})`
        : undefined,
    }}
  >
    <div className="hero-content">
      <h1>{heroMovie.title || "Loading..."}</h1>

      {/* 👇 NEW: Year + REAL Genre Names */}

      <p style={{ opacity: 0.8, marginBottom: "10px" }}>
        {heroMovie.release_date?.slice(0, 4)}{" "}
        {heroMovie.genre_ids?.length
          ? "• " +
            heroMovie.genre_ids
              .map((id) => {
                const genres = {
                  28: "Action",
                  12: "Adventure",
                  16: "Animation",
                  35: "Comedy",
                  80: "Crime",
                  99: "Documentary",
                  18: "Drama",
                  10751: "Family",
                  14: "Fantasy",
                  36: "History",
                  27: "Horror",
                  10402: "Music",
                  9648: "Mystery",
                  10749: "Romance",
                  878: "Sci-Fi",
                  10770: "TV Movie",
                  53: "Thriller",
                  10752: "War",
                  37: "Western",
                };
                return genres[id];
              })
              .filter(Boolean)
              .slice(0, 2)
              .join(", ")
          : ""}
      </p>

      <p>
        {heroMovie.overview ||
          "Discover amazing movies from our collection."}
      </p>

      <div className="buttons">
        <button
          className="btn play"
          onClick={() => openMovie(heroMovie)}
        >
          ▶ Details
        </button>

        <button
          className="btn info"
          onClick={() => openTrailer(heroMovie)}
        >
          ▶ Trailer
        </button>
      </div>
    </div>
  </section>

 
)}



      {/* CONTENT */}



      {mode === "movies" ? (
        <>


      <section>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
    }}
  >
    <h2 style={{ 
      margin: 0,
       color:"white",
       marginTop: "25px",
       paddingLeft: "100px"      
       }}>
         Trending
         
    </h2>

    <button
      onClick={() => setTrendingPeriod("day")}
      style={{
        padding: "6px 24px",
        borderRadius: "20px",
        border: "1px solid #e32d2d",
        background:
          trendingPeriod === "day" ? "#e50914" : "transparent",
        color: "white",
        cursor: "pointer",
        marginTop: "25px ",
         
      }}
    class="desktop-only"
    >
      Today
    </button>

    <button
      onClick={() => setTrendingPeriod("week")}
      style={{
        padding: "6px 24px",
        borderRadius: "20px",
        border: "1px solid #e32d2d",
        background:
          trendingPeriod === "week" ? "#e50914" : "transparent",
        color: "white",
        cursor: "pointer",
        marginTop: "25px ",
      }}
      class="desktop-only"
    >
      This Week
    </button>
  </div>

<br/>

  <p style={{ opacity: 0.7, fontSize: "17px", marginTop: "-8px", paddingRight:"80px" }}>
  Movies trending globally right now.
  Updated daily and weekly based on what people are watching.
  </p>

  <MovieRow title="" movies={trending} />



 {/*<AdBanner /> */} 


</section>


{/* TOP 10 TRENDING */}


<section className="top10-section">

  <div className="top10-header">
    <h2>Top 10 Trending</h2>
  </div>

  <p className="top10-description">
    The most popular movies and TV shows trending right now.
  </p>

  <div className="top10-tabs">

    <button
      className={top10Type === "movies" ? "active" : ""}
      onClick={() => setTop10Type("movies")}
    >
      Movies
    </button>

    <button
      className={top10Type === "tv" ? "active" : ""}
      onClick={() => setTop10Type("tv")}
    >
      TV Shows
    </button>

  </div>

  <div className="top10-row">

    {(top10Type === "movies" ? trending : trendingTV)
      .slice(0, 10)
      .map((movie, index) => (

        <div className="top10-card" key={movie.id}>

          <span className="top10-number">
            {index + 1}
          </span>

          <div
            className="top10-poster"
            onClick={() => openMovie(movie)}
          >

            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
            />

          </div>

        </div>

      ))}

  </div>

</section>

  


<section>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
    }}
  >

         <h2 style={{ 
                 margin: 0,
                 color:"red",
                 marginTop: "25px",
                 paddingLeft: "100px"      
               }}>
               Top Rated
         
        </h2>
</div>

<br/>
           <p style={{ opacity: 0.7, fontSize: "17px", marginTop: "-8px", marginLeft: "50px"}}>
                Highly rated movies loved by audiences.From timeless classics to modern masterpieces, these are the movies with the best ratings worldwide.
           </p>

       <MovieRow title="" movies={topRated} />
  
            {/*<AdBanner /> */} 

         </section>

<section>
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
    }}
  >

         <h2 style={{ 
                 margin: 0,
                 color:"red",
                 marginTop: "25px",
                 paddingLeft: "100px"      
               }}>
               Action Movies
         
        </h2>
</div>

<br/>
           <p style={{ opacity: 0.7, fontSize: "17px", marginTop: "-8px", paddingLeft:"70px" }}>
                Dive into a world of explosive action, intense combat, high-stakes missions, and adrenaline-fueled adventures featuring some of cinema's biggest heroes and villains.
           </p>

       <MovieRow title="" movies={action} />
  
           {/*<AdBanner /> */} 


         </section>

         <section>

  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: "12px",
      marginBottom: "10px",
    }}
  >

         <h2 style={{ 
                 margin: 0,
                 color:"red",
                 marginTop: "25px",
                 paddingLeft: "100px"      
               }}>
               Comedy Movies
         
        </h2>
</div>

<br/>
           <p style={{ opacity: 0.7, fontSize: "17px", marginTop: "-8px", paddingLeft:"54px" }}>
                From clever jokes to outrageous adventures, these comedy favorites are guaranteed to bring smiles, laughter, and plenty of entertainment.
           </p>

       <MovieRow title="" movies={comedy} />
  
            {/*<AdBanner /> */} 


         </section>     

        

          <section className="movie-row">

            <h2  style={{ 
                 margin: 0,
                 color:"red",
                 marginTop: "25px",
                 paddingLeft: "100px"      
               }}>
            
               {selectedMovieGenre === "All"
                 ? "All Popular Movies Of All Times"
                 : `🎬 ${selectedMovieGenreName} Movies`}
           </h2>
           <br/>
           <p style={{ opacity: 0.7, fontSize: "17px", marginTop: "-8px", paddingLeft:"50px" }}
           >Discover the movies everyone is talking about, from blockbuster hits to fan favorites that are capturing audiences around the world.
            Discover stories that define modern storytelling and continue to resonate with viewers around the world.</p>
           <p style={{ color: "red"}}> Discover stories that have defined cinema and stood the test of time.</p>

          {/*<AdBanner /> */} 

           <div className="movie-feed">
           {(selectedMovieGenre === "All" ? feedMovies : genreMovies).map((movie) => (
           <MovieCard key={movie.id} movie={movie} />
            ))}
           </div>


          </section>
        </>
      ) : (



        <section className="movie-row">

          <h2 style={{ 
                 margin: 0,
                 color:"red",
                 fontSize:"42px",
                 marginTop: "2px",
                 paddingLeft: "50px"      
               }}>

         Popular TV Shows</h2>


          <p style={{ opacity: 0.7, fontSize: "18px", lineHeight: "2.1", marginTop: "12px" }}>
               Discover the most popular TV shows that audiences around the world are currently watching and discussing.  
            From gripping dramas and thrilling mysteries to light-hearted comedies, these series define today’s entertainment trends.  
            Stay up to date with binge-worthy stories, unforgettable characters, and episodes that keep viewers hooked from start to finish.  
             Explore shows that dominate streaming platforms and continue to grow in popularity every day.
          </p>

         <div style={{ opacity: 0.7, fontSize: "18px", lineHeight: "2.6", marginTop: "12px" }}>
   Binge-worthy series across all genres<br />
  Trending shows watched worldwide<br />
  Memorable characters and storylines<br />
  Constantly updated with new popular titles<br />
  Addictive episodes that keep you watching late into the night
</div>
          <div className="movie-feed">
            {(selectedGenre === "All" ? feedTV : genreTV).map((show) => (
                <MovieCard key={show.id} movie={show} isTV />
             ))
            }
          </div>

        </section>
      )}



      <div ref={loaderRef} style={{ height: "60px" }} />



 {/* MODAL */}

{selectedMovie && (
  <div className="modal-overlay" onClick={closeModal}>

    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
    >

      {/* MOVIE HEADER */}

      <div className="movie-details-header">

        <img
          className="movie-details-poster"
          src={
            selectedMovie.poster_path
              ? `${IMAGE_BASE_URL}${selectedMovie.poster_path}`
              : "https://via.placeholder.com/300x450"
          }
          alt={selectedMovie.title || selectedMovie.name}
        />

        <div className="movie-details-info">

          <h2>
            {selectedMovie.title || selectedMovie.name}
          </h2>

          {/* ⭐ RATING */}

          <p className="movie-rating">
            ⭐ Rating:{" "}
            {movieDetails?.vote_average?.toFixed(1) || "N/A"} / 10
          </p>

          {/* 🎬 OVERVIEW */}

          <p className="movie-overview">
            {movieDetails?.overview || selectedMovie.overview}
          </p>


          {/* 🎥 WATCH TRAILER */}

            <button
              className="modal-trailer-btn"
             onClick={() => openTrailer(selectedMovie)}
              >
              ▶ Watch Trailer
            </button>

        </div>

      </div>


      {/* 👥 CAST */}

      <div className="cast-section">

        <h3>Top Billed Cast</h3>

        <div className="cast-container">

          {cast.map((actor) => (

            <div
              key={actor.id}
              className="cast-card"
              onClick={() => openActor(actor)}
            >

              <img
                src={
                  actor.profile_path
                    ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                    : "https://via.placeholder.com/80x120?text=No+Image"
                }
                alt={actor.name}
              />

              <p className="cast-name">
                {actor.name}
              </p>

              <p className="cast-character">
                {actor.character}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* ⭐ REVIEWS */}

      <div className="reviews-section">

        <div className="reviews-header">

          <h3>⭐ Reviews</h3>

          {reviews.length > 0 && (
            <span>
              {reviews.length} reviews
            </span>
          )}

        </div>


        {reviews.length > 0 ? (

          <div className="reviews-container">

            {reviews.slice(0, 5).map((review) => {

  const content = review.content || "";
  const isLong = content.length > 350;
  const isExpanded = expandedReview === review.id;

  return (

    <div
      className="review-card"
      key={review.id}
    >

      {/* REVIEW HEADER */}

      <div className="review-top">

        <div className="reviewer">

          <div className="review-avatar">
            {review.author?.charAt(0)?.toUpperCase() || "U"}
          </div>

          <div>

            <p className="review-author">
              {review.author || "Anonymous"}
            </p>

            <p className="review-date">
              {review.created_at
                ? new Date(
                    review.created_at
                  ).toLocaleDateString()
                : ""}
            </p>

          </div>

        </div>


        {/* RATING */}

        {review.author_details?.rating && (

          <div className="review-rating">
            ⭐ {review.author_details.rating}/10
          </div>

        )}

      </div>


      {/* REVIEW TEXT */}

      <p className="review-content">

        {isLong && !isExpanded
          ? `${content.substring(0, 350)}...`
          : content}

      </p>


      {/* READ MORE / SHOW LESS */}

      {isLong && (

        <button
          className="read-review"
          onClick={() =>
            setExpandedReview(
              isExpanded ? null : review.id
            )
          }
        >
          {isExpanded
            ? "Show less ↑"
            : "Read full review →"}
        </button>

      )}

    </div>

  );

})}

          </div>

        ) : (

          <div className="no-reviews">

            <span>💬</span>

            <p>
              No reviews available for this title yet.
            </p>

          </div>

        )}

      </div>
        
        {/* 🎬 YOU MIGHT ALSO LIKE */}

{recommendations.length > 0 && (
  <div className="recommendations-section">

    <div className="recommendations-header">
      <h3>You Might Also Like</h3>
    </div>

    <div className="recommendations-container">

      {recommendations.map((recommendation) => (

        <div
          className="recommendation-card"
          key={recommendation.id}
          onClick={() => openMovie(recommendation)}
        >

          <img
            src={
              recommendation.poster_path
                ? `${IMAGE_BASE_URL}${recommendation.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={
              recommendation.title ||
              recommendation.name
            }
          />

          <p>
            {recommendation.title ||
              recommendation.name}
          </p>

        </div>

      ))}

    </div>

  </div>
)}

      {/* CLOSE */}

      <button
        className="btn close"
        onClick={closeModal}
      >
        Close
      </button>

    </div>

  </div>
)}

{/* 👤 ACTOR MODAL */}

{selectedActor && (
  <div
    className="actor-modal-overlay"
    onClick={() => setSelectedActor(null)}
  >

    <div
      className="actor-modal"
      onClick={(e) => e.stopPropagation()}
    >

      {/* ACTOR HEADER */}

      <div className="actor-header">

        <img
          src={
            selectedActor.profile_path
              ? `https://image.tmdb.org/t/p/w500${selectedActor.profile_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={selectedActor.name}
        />

        <div className="actor-info">

          <h2>{selectedActor.name}</h2>

          <p>
            🎭 {selectedActor.known_for_department || "Acting"}
          </p>

          {selectedActor.birthday && (
            <p>
              🎂 {selectedActor.birthday}
            </p>
          )}

          {selectedActor.place_of_birth && (
            <p>
              📍 {selectedActor.place_of_birth}
            </p>
          )}

        </div>

      </div>


      {/* BIOGRAPHY */}

      {selectedActor.biography && (
        <div className="actor-biography">

          <h3>Biography</h3>

          <p>
            {selectedActor.biography}
          </p>

        </div>
      )}


      {/* 🎬 FILMOGRAPHY */}

      <div className="actor-filmography">

        <h3>Known For</h3>

        <div className="actor-movies">

          {actorMovies.slice(0, 12).map((item) => (

            <div
              className="actor-movie-card"
              key={`${item.id}-${item.media_type}`}
              onClick={() => {
                setSelectedActor(null);
                openMovie(item);
              }}
            >

              <img
                src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                alt={item.title || item.name}
              />

              <p>
                {item.title || item.name}
              </p>

            </div>

          ))}

        </div>

      </div>


      {/* CLOSE ACTOR */}

      <button
        className="actor-close"
        onClick={() => setSelectedActor(null)}
      >
        Close
      </button>

    </div>

  </div>
)}



       {/* FOOTER  */}

      

 <footer

style={{
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  padding: "14px 40px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  gap: "18px",
  background: "transparent",
  borderTop: "1px solid rgba(255,255,255,0.02)",
  backdropFilter: "blur(4px)",
  WebkitBackdropFilter: "blur(6px)",
  zIndex: 1000,
}}

>

<Link to="/about" style={linkStyle}>About</Link>
<Link to="/contact" style={linkStyle}>Contact</Link>
<Link to="/privacy-policy" style={linkStyle}>Privacy Policy</Link>
<Link to="/terms" style={linkStyle}>Terms</Link>



</footer>
      

</div>


  );

}
 

export default App;
