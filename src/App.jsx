import { useState } from 'react'
import { Routes, Route} from 'react-router-dom'
import  Navbar  from './components/Navbar'
import  Home  from './pages/Home'
import  Settings  from './pages/Settings'
import  MorningRoutine  from './pages/MorningRoutine'
import  ToDoList  from './pages/ToDoList'
import  NightRoutine  from './pages/NightRoutine'
import './App.css'

function App() {
  return (
  <>
    <Navbar/>
    
    <Routes>
      <Route
      path='/'
      element={
        <Home/>
      }
      />

      <Route
      path='/settings'
      element={
        <Settings/>
      }
      />

      <Route
      path='/morning-routine'
      element={
        <MorningRoutine/>
      }
      />

       <Route
      path='/todo'
      element={
        <ToDoList/>
      }
      />

       <Route
      path='/night-routine'
      element={
        <NightRoutine/>
      }
      />

    </Routes>
    </>
  );
}

export default App
