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
      setUser({ 
        name: savedName, 
        role: savedRole,
        profile_image: localStorage.getItem("profile_image") || "",
        phone: localStorage.getItem("phone") || ""
      });
    }
    setLoading(false);
  }, []);

  // Sync user data without re-login
  const syncUser = (updatedData) => {
    setUser(prev => ({ ...prev, ...updatedData }));
    if (updatedData.name) localStorage.setItem("name", updatedData.name);
    if (updatedData.profile_image) localStorage.setItem("profile_image", updatedData.profile_image);
    if (updatedData.phone) localStorage.setItem("phone", updatedData.phone);
  };

  // Login function
  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    setRole(userData.role);
    localStorage.setItem("token", userToken);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("name", userData.name);
    localStorage.setItem("profile_image", userData.profile_image || "");
    localStorage.setItem("phone", userData.phone || "");
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout, syncUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);