import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import logo from "../assets/logo.png";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      {/* Header */}
      <header className="brand-gradient">
        <nav className="navbar">
          <div className="logo-section">
            <img src={logo} alt="FairShare logo" className="logo" />
          </div>

          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#team">Team</a>
          </div>

          <button className="signin-btn" onClick={() => navigate("/login")}>
            Sign In
          </button>
        </nav>

        {/* Hero Section */}
        <section className="hero">
          <h1>Split Fair, Stay Friends</h1>
          <p>
            The smartest way to split expenses and track who owes what. Built
            for fairness, designed for friendship.
          </p>
          <button className="cta-btn" onClick={() => navigate("/signup")}>
            Start Splitting Smart
          </button>
        </section>
      </header>

      {/* Features Section */}
      <section id="features" className="features-section">
        <h2>Why FairShare Wins</h2>
        <p>
          Powerful features that make expense splitting effortless and fair.
        </p>

        <div className="features-container">
          <div className="feature-card">
            <div className="icon green">
              <i className="fas fa-calculator"></i>
            </div>
            <h3>Simple Expense Splitting</h3>
            <p>
              Add shared bills in seconds and let FairShare automatically divide costs among your group — no more messy calculations or confusion.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon blue">
              <i className="fas fa-bolt"></i>
            </div>
            <h3>Bill Image to Text</h3>
            <p>
              Snap a picture of your receipt and let FairShare extract the details instantly. No need to type in every item manually.
            </p>
          </div>

          <div className="feature-card">
            <div className="icon purple">
              <i className="fas fa-lock"></i>
            </div>
            <h3>Easy Settlements</h3>
            <p>
              Track who owes whom and settle up easily — whether it's through cash, UPI, or any preferred payment method.
            </p>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-container">
          <div className="team-card">
            <h4>Riddhi Mundada</h4>
            <p>Authentication & Authorisation</p>
          </div>
          <div className="team-card">
            <h4>Samhitha Sudarshan</h4>
            <p>Databases & Logic</p>
          </div>
          <div className="team-card">
            <h4>Samika Ojha</h4>
            <p>AI Integration</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <p>© 2025 FairShare. All rights reserved.</p>
      </footer>
    </div>
  );
}

