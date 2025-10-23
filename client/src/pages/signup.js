import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/signup.css";
import logo from "../assets/logo.png"; // Fairshare logo
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
      const res = await axios.post("http://localhost:5000/api/auth/signup", formData);
      alert("Account created successfully! You can now log in.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err.response?.data || err);
      alert(err.response?.data?.message || "Error creating account. Please try again.");
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google"; // redirect to Google OAuth
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        {/* Fairshare logo */}
        <img src={logo} alt="Fairshare Logo" className="auth-logo" />

        <h2>Sign Up</h2>

        {/* Email/Password signup */}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button type="submit" className="btn-signup">Sign Up</button>
        </form>

        <div className="divider">or</div>

        {/* Google signup */}
        <button className="btn-google" onClick={handleGoogleSignup}>
          <img src={googleIcon} alt="Google" />
          Sign up with Google
        </button>

        {/* Login link */}
        <div className="signup-text">
          Already have an account? <span className="link" onClick={() => navigate("/login")}>Login</span>
        </div>
      </div>
    </div>
  );
}
