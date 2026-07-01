import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Userforgotpassword.css";

const API_BASE = "http://localhost:8000";

function Userforgotpassword() {
  const navigate = useNavigate();
  const [email,           setEmail]           = useState("");
  const [newPassword,     setNewPassword]     = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [success,         setSuccess]         = useState("");
  const [loading,         setLoading]         = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (newPassword !== confirmPassword) { setError("Passwords do not match"); return; }
    if (newPassword.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/users/forgot-password`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, new_password: newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess("Password updated successfully! Redirecting to login...");
        setTimeout(() => navigate("/userLogin"), 1500);
      } else {
        setError(data.detail || "Failed to reset password. Please try again.");
      }
    } catch {
      setError("Unable to connect to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-container">
      <div className="forgot-card">
        <h2 className="forgot-title">Reset Password</h2>
        <p style={{ color:"#9ca3af",fontSize:14,marginBottom:20 }}>
          Enter your registered email and set a new password.
        </p>
        <form className="forgot-form" onSubmit={handleReset}>
          <input className="forgot-input" type="email" placeholder="Enter your registered email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="forgot-input" type="password" placeholder="New Password (min 6 chars)" value={newPassword} onChange={e => setNewPassword(e.target.value)} required minLength={6} />
          <input className="forgot-input" type="password" placeholder="Confirm New Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
          {error   && <p className="forgot-error">{error}</p>}
          {success && <p style={{ color:"#15803d",fontSize:14,fontWeight:600 }}>{success}</p>}
          <button className="forgot-btn" type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
          <button type="button" className="forgot-btn" onClick={() => navigate("/userLogin")}
            style={{ background:"#667eea99",marginTop:4 }}>
            Back to Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Userforgotpassword;