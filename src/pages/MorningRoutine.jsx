
import { useState } from "react";
import GratitudeStep from "../components/morning-routine-components/GratitudeStep";
import VersesStep from "../components/morning-routine-components/VersesStep";

function MorningRoutine({lockStatuses, onRoutineFinish}){
    const isReadOnly = lockStatuses?.morning === "done";
    const[currentStep, setCurrentStep] = useState(isReadOnly ? "verses" : "gratitude");

    const stepProps = {isReadOnly, onNext: () => setCurrentStep("verses")};


      return (
        <div className="page-layout">
        <div className="routine-container morning">
            <h2>☀️ Morning Routine</h2>
             {currentStep === "gratitude" && (
                <GratitudeStep {...stepProps} />
             )}
            {currentStep === "verses" && (
                <VersesStep {...stepProps}
                onBack={() => setCurrentStep("gratitude")}
                onFinish={onRoutineFinish}
                />
            )}

        </div>
        </div>
    );
}

export default MorningRoutine;