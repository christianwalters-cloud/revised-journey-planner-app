export default function BiblicalTruthStep({
  title,
  desc,
  placeholder,
  value,
  onSave,
  isSubmitting,
  onFinish,
  onBack,
}) {
  return (
    <div className="step-fade-wrapper">
      <div className="reflections-section">
        <h3>{title || "6. Biblical Truth"}</h3>
        <p className="step-hint">
          {desc ||
            "Anchor your mindset here. What scriptural statement answers this weight completely?"}
        </p>
      </div>

      <div style={{ width: "100%" }}>
        <input
          type="text"
          className="routine-large-frame-input"
          value={value}
          onChange={(e) => onSave(e.target.value)}
          placeholder={
            placeholder || "He makes me lay down in green pastures..."
          }
        />
      </div>

      <div className="button-group-row">
        <button
          type="button"
          className="btn btn-cancel"
          disabled={isSubmitting}
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="button"
          className="btn btn-save"
          disabled={isSubmitting || !value.trim()}
          onClick={() => onFinish(value.trim())}
        >
          {isSubmitting ? "Syncing Breakthrough..." : "Log Victory ✓"}
        </button>
      </div>
    </div>
  );
}
