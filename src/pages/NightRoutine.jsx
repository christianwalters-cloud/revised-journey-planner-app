import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StrengthsStep from "../components/night-routine-components/StrengthsStep";
import WeaknessesStep from "../components/night-routine-components/WeaknessesStep";
import ImprovementStep from "../components/night-routine-components/ImprovementStep";
import '../css/NightRoutine.css';

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

    useEffect(() => {
        localStorage.setItem("night_strengths", JSON.stringify(strengthsList));
    }, [strengthsList]);

    useEffect(() => {
        localStorage.setItem("night_weaknesses", JSON.stringify(weaknessesList));
    }, [weaknessesList]);

    useEffect(() => {
        localStorage.setItem("night_improvements", JSON.stringify(improvementsList));
    }, [improvementsList]);

    useEffect(() => {
        if (!isNightDone && lockStatuses?.night === "unlocked" && strengthsList.length === 0 && weaknessesList.length === 0 && improvementsList.length === 0) {
            setStrengthsList([]);
            setWeaknessesList([]);
            setImprovementsList([]);
            setCurrentStep("strengths");
        }
    }, [isNightDone, lockStatuses?.night]);

    const handleAddStrength = (text) => setStrengthsList((prev) => [...prev, text]);
    const handleDeleteStrength = (index) => setStrengthsList((prev) => prev.filter((_, i) => i !== index));

    const handleAddWeakness = (text) => setWeaknessesList((prev) => [...prev, text]);
    const handleDeleteWeakness = (index) => setWeaknessesList((prev) => prev.filter((_, i) => i !== index));

    const handleAddImprovement = (text) => setImprovementsList((prev) => [...prev, text]);
    const handleDeleteImprovement = (index) => setImprovementsList((prev) => prev.filter((_, i) => i !== index));

    const handleFinishRoutine = () => {
        if (isNightDone) {
            navigate("/");
        } else {
            if (onNightFinish) onNightFinish();
            navigate("/");
        }
    };

   return (
    <main className="page-layout-wrapper">
        <section className="routine-container night">
            <h2>Night Routine</h2>

            {currentStep === "strengths" && (
                <StrengthsStep
                    isReadOnly={isNightDone}
                    list={strengthsList}
                    onAdd={handleAddStrength}
                    onDelete={handleDeleteStrength}
                    onNext={() => setCurrentStep("weaknesses")}
                />
            )}

            {currentStep === "weaknesses" && (
                <WeaknessesStep
                    isReadOnly={isNightDone}
                    list={weaknessesList}
                    onAdd={handleAddWeakness}
                    onDelete={handleDeleteWeakness}
                    onNext={() => setCurrentStep("improvements")}
                    onBack={() => setCurrentStep("strengths")} // 🚀 FIX: Connects the back button wire
                />
            )}

            {currentStep === "improvements" && (
                <ImprovementStep
                    isReadOnly={isNightDone}
                    list={improvementsList}
                    onAdd={handleAddImprovement}
                    onDelete={handleDeleteImprovement}
                    onNext={handleFinishRoutine}
                    onBack={() => setCurrentStep("weaknesses")} // 🚀 FIX: Connects the back button wire
                />
            )}
        </section>
    </main>
);
}