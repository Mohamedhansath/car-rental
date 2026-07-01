import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyBookings.css";

const API = "http://localhost:8000";

const STATUS_META = {
  Booked:    { bg: "rgba(124,58,237,0.1)",  color: "#7c3aed", label: "Booked" },
  Active:    { bg: "rgba(59,130,246,0.1)",  color: "#3b82f6", label: "Active" },
  Pending:   { bg: "rgba(245,158,11,0.1)", color: "#f59e0b", label: "Pending" },
  Cancelled: { bg: "rgba(239,68,68,0.1)",   color: "#ef4444", label: "Cancelled" },
  Completed: { bg: "rgba(34,197,94,0.1)",   color: "#16a34a", label: "Completed" },
};

export default function MyBookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [confirmCancel, setConfirmCancel] = useState(null); // {id, carName}

  /* ── Load bookings from DB ── */
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { navigate("/userLogin"); return; }
    fetchBookings(user.id);
  }, []);

  const fetchBookings = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/my-bookings/${userId}`);
      if (!res.ok) throw new Error("Failed to load bookings");
      const data = await res.json();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setBookings([]);
      flash("Failed to load bookings ❌");
    }
    setLoading(false);
  };

  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Cancel booking ── */
  const cancelBooking = async (id) => {
    try {
      const res = await fetch(`${API}/api/bookings/${id}/cancel`, { method: "PATCH" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || "Cancel failed");
      }
      /* Update local state — no need to refetch */
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: "Cancelled" } : b));
      flash("Booking cancelled successfully ✅");
      setConfirmCancel(null);
    } catch (err) {
      flash(err.message || "Cancel failed ❌");
    }
  };

  const filtered = filter === "All" ? bookings : bookings.filter(b => b.status === filter);

  const counts = {
    all: bookings.length,
    booked: bookings.filter(b => b.status === "Booked").length,
    active: bookings.filter(b => b.status === "Active").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
    total: bookings.filter(b => b.status !== "Cancelled").reduce((s, b) => s + Number(b.amount || b.price || 0), 0),
  };

  const formatDate = (date) => {
    if (!date) return "—";
    const d = new Date(date);
    return isNaN(d) ? date.slice(0, 10) : d.toLocaleDateString("en-IN");
  };

  return (
    <>
      <nav className="mb-nav">
        <div className="mb-brand" onClick={() => navigate("/userDashboard")}><i className="fa-solid fa-car-side"></i> DriveEase</div>
        <button className="mb-back" onClick={() => navigate("/userDashboard")}>← Browse Cars</button>
      </nav>

      <section className="mb-hero">
        <div className="mb-hero-content">
          <h1>My Bookings</h1>
          <p>Track, manage and cancel your car reservations below.</p>
        </div>
      </section>

      <main className="mb-main">

        {/* STATS */}
        <div className="mb-stats">
          {[
            { key: "All", label: "Total", num: counts.all },
            { key: "Booked", label: "Booked", num: counts.booked },
            { key: "Active", label: "Active", num: counts.active },
            { key: "Cancelled", label: "Cancelled", num: counts.cancelled },
            { key: "revenue", label: "Spent", num: "₹" + counts.total.toLocaleString("en-IN"), noFilter: true },
          ].map(s => (
            <div
              key={s.key}
              className={`mb-stat ${filter === s.key && !s.noFilter ? "active-s" : ""}`}
              onClick={() => !s.noFilter && setFilter(s.key)}
            >
              <div className="mb-stat-num">{s.num}</div>
              <div className="mb-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* TABS */}
        <div className="mb-tabs">
          {["All", "Booked", "Active", "Cancelled"].map(t => (
            <button
              key={t}
              className={`mb-tab ${filter === t ? "active" : ""}`}
              onClick={() => setFilter(t)}
            >{t}</button>
          ))}
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="mb-empty">
            <div className="mb-empty-ico"><i className="fa-solid fa-hourglass"></i></div>
            <div style={{ fontSize: 16, fontWeight: 700, color: "#7c3aed" }}>Loading bookings...</div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="mb-empty">
            <div className="mb-empty-ico"><i className="fa-solid fa-car-side"></i></div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#7c3aed", marginBottom: 6 }}>
              {filter === "All" ? "No bookings yet" : `No ${filter.toLowerCase()} bookings`}
            </div>
            <div style={{ fontSize: 14, color: "#6b7280" }}>Browse our fleet and book your first ride!</div>
            <button className="mb-empty-btn" onClick={() => navigate("/userDashboard")}>
              Browse Cars →
            </button>
          </div>
        ) : (
          <div className="mb-list">
            {filtered.map((b, i) => {
              const sm = STATUS_META[b.status] || STATUS_META["Booked"];
              return (
                <div className="mb-card" key={b.id} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="mb-card-inner">
                    {/* CAR IMAGE */}
                    {b.carImage ? (
                      <img
                        className="mb-card-img"
                        src={b.carImage}
                        alt={b.carName}
                        onError={e => { e.target.style.display = "none"; }}
                      />
                    ) : (
                      <div className="mb-card-img-placeholder">🚗</div>
                    )}

                    <div className="mb-card-body">
                      <div className="mb-card-left">
                        <div className="mb-car-name">{b.carName || "Car"}</div>
                        <div className="mb-car-type">{b.carType || "Vehicle"}</div>
                        <div className="mb-meta">
                          <span className="mb-meta-item">📅 {formatDate(b.date)}</span>
                          {b.days && (
                            <span className="mb-meta-item">🗓 {b.days} day{b.days > 1 ? "s" : ""}</span>
                          )}
                          <span className="mb-meta-item" style={{ fontFamily: "monospace", fontSize: 11, color: "#9ca3af" }}>
                            #{String(b.id).slice(-6)}
                          </span>
                        </div>
                      </div>

                      <div className="mb-card-right">
                        <div className="mb-price">₹{Number(b.amount || b.price || 0).toLocaleString("en-IN")}</div>
                        <div className="mb-price-sub">total paid</div>
                        <span className="mb-badge" style={{ background: sm.bg, color: sm.color }}>
                          <span className="mb-badge-dot"></span>
                          {sm.label}
                        </span>
                        <div>
                          {(b.status === "Booked" || b.status === "Active") ? (
                            <button
                              className="mb-cancel-btn"
                              onClick={() => setConfirmCancel({ id: b.id, carName: b.carName })}
                            >
                              Cancel Booking
                            </button>
                          ) : (
                            <span className="mb-cancelled-tag">
                              {b.status === "Completed" ? "Completed" : "Cancelled"}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CONFIRM CANCEL MODAL */}
      {confirmCancel && (
        <div className="mb-modal-overlay" onClick={() => setConfirmCancel(null)}>
          <div className="mb-modal" onClick={e => e.stopPropagation()}>
            <h3>Cancel Booking</h3>
            <p>Are you sure you want to cancel your booking for <strong>{confirmCancel.carName}</strong>? This action cannot be undone.</p>
            <div className="mb-modal-actions">
              <button className="mb-modal-cancel" onClick={() => setConfirmCancel(null)}>Keep Booking</button>
              <button className="mb-modal-confirm" onClick={() => cancelBooking(confirmCancel.id)}>Yes, Cancel</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`ud-toast ${toast.type === "error" ? "t-error" : "t-success"}`}>{toast.msg}</div>
      )}
    </>
  );
}