import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import logo from "../assets/logo.png";
import "../styles/navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user) return null; // Don't show navbar if not logged in

  return (
    <nav className="dashboard-navbar">
      <div className="navbar-left">
        <img src={logo} alt="FairShare Logo" className="navbar-logo" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }} />
      </div>

      <div className="navbar-links">
        <button onClick={() => navigate("/dashboard")} className="nav-btn">Dashboard</button>
        <button onClick={() => navigate("/groups")} className="nav-btn">Groups</button>
        <button onClick={() => navigate("/expenses")} className="nav-btn">Expenses</button>
        <button onClick={() => navigate("/bills")} className="nav-btn">Bills</button>
      </div>

      <div className="navbar-right">
        <span className="user-name">Hi, {user.name}!</span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
