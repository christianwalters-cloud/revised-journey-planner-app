export default function FriendPerspectiveStep({
  value,
  onSave,
  onNext,
  onBack,
}) {
  return (
    <div className="step-fade-wrapper">
      <div className="reflections-section">
        <h3>5. The Wise Counsel Lens</h3>
        <p className="step-hint">
          If a close friend or ally came to you carrying this exact level of
          pressure, what gentle words would you say to remind them of who they
          are?
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <input
          type="text"
          className="routine-large-frame-input"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          placeholder="You are doing the best you can, do not be so harsh on your progress..."
          id="friend-perspective-input-field"
        />
      </div>

      <div className="button-group-row">
        <button type="button" className="btn btn-cancel" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="btn btn-save"
          style={{
            background: "var(--color-unlocked, #007acc)",
            color: "#ffffff",
          }}
          disabled={!value.trim()}
          onClick={onNext}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
