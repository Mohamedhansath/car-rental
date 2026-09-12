import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Dashboard.css";
import { getBookings, getCars } from "./localData";

const navItems = [
  { label: "Dashboard",  path: "/dashboard" },
  { label: "Cars",  path: "/cars" },
  { label: "Bookings",  path: "/booking" },
  { label: "Users",  path: "/user" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentBookings, setRecentBookings] = useState([]);
  const [cars, setCars] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      setLoading(true);

      const bookings = getBookings();
      const carsList = getCars().map((c) => ({
        ...c,
        price: `₹${Number(c.price || 0).toLocaleString("en-IN")}/day`,
        rating: c.rating || 4.5,
      }));

      setCars(carsList);

      const sortedBookings = [...bookings]
        .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
        .slice(0, 5);

      setRecentBookings(sortedBookings.map((b) => ({
        id: b.id,
        customer: b.customer || b.carName || "Guest",
        car: b.carName || "Car",
        date: b.createdAt || b.date || "—",
        amount: "₹" + Number(b.amount || b.price || 0).toLocaleString("en-IN"),
        status: b.status || "Pending",
      })));

      const totalCars = carsList.length;
      const activeBookings = bookings.filter((b) => b.status === "Active" || b.status === "Booked").length;
      const revenue = bookings.filter((b) => b.status !== "Cancelled").reduce((sum, b) => sum + Number(b.amount || b.price || 0), 0);
      const availableCars = carsList.filter((c) => c.status === "Available").length;

      setStats([
        { label: "Total Cars", value: totalCars.toString(), change: "+4 this month", color: "#f97316" },
        { label: "Active Bookings", value: activeBookings.toString(), change: "+8 today", color: "#06b6d4" },
        { label: "Revenue", value: `₹${(revenue / 100000).toFixed(1)}L`, change: "+12% vs last month", color: "#10b981" },
        { label: "Available Cars", value: availableCars.toString(), change: `${((availableCars / totalCars) * 100).toFixed(0)}% fleet free`, color: "#8b5cf6" },
      ]);

      setLoading(false);
    };

    loadData();
  }, []);

  const statusColor = (s) => {
    if (s === "Active" || s === "Available") return { bg: "#dcfce7", color: "#15803d" };
    if (s === "Completed") return { bg: "#dbeafe", color: "#1d4ed8" };
    if (s === "Pending") return { bg: "#fef9c3", color: "#a16207" };
    if (s === "Maintenance") return { bg: "#fee2e2", color: "#b91c1c" };
    if (s === "Rented") return { bg: "#ede9fe", color: "#6d28d9" };
    return { bg: "#f3f4f6", color: "#374151" };
  };

  return (
    <>
    
     

      <div className="dashboard-content">
        <Sidebar/>
        {/* SIDEBAR */}
        {/* <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
          <div className="sidebar-brand">
            <div className="brand-icon">🚗</div>
            <div>
              <div className="brand-text">DriveEase</div>
              <div className="brand-sub">Admin Panel</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <div className="nav-section-label">Main Menu</div>
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`nav-item ${activeNav === item.label ? "active" : ""}`}
                onClick={() => { setActiveNav(item.label); navigate(item.path); }}
              >
                <span className="nav-icon">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="sidebar-bottom">
            <button className="logout-btn" onClick={() => navigate("/")}>
              <span className="nav-icon">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </aside> */}

     
        <div className={`main ${sidebarOpen ? "" : "expanded"}`}>
          
          <header className="topbar">
            <div className="topbar-left">
              <span className="topbar-title">Dashboard</span>
            </div>
            <div className="topbar-right">
              <span className="topbar-date">
                {new Date().toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
              </span>
              <div className="admin-badge">
                <div className="admin-dot"></div>
                Admin
              </div>
            </div>
          </header>

          {/* CONTENT */}
          <div className="content">
            <div className="page-header">
              <h1>Good Morning, Admin <i className="fa-brands fa-black-tie"></i></h1>
              <p>Here's what's happening with your fleet today.</p>
            </div>

            {/* STAT CARDS */}
            <div className="stats-grid">
              {stats.map((s) => (
                <div className="stat-card" key={s.label}>
                  <div className="stat-icon" >
                    <span>{s.icon}</span>
                  </div>
                  <div className="stat-info">
                    <div className="stat-label">{s.label}</div>
                    <div className="stat-value">{s.value}</div>
                    <div className="stat-change">{s.change}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* QUICK ACTIONS */}
            <div className="quick-actions">
              {[
                {  label: "Add Car", color: "#fff7ed", action: () => navigate("/cars") },
                {  label: "New Booking", color: "#eff6ff", action: () => navigate("/booking") },
                { label: "Add User", color: "#f0fdf4", action: () => navigate("/user") },
               
              ].map((q) => (
                <button className="qa-btn" key={q.label} onClick={q.action}>
                  <div className="qa-icon" ><i className="fa-solid fa-circle-plus"></i></div>
                  <span className="qa-label">{q.label}</span>
                </button>
              ))}
            </div>

            {/* TWO COLUMN */}
            <div className="two-col">
              {/* RECENT BOOKINGS TABLE */}
              <div className="section-card">
                <div className="section-header">
                  <span className="section-title">Recent Bookings</span>
                  <button className="section-action" onClick={() => navigate("/booking")}>View All →</button>
                </div>
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Car</th>
                        <th>Amount</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((b) => {
                        const sc = statusColor(b.status);
                        return (
                          <tr key={b.id}>
                            <td style={{ color: "#9ca3af", fontSize: 12 }}>{b.id}</td>
                            <td className="customer-name">{b.customer}</td>
                            <td>{b.car}</td>
                            <td style={{ fontWeight: 700, color: "#111827" }}>{b.amount}</td>
                            <td>
                              <span className="badge" style={{ background: sc.bg, color: sc.color }}>
                                <span className="badge-dot"></span>
                                {b.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* CAR LIST */}
              <div className="section-card">
                <div className="section-header">
                  <span className="section-title">Fleet Status</span>
                  <button className="section-action" onClick={() => navigate("/cars")}>Manage →</button>
                </div>
                <div className="car-list">
                  {cars.map((c) => {
                    const sc = statusColor(c.status);
                    return (
                      <div className="car-item" key={c.name}>
                        <div className="car-item-left">
                          <div className="car-emoji">🚘</div>
                          <div>
                            <div className="car-name">{c.name}</div>
                            <div className="car-type">{c.type}</div>
                          </div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ marginBottom: 4 }}>
                            <span className="badge" style={{ background: sc.bg, color: sc.color }}>
                              {c.status}
                            </span>
                          </div>
                          <div className="car-price">{c.price}</div>
                          <div className="car-rating">★ {c.rating}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}


