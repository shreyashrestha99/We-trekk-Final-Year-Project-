import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";
import API from "../../utils/axios";

function TrekBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/api/bookings/guide");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to load guide bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/api/bookings/${id}/status`, { status });
      alert(`Booking ${status.toLowerCase()}ed!`);
      fetchBookings();
    } catch (error) {
      console.error("Failed to update status", error);
      alert("Status update failed");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed": return "text-[#34D399] bg-[#34D399]/10 border-[#34D399]/20";
      case "Pending": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Cancelled": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "Completed": return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default: return "text-white bg-gray-800 border-gray-700";
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 flex justify-between items-center bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-2xl">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Roster</p>
          <h1 className="text-3xl font-black text-white mt-1">Trek Reservations</h1>
        </div>
      </div>

      <div className="bg-[#111827] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">
        {loading ? (
           <div className="p-8 text-center text-gray-400">Syncing rosters...</div>
        ) : bookings.length === 0 ? (
           <div className="text-center py-16">
               <p className="text-5xl mb-4">👥</p>
               <h3 className="text-2xl font-black text-white">No Bookings Found</h3>
               <p className="text-gray-400 mt-2 max-w-sm mx-auto">
                 Once trekkers discover your scheduled dates, their reservations will appear here.
               </p>
           </div>
        ) : (
           <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                 <thead>
                    <tr className="bg-[#1A2235] text-xs uppercase tracking-widest font-black text-gray-400 border-b border-gray-800">
                       <th className="p-4 px-6">Trekker Name</th>
                       <th className="p-4">Trek Target</th>
                       <th className="p-4 font-mono">Seats Reserved</th>
                       <th className="p-4">Amount Due</th>
                       <th className="p-4">Booking Status</th>
                       <th className="p-4">Timestamp</th>
                       <th className="p-4 text-center">Actions</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-800">
                    {bookings.map((booking) => (
                       <tr key={booking._id} className="hover:bg-[#1A2235]/40 transition-colors">
                          <td className="p-4 px-6">
                             <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-[#0A0F1C] border border-[#AAFF00]/30 text-[#AAFF00] font-black flex justify-center items-center">
                                   {booking.user_id?.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                   <p className="text-white font-bold">{booking.user_id?.name || 'Anonymous'}</p>
                                   <p className="text-xs text-gray-500">{booking.user_id?.email}</p>
                                </div>
                             </div>
                          </td>
                          <td className="p-4">
                             <p className="text-white font-bold">{booking.trek_schedule_id?.trek_id?.trek_name || 'Removed Trek'}</p>
                             <p className="text-xs font-bold text-[#AAFF00] mt-0.5">
                               {booking.trek_schedule_id?.start_date ? new Date(booking.trek_schedule_id.start_date).toLocaleDateString() : 'No Date'}
                             </p>
                          </td>
                          <td className="p-4">
                              <span className="font-black text-xl text-white ml-6">{booking.seats}</span>
                           </td>
                           <td className="p-4 font-mono text-sm text-[#AAFF00]">
                              NPR {( (booking.trek_schedule_id?.trek_id?.cost || 0) * booking.seats ).toLocaleString()}
                           </td>
                          <td className="p-4">
                             <span className={`px-3 py-1 text-xs font-black uppercase tracking-widest rounded-full border ${getStatusColor(booking.booking_status)}`}>
                               {booking.booking_status}
                             </span>
                          </td>
                          <td className="p-4">
                             <p className="text-sm font-medium text-gray-400">{new Date(booking.createdAt).toLocaleString()}</p>
                          </td>
                           <td className="p-4 text-center">
                              <div className="flex flex-col gap-2">
                                 {booking.booking_status === "Pending" && (
                                    <span className="text-[10px] text-gray-500 italic font-bold">Waiting for Trekker...</span>
                                 )}
                                 
                                 {booking.booking_status === "Confirmed by Trekker" && (
                                    <button 
                                       onClick={() => handleStatusUpdate(booking._id, "Confirmed")}
                                       className="px-4 py-2 bg-[#AAFF00] text-black text-[10px] font-black uppercase rounded-lg hover:bg-white transition-all shadow-lg"
                                    >
                                       Confirm Roster
                                    </button>
                                 )}

                                 {booking.booking_status === "Confirmed" && (
                                    <div className="flex flex-col gap-1 text-center">
                                       <span className="text-[10px] text-blue-400 font-black uppercase">Confirmed</span>
                                       <button 
                                          onClick={() => handleStatusUpdate(booking._id, "Completed")}
                                          className="px-4 py-1 bg-blue-500 text-white text-[10px] font-black uppercase rounded hover:bg-blue-400 transition-all"
                                       >
                                          Complete
                                       </button>
                                    </div>
                                 )}

                                 {(booking.booking_status !== "Cancelled" && booking.booking_status !== "Completed") && (
                                    <button 
                                       onClick={() => handleStatusUpdate(booking._id, "Cancelled")}
                                       className="px-4 py-2 bg-red-500/10 border border-red-500/30 text-red-500 text-[10px] font-black uppercase rounded-lg hover:bg-red-500 hover:text-white transition-all"
                                    >
                                       Cancel
                                    </button>
                                 )}
                              </div>
                           </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>
        )}
      </div>

    </DashboardLayout>
  );
}

export default TrekBookings;
