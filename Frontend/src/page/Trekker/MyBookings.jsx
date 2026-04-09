import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks and Rides", icon: "🏔️", path: "/trekker/explore" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

function MyBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [activeType, setActiveType] = useState("All"); // "All", "Trek", "Ride"

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await API.get("/api/bookings/my");
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredBookings = () => {
    let filtered = bookings;
    
    // Filter by Type (Trek/Ride)
    if (activeType === "Trek") {
      filtered = filtered.filter(b => b.trek_schedule_id);
    } else if (activeType === "Ride") {
      filtered = filtered.filter(b => b.ride_id);
    }

    // Filter by Status (Current activeFilter system)
    if (activeFilter === "All") return filtered;
    return filtered.filter(booking =>
      booking.booking_status?.toLowerCase() === activeFilter.toLowerCase()
    );
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: { bg: "#F59E0B20", text: "#F59E0B", border: "#F59E0B40" },
      "confirmed by trekker": { bg: "#AAFF0020", text: "#AAFF00", border: "#AAFF0040" },
      confirmed: { bg: "#34D39920", text: "#34D399", border: "#34D39940" },
      cancelled: { bg: "#EF444420", text: "#EF4444", border: "#EF444440" },
      completed: { bg: "#60A5FA20", text: "#60A5FA", border: "#60A5FA40" }
    };
    return colors[status?.toLowerCase()] || colors.pending;
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    try {
      await API.put(`/api/bookings/${bookingId}/cancel`);
      alert("Booking cancelled successfully");
      fetchBookings(); // Refresh the list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel booking");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await API.patch(`/api/bookings/${id}/status`, { status });
      alert(`Booking ${status.toLowerCase()}!`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Status update failed");
    }
  };

  const filteredBookings = getFilteredBookings();

  if (loading) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="animate-spin text-6xl mb-4">⛰️</div>
            <p className="text-sm font-bold" style={{ color: "#9CA3AF" }}>
              Loading your bookings...
            </p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-5xl mb-4">⚠️</p>
          <p className="text-white font-bold mb-4">{error}</p>
          <button
            onClick={fetchBookings}
            className="px-6 py-2 rounded-md font-bold"
            style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
          >
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Bookings
        </p>
        <h1 className="text-3xl font-black text-white mt-1">My Bookings</h1>
        <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
          Showing {filteredBookings.length} bookings
        </p>
      </div>

      {/* TYPE FILTERS (Trek and Ride Buttons) */}
      <div className="flex gap-4 mb-8 p-1 rounded-2xl w-fit" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
        {["All", "Trek", "Ride"].map((type) => (
          <button
            key={type}
            onClick={() => setActiveType(type)}
            className="px-8 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all"
            style={{
              backgroundColor: activeType === type ? "#AAFF00" : "transparent",
              color: activeType === type ? "#0A0F1C" : "#9CA3AF"
            }}
          >
            {type === "All" ? "All Bookings" : type === "Trek" ? "Trek Bookings" : "Ride Bookings"}
          </button>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Pending", "Confirmed", "Cancelled", "Completed"].map((tab) => {
          const count = tab === "All"
            ? (activeType === "All" ? bookings.length : activeType === "Trek" ? bookings.filter(b => b.trek_schedule_id).length : bookings.filter(b => b.ride_id).length)
            : (activeType === "All" 
                ? bookings.filter(b => b.booking_status?.toLowerCase() === tab.toLowerCase()).length
                : activeType === "Trek" 
                  ? bookings.filter(b => b.trek_schedule_id && b.booking_status?.toLowerCase() === tab.toLowerCase()).length
                  : bookings.filter(b => b.ride_id && b.booking_status?.toLowerCase() === tab.toLowerCase()).length
              );

          return (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className="px-4 py-2 rounded-md text-sm font-semibold transition-all"
              style={{
                backgroundColor: tab === activeFilter ? "#AAFF00" : "#1A2235",
                color: tab === activeFilter ? "#0A0F1C" : "#9CA3AF",
                border: "1px solid #1F2937"
              }}
            >
              {tab} {count > 0 && `(${count})`}
            </button>
          );
        })}
      </div>

      {/* BOOKINGS LIST */}
      {filteredBookings.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <p className="text-5xl mb-4">📋</p>
          <p className="text-white font-bold text-xl">
            {activeFilter === "All" ? "No bookings yet!" : `No ${activeFilter.toLowerCase()} bookings`}
          </p>
          <p className="text-sm mt-2 mb-6" style={{ color: "#9CA3AF" }}>
            {activeFilter === "All"
              ? "Browse available treks and make your first booking"
              : "Try selecting a different filter"}
          </p>
          {activeFilter === "All" && (
            <button
               onClick={() => navigate("/trekker/explore")}
               className="px-6 py-2 rounded-md font-bold"
               style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              Browse Treks & Rides
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredBookings.map((booking) => {
            const statusColors = getStatusColor(booking.booking_status);

            return (
              <div
                key={booking._id}
                className="p-6 rounded-xl transition-all hover:shadow-lg"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-black text-white">
                      {booking.trek_schedule_id?.trek_id?.trek_name || booking.ride_id?.ride_name || "Unknown Item"}
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                      Booking ID: {booking._id?.slice(-8).toUpperCase()}
                    </p>
                  </div>
                  <span
                    className="px-3 py-1 rounded-full text-xs font-black uppercase"
                    style={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      border: `1px solid ${statusColors.border}`
                    }}
                  >
                    {booking.booking_status}
                  </span>
                </div>

                {/* Details Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "#0A0F1C" }}>
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                      Type
                    </p>
                    <p className="text-sm font-bold text-white mt-1">
                      {booking.trek_schedule_id ? "🗓️ Guided Trek" : "🚗 Transport"}
                    </p>
                  </div>

                  {booking.trek_schedule_id && (
                    <>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: "#0A0F1C" }}>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                          Start Date
                        </p>
                        <p className="text-sm font-bold text-white mt-1">
                          {new Date(booking.trek_schedule_id.start_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: "#0A0F1C" }}>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                          Guide
                        </p>
                        <p className="text-sm font-bold text-white mt-1">
                          {booking.trek_schedule_id.guide_id?.name || "TBD"}
                        </p>
                      </div>
                    </>
                  )}

                  {booking.ride_id && (
                    <>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: "#0A0F1C" }}>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                          Route
                        </p>
                        <p className="text-sm font-bold text-white mt-1">
                          {booking.ride_id.pickup_location} → {booking.ride_id.drop_location}
                        </p>
                      </div>
                      <div className="p-3 rounded-lg" style={{ backgroundColor: "#0A0F1C" }}>
                        <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                          Seats Booked
                        </p>
                        <p className="text-sm font-bold text-white mt-1">
                          {booking.seats || 1}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="p-3 rounded-lg" style={{ backgroundColor: "#0A0F1C" }}>
                    <p className="text-[0.6rem] font-bold uppercase tracking-wider" style={{ color: "#6B7280" }}>
                      Total Amount
                    </p>
                    <p className="text-sm font-bold mt-1" style={{ color: "#AAFF00" }}>
                      NPR {((booking.trek_schedule_id?.trek_id?.cost || booking.ride_id?.price || 0) * (booking.seats || 1)).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t" style={{ borderColor: "#1F2937" }}>
                  <button
                    onClick={() => navigate(`/trek/${booking.trek_schedule_id?.trek_id?._id || booking.ride_id?.trek_id}`)}
                    className="flex-1 py-2 rounded-md text-sm font-semibold"
            className="flex-1 py-2 rounded-md text-sm font-semibold"
                    style={{ border: "1px solid #1F2937", color: "#9CA3AF" }}
                  >
                    View Trek Details
                  </button>

                   {booking.booking_status?.toLowerCase() === "pending" && (
                     <>
                       <button
                         onClick={() => handleStatusUpdate(booking._id, "Confirmed by Trekker")}
                         className="px-6 py-2 rounded-md text-sm font-semibold"
                         style={{
                           backgroundColor: "#AAFF00",
                           color: "#0A0F1C"
                         }}
                       >
                         Confirm Booking
                       </button>
                       <button
                         onClick={() => handleCancelBooking(booking._id)}
                         className="px-6 py-2 rounded-md text-sm font-semibold"
                         style={{
                           backgroundColor: "#EF444420",
                           color: "#EF4444",
                           border: "1px solid #EF444440"
                         }}
                       >
                         Cancel Booking
                       </button>
                     </>
                   )}

                   {booking.booking_status === "Confirmed by Trekker" && (
                     <div className="flex-1 flex justify-between items-center bg-[#0A0F1C] p-2 rounded-lg border border-[#AAFF00]/20">
                        <p className="text-[10px] font-bold text-gray-500 italic">
                           ⏳ Awaiting Guide/Vendor Final Confirmation...
                        </p>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="px-3 py-1 rounded text-[10px] font-bold uppercase"
                          style={{
                            backgroundColor: "#EF444420",
                            color: "#EF4444",
                          }}
                        >
                          Withdraw
                        </button>
                     </div>
                   )}

                   {booking.booking_status === "Confirmed" && (
                     <div className="flex-1 flex justify-between items-center bg-[#AAFF00]/10 p-2 rounded-lg border border-[#AAFF00]/30">
                        <p className="text-[10px] font-black text-[#AAFF00] uppercase tracking-wider">
                           ✅ Reservation Secured! 
                        </p>
                        <button
                          className="px-6 py-2 rounded-md text-xs font-black uppercase tracking-widest transition-all hover:scale-105"
                          style={{
                            backgroundColor: "#AAFF00",
                            color: "#0A0F1C"
                          }}
                        >
                          💳 Pay NPR {((booking.trek_schedule_id?.trek_id?.cost || booking.ride_id?.price || 0) * (booking.seats || 1)).toLocaleString()}
                        </button>
                     </div>
                   )}

                </div>

                {/* Booking Date */}
                <p className="text-xs mt-3" style={{ color: "#4B5563" }}>
                  Booked on {new Date(booking.createdAt || booking.booking_date).toLocaleString()}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default MyBookings;