import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "All Users", icon: "👥", path: "/admin/users" },
  { label: "Browse Treks & Rides", icon: "🧭", path: "/admin/browse" },
  { label: "Manage Treks", icon: "🏔️", path: "/admin/treks" },
  { label: "Verifications", icon: "✅", path: "/admin/verify" },
  { label: "Disputes", icon: "⚠️", path: "/admin/disputes" },
];

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function AdminTreks() {
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      const res = await API.get("/api/treks");
      setTreks(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this trek?")) return;
    try {
      await API.delete(`/api/treks/${id}`); // Assuming delete route exists
      setTreks(treks.filter(t => t._id !== id));
      alert("Trek removed successfully");
    } catch (err) {
      alert("Failed to remove trek");
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>
          Platform Content
        </p>
        <h1 className="text-3xl font-black text-white mt-1">Manage Treks</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: "#AAFF00" }} className="font-bold">Loading treks...</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {treks.map((trek) => (
            <div key={trek._id} className="p-4 rounded-xl flex items-center justify-between" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
              <div className="flex items-center space-x-4">
                <img 
                  src={trek.image_url ? `${IMAGE_BASE_URL}${trek.image_url}` : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=200"} 
                  className="w-16 h-16 rounded-lg object-cover"
                  alt=""
                />
                <div>
                  <h3 className="text-white font-bold">{trek.trek_name}</h3>
                  <p className="text-xs text-gray-500 uppercase font-black">{trek.location} • {trek.duration_days} Days</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <button 
                  onClick={() => handleDelete(trek._id)}
                  className="px-4 py-2 rounded-md font-bold text-xs"
                  style={{ border: "1px solid #EF4444", color: "#EF4444" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default AdminTreks;
