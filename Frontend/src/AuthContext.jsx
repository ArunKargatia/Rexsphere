import React, { createContext, useState, useEffect, useContext } from "react";
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const storedToken = sessionStorage.getItem("token");
  const initialToken = storedToken && !isTokenExpired(storedToken) ? storedToken : null;

  const [token, setToken] = useState(initialToken);
  const [isAuthenticated, setIsAuthenticated] = useState(!!initialToken);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      logout();
    } else {
      setIsAuthenticated(true);
    }
  }, [token]);

  useEffect(() => {
    if (!isAuthenticated) return;
    const interval = setInterval(() => {
      if (token && isTokenExpired(token)) {
        logout();
      }
    }, 60 * 1000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated, token]);

  function isTokenExpired(token) {
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  function getUserIdFromToken() {
    try {
      return token ? jwtDecode(token).userId || null : null;
    } catch {
      return null;
    }
  }

  function login(newToken) {
    if (!newToken || isTokenExpired(newToken)) return;
    setToken(newToken);
    sessionStorage.setItem("token", newToken);
    setIsAuthenticated(true);
  }

  function logout() {
    setToken(null);
    sessionStorage.removeItem("token");
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, getUserIdFromToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
