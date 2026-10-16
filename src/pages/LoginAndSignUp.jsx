import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import supabase from "../../supabase-client";
import { Icon } from "../components/Icon";
import "../css/LoginAndSignUp.css";

function LoginAndSignUp() {
  const [action, setAction] = useState("Sign Up");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login, signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (action === "Sign Up" && password !== confirmPassword) {
      setErrorMsg("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      if (action === "Login") {
        const { error } = await login(email, password);
        if (error) throw error;
        navigate("/");
      } else {
        const { error } = await signUp(email, password, {
          options: { data: { display_name: name } },
        });
        if (error) throw error;
        setSuccessMsg("Account successfully created! Please log in.");
        setAction("Login");
        setName("");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setErrorMsg(err.message || "An authentication error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setErrorMsg(
        "Please enter your email address first so we can send a password reset link.",
      );
      return;
    }

    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      setSuccessMsg("Password reset link sent to your email!");
    } catch (err) {
      setErrorMsg(err.message || "Could not process password reset request.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="header">
        <div className="text">{action}</div>
        <div className="underline"></div>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {errorMsg && <div className="auth-error-banner">{errorMsg}</div>}
        {successMsg && <div className="auth-success-banner">{successMsg}</div>}

        <div className="inputs">
          {/* 1. Name Input Box (Sign Up Only) */}
          {action !== "Login" && (
            <div className="input">
              <Icon name="userImage" className="nav-menu-icon" />
              <label htmlFor="auth-name-input" className="sr-only">
                Name
              </label>
              <input
                type="text"
                id="auth-name-input"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          {/* 2. Email Input Box */}
          <div className="input">
            <Icon name="emailImage" className="nav-menu-icon" />
            <label htmlFor="auth-email-input" className="sr-only">
              Email
            </label>
            <input
              type="email"
              id="auth-email-input"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* 3. Password Input Box with Built-In Reveal Button */}
          <div className="input">
            <Icon name="passwordIconImage" className="nav-menu-icon" />
            <label htmlFor="auth-password-input" className="sr-only">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="auth-password-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="password-reveal-btn"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              <Icon
                name={showPassword ? "showPasswordImage" : "hidePasswordImage"}
                className="nav-menu-icon visability-icon"
              />
            </button>
          </div>

          {/* 4. Confirm Password Input Box (Sign Up Only) with Built-In Reveal Button */}
          {action === "Sign Up" && (
            <div className="input">
              <Icon name="passwordIconImage" className="nav-menu-icon" />
              <label htmlFor="auth-confirm-input" className="sr-only">
                Confirm Password
              </label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="auth-confirm-input"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-reveal-btn"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirmation password"
                    : "Show confirmation password"
                }
              >
                <Icon
                  name={
                    showConfirmPassword
                      ? "showPasswordImage"
                      : "hidePasswordImage"
                  }
                  className="nav-menu-icon visability-icon"
                />
              </button>
            </div>
          )}
        </div>

        {action === "Login" && (
          <div className="forgot-password">
            Lost Password?{" "}
            <span onClick={handleForgotPassword}>Click here</span>
          </div>
        )}

        <div className="submit-container">
          <button type="submit" className="submit" disabled={isLoading}>
            {isLoading ? "Processing..." : `Confirm ${action}`}
          </button>

          <div className="toggle-action-row">
            <span>
              {action === "Sign Up"
                ? "Already have an account?"
                : "Need a new account?"}
            </span>
            <button
              type="button"
              className="toggle-action-btn"
              onClick={() => {
                setAction(action === "Sign Up" ? "Login" : "Sign Up");
                setErrorMsg("");
                setSuccessMsg("");
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              {action === "Sign Up" ? "Login" : "Sign Up"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginAndSignUp;
