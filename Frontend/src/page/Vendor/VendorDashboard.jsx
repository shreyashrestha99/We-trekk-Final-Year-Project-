import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "Create Ride", icon: "➕", path: "/vendor/create-ride" },
  { label: "My Rides", icon: "🚙", path: "/vendor/rides" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "Notifications", icon: "🔔", path: "/vendor/notifications" },
  { label: "Profile", icon: "👤", path: "/vendor/profile" },
];

function VendorDashboard() {
  const { user } = useAuth();
  
  const [stats, setStats] = useState({
    totalRides: 0,
    activeRides: 0,
    totalBookings: 0,
    revenue: 0,
    recentBookings: [],
    loading: true
  });

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const [ridesRes, bookRes, earningsRes] = await Promise.all([
          API.get("/api/rides/vendor"),
          API.get("/api/bookings/vendor/my-bookings"),
          API.get("/api/rides/earnings")
        ]);

        const ridesData = ridesRes.data || [];
        const bookingsData = bookRes.data || [];
        const earningsData = earningsRes.data || { totalEarnings: 0 };

        const totalRides = ridesData.length;
        const activeRides = ridesData.filter(r => new Date(r.departure_time) >= new Date()).length;
        
        // Calculate confirmed bookings
        const rawBookings = bookingsData.filter(b => b.booking_status === "Confirmed" || b.booking_status === "Pending");
        const totalBookings = rawBookings.length;
        
        // Sort and get recent bookings
        const recentBookings = rawBookings.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);

        setStats({
          totalRides,
          activeRides,
          totalBookings,
          revenue: earningsData.totalEarnings,
          recentBookings,
          loading: false
        });

      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Welcome Back, {user?.name}
        </p>
        <h1 className="text-3xl font-black text-white mt-1">Vendor Dashboard Overview</h1>
      </div>

      {stats.loading ? (
        <p className="text-white">Loading your intelligence overview...</p>
      ) : (
        <>
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          
          <div className="p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#1A2235" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-400">Total Rides Created</p>
              <span className="text-xl">🚙</span>
            </div>
            <p className="text-3xl font-black text-white">{stats.totalRides}</p>
            <p className="text-xs text-gray-500 mt-2">All-time shared rides</p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#111827" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-400">Active Rides</p>
              <span className="text-xl">🟢</span>
            </div>
            <p className="text-3xl font-black text-white">{stats.activeRides}</p>
            <p className="text-xs text-gray-500 mt-2">Upcoming departures</p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#111827" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-400">Total Bookings</p>
              <span className="text-xl">📋</span>
            </div>
            <p className="text-3xl font-black text-white">{stats.totalBookings}</p>
            <p className="text-xs text-gray-500 mt-2">Passengers reserved</p>
          </div>

          <div className="p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#1A2235" }}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-bold text-gray-400">Platform Earnings</p>
              <span className="text-xl">💰</span>
            </div>
            <p className="text-3xl font-black" style={{ color: "#AAFF00" }}>Rs. {stats.revenue.toLocaleString()}</p>
            <p className="text-xs text-gray-500 mt-2">Total gross revenue</p>
          </div>

        </div>

        {/* QUICK ACTIONS & RECENT BOOKINGS */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Quick Actions</h2>
            <div className="flex flex-col gap-4">
              <a href="/vendor/create-ride" className="p-4 rounded-lg flex items-center justify-between transition-colors border border-gray-800 hover:border-[#AAFF00]" style={{ backgroundColor: "#1A2235" }}>
                <span className="font-bold text-white">Create New Ride</span>
                <span className="text-[#AAFF00]">→</span>
              </a>
              <a href="/vendor/rides" className="p-4 rounded-lg flex items-center justify-between transition-colors border border-gray-800 hover:border-[#AAFF00]" style={{ backgroundColor: "#1A2235" }}>
                <span className="font-bold text-white">Manage My Rides</span>
                <span className="text-[#AAFF00]">→</span>
              </a>
              <a href="/vendor/bookings" className="p-4 rounded-lg flex items-center justify-between transition-colors border border-gray-800 hover:border-[#AAFF00]" style={{ backgroundColor: "#1A2235" }}>
                <span className="font-bold text-white">View Bookings</span>
                <span className="text-[#AAFF00]">→</span>
              </a>
            </div>
          </div>

          <div className="md:col-span-2 p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#111827" }}>
             <h2 className="text-xl font-bold text-white mb-4">Recent Bookings</h2>
             {stats.recentBookings.length === 0 ? (
                <p className="text-gray-400 text-sm">No recent bookings found.</p>
             ) : (
                <div className="space-y-4">
                  {stats.recentBookings.map((booking) => (
                    <div key={booking._id} className="p-4 bg-[#1A2235] rounded-xl flex justify-between items-center border border-gray-800">
                      <div>
                        <p className="font-bold text-white">{booking.user_id?.name || "Unknown User"}</p>
                        <p className="text-xs text-gray-400">Ride: {booking.ride_id?.ride_name || "Unknown Ride"}</p>
                        <p className="text-xs text-[#AAFF00]">Seats: {booking.seats}</p>
                      </div>
                      <div className="text-right">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${booking.booking_status === "Confirmed" ? "bg-green-900 text-green-300" : "bg-yellow-900 text-yellow-300"}`}>
                          {booking.booking_status}
                        </span>
                        <p className="text-xs text-gray-500 mt-2">{new Date(booking.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
             )}
          </div>
        </div>
        </>
      )}

    </DashboardLayout>
  );
}

export default VendorDashboard;