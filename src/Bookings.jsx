import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Bookings.css";
import { getBookings, updateBookingStatus, deleteBooking } from "./localData";

const STATUS_COLORS = {
  Booked:    { bg: "#e0e7ff", color: "#4338ca" },
  Active:    { bg: "#dcfce7", color: "#15803d" },
  Completed: { bg: "#dbeafe", color: "#1d4ed8" },
  Pending:   { bg: "#fef9c3", color: "#a16207" },
  Cancelled: { bg: "#fee2e2", color: "#b91c1c" },
};

export default function Bookings() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [search,   setSearch]   = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [modal,    setModal]    = useState(null);   // null | {type, data}
  const [toast,    setToast]    = useState(null);
  const [loading,  setLoading]  = useState(true);

  /* ── Load bookings ── */
  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = () => {
    setLoading(true);
    setBookings(getBookings());
    setLoading(false);
  };

  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Status change ── */
  const handleStatusChange = (bookingId, newStatus) => {
    updateBookingStatus(bookingId, newStatus);
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b));
    flash("Status updated ✅");
  };

  /* ── Delete booking ── */
  const handleDelete = (bookingId) => {
    deleteBooking(bookingId);
    setBookings(prev => prev.filter(b => b.id !== bookingId));
    setModal(null);
    flash("Booking deleted ✅");
  };

  /* ── Filter ── */
  const filtered = bookings.filter(b => {
    const matchSearch =
      (b.customer || "").toLowerCase().includes(search.toLowerCase()) ||
      (b.car       || "").toLowerCase().includes(search.toLowerCase()) ||
      String(b.id).includes(search);
    const matchStatus = statusFilter === "All" || b.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all:       bookings.length,
    booked:    bookings.filter(b => b.status === "Booked").length,
    completed: bookings.filter(b => b.status === "Completed").length,
    cancelled: bookings.filter(b => b.status === "Cancelled").length,
  };

  const sc = (status) => STATUS_COLORS[status] || { bg: "#f3f4f6", color: "#374151" };

  return (
    <div className="bk-root">
      <Sidebar />

      <div className="bk-main">
        {/* TOPBAR */}
        <div className="bk-topbar">
          <span className="bk-topbar-title"><i className="fa-solid fa-receipt"></i> Bookings Management</span>
          <div className="bk-topbar-right">
            <div className="bk-admin-pill">
              <div className="bk-online"></div>Admin
            </div>
          </div>
        </div>

        {/* HEADER */}
        <div className="bk-header">
          <div>
            <div className="bk-page-title">All Bookings</div>
            <div className="bk-page-sub">Manage all car rental bookings</div>
          </div>
        </div>

        {/* STATS */}
        <div className="bk-stats">
          {[
            { label: "Total",     num: counts.all,       key: "All",       color: "#667eea" },
            { label: "Active",    num: counts.booked,    key: "Booked",    color: "#10b981" },
            { label: "Completed", num: counts.completed, key: "Completed", color: "#3b82f6" },
            { label: "Cancelled", num: counts.cancelled, key: "Cancelled", color: "#ef4444" },
          ].map(s => (
            <div
              key={s.key}
              className={`bk-stat ${statusFilter === s.key ? "s-active" : ""}`}
              onClick={() => setStatusFilter(s.key)}
            >
              <div className="bk-stat-num">{s.num}</div>
              <div className="bk-stat-label">{s.label}</div>
              <div className="bk-stat-bar">
                <div className="bk-stat-fill" style={{ width: `${counts.all ? (s.num / counts.all) * 100 : 0}%`, background: s.color }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="bk-filters">
          <div className="bk-search-wrap">
            <span className="bk-search-ico"><i className="fa-solid fa-magnifying-glass"></i></span>
            <inputpw
              className="bk-search"
              placeholder="Search by customer, car, or ID..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select
            className="bk-sel"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Booked">Booked</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
            <option value="Pending">Pending</option>
          </select>
          <div className="bk-count">{filtered.length} bookings</div>
        </div>

        {/* TABLE */}
        <div className="bk-content">
          <div className="bk-table-card">
            <div className="bk-table-wrap">
              <table className="bk-table">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Customer</th>
                    <th>Car</th>
                    <th>Days</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" style={{ textAlign: "center", padding: 30 }}><i className="fa-solid fa-hourglass"></i> Loading...</td></tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="8">
                        <div className="bk-empty">
                          <div className="bk-empty-ico"><i className="fa-solid fa-receipt"></i></div>
                          No bookings found
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map(b => (
                      <tr key={b.id}>
                        <td className="bk-id">#{String(b.id).slice(-6)}</td>
                        <td>
                          <div className="bk-cust">{b.customer || "—"}</div>
                          <div className="bk-phone">{b.phone || b.userEmail || "—"}</div>
                        </td>
                        <td>
                          <div className="bk-car-cell">
                            <span className="bk-car-ico"><i className="fa-solid fa-car-side"></i></span>
                            <div>
                              <div className="bk-car-name">{b.car || "—"}</div>
                              <div className="bk-route">{b.carType || ""}</div>
                            </div>
                          </div>
                        </td>
                        <td>{b.days || 1} day{(b.days || 1) > 1 ? "s" : ""}</td>
                        <td className="bk-amount">₹{Number(b.amount || 0).toLocaleString("en-IN")}</td>
                        <td className="bk-date">{b.createdAt ? b.createdAt.slice(0, 10) : "—"}</td>
                        <td>
                          <select
                            className="bk-status-sel"
                            value={b.status}
                            style={{ background: sc(b.status).bg, color: sc(b.status).color }}
                            onChange={e => handleStatusChange(b.id, e.target.value)}
                          >
                            <option value="Booked">Booked</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Pending">Pending</option>
                          </select>
                        </td>
                        <td>
                          <div className="bk-actions">
                            <button
                              className="bk-btn b-view"
                              title="View"
                              onClick={() => setModal({ type: "view", data: b })}
                            >👁</button>
                            <button
                              className="bk-btn b-del"
                              title="Delete"
                              onClick={() => setModal({ type: "delete", data: b })}
                            >🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODAL */}
      {modal?.type === "view" && (
        <div className="bk-overlay" onClick={() => setModal(null)}>
          <div className="bk-modal bk-modal-lg" onClick={e => e.stopPropagation()}>
            <div className="bk-mhead">
              <span className="bk-mtitle"><i className="fa-solid fa-receipt"></i>  Booking Details</span>
              <button className="bk-mclose" onClick={() => setModal(null)}>✕</button>
            </div>
            <div className="bk-mbody">
              <div className="bk-view-hero">
                <div className="bk-view-id">Booking #{String(modal.data.id).slice(-6)}</div>
                <div className="bk-view-name">{modal.data.customer || "—"}</div>
                <div className="bk-view-car"><i className="fa-solid fa-car-side"></i> {modal.data.car || "—"}</div>
                <span
                  className="bk-badge"
                  style={{
                    background: sc(modal.data.status).bg,
                    color: sc(modal.data.status).color,
                    padding: "4px 12px",
                    borderRadius: 20,
                    fontSize: 12,
                    fontWeight: 700,
                    display: "inline-block",
                    marginTop: 6,
                  }}
                >{modal.data.status}</span>
              </div>
              <div className="bk-view-grid">
                {[
                  { lbl: "Phone",    val: modal.data.phone    || "—" },
                  { lbl: "Email",    val: modal.data.userEmail || "—" },
                  { lbl: "Car Type", val: modal.data.carType  || "—" },
                  { lbl: "Days",     val: `${modal.data.days || 1} day(s)` },
                  { lbl: "Amount",   val: "₹" + Number(modal.data.amount || 0).toLocaleString("en-IN") },
                  { lbl: "Pickup",   val: modal.data.pickup   || "—" },
                  { lbl: "Booked On", val: modal.data.createdAt ? modal.data.createdAt.slice(0, 10) : "—" },
                ].map(item => (
                  <div key={item.lbl} className="bk-view-item">
                    <div className="bk-view-lbl">{item.lbl}</div>
                    <div className="bk-view-val">{item.val}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bk-mfoot">
              <button className="bk-btn-cancel" onClick={() => setModal(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {modal?.type === "delete" && (
        <div className="bk-overlay" onClick={() => setModal(null)}>
          <div className="bk-modal" onClick={e => e.stopPropagation()}>
            <div className="bk-del-body">
              <div className="bk-del-ico">🗑</div>
              <div className="bk-del-title">Delete Booking?</div>
              <div className="bk-del-sub">
                Booking #{String(modal.data.id).slice(-6)} by {modal.data.customer || "—"} will be permanently deleted.
                The car will become available again.
              </div>
            </div>
            <div className="bk-mfoot" style={{ justifyContent: "center", gap: 12 }}>
              <button className="bk-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="bk-btn-danger" onClick={() => handleDelete(modal.data.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* TOAST */}
      {toast && (
        <div className={`bk-toast ${toast.type === "error" ? "t-error" : "t-success"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}