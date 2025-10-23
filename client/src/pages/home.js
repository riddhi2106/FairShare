import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import "../styles/home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <nav className="navbar">
        <img src={logo} alt="Logo" className="logo" />
        <button className="btn-login" onClick={() => navigate("/login")}>Login</button>
      </nav>

      <header className="hero">
        <h2>Manage Shared Expenses Effortlessly</h2>
        <p>Split bills, track group expenses, and simplify shared payments.</p>
        <button className="btn-get-started" onClick={() => navigate("/signup")}>
          Get Started
        </button>
      </header>

      <section className="features">
        <h3>Features</h3>
        <div className="feature-cards">
          <div className="card">
            <h4>Quick Bill Splitting</h4>
            <p>Split bills with friends instantly and fairly.</p>
          </div>
          <div className="card">
            <h4>Upload Receipts</h4>
            <p>Take a picture of your bill and auto-extract expenses.</p>
          </div>
          <div className="card">
            <h4>Track Groups</h4>
            <p>See all your groups and shared expenses in one place.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
