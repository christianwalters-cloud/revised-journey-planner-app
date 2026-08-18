import { Link } from "react-router-dom";
import { Icon } from "./Icon"; 
import "../css/Navbar.css";

function Navbar({ lockStatuses, handleNavigationClick }) {
  
  // Unified navigation configuration map linked to your SVG registry names
  const navItems = [
    { key: "morning", path: "/morning-routine", label: "Morning Routine", iconName: "morningImage" },
    { key: "todo", path: "/todo", label: "To Do List", iconName: "todoImage" },
    { key: "night", path: "/night-routine", label: "Night Routine", iconName: "nightImage" },
  ];

  const handleRoutineClick = (e, status) => {
    handleNavigationClick(e, status);
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      {/* 🚀 Journey Logo acting as the sole primary home navigation link block */}
      <div className="navbar-logo">
        <Link to="/" className="nav-link logo-link">
          <Icon name="homeImage" className="nav-menu-icon" aria-hidden="true" />
          <span>Journey</span>
        </Link>
      </div>
      
      {/* Semantic horizontal routing menu structure */}
      <ul className="navbar-menu">
        
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
                {isDone && <span className="done-check" aria-hidden="true">✓</span>}
              </Link>
            </li>
          );
        })}

        {/* 🚀 ADDED: The Why component module placed right before settings using the brain icon */}
        <li>
          <Link to="/why" className="nav-link">
            <Icon name="whyImage" className="nav-menu-icon" aria-hidden="true" />
            <span>Why</span>
          </Link>
        </li>
        
        <li>
          <Link to="/settings" className="nav-link">
            <Icon name="settingsImage" className="nav-menu-icon" aria-hidden="true" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
