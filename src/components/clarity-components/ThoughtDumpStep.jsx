export default function ThoughtDumpStep({ value, onSave, onNext }) {
  return (
    <div className="step-fade-wrapper">
      <div className="reflections-section">
        <h3>1. The Initial Thought Release</h3>
        <p className="step-hint">
          Bring the heavy or critical thoughts taken captive out into the light.
          Type it exactly as it sounds:
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <input
          type="text"
          className="routine-large-frame-input"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          placeholder="Type out what's clouding your focus..."
          id="thought-dump-input-field"
        />
      </div>

      <div className="center-btn-wrapper">
        <button
          type="button"
          className="btn btn-save"
          style={{
            background: "var(--color-unlocked, #007acc)",
            color: "#ffffff",
            padding: "12px 32px",
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
