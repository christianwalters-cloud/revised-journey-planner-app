import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GratitudeStep from "../components/morning-routine-components/GratitudeStep";
import VersesStep from "../components/morning-routine-components/VersesStep";
import { selectableBibleVerses } from "../Utils/SelectableVerses"; 
import '../css/MorningRoutine.css';

export default function MorningRoutine({ lockStatuses, onGratitudeFinish, onVerseFinish, selectedVerseId, onSelectVerse }) {
    const navigate = useNavigate();

    const isMorningDone = lockStatuses?.morning === "done";
    const [isWaitingForUnlock, setIsWaitingForUnlock] = useState(false);

    const [gratitudeList, setGratitudeList] = useState(() => {
        const saved = localStorage.getItem("morning_grateful");
        return saved ? JSON.parse(saved) : [];
    });

    const [currentStep, setCurrentStep] = useState(() => isMorningDone ? "verses" : "gratitude");

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

    const targetVerseObj = selectableBibleVerses.find(v => v.id === selectedVerseId);
    const verseListArray = targetVerseObj ? [`"${targetVerseObj.text}" — ${targetVerseObj.verse}`] : [];

    const handleAddGratitude = (newText) => {
        setGratitudeList((prev) => [...prev, newText]);
    };

    const handleDeleteGratitude = (targetIndex) => {
        setGratitudeList((prev) => prev.filter((_, index) => index !== targetIndex));
    };

    const handleSelectVerse = (verseObj) => {
        onSelectVerse(verseObj.id); 
    };

    const handleDeleteVerse = () => {
        onSelectVerse(""); 
    };

    const handleNextStep = () => {
        if (onGratitudeFinish) onGratitudeFinish();
        setCurrentStep("verses"); 
    };

    const handleBackStep = () => {
        setCurrentStep("gratitude");
    };

    const handleFinishRoutine = () => {
        if (isMorningDone) {
            navigate("/todo");
        } else {
            if (!selectedVerseId) return alert("Please select a focus verse first.");
            setIsWaitingForUnlock(true);
            if (onVerseFinish) onVerseFinish(); 
        }
    };

    return (
        <main className="page-layout-wrapper">
            <section className="routine-container morning">
                <h2>Morning Routine</h2>
                
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
