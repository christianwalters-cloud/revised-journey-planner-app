export default function EntryTypeToggle({ entryType, onToggle }) {
  //toggle for if a thought can or can't be reasoned with
  const isHighPressure = entryType === "high_pressure";

  return (
    <div className="emergency-valve-row">
      <div className="setting-text">
        <h2 style={{ color: isHighPressure ? "#ef4444" : "var(--text-main)" }}>
          {isHighPressure
            ? "⚠️ High-Pressure Escape Spiral Activated"
            : "Activate High-Pressure Emergency Valve?"}
        </h2>
        <p id="desc-spiral">
          Flip this on if you are experiencing severe thoughts where logical
          debate feels unhelpful or impossible.
        </p>
      </div>

      <label className="switch-label" htmlFor="spiral-toggle-input">
        <span className="sr-only">Toggle high pressure spillover path</span>
        <input
          type="checkbox"
          id="spiral-toggle-input"
          className="settings-checkbox"
          checked={isHighPressure}
          onChange={(e) =>
            onToggle(e.target.checked ? "high_pressure" : "standard")
          }
          aria-describedby="desc-spiral"
        />
        <span
          className="slider-visual-anchor"
          aria-hidden="true"
          style={{ backgroundColor: isHighPressure ? "#ef4444" : "" }}
        ></span>
      </label>
    </div>
  );
}
