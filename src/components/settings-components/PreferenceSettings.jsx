export default function PreferenceSettings({
  darkMode,
  setDarkMode,
  srMode,
  setSrMode,
}) {
  return (
    <>
      <li className="setting-item toggle-feature">
        <div className="setting-text">
          <h2>Display mode</h2>
          <p id="desc-display">
            This toggles the display between a light and dark mode
          </p>
        </div>
        <label className="switch-label" htmlFor="settings-display-color">
          <span className="sr-only">Toggle dark mode</span>
          <input
            type="checkbox"
            id="settings-display-color"
            className="settings-checkbox"
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
            aria-describedby="desc-display"
          />
          <span className="slider-visual-anchor" aria-hidden="true"></span>
        </label>
      </li>

      <li className="setting-item toggle-feature">
        <div className="setting-text">
          <h2>Reduced Motion & Layout Optimisation</h2>
          <p id="desc-sr">
            Strips layout animation constraints and scales element spacing
            configurations
          </p>
        </div>
        <label className="switch-label" htmlFor="settings-sr-mode">
          <span className="sr-only">
            Enable layout accessibility extensions
          </span>
          <input
            type="checkbox"
            id="settings-sr-mode"
            className="settings-checkbox"
            checked={srMode}
            onChange={(e) => setSrMode(e.target.checked)}
            aria-describedby="desc-sr"
          />
          <span className="slider-visual-anchor" aria-hidden="true"></span>
        </label>
      </li>
    </>
  );
}
