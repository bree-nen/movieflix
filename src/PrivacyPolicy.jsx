export default function PrivacyPolicy() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Privacy Policy</h1>

        <p style={styles.text}>
          Movieflix respects your privacy and is committed to protecting your personal data.
        </p>

        <h3 style={styles.subtitle}>Information We Collect</h3>
        <p style={styles.text}>
          We may collect basic usage data such as pages visited and interactions to improve user experience.
        </p>

        <h3 style={styles.subtitle}>Cookies</h3>
        <p style={styles.text}>
          We may use cookies to enhance website performance and analytics.
        </p>

        <h3 style={styles.subtitle}>Third-Party Services</h3>
        <p style={styles.text}>
          We use TMDB API and may integrate Google services such as AdSense in the future.
        </p>

        <h3 style={styles.subtitle}>Contact</h3>
        <p style={styles.text}>
          If you have questions, contact us via the website or project owner.
        </p>

        <p style={styles.small}>Last updated: 2026</p>
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
    maxWidth: "800px",
    background: "rgba(20,20,20,0.85)",
    padding: "40px",
    borderRadius: "15px",
    border: "1px solid rgba(229,9,20,0.3)",
  },
  title: {
    color: "#e50914",
    marginBottom: "20px",
    fontSize: "32px",
  },
  subtitle: {
    marginTop: "20px",
  },
  text: {
    opacity: 0.85,
    lineHeight: "1.6",
  },
  small: {
    marginTop: "20px",
    fontSize: "12px",
    opacity: 0.5,
  },
};