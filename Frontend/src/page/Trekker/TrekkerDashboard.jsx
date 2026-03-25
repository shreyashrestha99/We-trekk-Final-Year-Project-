import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks", icon: "🏔️", path: "/explore" },
  { label: "Browse Groups", icon: "👥", path: "/trekker/groups" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

function TrekkerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const stats = [
    { label: "My Bookings", value: "0", icon: "📋", color: "#AAFF00" },
    { label: "Groups Joined", value: "0", icon: "👥", color: "#60A5FA" },
    { label: "Treks Completed", value: "0", icon: "🏔️", color: "#34D399" },
    { label: "Total Expenses", value: "NPR 0", icon: "💰", color: "#F59E0B" }
  ];

  return (
    <DashboardLayout menuItems={menuItems}>

      {/* WELCOME */}
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Welcome Back
        </p>
        <h1 className="text-3xl font-black text-white mt-1">
          Hello, {user?.name}! 👋
        </h1>
        <p className="mt-1 text-sm" style={{ color: "#9CA3AF" }}>
          Ready for your next adventure?
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl"
            style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
          >
            <div className="flex justify-between items-start mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span
                className="text-xs px-2 py-1 rounded-full font-bold"
                style={{ backgroundColor: stat.color + "20", color: stat.color }}
              >
                Total
              </span>
            </div>
            <p className="text-2xl font-black" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">
            Quick Actions
          </h2>
          <div className="space-y-3">
            {[
              { label: "🏔️ Browse Available Treks", path: "/explore", primary: true },
              { label: "👥 Browse Trek Groups", path: "/trekker/groups", primary: false },
              { label: "📋 View My Bookings", path: "/trekker/bookings", primary: false },
              { label: "💰 Track Expenses", path: "/trekker/expenses", primary: false },
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

        {/* PROFILE CARD */}
        <div
          className="p-6 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">My Profile</h2>
          <div className="flex items-center space-x-4 mb-6">
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
            </div>
          </div>
          <button
            onClick={() => navigate("/trekker/profile")}
            className="w-full py-2 rounded-md font-semibold text-sm"
            style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
          >
            Edit Profile
          </button>
        </div>
      </div>

      {/* RECENT ACTIVITY */}
      <div
        className="p-6 rounded-xl"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <h2 className="text-lg font-bold text-white mb-4">Recent Activity</h2>
        <div className="text-center py-8">
          <p className="text-4xl mb-3">🏔️</p>
          <p className="text-white font-bold">No activity yet!</p>
          <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
            Start by browsing available treks
          </p>
          <button
            onClick={() => navigate("/explore")}
            className="mt-4 px-6 py-2 rounded-md font-bold text-sm"
            style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
          >
            Explore Treks
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TrekkerDashboard;