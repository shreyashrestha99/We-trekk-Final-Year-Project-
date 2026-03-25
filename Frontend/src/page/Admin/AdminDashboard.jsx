import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "All Users", icon: "👥", path: "/admin/users" },
  { label: "All Treks", icon: "🏔️", path: "/admin/treks" },
  { label: "Verifications", icon: "✅", path: "/admin/verify" },
  { label: "Disputes", icon: "⚠️", path: "/admin/disputes" },
  { label: "Platform Stats", icon: "📊", path: "/admin/stats" },
];

function AdminDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTreks: 0,
    pendingVerifications: 0,
    totalRevenue: 0
  });

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Admin Portal
        </p>
        <h1 className="text-3xl font-black text-white mt-1">
          Platform Dashboard
        </h1>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: stats.totalUsers, icon: "👥", color: "#60A5FA" },
          { label: "Total Treks", value: stats.totalTreks, icon: "🏔️", color: "#AAFF00" },
          { label: "Pending Verifications", value: stats.pendingVerifications, icon: "⏳", color: "#F59E0B" },
          { label: "Platform Revenue", value: `NPR ${stats.totalRevenue}`, icon: "💰", color: "#34D399" }
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl"
            style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-2xl font-black mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: "👥 Manage All Users", path: "/admin/users", primary: true },
              { label: "✅ Verify Guides & Vendors", path: "/admin/verify", primary: false },
              { label: "⚠️ View Disputes", path: "/admin/disputes", primary: false },
              { label: "📊 Platform Statistics", path: "/admin/stats", primary: false },
            ].map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="w-full py-2 rounded-md font-semibold text-sm text-left px-4"
                style={action.primary
                  ? { backgroundColor: "#AAFF00", color: "#0A0F1C" }
                  : { border: "1px solid #1F2937", color: "#9CA3AF" }
                }
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>

        {/* RECENT ACTIVITY */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">
            Recent Activity
          </h2>
          <div className="text-center py-8">
            <p className="text-4xl mb-3">📊</p>
            <p className="text-white font-bold">No activity yet!</p>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
              Activity will appear here as users join
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;