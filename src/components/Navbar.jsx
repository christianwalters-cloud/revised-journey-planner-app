import { Link } from "react-router-dom";

function Navbar({lockStatuses = {}, handleNavigationClick}) {
  const navLockedItemsList = [
    { key: "morning", path: "/morning-routine", label: "Morning Routine" },
    { key: "todo", path: "/todo", label: "To Do List" },
    { key: "night", path: "/night-routine", label: "Night Routine" },
  ];

  return (
    <nav className="navbar">
      <div>
        <Link to='/'>Journey</Link>
      </div>

      <ul className="navbar-menu">
        {navLockedItemsList.map(({ key, path, label }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isUnlocked = status === "unlocked" || isDone;

          return(
          <li key={key}>
            <Link
              to={isUnlocked ?  path : "#"}
              onClick={(e) => handleNavigationClick(e, status)}
              className={`nav-link status-${status}`}
            >
              {label}
              {isDone && (
                <>
                  <span aria-hidden="true"> ✓</span>
                  <span className="sr-only"> (Completed)</span>
                </>
              )}
            </Link>
          </li>
          );
        })}

        <li>
          <Link to="/settings" className="nav-link">
            Settings
          </Link>
        </li>
      </ul>
    </nav>
  );
}
 export default Navbar;