import { useState } from "react";
import { selectableBibleVerses } from "../../Utils/SelectableVerses";

const ROUTINE_CATEGORIES = [...new Set(selectableBibleVerses.map(v => v.category))];

export default function VersesStep({ isReadOnly, list = [], onSelect, onDelete, onBack, onFinish }) {
    const MAX_ITEMS = 1; 
    const [activeCategory, setActiveCategory] = useState(ROUTINE_CATEGORIES[0] || "strength");
    const [errorMsg, setErrorMsg] = useState(""); // Replaced alert with local state

    const filteredVerses = selectableBibleVerses.filter(v => v.category === activeCategory);
    
    const isVerseChosen = list.length > 0;
    const isLimitReached = list.length >= MAX_ITEMS;

    const handleCardClick = (verseObj, isChosen) => {
        if (isReadOnly) return; 
        setErrorMsg(""); // Clear errors on interaction

        if (isChosen) {
            onDelete(); 
        } else {
            if (isLimitReached) {
                setErrorMsg("You can only select one focus verse per day. Remove your current choice first.");
                return;
            }
            onSelect(verseObj);
        }
    };

    const handleKeyDown = (e, verseObj, isChosen) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleCardClick(verseObj, isChosen);
        }
    };

    return (
        <div className="reflections-section" role="region" aria-label="Bible Verse Selection Step">
            <button className="back-btn" type="button" onClick={onBack}>
                <span aria-hidden="true">← </span>Back to Gratitude
            </button>

            <h3>
                Focus Verse <span aria-hidden="true">({list.length}/{MAX_ITEMS})</span>
                <span className="sr-only">, {list.length} of {MAX_ITEMS} verses selected</span>
            </h3>

            {/* Accessible inline alert for the selection limit */}
            {errorMsg && (
                <p role="alert" className="error-message" style={{ color: "red", textAlign: "center" }}>
                    {errorMsg}
                </p>
            )}
            
            {!isReadOnly ? (
                <>
                    <p className="step-hint">Select your focus verse for today. Click it again to deselect it.</p>

                    <div className="category-tabs-row" role="tablist" aria-label="Verse Categories">
                        {ROUTINE_CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                type="button"
                                role="tab"
                                id={`tab-${cat}`}
                                aria-controls={`panel-${cat}`}
                                aria-selected={activeCategory === cat}
                                className={`category-tab-btn ${activeCategory === cat ? "active" : ""}`}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setErrorMsg("");
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div 
                        className="verses-selection-grid"
                        id={`panel-${activeCategory}`}
                        role="tabpanel"
                        aria-labelledby={`tab-${activeCategory}`}
                    >
                        {filteredVerses.map((v) => {
                            const expectedFormat = `"${v.text}" — ${v.verse}`;
                            const isChosen = list.includes(expectedFormat);
                            
                            const cardClass = isChosen 
                                ? "verse-selection-card already-selected" 
                                : isLimitReached 
                                    ? "verse-selection-card disabled" 
                                    : "verse-selection-card";

                            return (
                                <div 
                                    key={v.id} 
                                    className={cardClass}
                                    onClick={() => handleCardClick(v, isChosen)} 
                                    onKeyDown={(e) => handleKeyDown(e, v, isChosen)} 
                                    role="button"
                                    tabIndex={0} 
                                    aria-pressed={isChosen}
                                    aria-disabled={isLimitReached && !isChosen}
                                    aria-label={`Verse: ${v.verse}. Text: ${v.text}.${isChosen ? " Selected." : ""}`}
                                >
                                    <strong aria-hidden="true">{v.verse}</strong>
                                    <p aria-hidden="true">"{v.text}"</p>
                                </div>
                            );
                        })}
                    </div>
                </>
            ) : (
                <p className="read-only-msg" role="status" style={{ textAlign: "center", width: "100%" }}>
                    Viewing locked answers for today.
                </p>
            )}

            {isVerseChosen && (
                <>
                    <h4 className="sub-section-title">Your Selected Focus Verse:</h4>
                    <ul className="todo-list" aria-label="Selected verse">
                        {list.map((itemText) => (
                            <li key={itemText} className="todo-list-item">
                                <span className="verse-logged-text">{itemText}</span>
                                {!isReadOnly && (
                                    <button 
                                        type="button" 
                                        className="delete-btn" 
                                        onClick={onDelete} 
                                        aria-label="Remove selected focus verse"
                                    >
                                        ✕
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            <div className="center-btn-wrapper">
                {!isReadOnly ? (
                    <button 
                        className="complete-btn" 
                        type="button" 
                        onClick={onFinish}
                        disabled={!isVerseChosen}
                        style={{
                            opacity: isVerseChosen ? 1 : 0.5,
                            cursor: isVerseChosen ? 'pointer' : 'not-allowed'
                        }}
                    >
                        Finish & Log Routine <span aria-hidden="true">✔</span>
                    </button>
                ) : (
                    <button 
                        className="complete-btn" 
                        type="button" 
                        onClick={onFinish} 
                        style={{ cursor: "pointer", opacity: 1, backgroundColor: "var(--color-unlocked)" }}
                    >
                        Return to Dashboard <span aria-hidden="true">→</span>
                    </button>
                )}
            </div>
        </div>
    );
}

