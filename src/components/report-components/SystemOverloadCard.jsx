export default function SystemOverloadCard({ pressureSpirals }) {
  return (
    <div
      className="goal-display-box overview-summary-block"
      style={{ borderLeft: "4px solid #ef4444" }}
    >
      <span
        className="badge-tag safety-tag"
        style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444" }}
      >
        SYSTEM OVERLOAD LOOPS
      </span>
      <p className="display-sub-text hint-text">
        What your deepest emotional escape spirals were reacting to this month:
      </p>
      <ul className="overview-list">
        {pressureSpirals.slice(0, 2).map((spiral) => (
          <li
            key={spiral.id}
            className="overview-item struggle-item"
            style={{
              borderLeftColor: "#ef4444",
              background: "rgba(239, 68, 68, 0.02)",
            }}
          >
            <div>
              <small
                style={{
                  color: "#ef4444",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                }}
              >
                System Cry: "{spiral.raw_thought}"
              </small>
            </div>
            <div style={{ marginTop: "4px", color: "var(--text-main)" }}>
              ⚠️ <strong>Underlying Load:</strong> "
              {spiral.circumstance_pressure || "Accumulated background weight."}
              "
            </div>
          </li>
        ))}
        {pressureSpirals.length === 0 && (
          <li className="empty-msg">
            No intense nervous system overload events tracked this month.
          </li>
        )}
      </ul>
    </div>
  );
}
