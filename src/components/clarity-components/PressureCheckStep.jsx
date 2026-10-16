export default function PressureCheckStep({ value, onSave, onNext, onBack }) {
  return (
    <div className="step-fade-wrapper">
      <div className="reflections-section">
        <h3>Circumstantial Pressure Check</h3>
        <p className="step-hint">
          What extreme conditions or compounding weights are you navigating
          right now? Let's lay out why your nervous system's response makes
          sense.
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <input
          type="text"
          className="routine-large-frame-input spiral-focus"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          placeholder="I've been sleep-deprived, carrying work stresses alone..."
          id="pressure-input-field"
        />
      </div>

      <div className="validation-blurb-alert">
        <p>
          💡 <strong>Compassion Validation:</strong> Given this massive
          accumulation of underlying pressure, your brain screaming to escape
          isn't a failure—it's an overloaded safety alarm. Your reaction is
          valid.
        </p>
      </div>

      <div className="center-btn-wrapper">
        <button type="button" className="back-btn" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="complete-btn"
          style={{ backgroundColor: "#ef4444" }}
          disabled={!value.trim()}
          onClick={onNext}
        >
          Continue to verses →
        </button>
      </div>
    </div>
  );
}
