import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon"; 
import "../css/Navbar.css";

function Navbar({ lockStatuses, handleNavigationClick, srMode = false }) {
  const [isOpen, setIsOpen] = useState(false);
  
  const navItems = [
    { key: "morning", path: "/morning-routine", label: "Morning Routine", iconName: "morningImage" },
    { key: "todo", path: "/todo", label: "To Do List", iconName: "todoImage" },
    { key: "night", path: "/night-routine", label: "Night Routine", iconName: "nightImage" },
  ];

  const handleRoutineClick = (e, status) => {
    handleNavigationClick(e, status);
    if (status !== 'locked') {
      setIsOpen(false);
    }
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-logo">
        <Link to="/" className="nav-link logo-link" onClick={() => setIsOpen(false)}>
          <Icon name="homeImage" className="nav-menu-icon" aria-hidden="true" />
          <span>Journey</span>
        </Link>
      </div>

      <button 
        type="button" 
        className={`navbar-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
        <span className="hamburger-line"></span>
      </button>
      
      <ul className={`navbar-menu ${isOpen ? "mobile-open" : ""}`}>
        {navItems.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isLocked = status === "locked";
          
          return (
            <li key={key}>
              <Link 
                to={isLocked ? "/" : path}
                onClick={(e) => handleRoutineClick(e, status)}
                className={`nav-link status-${status}`}
              >
                <Icon name={iconName} className="nav-menu-icon" aria-hidden="true" />
                <span>{label}</span>
                {isDone && (
                  srMode ? (
                    <span className="sr-status-text completed" style={{ marginLeft: "6px" }}>(Completed)</span>
                  ) : (
                    <span className="done-check" aria-hidden="true">✓</span>
                  )
                )}
              </Link>
            </li>
          );
        })}

        <li>
          <Link to="/why" className="nav-link" onClick={() => setIsOpen(false)}>
            <Icon name="whyImage" className="nav-menu-icon" aria-hidden="true" />
            <span>Why</span>
          </Link>
        </li>
        
        <li>
          <Link to="/settings" className="nav-link" onClick={() => setIsOpen(false)}>
            <Icon name="settingsImage" className="nav-menu-icon" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
