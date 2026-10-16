import { useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../supabase-client";
import { useAuth } from "../context/AuthContext";

// Standard Child Step Components
import ThoughtDumpStep from "../components/clarity-components/ThoughtDumpStep";
import FactCheckStep from "../components/clarity-components/FactCheckStep";
import EvidenceStep from "../components/clarity-components/EvidenceStep";
import FriendPerspectiveStep from "../components/clarity-components/FreindPerspetive";
import BiblicalTruthStep from "../components/clarity-components/BiblicalTruthStep";

// Sub-components
import EntryTypeToggle from "../components/clarity-components/EntryTypeToggle";
import PressureCheckStep from "../components/clarity-components/PressureCheckStep";

import "../css/ClarityCorner.css";

export default function ClarityCorner() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState("dump");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [srAnnouncement, setSrAnnouncement] = useState("");

  const [entryType, setEntryType] = useState("standard");
  const [circumstancePressure, setCircumstancePressure] = useState("");
  const [rawThought, setRawThought] = useState("");
  const [isItTrue, setIsItTrue] = useState("");
  const [evidenceFor, setEvidenceFor] = useState("");
  const [evidenceAgainst, setEvidenceAgainst] = useState("");
  const [friendPerspective, setFriendPerspective] = useState("");
  const [biblicalTruth, setBiblicalTruth] = useState("");

  const handleFinalSubmit = async (finalBiblicalText) => {
    setIsSubmitting(true);
    let currentUserId = user?.id;
    if (!currentUserId) {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      currentUserId = session?.user?.id;
    }

    if (!currentUserId) {
      alert("Session expired. Please log in again.");
      setIsSubmitting(false);
      navigate("/login-and-sign-up");
      return;
    }

    const { error } = await supabase.from("clarity_corner").insert([
      {
        raw_thought: rawThought,
        is_it_true: entryType === "high_pressure" ? "Spiralling" : isItTrue,
        evidence_for: evidenceFor,
        evidence_against: evidenceAgainst,
        friend_perspective: friendPerspective,
        biblical_truth: finalBiblicalText,
        user_id: currentUserId,
        entry_type: entryType,
        circumstance_pressure:
          entryType === "high_pressure" ? circumstancePressure : null,
      },
    ]);

    setIsSubmitting(false);
    if (error) alert("Database error. Returning home.");
    else navigate("/");
  };

  const handleStepChange = (nextStep, announcement) => {
    setCurrentStep(nextStep);
    setSrAnnouncement(announcement);
  };

  return (
    <main className="goals-container clarity-corner-page">
      <div className="sr-only" aria-live="assertive">
        {srAnnouncement}
      </div>

      <h1 className="page-title">Clarity Corner</h1>
      <p className="page-subtitle" style={{ marginBottom: "1.5rem" }}>
        Take negative or overwhelming thoughts captive and evaluate them under
        truth.
      </p>

      <section className="routine-container clarity">
        {currentStep === "dump" && (
          <div className="step-fade-wrapper">
            <ThoughtDumpStep
              value={rawThought}
              onSave={setRawThought}
              onNext={() =>
                handleStepChange(
                  entryType === "high_pressure" ? "pressure-check" : "check",
                  "Next Step.",
                )
              }
            />
            <EntryTypeToggle entryType={entryType} onToggle={setEntryType} />
          </div>
        )}

        {currentStep === "pressure-check" && (
          <PressureCheckStep
            value={circumstancePressure}
            onSave={setCircumstancePressure}
            onNext={() => handleStepChange("truth", "Sanctuary Anchor.")}
            onBack={() => handleStepChange("dump", "Back.")}
          />
        )}

        {currentStep === "check" && (
          <FactCheckStep
            value={isItTrue}
            onSave={setIsItTrue}
            onNext={() => handleStepChange("for", "Evidence For.")}
            onBack={() => handleStepChange("dump", "Back.")}
          />
        )}
        {currentStep === "for" && (
          <EvidenceStep
            title="3. Evidence FOR"
            value={evidenceFor}
            onSave={setEvidenceFor}
            onNext={() => handleStepChange("against", "Evidence Against.")}
            onBack={() => handleStepChange("check", "Back.")}
          />
        )}
        {currentStep === "against" && (
          <EvidenceStep
            title="4. Evidence AGAINST"
            value={evidenceAgainst}
            onSave={setEvidenceAgainst}
            onNext={() => handleStepChange("friend", "Best Friend Test.")}
            onBack={() => handleStepChange("for", "Back.")}
          />
        )}
        {currentStep === "friend" && (
          <FriendPerspectiveStep
            value={friendPerspective}
            onSave={setFriendPerspective}
            onNext={() => handleStepChange("truth", "Biblical Truth.")}
            onBack={() => handleStepChange("against", "Back.")}
          />
        )}
        {currentStep === "truth" && (
          <BiblicalTruthStep
            title={
              entryType === "high_pressure"
                ? "3. Sanctuary Anchor"
                : "6. Biblical Truth"
            }
            value={biblicalTruth}
            onSave={setBiblicalTruth}
            isSubmitting={isSubmitting}
            onFinish={handleFinalSubmit}
            onBack={() =>
              handleStepChange(
                entryType === "high_pressure" ? "pressure-check" : "friend",
                "Back.",
              )
            }
          />
        )}
      </section>
    </main>
  );
}
