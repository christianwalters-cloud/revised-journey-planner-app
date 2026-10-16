import { useState } from "react";

function ImprovementStep({
  isReadOnly,
  list = [],
  onAdd,
  onDelete,
  onNext,
  onBack,
}) {
  const [input, setInput] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const MAX_ITEMS = 3;
  const isLimitReached = list.length >= MAX_ITEMS;

  const canProceed = isReadOnly || isLimitReached;

  const addToImprovementList = () => {
    const trimmed = input.trim();
    setErrorMsg("");

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
      addToImprovementList();
    }
  };

  return (
    <div className="reflections-section">
      <button className="back-btn" type="button" onClick={onBack}>
        <span aria-hidden="true">← </span>Back to what didn't go well
      </button>

      <h3 style={{ textAlign: "center", width: "100%", display: "block" }}>
        What can I improve for tomorrow?{" "}
        <span aria-hidden="true">
          ({list.length}/{MAX_ITEMS})
        </span>
        <span className="sr-only">
          , {list.length} of {MAX_ITEMS} items logged
        </span>
      </h3>

      {errorMsg && (
        <p
          role="alert"
          className="error-message"
          style={{ color: "red", textAlign: "center", margin: "10px 0" }}
        >
          {errorMsg}
        </p>
      )}

      {!isReadOnly ? (
        <div className="todo-row">
          <label htmlFor="improvement-input-entry" className="sr-only">
            Type an area you want to work on
          </label>
          <input
            type="text"
            id="improvement-input-entry"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              if (errorMsg) setErrorMsg("");
            }}
            onKeyDown={handleKeyDown}
            placeholder={
              isLimitReached ? "Limit of 3 reached" : "I want to work on..."
            }
            disabled={isLimitReached}
          />
          <button
            type="button"
            onClick={addToImprovementList}
            disabled={isLimitReached}
          >
            Add
          </button>
        </div>
      ) : (
        <p
          className="read-only-msg"
          style={{ textAlign: "center", width: "100%" }}
        >
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
                aria-label={`Delete improvement item ${index + 1}`}
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
          margin: "1.5rem auto 0 auto",
        }}
      >
        {isReadOnly ? "Good work today! →" : "Finish for the day ✔"}
      </button>
    </div>
  );
}

export default ImprovementStep;
