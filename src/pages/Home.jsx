import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase-client";
import { Icon } from "../components/Icon";
import "../css/Home.css";

function Home({ lockStatuses = {}, handleNavigationClick }) {
  const navigate = useNavigate();

  const [flashbackWin, setFlashbackWin] = useState(null);

  useEffect(() => {
    const triggerRandomFlashback = async () => {
      if (Math.random() > 0.25) return;
      console.log(
        "🎲 Flashback rolling! Fetching a special memory from the cloud...",
      );

      const { data: allWins, error } = await supabase
        .from("daily_wins")
        .select("win_text, created_at");

      if (error) {
        console.error(
          "❌ Failed to query old wins for flashback:",
          error.message,
        );
        return;
      }

      // 3. If historical logs exist, pull a random index item out
      if (allWins && allWins.length > 0) {
        const randomIndex = Math.floor(Math.random() * allWins.length);
        const pickedWin = allWins[randomIndex];

        // Format the database timestamp into a local date string
        const winDate = new Date(pickedWin.created_at).toLocaleDateString(
          undefined,
          {
            month: "long",
            day: "numeric",
            year: "numeric",
          },
        );

        // Save to state to mount the overlay card display
        setFlashbackWin({
          text: pickedWin.win_text,
          date: winDate,
        });
      }
    };

    triggerRandomFlashback();
  }, []);

  const RoutineItems = [
    {
      key: "morning",
      path: "/morning-routine",
      label: "Morning Routine",
      iconName: "morningImage",
    },
    { key: "todo", path: "/todo", label: "To Do List", iconName: "todoImage" },
    {
      key: "night",
      path: "/night-routine",
      label: "Night Routine",
      iconName: "nightImage",
    },
  ];

  const handleCardClick = (event, path, status) => {
    handleNavigationClick(event, status);

    if (status !== "locked") {
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
      {/* ACCESSIBLE SURPRISE MEMORY FLASHBACK OVERLAY LAYER */}
      {flashbackWin && (
        <div
          className="flashback-banner-overlay"
          role="dialog"
          aria-labelledby="flashback-title"
          aria-modal="true"
        >
          <div className="flashback-card">
            <h2 id="flashback-title">⭐ Blast From the Past!</h2>
            <p className="flashback-text">"{flashbackWin.text}"</p>
            <small className="flashback-date">
              You logged this victory on {flashbackWin.date}
            </small>
            <button
              type="button"
              className="flashback-close-btn"
              onClick={() => setFlashbackWin(null)}
              autoFocus
            >
              Thanks for the reminder!
            </button>
          </div>
        </div>
      )}

      <h1 className="page-title">Your Journey Starts Here Today!</h1>

      <div className="dashboard-grid">
        {RoutineItems.map(({ key, path, label, iconName }) => {
          const status = lockStatuses?.[key] || "locked";
          const isDone = status === "done";
          const isUnlocked = status === "unlocked" || isDone;
          const isLocked = status === "locked";

          // Format status to readable text strings
          const displayStatus = isDone
            ? "Completed"
            : status.charAt(0).toUpperCase() + status.slice(1);
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
              aria-label={accessibleCardLabel}
            >
              <div aria-hidden="true" className="card-visual-content">
                <div className="card-icon-wrapper">
                  <Icon name={iconName} className="routine-card-icon" />
                </div>

                <h2 className="card-text-label">{label}</h2>

                <div className="card-status-indicator">
                  {isLocked && (
                    <span className="status-indicator lock">🔒</span>
                  )}
                  {status === "unlocked" && (
                    <span className="status-indicator unlock">🔓</span>
                  )}
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
