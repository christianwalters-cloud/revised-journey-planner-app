import supabase from "../../supabase-client";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StrengthsStep from "../components/night-routine-components/StrengthsStep";
import WeaknessesStep from "../components/night-routine-components/WeaknessesStep";
import ImprovementStep from "../components/night-routine-components/ImprovementStep";
import "../css/NightRoutine.css";

export default function NightRoutine({ lockStatuses, onNightFinish }) {
  const navigate = useNavigate();

  const isNightDone = lockStatuses?.night === "done";

  const [strengthsList, setStrengthsList] = useState(() => {
    const saved = localStorage.getItem("night_strengths");
    return saved ? JSON.parse(saved) : [];
  });

  const [weaknessesList, setWeaknessesList] = useState(() => {
    const saved = localStorage.getItem("night_weaknesses");
    return saved ? JSON.parse(saved) : [];
  });

  const [improvementsList, setImprovementsList] = useState(() => {
    const saved = localStorage.getItem("night_improvements");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentStep, setCurrentStep] = useState("strengths");

  // Accessibility announcement context engine
  const [srAnnouncement, setSrAnnouncement] = useState("");

  useEffect(() => {
    localStorage.setItem("night_strengths", JSON.stringify(strengthsList));
  }, [strengthsList]);

  useEffect(() => {
    localStorage.setItem("night_weaknesses", JSON.stringify(weaknessesList));
  }, [weaknessesList]);

  useEffect(() => {
    localStorage.setItem(
      "night_improvements",
      JSON.stringify(improvementsList),
    );
  }, [improvementsList]);

  useEffect(() => {
    if (
      !isNightDone &&
      lockStatuses?.night === "unlocked" &&
      strengthsList.length === 0 &&
      weaknessesList.length === 0 &&
      improvementsList.length === 0
    ) {
      setStrengthsList([]);
      setWeaknessesList([]);
      setImprovementsList([]);
      setCurrentStep("strengths");
    }
  }, [isNightDone, lockStatuses?.night]);

  const handleAddStrength = (text) => {
    setStrengthsList((prev) => [...prev, text]);
    setSrAnnouncement(`Added item to your strengths list: ${text}`);
  };
  const handleDeleteStrength = (index) => {
    const removed = strengthsList[index];
    setStrengthsList((prev) => prev.filter((_, i) => i !== index));
    if (removed) setSrAnnouncement(`Deleted item: ${removed}`);
  };

  const handleAddWeakness = (text) => {
    setWeaknessesList((prev) => [...prev, text]);
    setSrAnnouncement(`Added item to your weaknesses list: ${text}`);
  };
  const handleDeleteWeakness = (index) => {
    const removed = weaknessesList[index];
    setWeaknessesList((prev) => prev.filter((_, i) => i !== index));
    if (removed) setSrAnnouncement(`Deleted item: ${removed}`);
  };

  const handleAddImprovement = (text) => {
    setImprovementsList((prev) => [...prev, text]);
    setSrAnnouncement(`Added improvement goal: ${text}`);
  };
  const handleDeleteImprovement = (index) => {
    const removed = improvementsList[index];
    setImprovementsList((prev) => prev.filter((_, i) => i !== index));
    if (removed) setSrAnnouncement(`Deleted item: ${removed}`);
  };

  const handleStepChange = (nextStepName, stepDescription) => {
    setCurrentStep(nextStepName);
    setSrAnnouncement(stepDescription);
  };

  const handleFinishRoutine = async () => {
    setSrAnnouncement("Night routine submitted successfully. Returning home.");

    if (!isNightDone) {
      // 1. Batch upload positive entries to your wins table

      if (strengthsList.length > 0) {
        const strengthRows = strengthsList.map((text) => ({
          win_text: text,
          source: "night_strengths",
        }));

        const { error: strengthError } = await supabase
          .from("daily_wins")
          .insert(strengthRows);

        if (strengthError) {
          console.error(
            "❌ Failed to log night strengths:",
            strengthError.message,
          );
        } else {
          console.log("🚀 Night strengths synced to cloud database.");
        }
      }

      // 2. Batch upload friction points to your struggle tracker table

      if (weaknessesList.length > 0) {
        const weaknessRows = weaknessesList.map((text) => ({
          struggle_text: text,
        }));

        const { error: weaknessError } = await supabase
          .from("daily_struggles")
          .insert(weaknessRows);

        if (weaknessError) {
          console.error(
            "❌ Failed to log daily struggles:",
            weaknessError.message,
          );
        } else {
          console.log("🚀 Daily struggles synced to cloud database.");
        }
      }

      if (onNightFinish) onNightFinish();
    }

    navigate("/");
  };

  return (
    <main className="page-layout-wrapper">
      <div className="sr-only" aria-live="assertive" aria-atomic="true">
        {srAnnouncement}
      </div>

      <section className="routine-container night">
        <h1>Night Routine</h1>

        {currentStep === "strengths" && (
          <StrengthsStep
            isReadOnly={isNightDone}
            list={strengthsList}
            onAdd={handleAddStrength}
            onDelete={handleDeleteStrength}
            onNext={() =>
              handleStepChange(
                "weaknesses",
                "Moved to step 2 of 3: Daily Weaknesses Form.",
              )
            }
          />
        )}

        {currentStep === "weaknesses" && (
          <WeaknessesStep
            isReadOnly={isNightDone}
            list={weaknessesList}
            onAdd={handleAddWeakness}
            onDelete={handleDeleteWeakness}
            onNext={() =>
              handleStepChange(
                "improvements",
                "Moved to step 3 of 3: Areas of Improvement Form.",
              )
            }
            onBack={() =>
              handleStepChange(
                "strengths",
                "Returned to step 1 of 3: Daily Strengths Form.",
              )
            }
          />
        )}

        {currentStep === "improvements" && (
          <ImprovementStep
            isReadOnly={isNightDone}
            list={improvementsList}
            onAdd={handleAddImprovement}
            onDelete={handleDeleteImprovement}
            onNext={handleFinishRoutine}
            onBack={() =>
              handleStepChange(
                "weaknesses",
                "Returned to step 2 of 3: Daily Weaknesses Form.",
              )
            }
          />
        )}
      </section>
    </main>
  );
}
