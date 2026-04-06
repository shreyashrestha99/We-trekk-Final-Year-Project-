import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { Link, useNavigate } from "react-router-dom";
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

function ManageRides() {
  const [rides, setRides] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRides();
  }, []);

  const fetchRides = async () => {
    try {
      const res = await API.get("/api/rides/vendor");
      setRides(res.data);
    } catch (error) {
      console.error("Failed to fetch rides", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ride? This action cannot be undone unless bookings exist, which will block the deletion.")) return;
    
    try {
      await API.delete(`/api/rides/${id}`);
      setRides(rides.filter(r => r._id !== id));
      alert("Ride deleted successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete ride");
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Transport Management</p>
          <h1 className="text-3xl font-black text-white mt-1">My Rides</h1>
        </div>
        <Link to="/vendor/create-ride" className="px-5 py-2 rounded-md font-bold text-sm transition-colors border border-[#AAFF00] hover:bg-[#AAFF00] hover:text-[#0A0F1C] text-[#AAFF00]">
          + Create New Ride
        </Link>
      </div>

      {loading ? (
         <p className="text-white">Loading your fleet...</p>
      ) : rides.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
          <p className="text-5xl mb-4">🚙</p>
          <p className="text-white font-bold text-xl">No rides created yet!</p>
          <Link to="/vendor/create-ride" className="mt-4 inline-block px-6 py-2 rounded-md font-bold text-sm" style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}>
            Add Your First Ride
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {rides.map(ride => (
            <div key={ride._id} className="p-6 rounded-xl border border-gray-800" style={{ backgroundColor: "#1A2235" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-black text-white text-2xl mb-1">{ride.ride_name || "Shared Ride"}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p><strong className="text-white">Route:</strong> {ride.pickup_location || "TBD"} &rarr; {ride.drop_location}</p>
                    <p><strong className="text-white">Departure:</strong> {new Date(ride.departure_time).toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-right">
                   <span className="text-xl font-bold text-[#AAFF00]">Rs. {ride.price}</span>
                   <p className="text-xs text-gray-500">per seat</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-[#0A0F1C] p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500">Total Seats</p>
                    <p className="font-bold text-white text-lg">{ride.total_seats}</p>
                 </div>
                 <div className="bg-[#0A0F1C] p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500">Available</p>
                    <p className="font-bold text-[#AAFF00] text-lg">{ride.available_seats}</p>
                 </div>
                 <div className="bg-[#0A0F1C] p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500">Booked</p>
                    <p className="font-bold text-blue-400 text-lg">{ride.total_seats - ride.available_seats}</p>
                 </div>
                 <div className="bg-[#0A0F1C] p-3 rounded-lg border border-gray-800">
                    <p className="text-xs text-gray-500">Vehicle</p>
                    <p className="font-bold text-white text-lg">{ride.vehicle_type}</p>
                 </div>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-gray-800 pt-4 mt-2">
                <button 
                  onClick={() => navigate("/vendor/bookings")}
                  className="px-4 py-2 rounded-md font-bold text-sm bg-blue-900 text-blue-300 hover:bg-blue-800 transition-colors"
                >
                  View Bookings
                </button>
                {/* Edit functionality left as a simple alert placeholder for future implementation to adhere strictly to basic requirements */}
                <button 
                  onClick={() => navigate("/vendor/create-ride", { state: { editRide: ride } })}
                  className="px-4 py-2 rounded-md font-bold text-sm border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Edit Ride
                </button>
                <button 
                  onClick={() => handleDelete(ride._id)}
                  className="px-4 py-2 flex-grow md:flex-grow-0 rounded-md font-bold text-sm border border-red-900 text-red-500 hover:bg-red-900 transition-colors"
                >
                  Delete Ride
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageRides;
