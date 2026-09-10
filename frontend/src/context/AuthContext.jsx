import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("crm_user");
    const token = localStorage.getItem("crm_token");
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    const { token, ...userData } = data;
    localStorage.setItem("crm_token", token);
    localStorage.setItem("crm_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role) => {
    const { data } = await api.post("/auth/register", { name, email, password, role });
    const { token, ...userData } = data;
    localStorage.setItem("crm_token", token);
    localStorage.setItem("crm_user", JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem("crm_token");
    localStorage.removeItem("crm_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
