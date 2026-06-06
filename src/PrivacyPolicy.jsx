
import "./App.css";

export default function PrivacyPolicy() {
  return (
    <div className="legal-page">
      <div className="legal-container">
        <h1>Privacy Policy</h1>

        <p>
          This Privacy Policy explains how MovieFlix collects, uses, and
          protects your information when you use our website.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          We do not require user accounts. However, we may collect:
          <br />• Basic usage data (pages visited, clicks)
          <br />• Device and browser information
          <br />• Cookies for improving experience and ads
        </p>

        <h2>2. How We Use Information</h2>
        <p>
          We use collected data to:
          <br />• Improve website performance
          <br />• Personalize content
          <br />• Show relevant advertisements (if enabled)
        </p>

        <h2>3. Google AdSense</h2>
        <p>
          We may use Google AdSense, which uses cookies to show relevant ads.
          Google may collect anonymized data through advertising cookies.
        </p>

        <h2>4. Third-Party Services</h2>
        <p>
          MovieFlix uses third-party APIs (such as TMDB) and may link to
          external services like YouTube for trailers.
        </p>

        <h2>5. Cookies</h2>
        <p>
          Cookies help improve user experience. You can disable cookies in your
          browser settings.
        </p>

        <h2>6. Contact</h2>
        <p>
          If you have questions, contact us via the website or project owner.
        </p>

        <p style={{ marginTop: "20px", opacity: 0.7 }}>
          Last updated: 2026
        </p>
      </div>
    </div>
  );
}