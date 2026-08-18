import { useNavigate } from "react-router-dom";
import { Icon } from "../components/Icon";
import '../css/Home.css';

function Home({ lockStatuses = {}, handleNavigationClick, srMode = false }) {
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

  return (
    <div className="home-dashboard">
      <h1 className="page-title">Your Journey Starts Here Today!</h1>
      
      <div className="dashboard-grid">
        {RoutineItems.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isUnlocked = status === "unlocked" || isDone;
          const isLocked = status === "locked";

          return (
            <div
              key={key}
              className={`routine-card status-${status}`}
              onClick={(e) => handleCardClick(e, path, status)}
              role="button"
              tabIndex={isUnlocked ? 0 : -1}
              aria-disabled={isLocked}
            >
              <div className="card-icon-wrapper">
                <Icon name={iconName} className="routine-card-icon" aria-hidden="true" />
              </div>

              <h2 className="card-text-label">{label}</h2>

              <div className="card-status-indicator">
                {isLocked && (
                  srMode ? (
                    <span className="sr-status-text">(Locked)</span>
                  ) : (
                    <>
                      <span className="status-indicator lock" aria-label="Locked">🔒</span>
                      <span className="sr-only">(Locked)</span> 
                    </>
                  )
                )}

                {status === "unlocked" && (
                  srMode ? (
                    <span className="sr-status-text unlocked">(Unlocked)</span>
                  ) : (
                    <>
                      <span className="status-indicator unlock" aria-label="Unlocked">🔓</span>
                      <span className="sr-only">(Unlocked)</span>
                    </>
                  )
                )}
                     
                {isDone && (
                  srMode ? (
                    <span className="sr-status-text completed">(Completed)</span>
                  ) : (
                    <>
                      <span className="status-indicator done" aria-label="Completed">✓</span>
                      <span className="sr-only">(Completed)</span>
                    </>
                  )
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;
