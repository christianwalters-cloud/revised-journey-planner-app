import { useState, useEffect } from 'react';
import '../css/Goals.css';

function Why() {
  const [goalData, setGoalData] = useState(() => {
    const saved = localStorage.getItem('user_anchor_intentions');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      goal: "Run a half-marathon by November",
      why: "To build physical discipline, protect my cardiovascular health, and prove to myself that I can complete long-term challenges."
    };
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editGoal, setEditGoal] = useState(goalData.goal);
  const [editWhy, setEditWhy] = useState(goalData.why);
  
  // Accessibility state engine for custom voice tracking alerts
  const [srAnnouncement, setSrAnnouncement] = useState("");

  useEffect(() => {
    localStorage.setItem('user_anchor_intentions', JSON.stringify(goalData));
  }, [goalData]);

  const handleSave = (e) => {
    e.preventDefault();
    if (!editGoal.trim() || !editWhy.trim()) {
      setSrAnnouncement("Error: Both fields must contain valid text before saving.");
      alert("Both fields must contain text before saving.");
      return;
    }
    setGoalData({ goal: editGoal.trim(), why: editWhy.trim() });
    setIsEditing(false);
    setSrAnnouncement("Core intentions saved successfully. Swapped to display view.");
  };

  const handleStartEdit = () => {
    setEditGoal(goalData.goal);
    setEditWhy(goalData.why);
    setIsEditing(true);
    setSrAnnouncement("Editing mode active. Focus moved to goal description form.");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to permanently clear your goal and why statement?")) {
      const cleared = { goal: "", why: "" };
      setGoalData(cleared);
      setEditGoal("");
      setEditWhy("");
      setIsEditing(false);
      setSrAnnouncement("All core statements have been permanently cleared. Create a new goal below.");
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSrAnnouncement("Editing canceled. Reverted to previous saved intention data.");
  };

  const hasNoData = !goalData.goal && !goalData.why;

  return (
    <main className="goals-container">
      {/* Universal announcement region for interactive page transitions */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {srAnnouncement}
      </div>

      <h1 className="page-title">Purpose & Intentions</h1>
      <p className="page-subtitle">Define what you want to achieve and anchor it heavily to your personal motivation.</p>

      {!isEditing && !hasNoData && (
        <section className="display-card-wrapper" aria-label="Current Core Intentions">
          <div className="goal-display-box">
            <span className="badge-tag goal-tag" aria-hidden="true">THE GOAL</span>
            <h2 className="sr-only">Your Current Goal</h2>
            <p className="display-main-text">{goalData.goal}</p>
          </div>

          <div className="goal-display-box">
            <span className="badge-tag why-tag" aria-hidden="true">THE WHY</span>
            <h2 className="sr-only">Your Core Motivation</h2>
            <p className="display-sub-text">{goalData.why}</p>
          </div>

          <div className="button-group-row">
            <button type="button" className="btn btn-edit" onClick={handleStartEdit}>
              Edit Statement <span className="sr-only">(Opens form layout below)</span>
            </button>
            <button type="button" className="btn btn-delete" onClick={handleDelete} aria-label="Delete statement permanently">
              Delete All
            </button>
          </div>
        </section>
      )}

      {(isEditing || hasNoData) && (
        <form className="goal-mutation-form" onSubmit={handleSave} aria-label={hasNoData ? "Create new goal form" : "Edit intentions form"}>
          {hasNoData && (
            <div className="empty-state-notice" role="status">
              <p className="display-sub-text alert-notice">⚠️ You currently have no goal set. Define one below to reactivate tracking grids.</p>
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
              aria-describedby="goal-counter"
              autoFocus={isEditing}
            />
            {/* Accessible character counter hook */}
            <div id="goal-counter" className="character-counter" aria-hidden="true">
              {editGoal.length} / 120 characters
            </div>
            <span className="sr-only">Maximum 120 characters. {120 - editGoal.length} remaining.</span>
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
              aria-describedby="why-counter"
            />
            {/* Accessible character counter hook */}
            <div id="why-counter" className="character-counter" aria-hidden="true">
              {editWhy.length} / 400 characters
            </div>
            <span className="sr-only">Maximum 400 characters. {400 - editWhy.length} remaining.</span>
          </div>

          <div className="button-group-row">
            <button type="submit" className="btn btn-save">
              {hasNoData ? "Create Statement" : "Save Changes"}
            </button>
            {!hasNoData && (
              <button type="button" className="btn btn-cancel" onClick={handleCancelEdit}>
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
