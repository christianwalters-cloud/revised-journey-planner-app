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
    <main className="settings-container">
      <h1>Settings</h1>
      
      <ul className="settings-list">
        
        <li className="setting-item toggle-feature">
          <div className="setting-text">
            <h2>Display mode</h2>
            <p id="desc-display">This toggles the display between a light and dark mode</p>
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
            <p id="desc-sr">Strips layout animation constraints and scales element spacing configurations</p>
          </div>

          <label className="switch-label" htmlFor="settings-sr-mode">
            <span className="sr-only">Enable layout accessibility extensions</span>
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

        <li className="setting-item toggle-feature">
          <label className="setting-text" htmlFor="settings-morning-routine-time">
            <h2>Morning Routine start time</h2>
            <p id="desc-morning">This feature allows you to choose a start time for your morning routine</p>
          </label>

          <input 
            type="time" 
            id="settings-morning-routine-time" 
            className="settings-time-input morning-input" 
            value={morningTime}
            onChange={(e) => setMorningTime(e.target.value)}
            aria-describedby="desc-morning"
          />
        </li>

        <li className="setting-item time-feature">
          <label className="setting-text" htmlFor="settings-night-routine-time">
            <h2>Night Routine start time</h2>
            <p id="desc-night">This feature allows you to choose a time to start your night routine</p>
          </label>
          
          <input 
            type="time" 
            id="settings-night-routine-time" 
            className="settings-time-input night-input" 
            value={nightTime}
            onChange={(e) => setNightTime(e.target.value)}
            aria-describedby="desc-night"
          />
        </li>

        {/* Danger Zone Stack Container */}
        <li className="setting-item danger-zone-feature">
          <div className="danger-zone-wrapper">
            <div className="setting-text">
              <h2>Danger Zone</h2>
              <p id="desc-danger">Permanently erase all progress, goals, and routine history data</p>
            </div>
            
            <div className="danger-zone-actions">
              <button
                type="button"
                className="master-clear-btn"
                onClick={handleMasterReset}
                aria-live="assertive"
                aria-describedby="desc-danger"
              >
                {isConfirming ? "Click again to reset daily progress" : "Reset Daily Progress"}
              </button>

              {isConfirming && (
                <button
                  type="button"
                  className="master-cancel-btn"
                  onClick={() => setIsConfirming(false)}
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </li>

      </ul>
    </main>
  );
}

export default Settings;
