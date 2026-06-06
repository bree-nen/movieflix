

export default function About() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>About Movieflix</h1>

        <p style={styles.text}>
          Movieflix is a modern movie discovery platform inspired by Netflix.
          It allows users to explore trending movies, top-rated films, and popular TV shows in one place.
        </p>

        <p style={styles.text}>
          Built using React and TMDB API, this project demonstrates real-world frontend development,
          API integration, and responsive UI design.
        </p>

        <div style={styles.highlightBox}>
          🎬 Discover • 🎥 Explore • 🍿 Enjoy
        </div>

        <p style={styles.small}>
          Movieflix does not host or stream any content.
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "radial-gradient(circle at top, #111, #000)",
    color: "white",
    padding: "40px",
  },
  card: {
    maxWidth: "700px",
    background: "rgba(20,20,20,0.85)",
    padding: "40px",
    borderRadius: "15px",
    border: "1px solid rgba(229,9,20,0.3)",
    boxShadow: "0 0 25px rgba(229,9,20,0.2)",
  },
  title: {
    color: "#e50914",
    marginBottom: "20px",
    fontSize: "32px",
  },
  text: {
    opacity: 0.85,
    lineHeight: "1.7",
    marginBottom: "15px",
  },
  highlightBox: {
    marginTop: "20px",
    padding: "15px",
    background: "rgba(229,9,20,0.1)",
    borderRadius: "10px",
    textAlign: "center",
    fontWeight: "bold",
  },
  small: {
    marginTop: "20px",
    fontSize: "12px",
    opacity: 0.5,
  },
};