import supabase from "../../supabase-client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GratitudeStep from "../components/morning-routine-components/GratitudeStep";
import VersesStep from "../components/morning-routine-components/VersesStep";
import { selectableBibleVerses } from "../Utils/SelectableVerses";
import "../css/MorningRoutine.css";

export default function MorningRoutine({
  lockStatuses,
  onGratitudeFinish,
  onVerseFinish,
  selectedVerseId,
  onSelectVerse,
}) {
  const navigate = useNavigate();

  const isMorningDone = lockStatuses?.morning === "done";
  const [isWaitingForUnlock, setIsWaitingForUnlock] = useState(false);

  // Accessibility announcement context engine
  const [srAnnouncement, setSrAnnouncement] = useState("");

  const [gratitudeList, setGratitudeList] = useState(() => {
    const saved = localStorage.getItem("morning_grateful");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentStep, setCurrentStep] = useState(() =>
    isMorningDone ? "verses" : "gratitude",
  );

  useEffect(() => {
    localStorage.setItem("morning_grateful", JSON.stringify(gratitudeList));
  }, [gratitudeList]);

  useEffect(() => {
    if (isWaitingForUnlock && lockStatuses?.todo !== "locked") {
      setIsWaitingForUnlock(false);
      navigate("/todo");
    }
  }, [lockStatuses?.todo, isWaitingForUnlock, navigate]);

  useEffect(() => {
    if (!isMorningDone && selectedVerseId === "") {
      setGratitudeList([]);
      setCurrentStep("gratitude");
    }
  }, [isMorningDone, selectedVerseId]);

  const targetVerseObj = selectableBibleVerses.find(
    (v) => v.id === selectedVerseId,
  );
  const verseListArray = targetVerseObj
    ? [`"${targetVerseObj.text}" — ${targetVerseObj.verse}`]
    : [];

  const handleAddGratitude = (newText) => {
    setGratitudeList((prev) => [...prev, newText]);
    setSrAnnouncement(`Added item to gratitude list: ${newText}`);
  };

  const handleDeleteGratitude = (targetIndex) => {
    const removed = gratitudeList[targetIndex];
    setGratitudeList((prev) =>
      prev.filter((_, index) => index !== targetIndex),
    );
    if (removed) {
      setSrAnnouncement(`Deleted gratitude item: ${removed}`);
    }
  };

  const handleSelectVerse = (verseObj) => {
    onSelectVerse(verseObj.id);
    setSrAnnouncement(`Selected focus verse: ${verseObj.verse}`);
  };

  const handleDeleteVerse = () => {
    onSelectVerse("");
    setSrAnnouncement("Cleared your selected focus verse.");
  };

  const handleNextStep = async () => {
    if (onGratitudeFinish) onGratitudeFinish();
    setCurrentStep("verses");
    setSrAnnouncement("Moved to step 2 of 2: Focus Verse Selection Form.");

    if (!isMorningDone && gratitudeList.length > 0) {
      const rowsToInsert = gratitudeList.map((text) => ({
        win_text: text,
        source: "morning_gratitude",
      }));
      const { error } = await supabase.from("daily_wins").insert(rowsToInsert);

      if (error) {
        console.error(
          "❌ Failed to log gratitude array to Supabase:",
          error.message,
        );
      } else {
        console.log("🚀 Batch gratitude successfully saved to cloud database.");
      }
    }
  };

  const handleBackStep = () => {
    setCurrentStep("gratitude");
    setSrAnnouncement("Returned to step 1 of 2: Daily Gratitude List.");
  };

  const handleFinishRoutine = () => {
    if (isMorningDone) {
      navigate("/todo");
    } else {
      if (!selectedVerseId) {
        setSrAnnouncement(
          "Error: Please select a focus verse first before completing the routine.",
        );
        return alert("Please select a focus verse first.");
      }
      setIsWaitingForUnlock(true);
      if (onVerseFinish) onVerseFinish();
      setSrAnnouncement(
        "Morning routine completed successfully. Redirecting to To Do List.",
      );
    }
  };

  return (
    <main className="page-layout-wrapper">
      {/* Central live announcer to safely handle background updates */}
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {srAnnouncement}
      </div>

      <section className="routine-container morning">
        <h1>Morning Routine</h1>

        {currentStep === "gratitude" ? (
          <GratitudeStep
            isReadOnly={isMorningDone}
            list={gratitudeList}
            onAdd={handleAddGratitude}
            onDelete={handleDeleteGratitude}
            onNext={handleNextStep}
          />
        ) : (
          <VersesStep
            isReadOnly={isMorningDone}
            list={verseListArray}
            onSelect={handleSelectVerse}
            onDelete={handleDeleteVerse}
            onBack={handleBackStep}
            onFinish={handleFinishRoutine}
          />
        )}
      </section>
    </main>
  );
}
