import { Link } from "react-router-dom";
import { Icon } from '../components/Icon';
import '../css/Navbar.css';

function Navbar({ lockStatuses = {}, handleNavigationClick, srMode }) {
  const navLockedItemsList = [
    { key: "morning", path: "/morning-routine", label: "Morning Routine", iconName: "morningImage" },
    { key: "todo", path: "/todo", label: "To Do List", iconName: "todoImage" },
    { key: "night", path: "/night-routine", label: "Night Routine", iconName: "nightImage" }, 
  ];

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div>
        <Link to='/' className="nav-link logo-link">
          <Icon name='homeImage' className="nav-menu-icon" aria-hidden="true"/> 
          Journey
        </Link>
      </div>

      <ul className="navbar-menu">
        {navLockedItemsList.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isUnlocked = status === "unlocked" || isDone;
          const isLocked = status === "locked";

          return (
            <li key={key}>
              <Link
                to={isUnlocked ? path : "#"}
                onClick={(e) => handleNavigationClick(e, status)}
                className={`nav-link status-${status}`}
                aria-disabled={isLocked}
              >
                <Icon name={iconName} className="nav-menu-icon" aria-hidden="true"/>
                <span className="nav-text-label">{label}</span>
                
                {isLocked && (
                  srMode ? (
                    <span className="sr-status-text"> (Locked)</span>
                  ) : (
                    <>
                      <span className="status-indicator lock" aria-label="Locked"> 🔒</span>
                      <span className="sr-only"> (Locked)</span>
                    </>
                  )
                )}
                
                {isDone && (
                  srMode ? (
                    <span className="sr-status-text completed"> (Completed)</span>
                  ) : (
                    <>
                      <span className="status-indicator lock" aria-label="Completed"> ✓</span>
                      <span className="sr-only"> (Completed)</span>
                    </>
                  )
                )}
              </Link>
            </li>
          );
        })}

        <li>
          <Link to="/settings" className="nav-link">
            <Icon name='settingsImage' className="nav-menu-icon" aria-hidden="true"/>
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
