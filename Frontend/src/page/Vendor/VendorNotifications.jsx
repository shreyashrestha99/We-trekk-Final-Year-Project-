import { useState, useEffect } from "react";
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

function VendorNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/api/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("Failed to load notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "ride_created": return "🚙";
      case "booking": return "📋";
      case "cancellation": return "⚠️";
      default: return "🔔";
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Timeline</p>
          <h1 className="text-3xl font-black text-white mt-1">Vendor Inbox</h1>
        </div>
      </div>

      <div className="bg-[#111827] rounded-xl border border-gray-800 p-6">
        {loading ? (
           <p className="text-gray-400">Loading inbox...</p>
        ) : notifications.length === 0 ? (
           <div className="text-center py-10">
               <p className="text-4xl mb-3">🔔</p>
               <p className="text-gray-400 font-bold">Inbox empty! No recent activity.</p>
           </div>
        ) : (
           <div className="space-y-4">
             {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 rounded-xl border ${notif.is_read ? 'border-gray-800 bg-[#0A0F1C] opacity-70' : 'border-[#AAFF00] bg-[#1A2235]'} flex gap-4 transition-all`}
                >
                  <div className="text-2xl pt-1">{getIcon(notif.type)}</div>
                  <div className="flex-1">
                     <p className={`text-sm md:text-base font-medium ${notif.is_read ? 'text-gray-300' : 'text-white'}`}>
                       {notif.message}
                     </p>
                     <p className="text-xs text-gray-500 mt-2">
                       {new Date(notif.createdAt).toLocaleString()}
                     </p>
                  </div>
                  {!notif.is_read && (
                    <button 
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="self-center px-4 py-1.5 text-xs font-bold rounded-full bg-[#AAFF00] text-[#0A0F1C] hover:bg-green-400 transition-colors"
                    >
                      Mark Read
                    </button>
                  )}
                </div>
             ))}
           </div>
        )}
      </div>

    </DashboardLayout>
  );
}

export default VendorNotifications;
