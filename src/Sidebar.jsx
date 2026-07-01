import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Usersection.css";

function Sidebar() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button 
        className={`sidebar-hamburger ${mobileMenuOpen ? "active" : ""}`} 
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className={`sidebar-overlay ${mobileMenuOpen ? "active" : ""}`}
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button 
            className="sidebar-close"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        
        <ul className="sidebar-menu">
          <li onClick={() => handleNavClick("/dashboard")}>
            <i className="fa-solid fa-chart-line"></i> Dashboard
          </li>
          <li onClick={() => handleNavClick("/cars")}>
            <i className="fa-solid fa-car"></i> Cars
          </li>
          <li onClick={() => handleNavClick("/booking")}>
            <i className="fa-solid fa-calendar-check"></i> Bookings
          </li>
          <li onClick={() => handleNavClick("/user")}>
            <i className="fa-solid fa-users"></i> Users
          </li>
        </ul>

        <div className="sidebar-logout">
          <hr />
          <button 
            onClick={() => { 
              navigate("/"); 
              setMobileMenuOpen(false); 
            }} 
            className="logout-btn"
          >
            <i className="fa-solid fa-arrow-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;