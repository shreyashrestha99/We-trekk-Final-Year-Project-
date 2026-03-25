import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check localStorage when app loads
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    const savedName = localStorage.getItem("name");

    if (savedToken) {
      setToken(savedToken);
      setRole(savedRole);
      setUser({ name: savedName, role: savedRole });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setRole(userData.role);
    localStorage.setItem("token", userToken);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("name", userData.name);
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);