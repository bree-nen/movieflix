

export default function Terms() {
  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h1 style={styles.title}>Terms of Service</h1>

        <p style={styles.text}>
          By using Movieflix, you agree to the following terms and conditions.
        </p>

        <h3 style={styles.subtitle}>1. Content</h3>
        <p style={styles.text}>
          Movieflix does not host or store any movies or TV shows. All content is provided
          via third-party APIs for informational and discovery purposes only.
        </p>

        <h3 style={styles.subtitle}>2. Usage</h3>
        <p style={styles.text}>
          Users agree to use this website responsibly and not misuse any features or services.
        </p>

        <h3 style={styles.subtitle}>3. Changes</h3>
        <p style={styles.text}>
          We may update these terms at any time without prior notice.
        </p>

        <p style={styles.small}>
          Last updated: 2026
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
    color: "#fff",
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