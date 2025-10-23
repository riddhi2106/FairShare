import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/authcontext";
import axios from "axios";
import "../styles/login.css";
import logo from "../assets/logo.png"; // Fairshare logo
import googleIcon from "../assets/google-icon.png"; // Google icon

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle token from Google OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      // You can also decode JWT to get user info here if needed
      login({ token });
      navigate("/dashboard");
    }
  }, [location.search, login, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", formData);
      login({ ...res.data.user, token: res.data.token });
      navigate("/dashboard");
    } catch (err) {
      alert("Invalid credentials or server error");
    }
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth route
    window.location.href = "http://localhost:5000/api/auth/google";
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
