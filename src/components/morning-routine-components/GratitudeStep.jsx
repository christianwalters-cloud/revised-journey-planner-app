import { useState } from "react";

export default function GratitudeStep({ isReadOnly, list = [], onAdd, onDelete, onNext }) {
    const [input, setInput] = useState("");
    const [errorMsg, setErrorMsg] = useState(""); // Replaced alert windows with local error states
    const MAX_ITEMS = 3;
    const isLimitReached = list.length >= MAX_ITEMS;

    const canProceed = isReadOnly || isLimitReached;

    const addToGratitudeList = () => {
        const trimmed = input.trim();
        setErrorMsg(""); // Clear previous errors

        if (!trimmed) {
            setErrorMsg("Field must contain text before saving.");
            return;
        }
        if (list.length >= MAX_ITEMS) {
            setErrorMsg(`Limit of ${MAX_ITEMS} entries reached.`);
            return;
        }

        onAdd(trimmed);
        setInput(""); 
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addToGratitudeList();
        }
    };

    return (
        <div className="reflections-section">
            <h3 style={{ textAlign: "center", width: "100%", display: "block" }}>
                Gratitude Entries <span aria-hidden="true">({list.length}/{MAX_ITEMS})</span>
                <span className="sr-only">, {list.length} of {MAX_ITEMS} items logged</span>
            </h3>

            {/* Accessible Live Region for inline errors */}
            {errorMsg && (
                <p role="alert" className="error-message" style={{ color: "red", textAlign: "center" }}>
                    {errorMsg}
                </p>
            )}

            {!isReadOnly ? (
                <div className="todo-row">
                    {/* Hidden semantic label linked directly to input fields */}
                    <label htmlFor="gratitude-input-entry" className="sr-only">
                        Type what you are grateful for
                    </label>
                    <input
                        type="text"
                        id="gratitude-input-entry"
                        value={input}
                        onChange={(e) => {
                            setInput(e.target.value);
                            if(errorMsg) setErrorMsg("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={isLimitReached ? "Limit of 3 reached" : "I am grateful for..."}
                        disabled={isLimitReached}
                    />
                    <button 
                        type="button" 
                        onClick={addToGratitudeList}
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
                                aria-label={`Delete gratitude item ${index + 1}`}
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
                Continue to verses 
                {/* Hides the structural arrow character from being announced by screen readers */}
                <span aria-hidden="true"> →</span>
            </button>
        </div>
    );
}
