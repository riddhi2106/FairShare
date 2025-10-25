import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import "../styles/dashboard.css";
import logo from "../assets/logo.png";

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const params = new URLSearchParams(location.search);
      const token = params.get("token");

      if (token) {
        localStorage.setItem("token", token);

        try {
          // Fetch real user info from backend
          const res = await fetch("http://localhost:5000/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch user");

          const data = await res.json();
          login({ ...data, token }); // update auth context
        } catch (err) {
          console.error("Failed to load user:", err);
        }

        // Clean URL
        navigate("/dashboard", { replace: true });
      }
      setLoading(false);
    };

    fetchUser();
  }, [location.search, navigate, login]);

  const handleCreateGroup = () => {
    alert("Create Group clicked!");
  };

  const handleJoinGroup = () => {
    alert("Join Group clicked!");
  };

  const handleLogout = async () => {
    try {
      // Log out from backend (for Google users)
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "GET",
        credentials: "include",
      });
    } catch (err) {
      console.error("Google logout failed", err);
    }

    logout(); // clear frontend state
    navigate("/"); // redirect to homepage
  };

  if (loading) return <h1>Loading...</h1>;
  if (!user) return <h1>Please log in</h1>;

  return (
    <div className="dashboard-wrapper">
      {/* Navbar */}
      <nav className="dashboard-navbar">
        <img src={logo} alt="Logo" className="navbar-logo" />
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </nav>

      {/* Main content */}
      <div className="dashboard-container">
        <h1>Welcome, {user.name}!</h1>
        <p>Manage your shared bills and groups below:</p>

        <div className="dashboard-buttons">
          <button className="btn-action" onClick={handleCreateGroup}>
            Create Group
          </button>
          <button className="btn-action" onClick={handleJoinGroup}>
            Join Group
          </button>
        </div>
      </div>
    </div>
  );
}
