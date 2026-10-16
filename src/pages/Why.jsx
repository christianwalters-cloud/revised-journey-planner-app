import { useState, useEffect } from "react";
import supabase from "../../supabase-client";
import { useAuth } from "../context/AuthContext";
import "../css/Goals.css";

function Why() {
  const { user, isLoggedIn } = useAuth();

  const [goalData, setGoalData] = useState({ goal: "", why: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState("");
  const [editWhy, setEditWhy] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [srAnnouncement, setSrAnnouncement] = useState("");

  // 🚀 1. SECURE ACCELERATOR FETCH: Reads from Supabase secure native user metadata cache
  useEffect(() => {
    const loadMetadataIntentions = () => {
      if (!isLoggedIn || !user) {
        setIsLoading(false);
        return;
      }

      const metadata = user.user_metadata || {};
      const structuralData = {
        goal: metadata.life_goal || "",
        why: metadata.life_why || "",
      };

      setGoalData(structuralData);
      setEditGoal(structuralData.goal);
      setEditWhy(structuralData.why);
      setIsLoading(false);
    };

    loadMetadataIntentions();
  }, [user, isLoggedIn]);

  // 🚀 2. SECURE CLOUD METADATA HANDLER
  const handleSave = async (e) => {
    e.preventDefault();
    if (!editGoal.trim() || !editWhy.trim()) {
      setSrAnnouncement(
        "Error: Both fields must contain valid text before saving.",
      );
      alert("Both fields must contain text before saving.");
      return;
    }

    setIsLoading(true);
    const updatedGoal = editGoal.trim();
    const updatedWhy = editWhy.trim();

    // Updates properties inside Supabase
    const { data, error } = await supabase.auth.updateUser({
      data: {
        life_goal: updatedGoal,
        life_why: updatedWhy,
      },
    });

    setIsLoading(false);

    if (error) {
      console.error("❌ Failed to sync intentions metadata:", error.message);
      alert(`Sync error: ${error.message}`);
    } else {
      setGoalData({ goal: updatedGoal, why: updatedWhy });
      setIsEditing(false);
      setSrAnnouncement(
        "Core intentions synced successfully. Swapped to display view.",
      );

      // 🚀 CRUCIAL: Forces the active session context object to refresh its data mapping cache
      if (data?.user) {
        user.user_metadata = data.user.user_metadata;
      }
    }
  };

  const handleStartEdit = () => {
    setEditGoal(goalData.goal);
    setEditWhy(goalData.why);
    setIsEditing(true);
    setSrAnnouncement(
      "Editing mode active. Focus moved to goal description form.",
    );
  };

  // 🚀 3. SECURE METADATA PURGE ENGINE: Wipes variables from the native user record entry
  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to permanently clear your goal and why statement?",
      )
    ) {
      return;
    }

    setIsLoading(true);
    const { data, error } = await supabase.auth.updateUser({
      data: {
        life_goal: "",
        life_why: "",
      },
    });

    setIsLoading(false);

    if (error) {
      alert(`Could not clear statements: ${error.message}`);
    } else {
      setGoalData({ goal: "", why: "" });
      setEditGoal("");
      setEditWhy("");
      setIsEditing(false);
      setSrAnnouncement("All core statements have been permanently cleared.");

      if (data?.user) {
        user.user_metadata = data.user.user_metadata;
      }
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSrAnnouncement(
      "Editing canceled. Reverted to previous saved intention data.",
    );
  };

  if (isLoading) {
    return (
      <div
        className="goals-container"
        style={{ textAlign: "center", padding: "40px" }}
      >
        <p style={{ color: "var(--text-muted)", fontWeight: "500" }}>
          Retrieving your purpose anchors...
        </p>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="goals-container">
        <h1 className="page-title">Purpose & Intentions</h1>
        <section
          className="lock-banner-card"
          aria-label="Authentication Required"
        >
          <h2>🔒 Verification Required</h2>
          <p>
            Defining core life targets and grounding deep psychological
            motivations is restricted to profile members.
          </p>
          <a
            href="/login-and-sign-up"
            className="btn btn-edit"
            style={{ display: "inline-block", textDecoration: "none" }}
          >
            Sign In to Build Intentions
          </a>
        </section>
      </main>
    );
  }

  const hasNoData = !goalData.goal && !goalData.why;

  return (
    <main className="goals-container">
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {srAnnouncement}
      </div>

      <h1 className="page-title">Purpose & Intentions</h1>
      <p className="page-subtitle">
        Define what you want to achieve and anchor it heavily to your personal
        motivation.
      </p>

      {!isEditing && !hasNoData && (
        <section
          className="display-card-wrapper"
          aria-label="Current Core Intentions"
        >
          <div className="goal-display-box">
            <span className="badge-tag goal-tag" aria-hidden="true">
              THE GOAL
            </span>
            <h2 className="sr-only">Your Current Goal</h2>
            <p className="display-main-text">{goalData.goal}</p>
          </div>

          <div className="goal-display-box">
            <span className="badge-tag why-tag" aria-hidden="true">
              THE WHY
            </span>
            <h2 className="sr-only">Your Core Motivation</h2>
            <p className="display-sub-text">{goalData.why}</p>
          </div>

          <div className="button-group-row">
            <button
              type="button"
              className="btn btn-edit"
              onClick={handleStartEdit}
            >
              Edit Statement
            </button>
            <button
              type="button"
              className="btn btn-delete"
              onClick={handleDelete}
              aria-label="Delete statement permanently"
            >
              Delete All
            </button>
          </div>
        </section>
      )}

      {(isEditing || hasNoData) && (
        <form
          className="goal-mutation-form"
          onSubmit={handleSave}
          aria-label={
            hasNoData ? "Create new goal form" : "Edit intentions form"
          }
        >
          {hasNoData && (
            <div className="empty-state-notice" role="status">
              <p className="display-sub-text alert-notice">
                ⚠️ You currently have no goal set. Define one below to
                reactivate tracking grids.
              </p>
            </div>
          )}

          <div className="form-field-group">
            <label htmlFor="user-goal-input" className="form-label-text">
              What is your primary goal right now?
            </label>
            <input
              type="text"
              id="user-goal-input"
              className="goal-text-input"
              placeholder="e.g., Read 2 books every month, Drink 3L water daily..."
              value={editGoal}
              onChange={(e) => setEditGoal(e.target.value)}
              maxLength={120}
              required
              aria-required="true"
              autoFocus={isEditing}
            />
            <div className="character-counter" aria-hidden="true">
              {editGoal.length} / 120 characters
            </div>
          </div>

          <div className="form-field-group">
            <label htmlFor="user-why-input" className="form-label-text">
              What is your deep "Why" behind this goal?
            </label>
            <textarea
              id="user-why-input"
              className="goal-textarea-input"
              placeholder="e.g., If I do not commit to this, I will stay stagnant. I owe it to my future self..."
              value={editWhy}
              onChange={(e) => setEditWhy(e.target.value)}
              rows={4}
              maxLength={400}
              required
              aria-required="true"
            />
            <div className="character-counter" aria-hidden="true">
              {editWhy.length} / 400 characters
            </div>
          </div>

          <div className="button-group-row">
            <button type="submit" className="btn btn-save" disabled={isLoading}>
              {hasNoData ? "Create Statement" : "Save Changes"}
            </button>
            {!hasNoData && (
              <button
                type="button"
                className="btn btn-cancel"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </main>
  );
}

export default Why;
