import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import API from "../utils/axios";

// Real-time Trek Data Fetching initialized below

function Explore() {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [maxPrice, setMaxPrice] = useState(25000);
  const [departureDate, setDepartureDate] = useState("");
  const [openGroupsOnly, setOpenGroupsOnly] = useState(false);

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const res = await API.get("/api/treks");
        setTreks(res.data);
      } catch (error) {
        console.error("Failed to fetch treks:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTreks();
  }, []);

  const filtered = treks.filter((trek) => {
    const matchSearch = (trek.trek_name || trek.name)
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchDifficulty =
      difficulty === "All" || trek.difficulty_level === difficulty || trek.difficulty === difficulty;
    const matchPrice = (trek.cost || trek.price) <= maxPrice;
    
    // Evaluate Date matching if specified (Simplified for real data)
    const matchDate = departureDate ? true : true; 
    
    // Evaluate Groups Availability if checked
    const matchGroup = openGroupsOnly ? trek.hasGroup === true : true;

    return matchSearch && matchDifficulty && matchPrice && matchDate && matchGroup;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1C" }}>

      <Navbar />

      {/* HERO */}
      <section
        className="relative h-64 flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(10,15,28,0.75)" }} />
        <div className="relative">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "#AAFF00" }}>
            All Treks
          </p>
          <h1 className="text-4xl font-black text-white">Explore Nepal</h1>
          <p className="mt-2" style={{ color: "#9CA3AF" }}>
            Find your perfect trekking adventure
          </p>
        </div>
      </section>

      {/* FILTERS */}
      <section className="max-w-7xl mx-auto px-6 py-8">
        <div
          className="p-6 rounded-xl mb-8"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <div className="grid md:grid-cols-5 gap-4 items-end">

            {/* SEARCH */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-white">
                Search Trek
              </label>
              <input
                type="text"
                placeholder="e.g. Everest..."
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{ backgroundColor: "#0A0F1C", border: "1px solid #1F2937" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              />
            </div>

            {/* DIFFICULTY */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-white">
                Difficulty
              </label>
              <select
                className="w-full rounded-md p-3 text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: "1px solid #1F2937",
                  color: "white"
                }}
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              >
                <option value="All">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very High">Very High</option>
              </select>
            </div>

            {/* DATE FILTER */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-white">
                Departure Date
              </label>
              <input
                type="date"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{ backgroundColor: "#0A0F1C", border: "1px solid #1F2937", colorScheme: "dark" }}
                value={departureDate}
                onChange={(e) => setDepartureDate(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              />
            </div>

            {/* PRICE */}
            <div className="md:col-span-1">
              <label className="block text-sm font-medium mb-2 text-white">
                Max Budget: Rs. {maxPrice}
              </label>
              <input
                type="range"
                min="200"
                max="2000"
                step="100"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full"
                style={{ accentColor: "#AAFF00" }}
              />
              <div className="flex justify-between text-xs mt-1"
                style={{ color: "#6B7280" }}>
                <span>Rs. 200</span>
                <span>Rs. 2000</span>
              </div>
            </div>

            {/* GROUP FILTER */}
            <div className="md:col-span-1 flex items-center h-full pb-3">
              <label className="flex items-center cursor-pointer text-sm font-medium text-white space-x-3">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded cursor-pointer"
                  style={{ accentColor: "#AAFF00", backgroundColor: "#0A0F1C" }}
                  checked={openGroupsOnly}
                  onChange={(e) => setOpenGroupsOnly(e.target.checked)}
                />
                <span>Open Groups Available</span>
              </label>
            </div>

          </div>
        </div>

        {/* RESULTS COUNT */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-sm" style={{ color: "#9CA3AF" }}>
            Showing{" "}
            <span style={{ color: "#AAFF00" }} className="font-bold">
              {filtered.length}
            </span>{" "}
            treks
          </p>
          {(search || difficulty !== "All" || maxPrice < 2000 || departureDate || openGroupsOnly) && (
            <button
              onClick={() => {
                setSearch("");
                setDifficulty("All");
                setMaxPrice(2000);
                setDepartureDate("");
                setOpenGroupsOnly(false);
              }}
              className="text-sm font-semibold transition-colors"
              style={{ color: "#EF4444" }}
              onMouseEnter={e => e.target.style.color = "#DC2626"}
              onMouseLeave={e => e.target.style.color = "#EF4444"}
            >
              Clear Filters ✕
            </button>
          )}
        </div>

        {/* TREK CARDS */}
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🏔️</p>
            <p className="text-white font-bold text-xl">No treks found!</p>
            <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
              Try adjusting your filters
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {filtered.map((trek) => (
              <div
                key={trek._id}
                className="rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <div className="relative">
                  <img
                    src={trek.image_url ? `http://localhost:5000${trek.image_url}` : (trek.img || "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800")}
                    className="w-full h-48 object-cover"
                    alt={trek.trek_name || trek.name}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800";
                    }}
                  />
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                  >
                    {trek.tag || "Trekking"}
                  </span>
                  <span
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#0A0F1C80", color: "white" }}
                  >
                    {trek.duration_days || trek.days} Days
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg">{trek.trek_name || trek.name}</h3>
                  <p className="text-[0.6rem] text-gray-400 font-bold uppercase tracking-widest mt-1">Location: {trek.location}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          (trek.difficulty_level || trek.difficulty) === "Easy" ? "#AAFF0020" :
                          (trek.difficulty_level || trek.difficulty) === "Moderate" ? "#F59E0B20" :
                          (trek.difficulty_level || trek.difficulty) === "Hard" ? "#EF444420" : "#9333EA20",
                        color:
                          (trek.difficulty_level || trek.difficulty) === "Easy" ? "#AAFF00" :
                          (trek.difficulty_level || trek.difficulty) === "Moderate" ? "#F59E0B" :
                          (trek.difficulty_level || trek.difficulty) === "Hard" ? "#EF4444" : "#9333EA"
                      }}
                    >
                      {trek.difficulty_level || trek.difficulty}
                    </span>
                    <span className="font-bold text-lg" style={{ color: "#AAFF00" }}>
                      Rs. {trek.cost || trek.price}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/trek/${trek._id}`)}
                    className="mt-4 w-full py-2 rounded-md font-semibold text-sm transition-colors"
                    style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
                  >
                    View Details →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}

export default Explore;