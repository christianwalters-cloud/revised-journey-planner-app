import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import '../css/Home.css';

function Home({ lockStatuses = {}, handleNavigationClick }) {
  const navigate = useNavigate();

  const RoutineItems = [
    { key: "morning", path: "/morning-routine", label: "Morning Routine", iconName: "morningImage" },
    { key: "todo", path: "/todo", label: "To Do List", iconName: "todoImage" },
    { key: "night", path: "/night-routine", label: "Night Routine", iconName: "nightImage" }, 
  ];

  const handleCardClick = (event, path, status) => {
    handleNavigationClick(event, status);
    
    if (status !== 'locked') {
      navigate(path);
    }
  };

  const handleKeyDown = (event, path, status) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleCardClick(event, path, status);
    }
  };

  return (
    <main className="home-dashboard">
      <h1 className="page-title">Your Journey Starts Here Today!</h1>
      
      <div className="dashboard-grid">
        {RoutineItems.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isUnlocked = status === "unlocked" || isDone;
          const isLocked = status === "locked";

          // Format status readable text strings properly
          const displayStatus = isDone ? "Completed" : status.charAt(0).toUpperCase() + status.slice(1);
          const accessibleCardLabel = `${label}, ${displayStatus}`;

          return (
            <div
              key={key}
              className={`routine-card status-${status}`}
              onClick={(e) => handleCardClick(e, path, status)}
              onKeyDown={(e) => handleKeyDown(e, path, status)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              aria-disabled={isLocked}
              aria-label={accessibleCardLabel} // Reads the whole card state smoothly as a single string
            >
              {/* Visual wrapper prevents layout fragments from breaking screen reader audio outputs */}
              <div aria-hidden="true" className="card-visual-content">
                <div className="card-icon-wrapper">
                  <Icon name={iconName} className="routine-card-icon" />
                </div>

                <h2 className="card-text-label">{label}</h2>

                <div className="card-status-indicator">
                  {isLocked && <span className="status-indicator lock">🔒</span>}
                  {status === "unlocked" && <span className="status-indicator unlock">🔓</span>}
                  {isDone && <span className="status-indicator done">✓</span>}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}

export default Home;
