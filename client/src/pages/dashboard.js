import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  const { user, login } = useAuth();
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
          const res = await fetch("http://localhost:8787/api/auth/me", {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (!res.ok) throw new Error("Failed to fetch user");
          const data = await res.json();
          login({ ...data, token });
        } catch (err) {
          console.error("Failed to load user:", err);
        }

        navigate("/dashboard", { replace: true });
      }
      setLoading(false);
    };

    fetchUser();
  }, [location.search, navigate, login]);

  if (loading) return <h1 className="loading-text">Loading...</h1>;
  if (!user) return <h1 className="loading-text">Please log in</h1>;

  return (
    <>
      <Navbar />
      <div className="dashboard-wrapper">
        <div className="dashboard-container">
          <div className="dashboard-card">
            <h1>Welcome, {user.name}!</h1>
            <p>Start managing your shared expenses and groups with ease.</p>

<<<<<<< Updated upstream
<<<<<<< Updated upstream
        <div className="navbar-links">
          <button onClick={() => navigate("/")} className="nav-btn">
            Home
          </button>
          <button onClick={() => navigate("/groups")} className="nav-btn">
            Groups
          </button>
          <button onClick={() => navigate("/expenses")} className="nav-btn">
            Expenses
          </button>
          <button onClick={() => navigate("/profile")} className="nav-btn">
            Profile
          </button>
        </div>

        <div className="navbar-right">
          <button className="btn-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="dashboard-container">
        <div className="dashboard-card">
          <h1>Welcome, {user.name}!</h1>
          <p>Start managing your shared expenses and groups with ease.</p>

          <div className="dashboard-buttons">
            <button className="btn-action" onClick={() => navigate("/groups")}>
              Create/Join Group
            </button>
            <button className="btn-action-outline" onClick={() => navigate("/expenses")}>
              Add Expense
            </button>
=======
=======
>>>>>>> Stashed changes
            <div className="dashboard-buttons">
              <button className="btn-action" onClick={() => navigate("/groups")}>
                Create/Join Group
              </button>
              <button
                className="btn-action-outline"
                onClick={() => navigate("/expenses")}
              >
                Add Expense
              </button>
              {/* ✅ New button to go directly to Bills page */}
              <button
                className="btn-action"
                onClick={() => navigate("/bills")}
                style={{ backgroundColor: "#2bb673", color: "white" }}
              >
                Go to Bills Section
              </button>
            </div>
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
          </div>
        </div>
      </div>
    </>
  );
}
