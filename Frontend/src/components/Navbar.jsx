import React from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  const handleDashboardRedirect = () => {
    if (role === "Trekker") navigate("/trekker/dashboard");
    else if (role === "Guide") navigate("/guide/dashboard");
    else if (role === "LocalVendor") navigate("/vendor/dashboard");
    else navigate("/dashboard");
  };

  return (
    <header style={{ backgroundColor: "#0A0F1C", borderBottom: "1px solid #1F2937" }}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div
          className="text-2xl font-bold cursor-pointer flex items-center gap-4"
          style={{ color: "#AAFF00" }}
        >
          <span onClick={() => navigate("/")}>WeTrekk</span>
          
          {/* Mobile profile display next to logo - accommodates generic "top left" request */}
          {user && (
            <div className="md:hidden flex items-center space-x-4 ml-4">
              <NotificationBell />
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm cursor-pointer"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                onClick={handleDashboardRedirect}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </div>
            </div>
          )}
        </div>

        <nav className="hidden md:flex space-x-8 text-sm">
          {["Home", "Explore", "Contact Us", "About Us"].map((item) => {
            const path = item === "Home" ? "/" 
                       : item === "Explore" ? "/explore" 
                       : item === "Contact Us" ? "/contact" 
                       : "/about";
            return (
              <button
                key={item}
                onClick={() => navigate(path)}
                className="transition-colors"
                style={{ color: "#9CA3AF" }}
                onMouseEnter={e => e.target.style.color = "#AAFF00"}
                onMouseLeave={e => e.target.style.color = "#9CA3AF"}
              >
                {item}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center space-x-4">
          {user ? (
            <div className="hidden md:flex items-center space-x-5">
              <NotificationBell />
              <div 
                className="flex items-center space-x-2 cursor-pointer"
                onClick={handleDashboardRedirect}
                title="Go to Dashboard"
              >
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                >
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span style={{ color: "#E5E7EB" }} className="font-medium text-sm">
                  {user.name}
                </span>
              </div>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="text-sm font-medium transition-colors text-red-500 hover:text-red-400"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-sm rounded-md transition-colors"
                style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#AAFF00" + "20"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              >
                Login
              </button>
              <button
                onClick={() => navigate("/register")}
                className="px-4 py-2 text-sm rounded-md font-semibold transition-colors"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
              >
                Join Now
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
