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

function ManageBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get("/api/bookings/vendor/my-bookings");
      setBookings(res.data);
    } catch (error) {
      console.error("Failed to load bookings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Client Logistics</p>
          <h1 className="text-3xl font-black text-white mt-1">Ride Reservations</h1>
        </div>
      </div>

      {loading ? (
         <p className="text-white">Loading incoming bookings...</p>
      ) : bookings.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
          <p className="text-5xl mb-4">📋</p>
          <p className="text-white font-bold text-xl">No incoming bookings yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-gray-800">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-[#1A2235] text-xs uppercase text-gray-400">
              <tr>
                <th className="px-6 py-4 border-b border-gray-800">Date Logged</th>
                <th className="px-6 py-4 border-b border-gray-800">Passenger Info</th>
                <th className="px-6 py-4 border-b border-gray-800">Ride Details</th>
                <th className="px-6 py-4 border-b border-gray-800">Seats</th>
                <th className="px-6 py-4 border-b border-gray-800">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, idx) => (
                <tr key={booking._id} className={idx % 2 === 0 ? "bg-[#0A0F1C]" : "bg-[#111827]"}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(booking.booking_date || booking.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 font-bold text-white whitespace-nowrap">
                    {booking.user_id?.name || "Unknown User"}
                    <span className="block text-xs font-normal text-gray-500">{booking.user_id?.email || ""}</span>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className="font-bold text-[#AAFF00] text-sm block mb-1">{booking.ride_id?.ride_name}</span>
                    Departure: {new Date(booking.ride_id?.departure_time).toLocaleString()}<br/>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-lg">
                    {booking.seats}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      booking.booking_status === "Confirmed" ? "bg-green-900 text-green-300" :
                      booking.booking_status === "Cancelled" ? "bg-red-900 text-red-300" :
                      "bg-yellow-900 text-yellow-300"
                    }`}>
                      {booking.booking_status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageBookings;
