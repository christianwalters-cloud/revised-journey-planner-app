import { useState } from "react";
import { Link } from "react-router-dom";
import { Icon } from "./Icon"; 
import "../css/Navbar.css";

function Navbar({ lockStatuses, handleNavigationClick }) {
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
        <Link 
          to="/" 
          className="nav-link logo-link" 
          onClick={() => setIsOpen(false)}
          aria-label="Journey Home"
        >
          <div aria-hidden="true" className="nav-link-visual-content">
            <Icon name="homeImage" className="nav-menu-icon" />
            <span>Journey</span>
          </div>
        </Link>
      </div>

      <button 
        type="button" 
        className={`navbar-toggle-btn ${isOpen ? "open" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={isOpen}
      >
        <span className="hamburger-line" aria-hidden="true"></span>
        <span className="hamburger-line" aria-hidden="true"></span>
        <span className="hamburger-line" aria-hidden="true"></span>
      </button>
      
      <ul className={`navbar-menu ${isOpen ? "mobile-open" : ""}`}>
        {navItems.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isLocked = status === "locked";
          
          // Structure single clean phrases for clear layout reading values
          const displayStatus = isDone ? "Completed" : status.charAt(0).toUpperCase() + status.slice(1);
          const accessibleLinkLabel = `${label}, ${displayStatus}`;
          
          return (
            <li key={key}>
              <Link 
                to={isLocked ? "#" : path}
                onClick={(e) => handleRoutineClick(e, status)}
                className={`nav-link status-${status}`}
                aria-label={accessibleLinkLabel}
                aria-disabled={isLocked}
              >
                {/* Child text wrapper cleanly shields decorative nodes from speech synthesizers */}
                <div aria-hidden="true" className="nav-link-visual-content">
                  <Icon name={iconName} className="nav-menu-icon" />
                  <span>{label}</span>
                  {isDone && <span className="done-check">✓</span>}
                </div>
              </Link>
            </li>
          );
        })}

        <li>
          <Link 
            to="/why" 
            className="nav-link" 
            onClick={() => setIsOpen(false)}
            aria-label="Why, Purpose and intentions page"
          >
            <div aria-hidden="true" className="nav-link-visual-content">
              <Icon name="whyImage" className="nav-menu-icon" />
              <span>Why</span>
            </div>
          </Link>
        </li>
        
        <li>
          <Link 
            to="/settings" 
            className="nav-link" 
            onClick={() => setIsOpen(false)}
            aria-label="Settings, Configuration panel"
          >
            <div aria-hidden="true" className="nav-link-visual-content">
              <Icon name="settingsImage" className="nav-menu-icon" />
              <span>Settings</span>
            </div>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
