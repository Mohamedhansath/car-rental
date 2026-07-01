import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Userregister.css";

const API_BASE = "http://localhost:8000";

function Userregister() {
  const navigate = useNavigate();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [city,     setCity]     = useState("");
  const [password, setPassword] = useState("");
  const [message,  setMessage]  = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch(`${API_BASE}/users/registration1`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, password, phone, city }),
      });
      const data = await response.json();
      if (response.ok) {
        setMessage({ type: "success", text: "Registration successful — redirecting to login..." });
        setTimeout(() => navigate("/userLogin"), 1500);
      } else {
        setMessage({ type: "error", text: data.detail || "Registration failed. Please try again." });
      }
    } catch {
      setMessage({ type: "error", text: "Unable to connect to server. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="userregister-page">
      <div className="userregister-card">
        <div className="userregister-brand">
          <div className="userregister-brand-logo">CR</div>
          <div>
            <div className="userregister-title">Create account</div>
            <div className="userregister-subtitle">Register to get started</div>
          </div>
        </div>
        <form className="userregister-form" onSubmit={handleRegister} noValidate>
          <div className="userregister-field">
            <label className="userregister-label">Full Name</label>
            <input className="userregister-input" type="text" placeholder="Your full name" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div className="userregister-field">
            <label className="userregister-label">Email *</label>
            <input className="userregister-input" type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="userregister-field">
            <label className="userregister-label">Phone</label>
            <input className="userregister-input" type="text" placeholder="10-digit phone number" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="userregister-field">
            <label className="userregister-label">City</label>
            <input className="userregister-input" type="text" placeholder="Your city" value={city} onChange={e => setCity(e.target.value)} />
          </div>
          <div className="userregister-field">
            <label className="userregister-label">Password *</label>
            <input className="userregister-input" type="password" placeholder="Minimum 6 characters" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          {message && (
            <div style={{ padding:"10px 12px",borderRadius:8,fontSize:13,fontWeight:600,
              background: message.type==="error"?"#fee2e2":"#dcfce7",
              color:      message.type==="error"?"#b91c1c":"#15803d" }}>
              {message.text}
            </div>
          )}
          <div className="userregister-actions">
            <button type="submit" className="userregister-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </button>
            <button type="button" className="userregister-back" onClick={() => navigate("/userLogin")}>
              Back to login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Userregister;