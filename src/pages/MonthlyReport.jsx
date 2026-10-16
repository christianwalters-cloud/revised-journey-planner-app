import { useEffect, useState } from "react";
import supabase from "../../supabase-client";
import { useAuth } from "../context/AuthContext";
import {
  calculateTopPatterns,
  extractBigWins,
  calculateTopFriendPerspectives,
  calculateTopBiblicalTruths,
} from "../Utils/TextAnalyzer";

// 🚀 Sub-components imported cleanly
import AchievementCard from "../components/report-components/AchievementCard";
import RenewedThoughtsCard from "../components/report-components/RenewedThoughtsCard";
import CognitivePatternsCard from "../components/report-components/CognitivePatternsCard";
import SystemOverloadCard from "../components/report-components/SystemOverloadCard";

import "../css/MonthlyReport.css";

export default function MonthlyReport() {
  const { user } = useAuth();
  const [monthlyWins, setMonthlyWins] = useState([]);
  const [monthlyStruggles, setMonthlyStruggles] = useState([]);
  const [monthlyClarity, setMonthlyClarity] = useState([]);
  const [topStruggles, setTopStruggles] = useState([]);
  const [bigWins, setBigWins] = useState([]);
  const [topFriendThemes, setTopFriendThemes] = useState([]);
  const [topBiblicalThemes, setTopBiblicalThemes] = useState([]);
  const [pressureSpirals, setPressureSpirals] = useState([]);
  const [showFullHistory, setShowFullHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyMetrics = async () => {
      if (!user?.id) return;
      setIsLoading(true);
      const isoThresholdDate = new Date(
        Date.now() - 30 * 24 * 60 * 60 * 1000,
      ).toISOString();

      const { data: wins } = await supabase
        .from("daily_wins")
        .select("*")
        .gte("created_at", isoThresholdDate)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const { data: struggles } = await supabase
        .from("daily_struggles")
        .select("*")
        .gte("created_at", isoThresholdDate)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      const { data: clarity } = await supabase
        .from("clarity_corner")
        .select("*")
        .gte("created_at", isoThresholdDate)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (wins) {
        setMonthlyWins(wins);
        setBigWins(extractBigWins(wins));
      }
      if (clarity || struggles) {
        const validStruggles = struggles || [];
        const validClarity = clarity || [];
        setMonthlyStruggles(validStruggles);
        setMonthlyClarity(validClarity);
        const standardClarityLogs = validClarity.filter(
          (item) => item.entry_type !== "high_pressure",
        );
        setPressureSpirals(
          validClarity.filter((item) => item.entry_type === "high_pressure"),
        );
        setTopStruggles(
          calculateTopPatterns(validStruggles, standardClarityLogs),
        );
        setTopFriendThemes(calculateTopFriendPerspectives(standardClarityLogs));
        setTopBiblicalThemes(calculateTopBiblicalTruths(validClarity));
      }
      setIsLoading(false);
    };
    fetchMonthlyMetrics();
  }, [user?.id]);

  if (isLoading)
    return (
      <div className="report-loading-container">
        <p>Assembling monthly overview...</p>
      </div>
    );

  return (
    <main className="goals-container monthly-report-page">
      <h1 className="page-title">Monthly Overview</h1>
      <p className="page-subtitle">
        A high-level view of your wins and repeating patterns over the last 30
        days.
      </p>

      <section className="display-card-wrapper monthly-card-body">
        <AchievementCard bigWins={bigWins} />
        <RenewedThoughtsCard monthlyClarity={monthlyClarity} />
        <CognitivePatternsCard topStruggles={topStruggles} />
        <SystemOverloadCard pressureSpirals={pressureSpirals} />

        {/* 🗂️ Detailed Historical Log */}
        <div className="history-toggle-section">
          <button
            type="button"
            className="btn btn-edit toggle-history-btn"
            onClick={() => setShowFullHistory(!showFullHistory)}
          >
            {showFullHistory
              ? "Hide Detailed Historical Log ▲"
              : "View Detailed Historical Log ▼"}
          </button>
          {showFullHistory && (
            <div className="detailed-logs-wrapper">
              <div className="compact-ledger-block">
                <h3>All Logged Wins ({monthlyWins.length})</h3>
                <ul className="report-history-list">
                  {monthlyWins.map((win) => (
                    <li key={win.id} className="report-item">
                      "{win.win_text}"
                    </li>
                  ))}
                </ul>
              </div>
              <div className="compact-ledger-block">
                <h3>All Clarity Corner Entries ({monthlyClarity.length})</h3>
                <ul className="report-history-list">
                  {monthlyClarity.map((thought) => (
                    <li
                      key={thought.id}
                      className="report-item"
                      style={{
                        borderLeft:
                          thought.entry_type === "high_pressure"
                            ? "3px solid #ef4444"
                            : "3px solid var(--color-unlocked)",
                      }}
                    >
                      "{thought.raw_thought}"
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
