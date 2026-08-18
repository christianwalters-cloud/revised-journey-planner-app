import { useEffect, useMemo, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Settings from './pages/Settings';
import MorningRoutine from './pages/MorningRoutine';
import ToDoList from './pages/ToDoList';
import NightRoutine from './pages/NightRoutine';
import Why from './pages/Why';
import './css/App.css';
import { calculateLockStatuses } from './Utils/LockStatusEngine';
import { selectableBibleVerses } from './Utils/SelectableVerses';

function App() {
  const [dayIdentifier, setDayIdentifier] = useState(() => 
    localStorage.getItem('routine_day_id') || new Date().toLocaleDateString()
  );

  const [morningTime, setMorningTime] = useState(() => localStorage.getItem('routine_morning_time') || '09:00');
  const [nightTime, setNightTime] = useState(() => localStorage.getItem('routine_night_time') || '18:00');
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('routine_dark_mode') === 'true');
  const [srMode, setSrMode] = useState(() => localStorage.getItem('routine_sr_mode') === 'true');

  // Core Completion Statuses (Controls the Lock Status Engine)
  const [morningGratitudeCompleted, setMorningGratitudeCompleted] = useState(() => localStorage.getItem('routine_morning_gratitude') === 'true'); 
  const [morningVerseCompleted, setMorningVerseCompleted] = useState(() => localStorage.getItem('routine_morning_verse') === 'true');
  const [todoCompleted, setTodoCompleted] = useState(() => localStorage.getItem('routine_todo_completed') === 'true');
  const [nightCompleted, setNightCompleted] = useState(() => localStorage.getItem('routine_night_completed') === 'true');

  // Central Tracking States for Children Components
  const [selectedVerseId, setSelectedVerseId] = useState(() => localStorage.getItem('routine_selected_verse_id') || '');
  const [todos, setTodos] = useState(() => JSON.parse(localStorage.getItem('routine_todos')) || []);

  const [currentTime, setCurrentTime] = useState(() => {
    const now = new Date();
    return { hour: now.getHours(), minute: now.getMinutes() };
  });

  // 💾 Global LocalStorage Synchronization Side-Effect
  useEffect(() => {
    localStorage.setItem('routine_day_id', dayIdentifier);
    localStorage.setItem('routine_morning_time', morningTime);
    localStorage.setItem('routine_night_time', nightTime);
    localStorage.setItem('routine_dark_mode', darkMode);
    localStorage.setItem('routine_sr_mode', srMode);
    localStorage.setItem('routine_morning_gratitude', morningGratitudeCompleted);
    localStorage.setItem('routine_morning_verse', morningVerseCompleted);
    localStorage.setItem('routine_todo_completed', todoCompleted);
    localStorage.setItem('routine_night_completed', nightCompleted);
    localStorage.setItem('routine_selected_verse_id', selectedVerseId);
    localStorage.setItem('routine_todos', JSON.stringify(todos));
  }, [dayIdentifier, morningTime, nightTime, darkMode, srMode, morningGratitudeCompleted, morningVerseCompleted, todoCompleted, nightCompleted, selectedVerseId, todos]);

  // 🕒 60-Second Midnight Reset Timer
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime({ hour: now.getHours(), minute: now.getMinutes() });

      const todayStr = now.toLocaleDateString();
      if (todayStr !== dayIdentifier) {
        setDayIdentifier(todayStr);
        setMorningGratitudeCompleted(false);
        setMorningVerseCompleted(false);
        setTodoCompleted(false);
        setNightCompleted(false);
        setSelectedVerseId('');
        setTodos([]);
      }
    }, 60000); 
    return () => clearInterval(timer);
  }, [dayIdentifier]);

  // ⚙️ Pure Lock Engine Calculation Wrapper
  const lockStatuses = useMemo(() => {
    return calculateLockStatuses({
      morningTime,
      nightTime,
      currentTime,
      morningGratitudeCompleted, 
      morningVerseCompleted,
      todoCompleted,
      nightCompleted
    });
  }, [morningTime, nightTime, currentTime, morningGratitudeCompleted, morningVerseCompleted, todoCompleted, nightCompleted]);

  const handleNavigationClick = (event, status) => {
    if (status === 'locked') {
      event.preventDefault();
      alert('This section is currently locked. Complete the prior routine milestones first!');
    }
  };

  const activeVerseData = useMemo(() => {
    return selectableBibleVerses.find(v => v.id === selectedVerseId) || null;
  }, [selectedVerseId]);
  
  return (
    <div className={`app-container ${darkMode ? 'dark-mode' : 'light-mode'}`} key={dayIdentifier}>
      <Navbar lockStatuses={lockStatuses} handleNavigationClick={handleNavigationClick} />
      
      <div className="page-content">
        <Routes>
          <Route path='/' element={<Home lockStatuses={lockStatuses} handleNavigationClick={handleNavigationClick} srMode={srMode} />} />
          <Route path='/why' element={<Why srMode={srMode} />} />
          <Route path='/settings' element={
            <Settings 
              darkMode={darkMode} setDarkMode={setDarkMode} srMode={srMode} setSrMode={setSrMode}
              morningTime={morningTime} setMorningTime={setMorningTime} nightTime={nightTime} setNightTime={setNightTime}
            />
          } />

          {/* ☀️ MORNING ROUTE INPUTS */}
          <Route path='/morning-routine' element={ 
            <MorningRoutine 
              lockStatuses={lockStatuses} 
              selectedVerseId={selectedVerseId}
              onSelectVerse={setSelectedVerseId}
              onGratitudeFinish={() => setMorningGratitudeCompleted(true)}
              onVerseFinish={() => setMorningVerseCompleted(true)}
            /> 
          } />

          {/* 📝 TO DO LIST INPUTS */}
          <Route path='/todo' element={ 
            <ToDoList 
              todos={todos}
              setTodos={setTodos}
              isReadOnly={lockStatuses?.todo === "done" || lockStatuses?.todo === "locked"} 
              onTodoRoutineFinish={() => setTodoCompleted(true)}
            /> 
          } />

          {/* 🌙 NIGHT ROUTE INPUTS */}
          <Route path='/night-routine' element={ 
            <NightRoutine 
              activeVerseData={activeVerseData}
              isReadOnly={lockStatuses?.night === "done" || lockStatuses?.night === "locked"}
              onNightRoutineFinish={() => setNightCompleted(true)}
            /> 
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;
