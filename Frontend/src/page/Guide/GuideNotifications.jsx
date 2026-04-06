import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";
import API from "../../utils/axios";

function GuideNotifications() {
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
      console.error("Failed to load guide notifications", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "trek_created": return "🏔️";
      case "schedule_created": return "📅";
      case "booking": return "📋";
      case "cancellation": return "⚠️";
      default: return "🔔";
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 flex justify-between items-center bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-2xl">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Timeline</p>
          <h1 className="text-3xl font-black text-white mt-1">Guide Inbox</h1>
          <p className="text-gray-400 mt-2 text-sm">Chronological history of interactions with your blueprints and schedules.</p>
        </div>
      </div>

      <div className="bg-[#1A2235] border border-gray-800 rounded-xl p-6 shadow-2xl">
        {loading ? (
           <p className="text-gray-400">Loading timeline...</p>
        ) : notifications.length === 0 ? (
           <div className="text-center py-10 opacity-70">
               <p className="text-5xl mb-3">🔔</p>
               <p className="text-gray-400 font-bold">Inbox empty! No recent activity.</p>
           </div>
        ) : (
           <div className="space-y-4">
             {notifications.map((notif) => (
                <div 
                  key={notif._id} 
                  className={`p-4 rounded-xl border ${notif.is_read ? 'border-gray-800 bg-[#0A0F1C] opacity-70' : 'border-[#AAFF00] bg-[#111827]'} flex gap-4 transition-all hover:scale-[1.01] shadow-lg`}
                >
                  <div className="text-3xl pt-1 flex items-center justify-center bg-black/40 w-12 h-12 rounded-full border border-gray-800">
                    {getIcon(notif.type)}
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                     <p className={`text-sm md:text-base font-bold ${notif.is_read ? 'text-gray-400' : 'text-white'}`}>
                       {notif.message}
                     </p>
                     <p className="text-xs text-gray-500 font-bold mt-1 tracking-widest uppercase">
                       {new Date(notif.createdAt).toLocaleString()}
                     </p>
                  </div>
                  {!notif.is_read && (
                    <button 
                      onClick={() => handleMarkAsRead(notif._id)}
                      className="self-center px-4 py-2 text-xs font-black tracking-widest uppercase rounded-full bg-[#AAFF00] text-[#0A0F1C] hover:bg-white transition-colors border border-green-500 shadow-[0_0_10px_rgba(170,255,0,0.3)]"
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

export default GuideNotifications;
