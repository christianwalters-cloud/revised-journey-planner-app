import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import MorningRoutine from "./pages/MorningRoutine";
import ToDoList from "./pages/ToDoList";
import NightRoutine from "./pages/NightRoutine";
import Why from "./pages/Why";
import MonthlyReport from "./pages/MonthlyReport";
import ClarityCorner from "./pages/ClarityCorner";
import LoginAndSignUp from "./pages/LoginAndSignUp";
import "./css/App.css";
import { calculateLockStatuses } from "./Utils/LockStatusEngine";
import { selectableBibleVerses } from "./Utils/SelectableVerses";

function App() {
  const { isLoggedIn } = useAuth();

  const [dayIdentifier, setDayIdentifier] = useState(
    () =>
      localStorage.getItem("routine_day_id") || new Date().toLocaleDateString(),
  );

  //initial settings on launch
  const [morningTime, setMorningTime] = useState(
    () => localStorage.getItem("routine_morning_time") || "09:00",
  );
  const [nightTime, setNightTime] = useState(
    () => localStorage.getItem("routine_night_time") || "18:00",
  );
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem("routine_dark_mode") === "true",
  );
  const [srMode, setSrMode] = useState(
    () => localStorage.getItem("routine_sr_mode") === "true",
  );


  const [morningGratitudeCompleted, setMorningGratitudeCompleted] = useState(
    () => localStorage.getItem("routine_morning_gratitude") === "true",
  );
  const [morningVerseCompleted, setMorningVerseCompleted] = useState(
    () => localStorage.getItem("routine_morning_verse") === "true",
  );
  const [todoCompleted, setTodoCompleted] = useState(
    () => localStorage.getItem("routine_todo_completed") === "true",
  );
  const [nightCompleted, setNightCompleted] = useState(
    () => localStorage.getItem("routine_night_completed") === "true",
  );

  const [selectedVerseId, setSelectedVerseId] = useState(
    () => localStorage.getItem("routine_selected_verse_id") || "",
  );
  const [todos, setTodos] = useState(
    () => JSON.parse(localStorage.getItem("routine_todos")) || [],
  );

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return { hour: now.getHours(), minute: now.getMinutes() };
  });

  const [srAnnouncement, setSrAnnouncement] = useState("");

  useEffect(() => {
    localStorage.setItem("routine_day_id", dayIdentifier);
    localStorage.setItem("routine_morning_time", morningTime);
    localStorage.setItem("routine_night_time", nightTime);
    localStorage.setItem("routine_dark_mode", darkMode);
    localStorage.setItem("routine_sr_mode", srMode);
    localStorage.setItem(
      "routine_morning_gratitude",
      morningGratitudeCompleted,
    );
    localStorage.setItem("routine_morning_verse", morningVerseCompleted);
    localStorage.setItem("routine_todo_completed", todoCompleted);
    localStorage.setItem("routine_night_completed", nightCompleted);
    localStorage.setItem("routine_selected_verse_id", selectedVerseId);
    localStorage.setItem("routine_todos", JSON.stringify(todos));
  }, [
    dayIdentifier,
    morningTime,
    nightTime,
    darkMode,
    srMode,
    morningGratitudeCompleted,
    morningVerseCompleted,
    todoCompleted,
    nightCompleted,
    selectedVerseId,
    todos,
  ]);

  // find the time and do a reset if todays date does not match local storage
  useEffect(() => {
    const checkDateImmediate = () => {
      const now = new Date();
      const todayStr = now.toLocaleDateString();

      if (todayStr !== localStorage.getItem("routine_day_id")) {
        setDayIdentifier(todayStr);
        setMorningGratitudeCompleted(false);
        setMorningVerseCompleted(false);
        setTodoCompleted(false);
        setNightCompleted(false);
        setSelectedVerseId("");
        setTodos([]);
        setSrAnnouncement(
          "A new day has started. Daily routine progress tracking has reset.",
        );
      }
    };

    checkDateImmediate();

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime({ hour: now.getHours(), minute: now.getMinutes() });

      const todayStr = now.toLocaleDateString();
      if (todayStr !== localStorage.getItem("routine_day_id")) {
        setDayIdentifier(todayStr);
        setMorningGratitudeCompleted(false);
        setMorningVerseCompleted(false);
        setTodoCompleted(false);
        setNightCompleted(false);
        setSelectedVerseId("");
        setTodos([]);
        setSrAnnouncement(
          "A new day has started. Daily routine progress tracking has reset.",
        );
      }
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  //locks for the routine loop morning routine, todo list and night routine
  const lockStatuses = useMemo(() => {
    return calculateLockStatuses({
      morningTime,
      nightTime,
      currentTime,
      morningGratitudeCompleted,
      morningVerseCompleted,
      todoCompleted,
      nightCompleted,
    });
  }, [
    morningTime,
    nightTime,
    currentTime,
    morningGratitudeCompleted,
    morningVerseCompleted,
    todoCompleted,
    nightCompleted,
  ]);

  // check if the routine is locked
  const handleNavigationClick = (event, status) => {
    if (status === "locked") {
      event.preventDefault();
      setSrAnnouncement(
        "This section is currently locked. Complete your active routine milestones first.",
      );
      alert(
        "This section is currently locked. Complete the prior routine milestones first!",
      );
    }
  };

  return (
    <div
      className={`app-container ${darkMode ? "dark-mode" : "light-mode"}`}
      key={dayIdentifier}
    >
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {srAnnouncement}
      </div>

      <Navbar
        lockStatuses={lockStatuses}
        handleNavigationClick={handleNavigationClick}
      />
      {/* routes you have access to if your not logged in */}
      <div className="page-content">
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Home
                  lockStatuses={lockStatuses}
                  handleNavigationClick={handleNavigationClick}
                />
              ) : (
                <Navigate to="/login-and-sign-up" />
              )
            }
          />

          <Route path="/login-and-sign-up" element={<LoginAndSignUp />} />
          <Route
            path="/settings"
            element={
              <Settings
                darkMode={darkMode}
                setDarkMode={setDarkMode}
                srMode={srMode}
                setSrMode={setSrMode}
                morningTime={morningTime}
                setMorningTime={setMorningTime}
                nightTime={nightTime}
                setNightTime={setNightTime}
              />
            }
          />

          {/* routes you need to be logged in to have access to*/}
          <Route
            path="/morning-routine"
            element={
              isLoggedIn ? (
                <MorningRoutine
                  lockStatuses={lockStatuses}
                  selectedVerseId={selectedVerseId}
                  onSelectVerse={setSelectedVerseId}
                  onGratitudeFinish={() => setMorningGratitudeCompleted(true)}
                  onVerseFinish={() => setMorningVerseCompleted(true)}
                />
              ) : (
                <Navigate to="/login-and-sign-up" />
              )
            }
          />

          <Route
            path="/todo"
            element={
              isLoggedIn ? (
                <ToDoList
                  isReadOnly={
                    lockStatuses?.todo === "done" ||
                    lockStatuses?.todo === "locked"
                  }
                  onTodoRoutineFinish={() => setTodoCompleted(true)}
                />
              ) : (
                <Navigate to="/login-and-sign-up" />
              )
            }
          />

          <Route
            path="/night-routine"
            element={
              isLoggedIn ? (
                <NightRoutine
                  lockStatuses={lockStatuses}
                  onNightFinish={() => setNightCompleted(true)}
                />
              ) : (
                <Navigate to="/login-and-sign-up" />
              )
            }
          />

          <Route
            path="/why"
            element={
              isLoggedIn ? <Why /> : <Navigate to="/login-and-sign-up" />
            }
          />

          <Route
            path="/monthly-overview"
            element={
              isLoggedIn ? (
                <MonthlyReport />
              ) : (
                <Navigate to="/login-and-sign-up" />
              )
            }
          />

          <Route
            path="/clarity-corner"
            element={
              isLoggedIn ? (
                <ClarityCorner />
              ) : (
                <Navigate to="/login-and-sign-up" />
              )
            }
          />

          {/* when the reset button is pressed */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
