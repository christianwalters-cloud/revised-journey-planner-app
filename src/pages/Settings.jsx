import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// 🚀 Sub-components
import PreferenceSettings from "../components/settings-components/PreferenceSettings";
import RoutineScheduleSettings from "../components/settings-components/RoutineScheduleSettings";
import AccountCredentials from "../components/settings-components/AccountCredentials";
import DangerSettingsZone from "../components/settings-components/DangerSettingsZone";

import "../css/Settings.css";

function Settings({
  darkMode,
  setDarkMode,
  srMode,
  setSrMode,
  morningTime,
  setMorningTime,
  nightTime,
  setNightTime,
}) {
  const { isLoggedIn, user, logout } = useAuth();

  useEffect(() => {
    document.body.classList.toggle("dark-theme", darkMode);
    document.body.classList.toggle("light-theme", !darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.classList.toggle("sr-accessible", srMode);
  }, [srMode]);

  return (
    <main className="settings-container">
      <h1>Settings</h1>
      <ul className="settings-list">
        {/* Core display settings always available */}
        <PreferenceSettings
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          srMode={srMode}
          setSrMode={setSrMode}
        />

        {/* need to be logged in to access these */}
        {isLoggedIn ? (
          <>
            <RoutineScheduleSettings
              morningTime={morningTime}
              setMorningTime={setMorningTime}
              nightTime={nightTime}
              setNightTime={setNightTime}
            />
            <AccountCredentials user={user} />
            <DangerSettingsZone
              isLoggedIn={isLoggedIn}
              user={user}
              logout={logout}
            />
          </>
        ) : (
          <li className="lock-banner-card">
            <div className="lock-banner-card-text-group">
              <h2>🔒 Authentication Required</h2>
              <p>Routine scheduling preferences, secure cloud sync networks, and profile reset engines are restricted to authenticated members.</p>
            </div>
            
            <Link to="/login-and-sign-up" className="btn-edit">
              Create an Account or Sign In
            </Link>
          </li>
        )}
      </ul>
    </main>
  );
}

export default Settings;
