import { useState } from "react";
import supabase from "../../../supabase-client";
import { Icon } from "../Icon";

export default function AccountCredentials({ user }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // 👁️ Separate visibility toggles for both fields
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setPasswordMessage("");

    if (newPassword.length < 6) {
      setPasswordMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("Passwords do not match. Please verify your typing.");
      return;
    }

    setIsChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setIsChangingPassword(false);

    if (error) {
      setPasswordMessage(`Error: ${error.message}`);
    } else {
      setPasswordMessage("Password updated successfully!");
      setNewPassword("");
      setConfirmPassword("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
    }
  };

  return (
    <li className="setting-item security-account-block">
      <div className="setting-text">
        <h2>Account Credentials</h2>
        <p>
          Your account is securely linked to: <strong>{user?.email}</strong>
        </p>
      </div>

      <form
        onSubmit={handlePasswordUpdate}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          width: "100%",
          marginTop: "0.5rem",
        }}
      >
        {/* Field 1: New Password */}
        <div className="password-input-row-wrapper">
          <label className="form-label-text" htmlFor="update-password-field">
            New Password
          </label>
          <div className="password-input-relative-container">
            <input
              type={showNewPassword ? "text" : "password"}
              id="update-password-field"
              className="settings-time-input password-update-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new account password..."
            />
            <button
              type="button"
              className="password-reveal-btn eyeball-toggle-position"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <Icon
                name={
                  showNewPassword ? "showPasswordImage" : "hidePasswordImage"
                }
                className="visability-icon"
              />
            </button>
          </div>
        </div>

        {/* Field 2: Confirm Password */}
        <div className="password-input-row-wrapper">
          <label className="form-label-text" htmlFor="confirm-password-field">
            Confirm Password
          </label>
          <div className="password-input-relative-container">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password-field"
              className="settings-time-input password-update-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-type new account password..."
            />
            <button
              type="button"
              className="password-reveal-btn eyeball-toggle-position"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Icon
                name={
                  showConfirmPassword
                    ? "showPasswordImage"
                    : "hidePasswordImage"
                }
                className="visability-icon"
              />
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="master-clear-btn"
          disabled={
            isChangingPassword || !newPassword.trim() || !confirmPassword.trim()
          }
          style={{
            alignSelf: "center",
            marginTop: "0.5rem",
            padding: "12px 32px",
          }}
        >
          Update Password
        </button>
      </form>
      {passwordMessage && (
        <p
          style={{
            margin: "8px 0 0 0",
            fontSize: "0.95rem",
            fontWeight: "600",
            color: "var(--color-unlocked)",
            textAlign: "center",
          }}
        >
          {passwordMessage}
        </p>
      )}
    </li>
  );
}
