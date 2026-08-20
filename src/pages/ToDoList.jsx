import { useEffect, useState } from "react";
/* 🚀 ACCESSIBILITY & UX FIX: Added useNavigate for automatic page redirection */
import { useNavigate } from "react-router-dom"; 
import '../css/ToDoList.css';

export default function ToDoList({ isReadOnly, onTodoRoutineFinish }) {
    const MAX_TASKS = 5;
    const navigate = useNavigate(); // Initialize the navigation engine

    const [tasks, setTasks] = useState(() => {
        const saveData = localStorage.getItem("todo_tasks_data");
        return saveData ? JSON.parse(saveData) : [];
    });

    const [inputValue, setInputValue] = useState("");
    const [srAnnouncement, setSrAnnouncement] = useState("");

    useEffect(() => {
        localStorage.setItem("todo_tasks_data", JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (isReadOnly) return;  
        
        const trimmed = inputValue.trim();
        if (trimmed === "") {
            setSrAnnouncement("Error: You must write a task description first.");
            return;
        }
        if (tasks.length >= MAX_TASKS) {
            setSrAnnouncement("Error: Your task list is full. Remove an item before adding a new one.");
            return;
        }

        const isFirstTask = tasks.length === 0;

        const newTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
            text: trimmed,
            completed: false,
            isStarred: isFirstTask 
        };

        setTasks((prevTasks) => [...prevTasks, newTask]);
        setInputValue("");
        setSrAnnouncement(`Added task: ${trimmed}${isFirstTask ? " as your Hero Task" : ""}`);
    };

    const handleToggleComplete = (idToToggle) => {
        if (isReadOnly) return; 
        setTasks((prevTasks) =>
            prevTasks.map(task => {
                if (task.id === idToToggle) {
                    const nextState = !task.completed;
                    setSrAnnouncement(`Marked task "${task.text}" as ${nextState ? "completed" : "pending"}`);
                    return { ...task, completed: nextState };
                }
                return task;
            })
        );
    };

    const handleDeleteTask = (idToDelete) => {
        if (isReadOnly) return; 
        const taskToRemove = tasks.find(t => t.id === idToDelete);
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== idToDelete));
        if (taskToRemove) {
            setSrAnnouncement(`Deleted task: ${taskToRemove.text}`);
        }
    };

    const handleRemoveAllTasks = () => {
        if (isReadOnly) return; 
        setTasks([]);
        setInputValue("");
        setSrAnnouncement("All items cleared from your daily to-do list.");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTask();
        }
    };

    /* 🚀 ACCESSIBILITY & NAVIGATION HANDLER */
    const handleFinalizeAndNavigate = () => {
        if (onTodoRoutineFinish) onTodoRoutineFinish(); 
        setSrAnnouncement("To-do list finalized. Unlocking and navigating to your Night Routine.");
        
        // Brief timeout ensures screen readers process the spoken announcement before the DOM unmounts
        setTimeout(() => {
            navigate("/night-routine"); 
        }, 200);
    };

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    
    // Core structural check to evaluate when all logged goals are complete
    const showUnlockMessage = tasks.length > 0 && tasks.every(t => t.completed);

    return (
        <main className="page-layout-wrapper">
            <div className="sr-only" aria-live="assertive" aria-atomic="true">
                {srAnnouncement}
            </div>

            <section className="routine-container morning">
                <h1 className="todo-centered-header">
                    Daily To-Do List <span aria-hidden="true">({completedTasks.length}/{tasks.length})</span>
                    <span className="sr-only">, {completedTasks.length} of {tasks.length} tasks completed</span>
                </h1>

                {!isReadOnly ? (
                    <div className="todo-row">
                        <label htmlFor="todo-input-entry" className="sr-only">
                            Type a daily task description
                        </label>
                        <input 
                            type="text" 
                            id="todo-input-entry"
                            placeholder={tasks.length === 0 ? "Add your Hero Task... ⭐" : "Add a regular task..."} 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button type="button" onClick={handleAddTask}>
                            {tasks.length === 0 ? "Add Hero Task" : "Add Task"}
                        </button>
                        <button type="button" id="removeTasksBtn" onClick={handleRemoveAllTasks}>Remove All</button>
                    </div>
                ) : (
                    <p className="todo-read-only-notice">
                        Viewing locked goals for today.
                    </p>
                )}

                {!isReadOnly && (
                    <div className="counter-display" aria-live="polite">
                        Tasks Logged: {tasks.length} / {MAX_TASKS}
                    </div>
                )}

                {activeTasks.length > 0 && (
                    <div className="task-sub-section">
                        <h2 className="task-section-title pending">PENDING</h2>
                        <ul className="todo-list">
                            {activeTasks.map((task) => (
                                <li key={task.id} className={`todo-list-item active-item ${task.isStarred ? 'starred-main-task' : ''}`}>
                                    <label className="task-clickable-area">
                                        <input 
                                            type="checkbox" 
                                            checked={task.completed} 
                                            disabled={isReadOnly}
                                            onChange={() => handleToggleComplete(task.id)}
                                            className="task-checkbox-indicator" 
                                        />
                                        <span className="item-text">
                                            {task.isStarred && <span aria-label="Hero Task: ">⭐ </span>}
                                            {task.text}
                                        </span>
                                    </label>
                                    {!isReadOnly && (
                                        <button 
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => handleDeleteTask(task.id)}
                                            aria-label={`Delete task: ${task.text}`}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {completedTasks.length > 0 && (
                    <div className="task-sub-section">
                        <h2 className="task-section-title completed">COMPLETED</h2>
                        <ul className="todo-list">
                            {completedTasks.map((task) => (
                                <li key={task.id} className={`todo-list-item completed-item ${task.isStarred ? 'starred-main-task' : ''}`}>
                                    <label className="task-clickable-area">
                                        <input 
                                            type="checkbox" 
                                            checked={task.completed} 
                                            disabled={isReadOnly}
                                            onChange={() => handleToggleComplete(task.id)}
                                            className="task-checkbox-indicator" 
                                        />
                                        <span className="item-text">
                                            {task.isStarred && <span aria-label="Hero Task: ">⭐ </span>}
                                            {task.text}
                                        </span>
                                    </label>
                                    {!isReadOnly && (
                                        <button 
                                            type="button"
                                            className="delete-btn"
                                            onClick={() => handleDeleteTask(task.id)}
                                            aria-label={`Delete task: ${task.text}`}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {showUnlockMessage && !isReadOnly && (
                    <div className="unlock-routine-wrapper">
                        <p>All daily goals achieved!</p>
                        <button type="button" className="next-step-btn"  onClick={handleFinalizeAndNavigate}>
                            Proceed to Night Routine
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}

