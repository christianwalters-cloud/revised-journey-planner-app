import { useEffect, useMemo, useState } from 'react'
import { Routes, Route} from 'react-router-dom'
import  Navbar  from './components/Navbar'
import  Home  from './pages/Home'
import  Settings  from './pages/Settings'
import  MorningRoutine  from './pages/MorningRoutine'
import  ToDoList  from './pages/ToDoList'
import  NightRoutine  from './pages/NightRoutine'
import './App.css'
import { calculateLockStatuses } from './Utils/LockStatusEngine'

function App() {
  const [dayIdentifier, setDayIdentifier] = useState(() => 
  new Date().toLocaleDateString()
);

// morning and night routine settings
const [morningTime, setMorningTime] = useState('09:00');
const [nightTime, setNightTime] = useState('18:00');

// a tracker for current time when app boots up
const [currentTime, setCurrentTime] = useState(() =>{
  const now = new Date();
  return {hour: now.getHours(), minute: now.getMinutes()};
});

// a traker for current time, tracking any time the current time changes
useEffect(() =>{
  const timer = setInterval(() =>{
    const now = new Date();
    setCurrentTime({
      hour: now.getHours(),
      minute: now.getMinutes()
    });
  }, 60000); // every min logs a change
  return () => clearInterval(timer);
}, []);

// settings
const [morningCompleted, setMorningCompleted] = useState(false);
const [morningVerseCompleted, setMorningVerseCompleted] = useState(false);
const [todoCompleted, setTodoCompleted] = useState(false);
const [nightCompleted, setNightCompleted] = useState(false);

  const lockStatuses = useMemo(()=> {
    return calculateLockStatuses({
    morningTime,
    nightTime,
    currentTime,

    morningCompleted,
    morningVerseCompleted,
    todoCompleted,
    nightCompleted
    });
  }, [morningTime, nightTime, currentTime, morningCompleted, morningVerseCompleted, todoCompleted, nightCompleted]);

  // Navbar lock checker
  const handleNavigationClick = (event, status) => {
    if (status === 'locked') {
      event.preventDefault();
      alert('This routine is currently locked');
      return;
    }
  };
  
  return (
  <div className='app-container' key={dayIdentifier}>
    <Navbar
    lockStatuses={lockStatuses}
    handleNavigationClick={handleNavigationClick}
    />
    
    <Routes>
      <Route path='/' element={ <Home lockStatuses={lockStatuses}/>} />

      <Route path='/settings' element={ <Settings/>} />

      <Route path='/morning-routine' element={ <MorningRoutine lockStatuses={lockStatuses}/> } />

      <Route path='/todo' element={ <ToDoList lockStatuses={lockStatuses}/> } />

      <Route path='/night-routine' element={ <NightRoutine lockStatuses={lockStatuses}/> }/>
    </Routes>

    </div>
  );
  }

export default App;
