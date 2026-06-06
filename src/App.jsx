

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

  const [trending, setTrending] = useState([]);
  const [topRated, setTopRated] = useState([]);
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

  const [mode, setMode] = useState("movies"); // 👈 NEW: movies | tv

  const loaderRef = useRef(null);

  const openMovie = (movie) => setSelectedMovie(movie);
  const closeModal = () => setSelectedMovie(null);

  const openTrailer = (movie) => {
    const query = encodeURIComponent(`${movie.title} official trailer`);
    window.open(
      `https://www.youtube.com/results?search_query=${query}`,
      "_blank"
    );
  };

  // FETCH MOVIE DATA
  useEffect(() => {
    fetch(TRENDING_URL)
      .then((res) => res.json())
      .then((data) => setTrending(data.results || []));

    fetch(TOP_RATED_URL)
      .then((res) => res.json())
      .then((data) => setTopRated(data.results || []));

    fetch(ACTION_URL)
      .then((res) => res.json())
      .then((data) => setAction(data.results || []));

    fetch(COMEDY_URL)
      .then((res) => res.json())
      .then((data) => setComedy(data.results || []));
  }, []);

  // HERO ROTATION
  useEffect(() => {
    if (trending.length === 0) return;

    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % trending.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [trending]);

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
        if (mode === "movies") loadMoreMovies();
        if (mode === "tv") loadMoreTV();
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
            padding: "6px 12px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          TV Shows
        </button>

        <button
          onClick={() => setMode("movies")}
          style={{
            marginLeft: "10px",
            background: mode === "movies" ? "#e50914" : "transparent",
            color: "white",
            border: "1px solid #e50914",
            padding: "6px 12px",
            borderRadius: "20px",
            cursor: "pointer",
          }}
        >
          Movies
        </button>

 <input
  className="search-bar"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  placeholder="Search..."
/>

<div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

 

  </div>





      </nav>

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
          ▶ Play
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
          <MovieRow title="Trending Now" movies={trending} />
          <AdBanner />
          <MovieRow title="Top Rated" movies={topRated} />
          <AdBanner />
          <MovieRow title="Action Movies" movies={action} />
          <AdBanner />
          <MovieRow title="Comedy Movies" movies={comedy} />
          <AdBanner />

          <section className="movie-row">
            <h2>🔥 Popular Movies</h2>

               <AdBanner />

            <div className="movie-feed">
              {feedMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>
          </section>
        </>
      ) : (
        <section className="movie-row">
          <h2>📺 Popular TV Shows</h2>
          <div className="movie-feed">
            {feedTV.map((show) => (
              <MovieCard key={show.id} movie={show} isTV />
            ))}
          </div>
        </section>
      )}

      <div ref={loaderRef} style={{ height: "60px" }} />

      {/* MODAL */}

      {selectedMovie && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={
                selectedMovie.poster_path
                  ? `${IMAGE_BASE_URL}${selectedMovie.poster_path}`
                  : "https://via.placeholder.com/300x450"
              }
              alt={selectedMovie.title || selectedMovie.name}
            />

            <div className="modal-text">
              <h2>{selectedMovie.title || selectedMovie.name}</h2>
              <p>{selectedMovie.overview}</p>

              <button className="btn close" onClick={closeModal}>
                Close
              </button>
            </div>
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
    padding: "20px 40px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "30px",
    background: "transparent",
    borderTop: "1px solid rgba(255,255,255,0.02)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(10px)",
    
    zIndex: 1000,
  }}
>
      <a
          href="/about"
            style={
              {
               color: "#e50914",
               textDecoration: "none",
                fontSize: "14px",
              }}
     >
              About
      </a>

  <a
    href="/contact"
    style={{
      color: "#e50914",
      textDecoration: "none",
      fontSize: "14px",
    }}
  >
    Contact
  </a>

  <a
    href="/privacy-policy"
    style={{
      color: "#e50914",
      textDecoration: "none",
      fontSize: "14px",
    }}
  >
    Privacy Policy
  </a>
</footer>
      

    </div>
  );

}
 

export default App;