import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "My Treks", icon: "🏔️", path: "/vendor/treks" },
  { label: "My Rides", icon: "🚙", path: "/vendor/rides" },
  { label: "My Schedules", icon: "📅", path: "/vendor/schedules" },
  { label: "My Groups", icon: "👥", path: "/vendor/groups" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "My Profile", icon: "👤", path: "/vendor/profile" },
];

function ManageSchedules() {
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState([]);
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    trek_id: "",
    start_date: "",
    end_date: "",
    available_seats: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [schedRes, treksRes] = await Promise.all([
        API.get("/api/schedules/vendor/my-schedules"),
        API.get("/api/treks")
      ]);
      setSchedules(schedRes.data);
      setTreks(treksRes.data);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.trek_id || !form.start_date || !form.end_date || !form.available_seats) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const res = await API.post("/api/schedules", form);
      // Populate trek visually locally safely
      const fullTrek = treks.find(t => t._id === form.trek_id);
      const newSchedule = { ...res.data, trek_id: fullTrek };
      
      setSchedules([...schedules, newSchedule]);
      setForm({ trek_id: "", start_date: "", end_date: "", available_seats: "" });
      setShowForm(false);
      alert("Schedule created successfully!");
    } catch (error) {
      alert("Failed to create schedule. Make sure dates are valid.");
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Timeline Management</p>
          <h1 className="text-3xl font-black text-white mt-1">My Schedules</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-md font-bold text-sm" style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}>
          + Create Schedule
        </button>
      </div>

      {showForm && (
        <div className="p-6 rounded-xl mb-6" style={{ backgroundColor: "#1A2235", border: "1px solid #AAFF00" }}>
          <h2 className="text-lg font-bold text-white mb-4">Create New Departure Schedule</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-white">Select Attached Trek</label>
              <select 
                className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" 
                value={form.trek_id} 
                onChange={e => setForm({ ...form, trek_id: e.target.value })}
              >
                <option value="">-- Choose a Trek --</option>
                {treks.map(trek => (
                  <option key={trek._id} value={trek._id}>{trek.trek_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Start Date</label>
              <input type="date" className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.start_date} onChange={e => setForm({ ...form, start_date: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">End Date</label>
              <input type="date" className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.end_date} onChange={e => setForm({ ...form, end_date: e.target.value })} />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">Available Seats</label>
              <input type="number" placeholder="15" className="w-full rounded-md p-3 text-sm outline-none bg-[#0A0F1C] border border-[#1F2937] text-white" value={form.available_seats} onChange={e => setForm({ ...form, available_seats: e.target.value })} />
            </div>

            <div className="md:col-span-2 flex space-x-3 mt-4">
              <button type="submit" className="px-6 py-2 rounded-md font-bold text-sm" style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}>Save Schedule</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 rounded-md font-bold text-sm text-gray-400 border border-gray-600">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
         <p className="text-white">Loading schedules...</p>
      ) : schedules.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
          <p className="text-5xl mb-4">📅</p>
          <p className="text-white font-bold text-xl">No schedules assigned.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {schedules.map(sch => (
            <div key={sch._id} className="p-5 rounded-xl border border-gray-800" style={{ backgroundColor: "#1A2235" }}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-white text-lg">{sch.trek_id?.trek_name || 'Trek Info Missing'}</h3>
                <span className="text-sm px-2 py-1 bg-green-900 text-green-300 rounded font-bold">
                  {sch.available_seats} Seats
                </span>
              </div>
              <p className="text-sm text-gray-400">Departing: {new Date(sch.start_date).toLocaleDateString()}</p>
              <p className="text-sm text-gray-400">Returning: {new Date(sch.end_date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageSchedules;
