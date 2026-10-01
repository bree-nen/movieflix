import "./MaintenancePage.css";

function MaintenancePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="maintenance-page">
      <div className="maintenance-background">
        <div className="maintenance-glow maintenance-glow-one"></div>
        <div className="maintenance-glow maintenance-glow-two"></div>
      </div>

      <section className="maintenance-card">
        <div className="maintenance-logo">
          <span className="maintenance-logo-m">M</span>
          <span className="maintenance-logo-text">MovieFlix</span>
        </div>

        <div className="maintenance-icon">
          <div className="maintenance-icon-ring">
            <span>🎬</span>
          </div>
        </div>

        <p className="maintenance-label">TEMPORARILY UNAVAILABLE</p>

        <h1>
          We're upgrading
          <span> MovieFlix</span>
        </h1>

        <p className="maintenance-message">
          We're currently making some exciting improvements to MovieFlix.
          The website will be back up and running in a few hours.
        </p>

        <div className="maintenance-status">
          <div className="maintenance-status-dot"></div>
          <span>MovieFlix is currently undergoing an upgrade</span>
        </div>

        <div className="maintenance-loader">
          <div className="maintenance-loader-bar"></div>
        </div>

        <p className="maintenance-return">
          Thank you for your patience. We can't wait to have you back.
        </p>

        <button
          className="maintenance-refresh"
          onClick={handleRefresh}
        >
          Check Again
        </button>

        <p className="maintenance-footer">
          © {new Date().getFullYear()} MovieFlix. All rights reserved.
        </p>
      </section>
    </main>
  );
}

export default MaintenancePage;