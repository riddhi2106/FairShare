import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import "../styles/dashboard.css";
import logo from "../assets/logo.png"; // small navbar logo

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleCreateGroup = () => {
    alert("Create Group clicked!");
    // navigate("/create-group"); // implement later
  };

  const handleJoinGroup = () => {
    alert("Join Group clicked!");
    // navigate("/join-group"); // implement later
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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
        <h1>Welcome, {user?.name || "User"}!</h1>
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
