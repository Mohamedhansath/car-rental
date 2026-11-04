import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Userregister.css";
import { addUser, getUserByEmail } from "./localData";

function Userregister() {
  const navigate = useNavigate();
  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [phone,    setPhone]    = useState("");
  const [city,     setCity]     = useState("");
  const [password, setPassword] = useState("");
  const [message,  setMessage]  = useState(null);
  const [loading,  setLoading]  = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (!name.trim() || !email.trim() || !password) {
      setMessage({ type: "error", text: "Please fill in the required fields." });
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "Password must be at least 6 characters." });
      setLoading(false);
      return;
    }

    if (getUserByEmail(email.trim())) {
      setMessage({ type: "error", text: "This email is already registered." });
      setLoading(false);
      return;
    }

    addUser({ name: name.trim(), email: email.trim().toLowerCase(), password, phone: phone.trim(), city: city.trim(), role: "user" });
    setMessage({ type: "success", text: "Registration successful — redirecting to login..." });
    setTimeout(() => navigate("/userLogin"), 1500);
    setLoading(false);
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