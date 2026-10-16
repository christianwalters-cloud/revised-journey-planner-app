export default function EvidenceStep({
  title,
  desc,
  placeholder,
  value,
  onSave,
  onNext,
  onBack,
}) {
  return (
    <div className="step-fade-wrapper">
      <div className="reflections-section">
        <h3>{title}</h3>
        <p className="step-hint">{desc}</p>
      </div>

      <div style={{ width: "100%" }}>
        <input
          type="text"
          className="routine-large-frame-input"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          placeholder={placeholder}
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
