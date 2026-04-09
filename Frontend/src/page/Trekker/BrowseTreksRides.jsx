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

const IMAGE_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function BrowseTreksRides() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Treks"); // "Treks" or "Rides"
  const [difficulty, setDifficulty] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "Treks") {
        const res = await API.get("/api/treks");
        setItems(res.data);
      } else {
        const res = await API.get("/api/rides");
        setItems(res.data);
      }
    } catch (error) {
      console.error(`Failed to fetch ${activeTab.toLowerCase()}:`, error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = items.filter((item) => {
    const itemName = activeTab === "Treks" ? (item.trek_name || item.name) : (item.ride_name || "Shared Ride");
    const matchSearch = itemName.toLowerCase().includes(search.toLowerCase());
    
    if (activeTab === "Treks") {
      const matchDifficulty = difficulty === "All" || item.difficulty_level === difficulty;
      const matchPrice = (item.cost || 0) <= maxPrice;
      return matchSearch && matchDifficulty && matchPrice;
    } else {
      const matchPrice = (item.price || 0) <= maxPrice;
      return matchSearch && matchPrice;
    }
  });

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>
          Exploration
        </p>
        <h1 className="text-3xl font-black text-white mt-1">Browse {activeTab}</h1>
      </div>

      {/* TABS */}
      <div className="flex gap-4 mb-8">
        {["Treks", "Rides"].map((tab) => (
          <button
            key={tab}
            onClick={() => {
                setActiveTab(tab);
                setSearch("");
                setDifficulty("All");
                setMaxPrice(tab === "Treks" ? 25000 : 5000);
            }}
            className="px-6 py-2 rounded-xl font-black uppercase text-xs tracking-widest transition-all"
            style={{
              backgroundColor: activeTab === tab ? "#AAFF00" : "#1A2235",
              color: activeTab === tab ? "#0A0F1C" : "#9CA3AF",
              border: `1px solid ${activeTab === tab ? "#AAFF00" : "#1F2937"}`
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* FILTERS */}
      <div className="p-6 rounded-2xl mb-8" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
        <div className="grid md:grid-cols-3 gap-6 items-end">
          <div>
            <label className="block text-[0.6rem] font-bold uppercase tracking-widest mb-2 text-gray-500">
              Search {activeTab}
            </label>
            <input
              type="text"
              placeholder={`Search by name...`}
              className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#AAFF00] transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {activeTab === "Treks" && (
            <div>
              <label className="block text-[0.6rem] font-bold uppercase tracking-widest mb-2 text-gray-500">
                Difficulty
              </label>
              <select
                className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-[#AAFF00] appearance-none"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Moderate">Moderate</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-[0.6rem] font-bold uppercase tracking-widest mb-2 text-gray-500">
              Max Budget: NPR {maxPrice.toLocaleString()}
            </label>
            <input
              type="range"
              min="500"
              max={activeTab === "Treks" ? 50000 : 10000}
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[#AAFF00]"
            />
          </div>
        </div>
      </div>

      {/* RESULTS */}
      {loading ? (
        <div className="py-20 text-center animate-pulse">
          <p className="text-[#AAFF00] font-black uppercase tracking-widest text-xs">Syncing Adventure Data...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center bg-[#1A2235]/50 rounded-2xl border border-dashed border-gray-800">
          <p className="text-4xl mb-4">🔍</p>
          <p className="text-white font-bold">No {activeTab.toLowerCase()} found!</p>
          <p className="text-xs text-gray-600 mt-2 uppercase font-black">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-[#1A2235] rounded-2xl border border-gray-800 overflow-hidden hover:border-[#AAFF00]/50 transition-all group pointer-events-auto"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image_url ? `${IMAGE_BASE_URL}${item.image_url}` : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  alt={activeTab === "Treks" ? item.trek_name : item.ride_name}
                />
                <div className="absolute top-3 right-3">
                    <span className="bg-[#0A0F1C]/80 backdrop-blur-md px-3 py-1 rounded-full text-[0.6rem] font-black uppercase text-white border border-white/10">
                        {activeTab === "Treks" ? `${item.duration_days} Days` : item.vehicle_type || "Jeep"}
                    </span>
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-white text-lg uppercase leading-tight">
                        {activeTab === "Treks" ? item.trek_name : item.ride_name}
                    </h3>
                </div>
                
                <p className="text-[0.6rem] text-gray-500 font-black uppercase tracking-tighter mb-4">
                    {activeTab === "Treks" ? `📍 ${item.location}` : `📍 ${item.pickup_location} → ${item.drop_location}`}
                </p>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <div className="flex flex-col">
                    <span className="text-[0.6rem] text-gray-600 font-bold uppercase">Price Starting At</span>
                    <span className="text-[#AAFF00] font-black">NPR {activeTab === "Treks" ? item.cost?.toLocaleString() : item.price?.toLocaleString()}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/trek/${activeTab === "Treks" ? item._id : item.trek_id?._id || item.trek_id}`)}
                    className="bg-[#AAFF00] text-black px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg shadow-[#AAFF00]/10"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default BrowseTreksRides;
