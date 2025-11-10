import React, { createContext, useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    const fetchUser = async (tokenToFetch) => {
      try {
        const res = await fetch("http://localhost:8787/api/auth/me", {
          headers: { Authorization: `Bearer ${tokenToFetch}` },
        });
        if (!res.ok) {
          logout(); // Token is invalid, so log out
          return;
        }
        const data = await res.json();
        login({ ...data, token: tokenToFetch });
        // If we got the token from the URL, store it and clean the URL
        if (urlToken) {
          localStorage.setItem("token", tokenToFetch);
          navigate(location.pathname, { replace: true });
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        logout();
      }
    };

    if (urlToken) {
      fetchUser(urlToken);
    } else if (token && !user) {
      fetchUser(token);
    }
  }, [location.search]); // Rerun when URL changes

  // login: save user info and token
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  // logout: clear user info and token
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
