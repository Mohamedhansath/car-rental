import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const API = "http://localhost:8000";

const initials = (name) =>
  name
    ? name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2)
    : "U";

export default function Profile() {
  const navigate = useNavigate();

  const [user,          setUser]          = useState({ id: "", name: "", email: "", phone: "", city: "" });
  const [editing,       setEditing]       = useState(false);
  const [form,          setForm]          = useState({ name: "", phone: "", city: "" });
  const [toast,         setToast]         = useState(null);
  const [bookingsCount, setBookingsCount] = useState(0);
  const [saving,        setSaving]        = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (!saved) { navigate("/userLogin"); return; }
    setUser(saved);
    setForm({ name: saved.name || "", phone: saved.phone || "", city: saved.city || "" });

    /* Load bookings count */
    if (saved.id) {
      fetch(`${API}/api/my-bookings/${saved.id}`)
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) {
            setBookingsCount(data.filter(b => b.status === "Booked").length);
          }
        })
        .catch(() => setBookingsCount(0));
    }
  }, []);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /* ── Save to DB ── */
  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API}/api/profile`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id:    user.id,
          name:  form.name,
          phone: form.phone,
          city:  form.city,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Update failed");

      /* Sync localStorage with new data */
      const updatedUser = { ...user, name: form.name, phone: form.phone, city: form.city };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditing(false);
      flash("Profile updated successfully! ✅");
    } catch (err) {
      flash(err.message || "Update failed ❌");
    }
    setSaving(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const displayName = user.name || user.email?.split("@")[0] || "User";

  return (
    <>
      {/* NAVBAR */}
      <nav className="pf-nav">
        <div className="pf-brand" onClick={() => navigate("/userDashboard")}><i className="fa-solid fa-car-side"></i> DriveEase</div>
        <button className="pf-back" onClick={() => navigate("/userDashboard")}>← Dashboard</button>
      </nav>

      {/* HERO */}
      <section className="pf-hero">
        <div className="pf-hero-inner">
          <div className="pf-avatar">{initials(displayName)}</div>
          <div className="pf-hero-info">
            <div className="pf-hero-name">{displayName}</div>
            <div className="pf-hero-email">{user.email || "No email set"}</div>
            <div className="pf-hero-stats">
              <div className="pf-hstat">
                <div className="pf-hstat-num">{bookingsCount}</div>
                <div className="pf-hstat-label">Active Bookings</div>
              </div>
              <div className="pf-hstat">
                <div className="pf-hstat-num">{user.city || "—"}</div>
                <div className="pf-hstat-label">City</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="pf-main">
        {/* QUICK ACTIONS */}
        <div className="pf-actions">
          <div className="pf-action-btn" onClick={() => navigate("/bookings")}>
            <div className="pf-action-icon"><i className="fa-solid fa-receipt"></i></div>
            <div className="pf-action-label">My Bookings</div>
          </div>
          <div className="pf-action-btn" onClick={() => navigate("/userDashboard")}>
            <div className="pf-action-icon"><i className="fa-solid fa-car-side"></i></div>
            <div className="pf-action-label">Browse Cars</div>
          </div>
          <div className="pf-action-btn" onClick={() => setEditing(true)}>
            <div className="pf-action-icon"><i className="fa-solid fa-pen-to-square"></i></div>
            <div className="pf-action-label">Edit Profile</div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className="pf-card">
          <div className="pf-card-header">
            <span className="pf-card-title">Profile Details</span>
            <button
              className={`pf-edit-btn ${editing ? "cancel" : ""}`}
              onClick={() => {
                if (editing) {
                  /* Reset form on cancel */
                  setForm({ name: user.name || "", phone: user.phone || "", city: user.city || "" });
                }
                setEditing(!editing);
              }}
            >
              {editing ? "Cancel" : "Edit"}
            </button>
          </div>

          <div className="pf-form">
            <div className="pf-frow">
              <div className="pf-fg">
                <label className="pf-lbl">Full Name</label>
                <input
                  className="pf-inp"
                  name="name"
                  value={editing ? form.name : user.name}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Your full name"
                />
              </div>
              <div className="pf-fg">
                <label className="pf-lbl">Email</label>
                <input
                  className="pf-inp"
                  value={user.email}
                  disabled
                />
              </div>
            </div>

            <div className="pf-frow">
              <div className="pf-fg">
                <label className="pf-lbl">Phone</label>
                <input
                  className="pf-inp"
                  name="phone"
                  value={editing ? form.phone : user.phone}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Phone number"
                />
              </div>
              <div className="pf-fg">
                <label className="pf-lbl">City</label>
                <input
                  className="pf-inp"
                  name="city"
                  value={editing ? form.city : user.city}
                  onChange={handleChange}
                  disabled={!editing}
                  placeholder="Your city"
                />
              </div>
            </div>

            {editing && (
              <button
                className="pf-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? " Saving..." : " Save Changes"}
              </button>
            )}
          </div>
        </div>

        {/* LOGOUT */}
        <div className="pf-danger">
          <div className="pf-danger-header"><i className="fa-solid fa-triangle-exclamation"></i> Account Actions</div>
          <div className="pf-danger-body">
            <div className="pf-danger-text">Sign out from your DriveEase account.</div>
            <button className="pf-logout-btn" onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
            </button>
          </div>
        </div>
      </main>

      {toast && <div className="ud-toast t-success">{toast}</div>}
    </>
  );
}