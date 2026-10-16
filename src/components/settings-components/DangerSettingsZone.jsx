import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "../../../supabase-client";

export default function DangerSettingsZone({ isLoggedIn, user, logout }) {
  const navigate = useNavigate();
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isConfirming) return;
    const disarmTimer = setTimeout(() => setIsConfirming(false), 5000);
    return () => clearTimeout(disarmTimer);
  }, [isConfirming]);

  const handleMasterReset = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }
    try {
      if (isLoggedIn && user?.id) {
        const isoMidnight = new Date(
          new Date().setHours(0, 0, 0, 0),
        ).toISOString();
        await supabase
          .from("daily_wins")
          .delete()
          .eq("user_id", user.id)
          .gte("created_at", isoMidnight);
        await supabase
          .from("daily_struggles")
          .delete()
          .eq("user_id", user.id)
          .gte("created_at", isoMidnight);
        await supabase
          .from("clarity_corner")
          .delete()
          .eq("user_id", user.id)
          .gte("created_at", isoMidnight);
      }
    } catch (err) {
      console.error(err);
    }

    const cacheKeys = [
      "routine_dark_mode",
      "routine_sr_mode",
      "routine_morning_time",
      "routine_night_time",
      "user_anchor_intentions",
    ];
    const saved = cacheKeys.reduce((acc, key) => {
      acc[key] = localStorage.getItem(key);
      return acc;
    }, {});
    localStorage.clear();
    Object.keys(saved).forEach((key) => {
      if (saved[key] !== null) localStorage.setItem(key, saved[key]);
    });
    window.location.reload();
  };

  const handleAccountDeletion = async () => {
    if (
      !window.confirm(
        "Are you absolutely sure you want to delete your account? This cannot be undone.",
      )
    )
      return;
    if (window.prompt("To confirm deletion, type DELETE below:") !== "DELETE")
      return;

    const { error } = await supabase.from("users").delete().eq("id", user.id);
    if (!error) {
      await logout();
      navigate("/login-and-sign-up");
    }
  };

  return (
    <li className="setting-item danger-zone-feature">
      <div className="danger-zone-wrapper">
        <div className="setting-text">
          <h2>Daily Do-Over Reset</h2>
          <p>
            Wipe today's checkboxes locally and safely clear today's matching
            entries from the cloud server.
          </p>
        </div>
        <div className="danger-zone-actions">
          <button
            type="button"
            className="master-clear-btn"
            onClick={handleMasterReset}
            style={{ backgroundColor: isConfirming ? "#d32f2f" : "" }}
          >
            {isConfirming
              ? "Click again to confirm daily purge! ⚠️"
              : "Reset Daily Progress"}
          </button>
        </div>

        <div className="account-purge-closure-node">
          <h3>Permanent Account Deletion</h3>
          <p>
            Permanently delete your profile account credentials and discard all
            historical routine analytics from the system.
          </p>
          <button
            type="button"
            className="btn-danger-purge"
            onClick={handleAccountDeletion}
          >
            Erase My Account Completely
          </button>
        </div>
      </div>
    </li>
  );
}
