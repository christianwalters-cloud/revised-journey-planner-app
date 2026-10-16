export default function RenewedThoughtsCard({ monthlyClarity }) {
  const standardThoughts = monthlyClarity.filter(
    (item) => item.entry_type !== "high_pressure",
  );

  return (
    <div className="goal-display-box overview-summary-block">
      <span
        className="badge-tag goal-tag"
        style={{
          background: "rgba(0, 122, 204, 0.1)",
          color: "var(--color-unlocked, #007acc)",
        }}
      >
        RENEWED THOUGHTS
      </span>
      <p className="display-sub-text hint-text">
        Total thoughts taken captive this month:{" "}
        <strong>{standardThoughts.length}</strong>
      </p>
      <ul className="overview-list">
        {standardThoughts.slice(0, 2).map((thought) => (
          <li
            key={thought.id}
            className="overview-item win-item"
            style={{
              borderLeftColor: "var(--color-unlocked, #007acc)",
              background: "rgba(0, 122, 204, 0.04)",
            }}
          >
            <div>
              <small
                style={{
                  color: "var(--text-muted, #888888)",
                  fontSize: "0.8rem",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                }}
              >
                The Lie: "{thought.raw_thought}"
              </small>
            </div>
            <div style={{ marginTop: "4px", fontWeight: "500" }}>
              👉 The Truth: "{thought.biblical_truth}"
            </div>
          </li>
        ))}
        {standardThoughts.length === 0 && (
          <li className="empty-msg">
            No thoughts processed through Clarity Corner this month yet.
          </li>
        )}
      </ul>
    </div>
  );
}
