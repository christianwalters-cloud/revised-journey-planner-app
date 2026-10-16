export default function AchievementCard({ bigWins }) {
  return (
    <div className="goal-display-box overview-summary-block">
      <span className="badge-tag goal-tag" aria-hidden="true">
        MAIN ACHIEVEMENTS
      </span>
      <p className="display-sub-text hint-text">
        Your 3 highest-rated victories based on detail and depth:
      </p>
      <ul className="overview-list">
        {bigWins.map((win) => (
          <li key={win.id} className="overview-item win-item">
            "{win.win_text}"
          </li>
        ))}
        {bigWins.length === 0 && (
          <li className="empty-msg">No achievements logged this month yet.</li>
        )}
      </ul>
    </div>
  );
}
