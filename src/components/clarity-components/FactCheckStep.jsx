export default function FactCheckStep({ value, onSave, onNext, onBack }) {
  return (
    <div className="step-fade-wrapper">
      <div className="reflections-section">
        <h3>2. The Reality Check</h3>
        <p className="step-hint">
          Is this specific thought undeniably, 100% true? Is it an absolute
          fact, or an emotional reaction?
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <input
          type="text"
          className="routine-large-frame-input"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          placeholder="e.g., This is a reaction to fatigue, not an undeniable reality..."
          id="fact-check-input-field"
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
