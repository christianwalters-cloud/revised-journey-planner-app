import { useState, useEffect } from 'react';
import '../css/Settings.css';

function Settings({
  darkMode,
  setDarkMode,
  srMode,
  setSrMode,
  morningTime,
  setMorningTime,
  nightTime,
  setNightTime
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-theme");
      document.body.classList.remove("light-theme");
    } else {
      document.body.classList.add("light-theme");
      document.body.classList.remove("dark-theme");
    }
  }, [darkMode]);

  useEffect(() => {
    if (srMode) {
      document.documentElement.classList.add('sr-accessible');
    } else {
      document.documentElement.classList.remove('sr-accessible');
    }
  }, [srMode]);

  const handleMasterReset = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="settings-container">
      <ul className="settings-list">
        
        <li className="setting-item toggle-feature">
          <div className="setting-text">
            <h2>Display mode</h2>
            <p>This toggles the display between a light and dark mode</p>
          </div>

          <label className="switch-label" htmlFor="settings-display-color">
            <span className="sr-only">Toggle dark mode</span>
            <input
              type="checkbox"
              id="settings-display-color"
              className="settings-checkbox"
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
            <span className="slider-visual-anchor" aria-hidden="true"></span>
          </label>
        </li> 

        <li className="setting-item toggle-feature">
          <div className="setting-text">
            <h2>Screen Reader Layout</h2>
            <p>Optimizes site text rendering and strips animation constraints</p>
          </div>

          <label className="switch-label" htmlFor="settings-sr-mode">
            <span className="sr-only">Enable screen reader optimized layout</span>
            <input
              type="checkbox"
              id="settings-sr-mode"
              className="settings-checkbox"
              checked={srMode} 
              onChange={(e) => setSrMode(e.target.checked)}
            />
            <span className="slider-visual-anchor" aria-hidden="true"></span>
          </label>
        </li>

        <li className="setting-item toggle-feature">
          <div className="setting-text">
            <h2>Morning Routine start time</h2>
            <p>This feature allows you to choose a start time for your morning routine</p>
          </div>

          <input 
            type="time" 
            id="settings-morning-routine-time" 
            className="settings-time-input morning-input" 
            value={morningTime}
            onChange={(e) => setMorningTime(e.target.value)}
          />
        </li>

        <li className="setting-item time-feature">
          <div className="setting-text">
            <h2>Night Routine start time</h2>
            <p>This feature allows you to choose a time to start your night routine</p>
          </div>
          
          <input 
            type="time" 
            id="settings-night-routine-time" 
            className="settings-time-input night-input" 
            value={nightTime}
            onChange={(e) => setNightTime(e.target.value)}
          />
        </li>

        <li className="setting-item danger-zone-feature" style={{ flexDirection: "column", gap: "12px", alignItems: "flex-start" }}>
          <div className="setting-text">
            <h2>Danger Zone</h2>
            <p>Permanently erase all progress, goals, and routine history data</p>
          </div>
          
          <button
            type="button"
            className="master-clear-btn"
            onClick={handleMasterReset}
            onMouseLeave={() => setIsConfirming(false)}
            style={{
              backgroundColor: isConfirming ? "var(--color-danger, #e63946)" : "var(--text-main, #212529)",
              color: "var(--bg-card, #ffffff)",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "1rem",
              fontWeight: "600",
              cursor: "pointer",
              transition: "background-color 0.2s ease, transform 0.1s ease",
              width: "100%",
              marginTop: "8px"
            }}
          >
            {isConfirming ? "Are you sure? Click again to confirm" : "Reset Daily Progress & Cache"}
          </button>
        </li>

      </ul>
    </div>
  );
}

export default Settings;
