import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  // Wait for auth to load
  if (loading) {
    return <div>Loading...</div>;
  }

  // Not logged in → go to login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Wrong role → go to home
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;