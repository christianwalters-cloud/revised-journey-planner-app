export default function RoutineScheduleSettings({
  morningTime,
  setMorningTime,
  nightTime,
  setNightTime,
}) {
  //moning and night routine start time settings
  return (
    <>
      <li className="setting-item toggle-feature">
        <label className="setting-text" htmlFor="settings-morning-routine-time">
          <h2>Morning Routine start time</h2>
          <p id="desc-morning">
            This feature allows you to choose a start time for your morning
            routine
          </p>
        </label>
        <input
          type="time"
          id="settings-morning-routine-time"
          className="settings-time-input morning-input"
          value={morningTime}
          onChange={(e) => setMorningTime(e.target.value)}
          aria-describedby="desc-morning"
        />
      </li>

      <li className="setting-item time-feature">
        <label className="setting-text" htmlFor="settings-night-routine-time">
          <h2>Night Routine start time</h2>
          <p id="desc-night">
            This feature allows you to choose a time to start your night routine
          </p>
        </label>
        <input
          type="time"
          id="settings-night-routine-time"
          className="settings-time-input night-input"
          value={nightTime}
          onChange={(e) => setNightTime(e.target.value)}
          aria-describedby="desc-night"
        />
      </li>
    </>
  );
}
