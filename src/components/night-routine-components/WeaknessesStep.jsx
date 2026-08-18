import { useState } from "react";

function WeaknessesStep({ isReadOnly, list = [], onAdd, onDelete, onNext, onBack }) {
    const [input, setInput] = useState("");
    const MAX_ITEMS = 3;
    const isLimitReached = list.length >= MAX_ITEMS;

    const canProceed = isReadOnly || isLimitReached;

    const addToWeaknessesList = () => {
        const trimmed = input.trim();
        if (!trimmed) return alert("Field must contain text before saving.");
        if (list.length >= MAX_ITEMS) return alert(`Limit of ${MAX_ITEMS} entries reached.`);

        onAdd(trimmed);
        setInput(""); 
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addToWeaknessesList();
        }
    };

    return (
        <div className="reflections-section">
            <button className="back-btn" type="button" onClick={onBack}>
                ← Back to what went well
            </button>

            <h3 style={{ textAlign: "center", width: "100%", display: "block" }}>
                What didn't go well today ({list.length}/{MAX_ITEMS})
            </h3>

            {!isReadOnly ? (
                <div className="todo-row">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isLimitReached ? "Limit of 3 reached" : "Something that didn't go well..."}
                        disabled={isLimitReached}
                    />
                    <button 
                        type="button" 
                        onClick={addToWeaknessesList}
                        disabled={isLimitReached}
                    >
                        Add
                    </button>
                </div>
            ) : (
                <p className="read-only-msg" style={{ textAlign: "center", width: "100%" }}>
                    Viewing locked answers for today.
                </p>
            )}

            <ul className="todo-list">
                {list.map((item, index) => (
                    <li key={`${item}-${index}`} className="todo-list-item">
                        <span className="item-text">{item}</span>
                        {!isReadOnly && (
                            <button 
                                type="button" 
                                className="delete-btn" 
                                onClick={() => onDelete(index)}
                                aria-label={`Delete item ${index + 1}`}
                            >
                                ✕
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <button 
                className="next-step-btn" 
                type="button" 
                onClick={onNext}
                disabled={!canProceed} 
                style={{ 
                    opacity: canProceed ? 1 : 0.5, 
                    cursor: canProceed ? "pointer" : "not-allowed",
                    display: "block",
                    margin: "1.5rem auto 0 auto" 
                }}
            >
                Continue to how can I improve →
            </button>
        </div>
    );
}

export default WeaknessesStep;
