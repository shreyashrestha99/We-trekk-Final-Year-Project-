import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/guide/dashboard" },
  { label: "Assigned Treks", icon: "🏔️", path: "/guide/treks" },
  { label: "My Schedule", icon: "📅", path: "/guide/schedule" },
  { label: "My Profile", icon: "👤", path: "/guide/profile" },
];

function GuideDashboard() {
  const { user } = useAuth();

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Guide Portal
        </p>
        <h1 className="text-3xl font-black text-white mt-1">
          Welcome, {user?.name}! 👋
        </h1>
      </div>

      {/* VERIFICATION STATUS */}
      <div
        className="p-4 rounded-xl mb-6"
        style={{ backgroundColor: "#F59E0B20", border: "1px solid #F59E0B" }}
      >
        <div className="flex items-center space-x-3">
          <span className="text-2xl">⏳</span>
          <div>
            <p className="font-bold" style={{ color: "#F59E0B" }}>
              Verification Pending
            </p>
            <p className="text-sm" style={{ color: "#9CA3AF" }}>
              Admin is reviewing your guide profile.
              You will be notified once verified.
            </p>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Assigned Treks", value: "0", color: "#AAFF00", icon: "🏔️" },
          { label: "Completed Treks", value: "0", color: "#34D399", icon: "✅" },
          { label: "Total Trekkers Led", value: "0", color: "#60A5FA", icon: "👥" }
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl"
            style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-black mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ASSIGNED TREKS */}
      <div
        className="p-6 rounded-xl mb-6"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <h2 className="text-lg font-bold text-white mb-4">
          Upcoming Assigned Treks
        </h2>
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🏔️</p>
          <p className="text-white font-bold">No treks assigned yet!</p>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
            Vendors will assign you to treks after verification
          </p>
        </div>
      </div>

      {/* PROFILE SUMMARY */}
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <h2 className="text-lg font-bold text-white mb-4">My Profile</h2>
        <div className="flex items-center space-x-4">
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black"
            style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-white font-bold text-lg">{user?.name}</p>
            <span
              className="text-xs px-2 py-1 rounded-full font-bold"
              style={{ backgroundColor: "#AAFF0020", color: "#AAFF00" }}
            >
              {user?.role}
            </span>
            <p className="text-xs mt-1" style={{ color: "#F59E0B" }}>
              ⏳ Awaiting verification
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default GuideDashboard;