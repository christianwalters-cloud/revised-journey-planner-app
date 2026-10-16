export default function CognitivePatternsCard({ topStruggles }) {
  return (
    <div className="goal-display-box overview-summary-block">
      <span className="badge-tag why-tag" aria-hidden="true">
        COGNITIVE PATTERNS
      </span>
      <p className="display-sub-text hint-text">
        Recurring distortion mindsets noticed across your daily logs:
      </p>
      <ul className="overview-list">
        {topStruggles.map((pattern, index) => (
          <li key={index} className="overview-item struggle-item">
            <span>
              Detected pattern of <strong>"{pattern.word}"</strong>
            </span>
            <span className="pattern-badge">{pattern.count}x</span>
          </li>
        ))}
        {topStruggles.length === 0 && (
          <li className="empty-msg">
            No repeating cognitive distortion patterns detected.
          </li>
        )}
      </ul>
    </div>
  );
}
