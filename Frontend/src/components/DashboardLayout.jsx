import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function DashboardLayout({ children, menuItems }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: "#0A0F1C" }}>

      {/* SIDEBAR */}
      <aside
        className="flex flex-col transition-all duration-300 overflow-y-auto custom-scrollbar"
        style={{
          width: sidebarOpen ? "260px" : "70px",
          backgroundColor: "#111827",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 50,
          borderRight: "1px solid #1F2937",
        }}
      >
        {/* LOGO */}
        <div
          className="flex items-center justify-between px-4 py-5 sticky top-0 z-10"
          style={{ borderBottom: "1px solid #1F2937", backgroundColor: "#111827" }}
        >
          {sidebarOpen && (
            <span
              className="text-xl font-black cursor-pointer"
              style={{ color: "#AAFF00" }}
              onClick={() => navigate("/")}
            >
              WeTrekk
            </span>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md"
            style={{ color: "#9CA3AF" }}
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* USER INFO */}
        {sidebarOpen && (
          <div
            className="px-4 py-4 cursor-pointer hover:bg-white/5 transition-all"
            style={{ borderBottom: "1px solid #1F2937" }}
            onClick={() => {
              if (user?.role === "Trekker") navigate("/trekker/dashboard");
              else if (user?.role === "Guide") navigate("/guide/dashboard");
              else if (user?.role === "LocalVendor") navigate("/vendor/dashboard");
              else if (user?.role === "Admin") navigate("/admin/dashboard");
            }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm mb-2"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <p className="text-white font-bold text-sm truncate">
              {user?.name}
            </p>
            <span
              className="text-xs px-2 py-1 rounded-full font-bold"
              style={{ backgroundColor: "#AAFF0020", color: "#AAFF00" }}
            >
              {user?.role}
            </span>
          </div>
        )}

        {/* MENU ITEMS */}
        <nav className="flex-1 px-2 py-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all text-left group"
                style={{
                  backgroundColor: isActive ? "#AAFF0020" : "transparent",
                  border: isActive ? "1px solid #AAFF0040" : "1px solid transparent",
                  color: isActive ? "#AAFF00" : "#9CA3AF"
                }}
              >
                <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
                {sidebarOpen && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="px-2 py-4 sticky bottom-0 z-10" style={{ borderTop: "1px solid #1F2937", backgroundColor: "#111827" }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all"
            style={{ color: "#EF4444" }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = "#EF444420"}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
          >
            <span className="text-lg">🚪</span>
            {sidebarOpen && (
              <span className="text-sm font-medium">Logout</span>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 transition-all duration-300 min-h-screen flex flex-col"
        style={{ marginLeft: sidebarOpen ? "260px" : "70px" }}
      >
        {/* TOP BAR */}
        <header
          className="px-6 py-4 flex justify-between items-center sticky top-0 z-40"
          style={{
            backgroundColor: "#111827",
            borderBottom: "1px solid #1F2937"
          }}
        >
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#AAFF00" }}>
              {user?.role} Portal
            </p>
          </div>
          <div 
            className="flex items-center space-x-3 cursor-pointer hover:opacity-80 transition-all"
            onClick={() => {
              if (user?.role === "Trekker") navigate("/trekker/dashboard");
              else if (user?.role === "Guide") navigate("/guide/dashboard");
              else if (user?.role === "LocalVendor") navigate("/vendor/dashboard");
              else if (user?.role === "Admin") navigate("/admin/dashboard");
            }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center font-black text-xs"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-white">{user?.name}</span>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}

export default DashboardLayout;