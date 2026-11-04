import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./Cars.css";
import { getCars, addCar, updateCar, deleteCar } from "./localData";

const EMPTY_CAR = {
  name: "", brand: "", type: "Sedan", fuel: "Petrol",
  seats: 5, transmission: "Manual", price: 0,
  status: "Available", plate: "", year: 2024,
  img: "🚗", rating: 4.5, reviews: 0,
  available: true, features: "", image: "", description: "",
};

export default function Cars() {
  const navigate = useNavigate();

  const [cars,    setCars]    = useState([]);
  const [search,  setSearch]  = useState("");
  const [filter,  setFilter]  = useState("All");
  const [modal,   setModal]   = useState(null);   // null | {type, data}
  const [form,    setForm]    = useState(EMPTY_CAR);
  const [toast,   setToast]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = () => {
    setLoading(true);
    setCars(getCars());
    setLoading(false);
  };

  const flash = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Add car ── */
  const handleAdd = () => {
    if (!form.name.trim()) { flash("Car name is required ❌", "error"); return; }
    if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0 || !Number.isInteger(Number(form.seats)) || Number(form.seats) < 1 || Number(form.seats) > 20) {
      flash("Enter a valid price and seat count.", "error");
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        name: form.name.trim(),
        seats: Number(form.seats),
        price: Number(form.price),
        year: Number(form.year),
        reviews: Number(form.reviews),
        rating: Number(form.rating),
        available: form.status === "Available",
        features: typeof form.features === "string" ? form.features : form.features.join(","),
      };
      addCar(payload);
      fetchCars();
      setModal(null);
      flash("Car added successfully ✅");
    } catch (error) {
      flash(error.message || "Unable to add car", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Edit car ── */
  const handleEdit = () => {
    if (!form.name.trim()) { flash("Car name is required ❌", "error"); return; }
    setSaving(true);

    const payload = {
      ...form,
      seats:    Number(form.seats),
      price:    Number(form.price),
      year:     Number(form.year),
      reviews:  Number(form.reviews),
      rating:   Number(form.rating),
      available: form.status === "Available",
      features: Array.isArray(form.features) ? form.features.join(",") : form.features,
    };

    try {
      updateCar(form.id, payload);
      fetchCars();
      setModal(null);
      flash("Car updated successfully ✅");
    } catch (error) {
      flash(error.message || "Unable to update car", "error");
    } finally {
      setSaving(false);
    }
  };

  /* ── Delete car ── */
  const handleDelete = (carId) => {
    try {
      deleteCar(carId);
      setCars(getCars());
      setModal(null);
      flash("Car deleted ✅");
    } catch (error) {
      setModal(null);
      flash(error.message || "Unable to delete car", "error");
    }
  };

  /* ── Filter ── */
  const filtered = cars.filter(c => {
    const matchSearch =
      (c.name  || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.brand || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.plate || "").toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "All"       ? true :
      filter === "Available" ? c.available === true :
      filter === "Rented"    ? c.status === "Rented" :
      c.status === filter;
    return matchSearch && matchFilter;
  });

  const statusBadge = (car) => {
    if (car.status === "Rented" || !car.available)
      return { bg: "#ede9fe", color: "#6d28d9", label: "Rented" };
    if (car.status === "Maintenance")
      return { bg: "#fee2e2", color: "#b91c1c", label: "Maintenance" };
    return { bg: "#dcfce7", color: "#15803d", label: "Available" };
  };

  const openAdd = () => {
    setForm(EMPTY_CAR);
    setModal({ type: "add" });
  };

  const openEdit = (car) => {
    setForm({
      ...car,
      features: Array.isArray(car.features) ? car.features.join(", ") : (car.features || ""),
    });
    setModal({ type: "edit" });
  };

  const FormField = ({ label, name, type = "text", options }) => (
    <div className="bk-fg" style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label className="bk-lbl">{label}</label>
      {options ? (
        <select className="bk-fsel" name={name} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })}>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input
          className="bk-inp"
          type={type}
          name={name}
          value={form[name]}
          onChange={e => setForm({ ...form, [name]: e.target.value })}
        />
      )}
    </div>
  );

  return (
    <div className="cars-root">
      <Sidebar />

      <div className="c-main">
        {/* TOPBAR */}
        <div className="c-topbar">
          <span className="c-breadcrumb"><i className="fa-solid fa-car-side"></i> Cars Management</span>
          <div className="c-admin-pill">
            <div className="c-online-dot"></div>Admin
          </div>
        </div>

        {/* HEADER */}
        <div className="c-page-header">
          <div>
            <div className="c-page-title">Fleet Management</div>
            <div className="c-page-sub">Add, edit and manage all cars</div>
          </div>
          <button className="c-add-btn" onClick={openAdd}>+ Add New Car</button>
        </div>

        {/* STATS */}
        <div className="c-stat-row">
          {[
            { label: "Total Cars",  num: cars.length,                                        key: "All",       color: "#667eea" },
            { label: "Available",   num: cars.filter(c => c.available).length,               key: "Available", color: "#10b981" },
            { label: "Rented",      num: cars.filter(c => c.status === "Rented").length,     key: "Rented",    color: "#f59e0b" },
            { label: "Maintenance", num: cars.filter(c => c.status === "Maintenance").length,key: "Maintenance",color: "#ef4444" },
          ].map(s => (
            <div key={s.key} className={`c-stat-pill ${filter === s.key ? "pill-active" : ""}`} onClick={() => setFilter(s.key)}>
              <div className="c-stat-pill-num">{s.num}</div>
              <div className="c-stat-pill-label">{s.label}</div>
              <div className="c-stat-pill-bar">
                <div className="c-stat-pill-fill" style={{ width: `${cars.length ? (s.num / cars.length) * 100 : 0}%`, background: s.color }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* FILTERS */}
        <div className="c-filter-row">
          <div className="c-search-wrap">
            <span className="c-search-icon"><i className="fa-solid fa-magnifying-glass"></i></span>
            <input className="c-search" placeholder="Search by name, brand or plate..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="c-select" value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Rented">Rented</option>
            <option value="Maintenance">Maintenance</option>
          </select>
          <div className="c-count-badge">{filtered.length} cars</div>
        </div>

        {/* TABLE */}
        <div className="c-table-card">
          <table className="c-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Car</th>
                <th>Type</th>
                <th>Fuel</th>
                <th>Transmission</th>
                <th>Price/Day</th>
                <th>Plate</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: 30 }}><i className="fa-solid fa-hourglass"></i> Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan="9" style={{ textAlign: "center", padding: 30 }}>No cars found</td></tr>
              ) : (
                filtered.map((car, idx) => {
                  const sb = statusBadge(car);
                  return (
                    <tr key={car.id}>
                      <td style={{ color: "#9ca3af", fontSize: 12 }}>{idx + 1}</td>
                      <td>
                        <div className="c-car-cell">
                          <span className="c-car-emo">{car.img || <i className="fa-solid fa-car-side"></i>}</span>
                          <div>
                            <div className="c-car-name">{car.name}</div>
                            <div className="c-car-plate">{car.brand}</div>
                          </div>
                        </div>
                      </td>
                      <td>{car.type}</td>
                      <td>{car.fuel}</td>
                      <td>{car.transmission}</td>
                      <td style={{ fontWeight: 700 }}>₹{Number(car.price || 0).toLocaleString("en-IN")}</td>
                      <td style={{ fontFamily: "monospace", fontSize: 12 }}>{car.plate || "—"}</td>
                      <td>
                        <span className="c-badge" style={{ background: sb.bg, color: sb.color }}>
                          ● {sb.label}
                        </span>
                      </td>
                      <td>
                        <div className="c-actions">
                          <button className="c-action-btn btn-edit" onClick={() => openEdit(car)}><i className="fa-solid fa-pen-to-square"></i></button>
                          <button className="c-action-btn btn-del" onClick={() => setModal({ type: "delete", data: car })}>🗑</button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <div className="c-overlay" onClick={() => setModal(null)}>
          <div className="c-modal" style={{ maxHeight: "90vh", overflowY: "auto" }} onClick={e => e.stopPropagation()}>
            <div className="c-modal-header">
              <span className="c-modal-title">{modal.type === "add" ? " Add New Car" : " Edit Car"}</span>
              <button className="c-modal-close" onClick={() => setModal(null)}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12, padding: "10px 0" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <FormField label="Car Name *" name="name" />
                <FormField label="Brand" name="brand" />
                <FormField label="Type" name="type" options={["Sedan", "SUV", "Hatchback", "MUV", "Coupe"]} />
                <FormField label="Fuel" name="fuel" options={["Petrol", "Diesel", "Electric", "Hybrid"]} />
                <FormField label="Seats" name="seats" type="number" />
                <FormField label="Transmission" name="transmission" options={["Manual", "Automatic"]} />
                <FormField label="Price/Day (₹)" name="price" type="number" />
                <FormField label="Status" name="status" options={["Available", "Rented", "Maintenance"]} />
                <FormField label="Plate Number" name="plate" />
                <FormField label="Year" name="year" type="number" />
                <FormField label="Rating" name="rating" type="number" />
              </div>
              <FormField label="Image URL" name="image" />
              <FormField label="Features (comma separated)" name="features" />
              <FormField label="Description" name="description" />
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 16, justifyContent: "flex-end" }}>
              <button className="c-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button
                className="c-btn-primary"
                disabled={saving}
                onClick={modal.type === "add" ? handleAdd : handleEdit}
              >
                {saving ? " Saving..." : modal.type === "add" ? "Add Car" : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {modal?.type === "delete" && (
        <div className="c-overlay" onClick={() => setModal(null)}>
          <div className="c-modal" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: "center", padding: "10px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🗑</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Delete Car?</div>
              <div style={{ color: "#6b7280", fontSize: 14 }}>
                "{modal.data.name}" will be permanently removed. All bookings for this car will also be deleted.
              </div>
            </div>
            <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 20 }}>
              <button className="c-btn-cancel" onClick={() => setModal(null)}>Cancel</button>
              <button className="c-btn-danger" onClick={() => handleDelete(modal.data.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`c-toast ${toast.type === "error" ? "toast-error" : "toast-success"}`}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}