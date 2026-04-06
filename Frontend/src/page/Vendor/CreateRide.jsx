import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { useAuth } from "../../context/AuthContext";
import API from "../../utils/axios";
import { useNavigate, useLocation } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "Create Ride", icon: "➕", path: "/vendor/create-ride" },
  { label: "My Rides", icon: "🚙", path: "/vendor/rides" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "Notifications", icon: "🔔", path: "/vendor/notifications" },
  { label: "Profile", icon: "👤", path: "/vendor/profile" },
];

function CreateRide() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const editRide = location.state?.editRide;

  const [formData, setFormData] = useState({
    ride_name: "",
    pickup_location: "",
    drop_location: "",
    departure_time: "",
    total_seats: "",
    price: "",
    trek_id: "",
    vehicle_type: "Jeep"
  });

  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTreks();
    if (editRide) {
      // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
      const date = new Date(editRide.departure_time);
      const formattedDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000))
        .toISOString()
        .slice(0, 16);

      setFormData({
        ride_name: editRide.ride_name || "",
        pickup_location: editRide.pickup_location || "",
        drop_location: editRide.drop_location || "",
        departure_time: formattedDate,
        total_seats: editRide.total_seats || "",
        price: editRide.price || "",
        trek_id: editRide.trek_id?._id || editRide.trek_id || "",
        vehicle_type: editRide.vehicle_type || "Jeep"
      });
    }
  }, [editRide]);

  const fetchTreks = async () => {
    try {
      const res = await API.get("/api/treks");
      setTreks(res.data);
    } catch (error) {
      console.error("Failed to load treks", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        total_seats: Number(formData.total_seats),
        price: Number(formData.price)
      };

      if (!payload.trek_id) delete payload.trek_id;

      if (editRide) {
         await API.put(`/api/rides/${editRide._id}`, payload);
         alert("Ride updated successfully!");
      } else {
         await API.post("/api/rides", payload);
         alert("Ride created successfully!");
      }
      navigate("/vendor/rides");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save ride");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>
          Fleet Management
        </p>
        <h1 className="text-3xl font-black text-white mt-1">
          {editRide ? "Edit Transportation" : "Create New Ride"}
        </h1>
      </div>

      <div className="bg-[#1A2235] border border-gray-800 rounded-xl p-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-white">Ride Name</label>
              <input 
                type="text" 
                name="ride_name"
                required
                className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                style={{ backgroundColor: "#0A0F1C" }}
                value={formData.ride_name}
                onChange={handleChange}
                placeholder="e.g. Kathmandu to Syabrubesi Shared Jeep"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Pickup Location</label>
              <input 
                type="text" 
                name="pickup_location"
                required
                className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                style={{ backgroundColor: "#0A0F1C" }}
                value={formData.pickup_location}
                onChange={handleChange}
                placeholder="Where does the ride start?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Drop Location</label>
              <input 
                type="text" 
                name="drop_location"
                required
                className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                style={{ backgroundColor: "#0A0F1C" }}
                value={formData.drop_location}
                onChange={handleChange}
                placeholder="Where does the ride end?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Departure Date & Time</label>
              <input 
                type="datetime-local" 
                name="departure_time"
                required
                className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                style={{ backgroundColor: "#0A0F1C" }}
                value={formData.departure_time}
                onChange={handleChange}
              />
            </div>

            <div>
               <label className="block text-sm font-medium mb-2 text-white">Link to Trek (Optional)</label>
               <select
                 name="trek_id"
                 className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                 style={{ backgroundColor: "#0A0F1C" }}
                 value={formData.trek_id}
                 onChange={handleChange}
               >
                 <option value="">-- No linked trek --</option>
                 {treks.map(t => (
                   <option key={t._id} value={t._id}>{t.trek_name}</option>
                 ))}
               </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Total Seats Available</label>
              <input 
                type="number" 
                name="total_seats"
                min="1"
                required
                className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                style={{ backgroundColor: "#0A0F1C" }}
                value={formData.total_seats}
                onChange={handleChange}
                placeholder="e.g. 7"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Price Per Seat (Rs)</label>
              <input 
                type="number" 
                name="price"
                min="0"
                required
                className="w-full rounded-md p-3 text-white text-sm outline-none transition-colors border-gray-800 border focus:border-[#AAFF00]"
                style={{ backgroundColor: "#0A0F1C" }}
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 1500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-800 flex justify-end">
            <button 
              type="submit" 
              disabled={loading}
              className="px-8 py-3 rounded-md font-bold text-[#0A0F1C] transition-colors uppercase tracking-widest text-xs"
              style={{ backgroundColor: loading ? "#6B7280" : "#AAFF00" }}
            >
              {loading ? "Saving..." : (editRide ? "Update Ride" : "Create Ride")}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default CreateRide;
