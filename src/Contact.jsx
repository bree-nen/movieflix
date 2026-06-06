

export default function Contact() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Contact Us</h1>

        <p style={styles.text}>
          Got feedback,or suggestions? We'd love to hear from you.
        </p>

        <div style={styles.infoBox}>
          <p>📧 Email</p>
          <p style={{ color: "#e50914" }}>support@movieflix.com</p>
        </div>

        <div style={styles.infoBox}>
          <p>💬 Response Time</p>
          <p>24–48 hours</p>
        </div>

        <button
          style={styles.button}
          onClick={() => window.location.href = "mailto:britneynenwalwi9@gmail.com"}
        >
          Send Email
        </button>
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
    maxWidth: "600px",
    background: "rgba(20,20,20,0.85)",
    padding: "40px",
    borderRadius: "15px",
    border: "1px solid rgba(229,9,20,0.3)",
    boxShadow: "0 0 25px rgba(229,9,20,0.2)",
    textAlign: "center",
  },
  title: {
    color: "#e50914",
    marginBottom: "20px",
    fontSize: "32px",
  },
  text: {
    opacity: 0.85,
    marginBottom: "20px",
  },
  infoBox: {
    marginTop: "15px",
    padding: "12px",
    background: "rgba(255,255,255,0.05)",
    borderRadius: "10px",
  },
  button: {
    marginTop: "25px",
    padding: "12px 20px",
    background: "#e50914",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};