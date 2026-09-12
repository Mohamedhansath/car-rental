import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./CarDetails.css";
import { addBooking, getBookingsByUser, getCarById } from "./localData";

export default function CarDetails() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const params    = new URLSearchParams(location.search);
  const id        = parseInt(params.get("id"));

  const [car,        setCar]        = useState(null);
  const [booked,     setBooked]     = useState(false);
  const [loading,    setLoading]    = useState(false);
  const [loadingCar, setLoadingCar] = useState(true);
  const [toast,      setToast]      = useState(null);
  const [days,       setDays]       = useState(1);

  /* ── Load car ── */
  useEffect(() => {
    if (!id) { setLoadingCar(false); return; }

    const data = getCarById(id);
    setCar(data || null);
    setLoadingCar(false);
  }, [id]);

  /* ── Check if user already booked this car ── */
  useEffect(() => {
    if (!car) return;
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) return;

    const data = getBookingsByUser(user.id);
    setBooked(data.some((b) => b.carId === car.id && (b.status === "Booked" || b.status === "Active")));
  }, [car]);

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Book car ── */
  const handleBook = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { navigate("/userLogin"); return; }
    if (!car || !car.available) return;

    setLoading(true);
    addBooking({ userId: user.id, carId: car.id, days });

    setBooked(true);
    setCar((prev) => prev ? { ...prev, available: false, status: "Rented" } : prev);
    flash(`${car.name} booked for ${days} day${days > 1 ? "s" : ""}! 🎉`);
    setLoading(false);
  };

  /* ── Loading / Error states ── */
  if (loadingCar) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f3ff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>⏳</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#7c3aed" }}>Loading car details...</div>
    </div>
  );

  if (!car) return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "#f5f3ff", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <div style={{ fontSize: 52, marginBottom: 12 }}>🚗</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: "#7c3aed", marginBottom: 8 }}>Car not found</div>
      <button
        onClick={() => navigate("/userDashboard")}
        style={{ padding: "10px 24px", background: "linear-gradient(135deg,#7c3aed,#2563eb)", color: "#fff", border: "none", borderRadius: 10, cursor: "pointer", fontWeight: 700, fontSize: 14 }}
      >
        ← Back to Cars
      </button>
    </div>
  );
  

  const totalPrice = (car.price * days).toLocaleString("en-IN");

  return (
    <>
      <nav className="cd-nav">
        <div className="cd-brand" onClick={() => navigate("/userDashboard")}>🚗 DriveEase</div>
        <button className="cd-back" onClick={() => navigate("/userDashboard")}>← Back to Cars</button>
      </nav>

      <main className="cd-main">
        <div className="cd-grid">

          {/* LEFT: IMAGE + FEATURES */}
          <div className="cd-img-card">
            <div className="cd-img-wrap">
              <img
                className="cd-img"
                src={car.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"}
                alt={car.name}
                onError={e => { e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80"; }}
              />
              <span className={`cd-avail-badge ${car.available && !booked ? "avail-yes" : "avail-no"}`}>
                {car.available && !booked ? "✓ Available" : "✗ Unavailable"}
              </span>
            </div>
            {car.features && car.features.length > 0 && (
              <div className="cd-features">
                <div className="cd-feat-title">Features & Amenities</div>
                <div className="cd-feat-list">
                  {car.features.map(f => (
                    <span key={f} className="cd-feat-chip">✓ {f}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: INFO + BOOKING */}
          <div className="cd-info-card">
            <div className="cd-car-name">{car.name}</div>
            <div className="cd-car-brand">{car.brand} · {car.type}</div>

            {car.rating && (
              <div className="cd-rating">
                <span className="cd-stars">{"★".repeat(Math.floor(car.rating))}{"☆".repeat(5 - Math.floor(car.rating))}</span>
                <span className="cd-rating-val">{car.rating}</span>
                <span className="cd-reviews">({car.reviews || 0} reviews)</span>
              </div>
            )}

            <div className="cd-meta-grid">
              {[
                { icon: "⛽", val: car.fuel,            lbl: "Fuel Type"    },
                { icon: "⚙️", val: car.transmission,    lbl: "Transmission" },
                { icon: "👥", val: car.seats + " Seats", lbl: "Capacity"    },
                { icon: "🚘", val: car.type,            lbl: "Body Type"    },
              ].map(m => (
                <div key={m.lbl} className="cd-meta-item">
                  <div className="cd-meta-icon">{m.icon}</div>
                  <div className="cd-meta-val">{m.val}</div>
                  <div className="cd-meta-lbl">{m.lbl}</div>
                </div>
              ))}
            </div>
            

            {car.description && (
              <div className="cd-desc">{car.description}</div>
            )}

            <div className="cd-price-row">
              <div>
                <div className="cd-price-label">Rental Price</div>
                <div className="cd-price-sub">per day</div>
              </div>
              <div className="cd-price-val">₹{(car.price || 0).toLocaleString("en-IN")}</div>
            </div>

            {/* Days selector — hide if already booked */}
            {!booked && (
              <>
                <div className="cd-days-row">
                  <span className="cd-days-label">Number of Days</span>
                  <div className="cd-days-control">
                    <button className="cd-days-btn" onClick={() => setDays(d => Math.max(1, d - 1))}>−</button>
                    <span className="cd-days-num">{days}</span>
                    <button className="cd-days-btn" onClick={() => setDays(d => d + 1)}>+</button>
                  </div>
                </div>
                <div className="cd-total">
                  <span className="cd-total-label">Total Amount</span>
                  <span className="cd-total-val">₹{totalPrice}</span>
                </div>
              </>
            )}

            {booked ? (
              <>
                <div className="cd-booked-btn">✅ Already Booked</div>
                <button className="cd-view-bookings" onClick={() => navigate("/bookings")}>
                  View My Bookings →
                </button>
              </>
            ) : (
              <button
                className="cd-book-btn"
                disabled={!car.available || loading}
                onClick={handleBook}
              >
                {loading
                  ? "⏳ Booking..."
                  : car.available
                    ? `Book for ₹${totalPrice}`
                    : "Currently Unavailable"}
              </button>
            )}
          </div>
        </div>
      </main>

      {toast && <div className="ud-toast t-success">{toast}</div>}
    </>
  );
}