import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";
import { getUserByEmail } from "./localData";

function UserLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = () => navigate("/userRegister");
  const handleForgotPassword = () => navigate("/userforgotpassword");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const user = getUserByEmail(email);

    if (!user || user.role !== "user" || user.password !== password) {
      setError("Invalid email or password");
      setLoading(false);
      return;
    }

    const { password: _storedPassword, ...safeUser } = user;
    localStorage.setItem("user", JSON.stringify(safeUser));
    navigate("/userDashboard");
    setLoading(false);
  };

  return (
    <div className="userlogin-page">
      <div className="userlogin-card">
        <div className="userlogin-brand">
          <div className="userlogin-brand-logo">CR</div>
          <div>
            <div className="userlogin-title">Welcome back</div>
            <div className="userlogin-subtitle">Sign in to continue</div>
          </div>
        </div>

        <form className="userlogin-form" onSubmit={handleLogin}>
          <div className="userlogin-field">
            <label className="userlogin-label">Email</label>
            <input
              className="userlogin-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="userlogin-field">
            <label className="userlogin-label">Password</label>
            <input
              className="userlogin-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* ✅ Show error message instead of alert */}
          {error && (
            <div style={{
              background: "#fee2e2", color: "#b91c1c",
              padding: "10px 12px", borderRadius: 8,
              fontSize: 13, fontWeight: 600
            }}>
              {error}
            </div>
          )}

          <div className="userlogin-actions">
            <label className="userlogin-remember">
              <input type="checkbox" /> Remember me
            </label>
            <a className="userlogin-link" onClick={handleForgotPassword} style={{ cursor: "pointer" }}>
              Forgot password?
            </a>
          </div>

          <button type="submit" className="userlogin-submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="userlogin-helper">
            Don't have an account?{" "}
            <a onClick={handleRegister} style={{ cursor: "pointer" }}>Create one</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UserLogin;