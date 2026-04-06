import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

export const guideMenuItems = [
  { label: "Dashboard", icon: "🏠", path: "/guide/dashboard" },
  { label: "Create Trek", icon: "➕", path: "/guide/create-trek" },
  { label: "My Treks", icon: "🏔️", path: "/guide/treks" },
  { label: "Schedules", icon: "📅", path: "/guide/schedules" },
  { label: "Bookings", icon: "📋", path: "/guide/bookings" },
  { label: "Earnings", icon: "💰", path: "/guide/earnings" },
  { label: "Notifications", icon: "🔔", path: "/guide/notifications" },
  { label: "Profile", icon: "👤", path: "/guide/profile" },
];

function GuideDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
     totalTreks: 0,
     activeSchedules: 0,
     totalBookings: 0,
     totalEarnings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [treksRes, schedulesRes, bookingsRes, earningsRes] = await Promise.all([
        API.get("/api/treks/guide"),
        API.get("/api/schedules/guide"),
        API.get("/api/bookings/guide"),
        API.get("/api/treks/earnings")
      ]);

      setStats({
        totalTreks: treksRes.data.length,
        activeSchedules: schedulesRes.data.length,
        totalBookings: bookingsRes.data.length,
        totalEarnings: earningsRes.data.totalEarnings || 0
      });

      setRecentBookings(bookingsRes.data.slice(0, 4));
    } catch (error) {
      console.error("Failed to load guide dashboard data", error);
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#AAFF00" }}>
            Guide Control Center
          </p>
          <h1 className="text-3xl font-black text-white mt-1">
            Welcome back, {user?.name}! 👋
          </h1>
        </div>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Blueprint Treks", value: stats.totalTreks, color: "#AAFF00", icon: "🏔️" },
          { label: "Active Schedules", value: stats.activeSchedules, color: "#34D399", icon: "📅" },
          { label: "Total Bookings", value: stats.totalBookings, color: "#60A5FA", icon: "📋" },
          { label: "Total Earnings", value: `Rs. ${stats.totalEarnings.toLocaleString()}`, color: "#FBBF24", icon: "💰" }
        ].map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border border-gray-800 bg-[#1A2235] hover:-translate-y-1 transition-transform"
          >
            <span className="text-2xl">{stat.icon}</span>
            <p className="text-3xl font-black mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
            <p className="text-xs mt-1 text-gray-400 font-bold uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* RECENT BOOKINGS */}
      <div className="bg-[#1A2235] rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <span>📋</span> Recent Bookings
        </h2>
        
        {recentBookings.length === 0 ? (
           <div className="text-center py-10">
              <p className="text-4xl mb-3">🏔️</p>
              <p className="text-white font-bold">No recent bookings!</p>
              <p className="text-sm mt-1 text-gray-400">
                Create new schedules to start accepting trekkers.
              </p>
           </div>
        ) : (
           <div className="space-y-4">
              {recentBookings.map(b => (
                 <div key={b._id} className="flex justify-between items-center p-4 bg-[#0A0F1C] rounded-lg border border-gray-800">
                    <div>
                      <p className="text-white font-bold">{b.user_id?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-400">{b.trek_schedule_id?.trek_id?.trek_name} • {new Date(b.trek_schedule_id?.start_date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[#AAFF00] font-black">{b.seats} Seats</p>
                       <p className="text-xs font-bold text-gray-500 uppercase">{b.booking_status}</p>
                    </div>
                 </div>
              ))}
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default GuideDashboard;