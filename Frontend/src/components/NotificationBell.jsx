import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../utils/axios";

function NotificationBell() {
  const navigate = useNavigate();
  const { user, role } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  useEffect(() => {
    if (!user) return; // Do not poll if unauthenticated
    
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Verify every 30s
    return () => clearInterval(interval);
  }, [user]);

  // Click outside listener for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await API.get("/api/notifications");
      setNotifications(res.data);
    } catch (error) {
      console.error("🔔 Silently failed catching notifications", error);
    }
  };

  const handleMarkAsRead = async (id, e) => {
    e.stopPropagation();
    try {
      await API.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, is_read: true } : n));
    } catch (error) {
      console.error("Failed to mark as read", error);
    }
  };

  const navigateToInbox = () => {
    setIsOpen(false);
    if (role === "Trekker") navigate("/trekker/notifications");
    else if (role === "Guide") navigate("/guide/notifications");
    else if (role === "LocalVendor") navigate("/vendor/notifications");
    else navigate("/dashboard");
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
       <button 
         onClick={() => setIsOpen(!isOpen)}
         className="relative p-2 rounded-full hover:bg-gray-800 transition-colors focus:outline-none"
       >
          <span className="text-xl inline-block -mt-1">🔔</span>
          {unreadCount > 0 && (
             <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[0.65rem] font-bold flex items-center justify-center border border-[#0A0F1C]">
                {unreadCount > 9 ? '9+' : unreadCount}
             </span>
          )}
       </button>

       {isOpen && (
          <div className="absolute right-0 mt-3 w-80 bg-[#1A2235] border border-gray-700 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] z-[100] overflow-hidden">
             
             {/* HEADER */}
             <div className="bg-[#0A0F1C] border-b border-gray-800 p-4 flex justify-between items-center">
                 <h3 className="text-white font-bold tracking-widest uppercase text-xs">Notifications</h3>
                 {unreadCount > 0 && (
                   <span className="text-[0.65rem] font-black uppercase bg-red-500 text-white px-2 py-0.5 rounded-full">
                     {unreadCount} Unread
                   </span>
                 )}
             </div>

             {/* NOTIFICATIONS LIST */}
             <div className="max-h-80 overflow-y-auto">
                 {notifications.length === 0 ? (
                    <div className="p-6 text-center text-sm text-gray-500 font-bold">
                       📭 Nothing new to report.
                    </div>
                 ) : (
                    <div className="divide-y divide-gray-800 flex flex-col">
                       {notifications.slice(0, 10).map((notif) => (
                          <div 
                            key={notif._id} 
                            className={`p-4 flex gap-3 text-sm transition-colors hover:bg-gray-800/40 cursor-pointer ${notif.is_read ? 'opacity-60' : 'bg-gray-800/10'}`}
                            onClick={navigateToInbox}
                          >
                             <div className="text-xl mt-0.5">
                               {notif.type === 'booking' ? '📋' : notif.type === 'cancellation' ? '⚠️' : '🔔'}
                             </div>
                             <div className="flex-1">
                                <p className={`leading-tight font-medium ${notif.is_read ? 'text-gray-400' : 'text-white'}`}>
                                  {notif.message}
                                </p>
                                <div className="flex justify-between items-center mt-2">
                                   <span className="text-[0.65rem] font-bold uppercase tracking-widest text-[#AAFF00]">
                                     {new Date(notif.createdAt).toLocaleDateString()}
                                   </span>
                                   {!notif.is_read && (
                                     <button 
                                       onClick={(e) => handleMarkAsRead(notif._id, e)}
                                       className="text-[0.65rem] font-bold text-gray-400 hover:text-white transition-colors uppercase"
                                     >
                                       Mark Read
                                     </button>
                                   )}
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 )}
             </div>

             {/* FOOTER */}
             <div 
               className="bg-[#0A0F1C] border-t border-gray-800 p-3 text-center cursor-pointer hover:bg-black transition-colors"
               onClick={navigateToInbox}
             >
                <span className="text-xs font-bold text-[#AAFF00] tracking-widest uppercase">
                  View Full Inbox →
                </span>
             </div>
          </div>
       )}
    </div>
  );
}

export default NotificationBell;
