import { useState } from "react";

function GratitudeStep({isReadOnly, onNext}){
    const [input, setInput] = useState("");
    return(
        <div className="reflections-section">
            <h3>Gratitude Entries</h3>

            {!isReadOnly ? (
                <div className="todo-row">
                    <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="I am grateful for..."
                    />
                        <button type="button">Add</button>
                </div>

            ):(
                <p className="read-only-msg">Veiwing locked answers for today.</p>
            )}
            <ul className="todo-list">
                {/* Render list items. Conditionally hide the delete "X" buttons using !isReadOnly && */}
            </ul>

            <button className="next-step-btn" onClick={onNext}>
                continue →
            </button>
        </div>
    );
}
export default GratitudeStep;