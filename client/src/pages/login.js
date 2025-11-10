import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import axios from "axios";
import "../styles/login.css";
import logo from "../assets/logo.png"; // Fairshare logo
import googleIcon from "../assets/google-icon.png"; // Google icon

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // No longer need to handle token here, AuthProvider does it
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8787/api/auth/login", formData);
      login({ ...res.data.user, token: res.data.token });
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials or server error");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = "http://localhost:8787/api/auth/google";
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
        <img src={logo} alt="Fairshare Logo" className="auth-logo" />

        <h2>Login</h2>

        {/* Email/Password login */}
        <form onSubmit={handleSubmit}>
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
          <button type="submit" className="btn-signup">Login</button>
        </form>

        <div className="divider">or</div>

        {/* Google login */}
        <button className="btn-google" onClick={handleGoogleLogin}>
          <img src={googleIcon} alt="Google" />
          Sign in with Google
        </button>

        {/* Sign-up link */}
        <div className="signup-text">
          Don’t have an account? <span className="link" onClick={() => navigate("/signup")}>Sign Up</span>
        </div>
      </div>
    </div>
  );
}
