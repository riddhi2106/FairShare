import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";
import logo from "../assets/logo.png"; // FairShare logo
import googleIcon from "../assets/google-icon.png"; // Google icon

export default function Signup() {
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8787/api/auth/signup", formData);
      alert("Account created successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error creating account. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:8787/api/auth/google";
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src={logo} alt="FairShare Logo" className="signup-logo" />

        <h2>Create your FairShare account</h2>
        <p className="signup-subtext">Join groups, track expenses, and settle bills effortlessly.</p>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Create Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-signup">Sign Up</button>
        </form>

        <div className="divider">or</div>

        <button className="btn-google" onClick={handleGoogleSignup}>
          <img src={googleIcon} alt="Google" />
          Continue with Google
        </button>

        <div className="signup-text">
          Already have an account?{" "}
          <span className="link" onClick={() => navigate("/login")}>
            Log In
          </span>
        </div>
      </div>
    </div>
  );
}
