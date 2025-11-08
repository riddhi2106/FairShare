import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

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

  // 🟢 Restore user session if token exists (e.g., after Google OAuth redirect)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || user) return; // already logged in or no token

    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:8787/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch user");
        const data = await res.json();
        setUser({ ...data, token });
        localStorage.setItem("user", JSON.stringify({ ...data, token }));
      } catch (err) {
        console.error("Failed to restore session:", err);
        logout();
      }
    };

    fetchUser();
  }, [user]);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
