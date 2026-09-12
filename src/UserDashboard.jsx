import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";
import { addBooking, getBookingsByUser, getCars } from "./localData";
const FUEL_ICON = { Petrol: "", Diesel: "", Electric: "", Hybrid: "" };

export default function UserDashboard() {
  const navigate = useNavigate();

  const [cars,    setCars]    = useState([]);
  const [user,    setUser]    = useState(null);
  const [filter,  setFilter]  = useState("All");
  const [search,  setSearch]  = useState("");
  const [booked,  setBooked]  = useState({});  
  const [toast,   setToast]   = useState(null);
  const [loading, setLoading] = useState(null);  

 
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("user"));
    if (!saved) { navigate("/userLogin"); return; }
    setUser(saved);
    loadCars();
    loadMyBookings(saved.id);
  }, []);

  const loadCars = () => {
    setCars(getCars());
  };

  /* Mark already-booked cars so card shows "Booked" immediately */
  const loadMyBookings = (userId) => {
    const bookings = getBookingsByUser(userId);
    const map = {};

    bookings.filter((b) => b.status === "Booked" || b.status === "Active").forEach((b) => {
      map[b.carId] = true;
    });

    setBooked(map);
  };

  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Book a car ── */
  const handleBook = (car) => {
    if (!user) { navigate("/userLogin"); return; }
    if (!car.available || booked[car.id]) { flash("Car is not available"); return; }

    setLoading(car.id);
    addBooking({ userId: user.id, carId: car.id, days: 1 });

    setBooked(prev => ({ ...prev, [car.id]: true }));
    setCars(prev => prev.map(c => c.id === car.id ? { ...c, available: false, status: "Rented" } : c));
    flash(`${car.name} booked successfully!`);
    setLoading(null);
  };

  const TYPES = ["All", "Hatchback", "Sedan", "SUV", "MUV"];

  const filtered = cars.filter(c => {
    const matchType   = filter === "All" || c.type === filter;
    const matchSearch =
      (c.name  || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.brand || "").toLowerCase().includes(search.toLowerCase());
    return matchType && matchSearch;
  });

  const name = user?.name || user?.email?.split("@")[0] || "User";

  return (
    <>
      {/* NAVBAR */}
      <nav className="ud-nav">
        <div className="ud-brand"><i className="fa-solid fa-car-side"></i> DriveEase</div>
        <div className="ud-nav-right">
          <div className="ud-user-pill"><i className="fa-solid fa-circle-user"></i> {name}</div>
          <button className="ud-nav-btn ghost" onClick={() => navigate("/bookings")}><i className="fa-solid fa-receipt"></i> My Bookings</button>
          <button className="ud-nav-btn ghost" onClick={() => navigate("/profile")}><i className="fa-solid fa-address-book"></i> Profile</button>
          <button className="ud-nav-btn primary" onClick={() => { localStorage.removeItem("user"); navigate("/"); }}><i className="fa-solid fa-arrow-right-from-bracket"></i> Logout</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="ud-hero">
        <div className="ud-hero-content">
          <h1>Hello, {name} <i className="fa-solid fa-crown"></i></h1>
          <p>Find and book your perfect car for today's journey.</p>
          <div className="ud-hero-stats">
            <div className="ud-stat">
              <div className="ud-stat-num">{cars.filter(c => c.available).length}</div>
              <div>Cars Available</div>
            </div>
            <div className="ud-stat">
              <div className="ud-stat-num">{Object.keys(booked).length}</div>
              <div>My Bookings</div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="ud-main">
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <h2 className="ud-section-title">Browse Cars</h2>
          <p className="ud-section-sub">Select a car and book instantly</p>

          {/* FILTERS */}
          <div className="ud-filters">
            <div className="ud-search-wrap">
              <input
                className="ud-search"
                placeholder="Search by name or brand..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="ud-filter-tabs">
              {TYPES.map(t => (
                <button
                  key={t}
                  className={`ud-tab ${filter === t ? "active" : ""}`}
                  onClick={() => setFilter(t)}
                >{t}</button>
              ))}
            </div>
          </div>

          {/* GRID */}
          {filtered.length === 0 ? (
            <div className="ud-empty">
              <div style={{ fontSize: 48, marginBottom: 12 }}><i className="fa-solid fa-magnifying-glass"></i></div>
              <p>No cars found. Try a different search.</p>
            </div>
          ) : (
            <div className="ud-grid">
              {filtered.map(car => {
                const isBooked   = booked[car.id] || !car.available;
                const isLoading  = loading === car.id;
                return (
                  <div className="ud-card" key={car.id}>
                    <div className="ud-card-img-wrap">
                      <img
                        className="ud-card-img"
                        src={car.image || "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"}
                        alt={car.name}
                        onError={e => { e.target.src = "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"; }}
                      />
                      <span className={`ud-card-avail ${car.available && !isBooked ? "avail-yes" : "avail-no"}`}>
                        {car.available && !isBooked ? "✓ Available" : "✗ Booked"}
                      </span>
                      <span className="ud-card-type">{car.type}</span>
                    </div>

                    <div className="ud-card-body">
                      <div className="ud-card-top">
                        <div>
                          <div className="ud-card-name">{car.name}</div>
                          <div className="ud-card-brand">{car.brand}</div>
                        </div>
                        <div>
                          <div className="ud-price-num">₹{(car.price || 0).toLocaleString("en-IN")}</div>
                          <div style={{ fontSize: 11, color: "#888" }}>/day</div>
                        </div>
                      </div>

                      <div className="ud-card-meta">
                        <span className="ud-meta-chip">{FUEL_ICON[car.fuel]} {car.fuel}</span>
                        <span className="ud-meta-chip"> {car.transmission}</span>
                        <span className="ud-meta-chip"> {car.seats} Seats</span>
                        <span className="ud-meta-chip">⭐ {car.rating}</span>
                      </div>

                      <div className="ud-card-btns">
                        <button
                          className="ud-btn-details"
                          onClick={() => navigate(`/car?id=${car.id}`)}
                        >Details</button>

                        {isBooked ? (
                          <div className="ud-btn-booked"> Booked</div>
                        ) : (
                          <button
                            className="ud-btn-book"
                            disabled={isLoading}
                            onClick={() => handleBook(car)}
                          >
                            {isLoading ? " Booking..." : "Book Now"}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* TOAST */}
      {toast && (
        <div className="ud-toast t-success">{toast}</div>
      )}
    </>
  );
}