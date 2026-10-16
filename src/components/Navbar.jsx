import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Icon } from "../components/Icon";
import "../css/Navbar.css";

function Navbar({ lockStatuses, handleNavigationClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  // all the links with their icons and whether they are accessible
  const navItems = [
    {
      key: "morning",
      path: "/morning-routine",
      label: "Morning Routine",
      iconName: "morningImage",
      protected: true,
    },
    {
      key: "todo",
      path: "/todo",
      label: "To Do List",
      iconName: "todoImage",
      protected: true,
    },
    {
      key: "night",
      path: "/night-routine",
      label: "Night Routine",
      iconName: "nightImage",
      protected: true,
    },
    {
      key: "report",
      path: "/monthly-overview",
      label: "Monthly Overview",
      iconName: "reportImage",
      protected: true,
    },
    {
      key: "clarity",
      path: "/clarity-corner",
      label: "Clarity Corner",
      iconName: "clarityImage",
      protected: true,
    },
    {
      key: "why",
      path: "/why",
      label: "Why",
      iconName: "whyImage",
      protected: true,
    },
    {
      key: "settings",
      path: "/settings",
      label: "Settings",
      iconName: "settingsImage",
      protected: false,
    },
  ];

  const closeMobileMenu = () => setIsOpen(false);

  const handleNavbarLogout = async () => {
    await logout();
    closeMobileMenu();
    navigate("/login-and-sign-up");
  };

  const visibleNavItems = navItems.filter(
    (item) => !item.protected || isLoggedIn,
  );

  const handleRoutineClick = (e, status) => {
    handleNavigationClick(e, status);
    if (status !== "locked") {
      setIsOpen(false);
    }
  };

  return (
    <nav className="navbar" aria-label="Main Navigation">
      <div className="navbar-logo">
        <Link
          to="/"
          className="nav-link logo-link"
          onClick={closeMobileMenu}
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

      <ul
        className={`navbar-menu ${isOpen ? "mobile-open" : ""} ${isLoggedIn ? "always-hamburger-drawer" : ""}`}
      >
        {visibleNavItems.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "unlocked";
          const isDone = status === "done";
          const isLocked = status === "locked";

          const displayStatus = isDone
            ? "Completed"
            : status.charAt(0).toUpperCase() + status.slice(1);
          const accessibleLinkLabel = `${label}, ${displayStatus}`;

          return (
            <li key={key}>
              <Link
                to={isLocked ? "#" : path}
                onClick={(e) =>
                  key !== "settings"
                    ? handleRoutineClick(e, status)
                    : closeMobileMenu()
                }
                className={`nav-link status-${status}`}
                aria-label={accessibleLinkLabel}
                aria-disabled={isLocked}
              >
                <div aria-hidden="true" className="nav-link-visual-content">
                  <Icon name={iconName} className="nav-menu-icon" />
                  <span>{label}</span>
                  {isDone && <span className="done-check">✓</span>}
                </div>
              </Link>
            </li>
          );
        })}

        {/* logged in/logged out toggle veiw */}
        <li>
          {isLoggedIn ? (
            <button
              type="button"
              className="nav-link logout-link-action"
              onClick={handleNavbarLogout}
            >
              <div aria-hidden="true" className="nav-link-visual-content">
                <Icon name="logoutImage" className="nav-menu-icon" />
                <span>Log Out</span>
              </div>
            </button>
          ) : (
            <Link
              to="/login-and-sign-up"
              className="nav-link"
              onClick={closeMobileMenu}
            >
              <div aria-hidden="true" className="nav-link-visual-content">
                <Icon name="userImage" className="nav-menu-icon" />
                <span>Login / Sign Up</span>
              </div>
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
