import { useState } from "react";
import { useNavigate } from "react-router-dom";

function VerseStep({ isReadOnly, onBack, onFinish}) {
    const navigate = useNavigate();

    return (
        <div className="reflections-section">
            <button className="back-btn" onClick={onBack}>← Back</button>
            <h3>Bible Verses</h3>
            {!isReadOnly ? (
                <div className="preset-verse-wrapper">
                    
                </div>
            ) : (
              <p className="read-only-msg">Veiwing locked answers for today.</p>
            )}
            <ul className="to-do-list">

            </ul>

            {isReadOnly ? (
                <button className="next-step-btn" onClick={() => navigate("/todo")}>
                    continue →
                </button>
            ):(
                 <button className="complete-btn" onClick={onFinish}>
                    Finish & Log Routine ✔
                </button>
            )}
            </div>
    );
}
export default VerseStep