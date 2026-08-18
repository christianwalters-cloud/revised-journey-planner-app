import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../css/ToDoList.css';

export default function ToDoList({ isReadOnly, onTodoRoutineFinish }) {
    const MAX_TASKS = 5;

    const [tasks, setTasks] = useState(() => {
        const saveData = localStorage.getItem("todo_tasks_data");
        return saveData ? JSON.parse(saveData) : [];
    });

    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        localStorage.setItem("todo_tasks_data", JSON.stringify(tasks));
    }, [tasks]);

    const handleAddTask = () => {
        if (isReadOnly) return;  
        
        const trimmed = inputValue.trim();
        if (trimmed === "") {
            alert("You must write something!");
            return;
        }
        if (tasks.length >= MAX_TASKS) {
            alert("Your task list is full! Please remove an item before adding a new one.");
            setInputValue("");
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
    };

    const handleToggleComplete = (idToToggle) => {
        if (isReadOnly) return; 
        setTasks((prevTasks) =>
            prevTasks.map(task => 
                task.id === idToToggle ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const handleDeleteTask = (idToDelete) => {
        if (isReadOnly) return; 
        setTasks((prevTasks) => prevTasks.filter(task => task.id !== idToDelete));
    };

    const handleRemoveAllTasks = () => {
        if (isReadOnly) return; 
        setTasks([]);
        setInputValue("");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddTask();
        }
    };

    const activeTasks = tasks.filter(task => !task.completed);
    const completedTasks = tasks.filter(task => task.completed);
    const showUnlockMessage = tasks.length > 0 && tasks.every(t => t.completed);

    const canProceed = isReadOnly || showUnlockMessage;

    const dynamicPlaceholderText = tasks.length === 0 
        ? "Add your Hero Task... ⭐" 
        : "Add a regular task...";

    const dynamicButtonText = tasks.length === 0 
        ? "Add Hero Task" 
        : "Add Task";

    return (
        <main className="page-layout-wrapper">
            <section className="routine-container morning">
                
                <h3 className="todo-centered-header">
                    Daily To-Do List ({completedTasks.length}/{tasks.length})
                </h3>

                {!isReadOnly ? (
                    <div className="todo-row">
                        <input 
                            type="text" 
                            placeholder={dynamicPlaceholderText} 
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <button type="button" onClick={handleAddTask}>
                            {dynamicButtonText}
                        </button>
                        <button type="button" id="removeTasksBtn" onClick={handleRemoveAllTasks}>Remove All</button>
                    </div>
                ) : (
                    <p className="todo-read-only-notice">
                        Viewing locked goals for today.
                    </p>
                )}

                {!isReadOnly && (
                    <div className="counter-display">
                        Tasks Logged: {tasks.length} / {MAX_TASKS}
                    </div>
                )}

                {activeTasks.length > 0 && (
                    <div className="task-sub-section">
                        <h4 className="task-section-title pending">PENDING</h4>
                        <ul className="todo-list">
                            {activeTasks.map((task) => (
                                <li key={task.id} className={`todo-list-item active-item ${task.isStarred ? 'starred-main-task' : ''}`}>
                                    <div 
                                        className="task-clickable-area"
                                        role="button"
                                        tabIndex={isReadOnly ? -1 : 0}
                                        onClick={() => handleToggleComplete(task.id)}
                                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleToggleComplete(task.id)}
                                    >
                                        {!isReadOnly && (
                                            <input 
                                                type="checkbox" 
                                                checked={false} 
                                                readOnly 
                                                className="task-checkbox-indicator" 
                                            />
                                        )}
                                        <span className="item-text">{task.isStarred && "⭐ "}{task.text}</span>
                                    </div>
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
                        <h4 className="task-section-title completed">COMPLETED</h4>
                        <ul className="todo-list">
                            {completedTasks.map((task) => (
                                <li key={task.id} className={`todo-list-item completed-item ${task.isStarred ? 'starred-main-task' : ''}`}>
                                    <div 
                                        className="task-clickable-area"
                                        role="button"
                                        tabIndex={isReadOnly ? -1 : 0}
                                        onClick={() => handleToggleComplete(task.id)}
                                        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleToggleComplete(task.id)}
                                    >
                                        <input 
                                            type="checkbox" 
                                            checked={true} 
                                            readOnly 
                                            className="task-checkbox-indicator" 
                                        />
                                        <span className="item-text">{task.isStarred && "⭐ "}{task.text}</span>
                                    </div>
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

                <div className="center-btn-wrapper" style={{ margin: "2rem auto 0 auto", display: "block", textAlign: "center" }}>
                    <button 
                        className="complete-btn" 
                        type="button" 
                        onClick={onTodoRoutineFinish}
                        disabled={!canProceed}
                        style={{
                            opacity: canProceed ? 1 : 0.5,
                            cursor: canProceed ? 'pointer' : 'not-allowed',
                            padding: "0.8rem 2rem",
                            fontSize: "1rem"
                        }}
                    >
                        {isReadOnly ? "Return to Dashboard →" : "Complete Daily List ✔"}
                    </button>
                </div>

            </section>
        </main>
    );
}
