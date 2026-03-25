import { useState } from "react";
import { useNavigate } from "react-router-dom";

const treks = [
  {
    name: "Annapurna Circuit",
    tag: "Adventure",
    difficulty: "Hard",
    price: 800,
    days: 15,
    slug: "annapurna",
    img: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800"
  },
  {
    name: "Everest Base Camp",
    tag: "Challenging",
    difficulty: "Very High",
    price: 1200,
    days: 14,
    slug: "everest",
    img: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800"
  },
  {
    name: "Langtang Valley",
    tag: "Moderate",
    difficulty: "Medium",
    price: 600,
    days: 10,
    slug: "langtang",
    img: "https://images.unsplash.com/photo-1585016495481-91585a7c68f9?q=80&w=800"
  },
  {
    name: "Gosaikunda Trek",
    tag: "Adventure",
    difficulty: "Medium",
    price: 500,
    days: 7,
    slug: "gosaikunda",
    img: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800"
  },
  {
    name: "Mardi Himal",
    tag: "Moderate",
    difficulty: "Medium",
    price: 450,
    days: 5,
    slug: "mardi",
    img: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800"
  },
  {
    name: "Manaslu Circuit",
    tag: "Challenging",
    difficulty: "Hard",
    price: 1000,
    days: 14,
    slug: "manaslu",
    img: "https://images.unsplash.com/photo-1486911278844-a81c5267e227?q=80&w=800"
  },
  {
    name: "Upper Mustang",
    tag: "Adventure",
    difficulty: "Medium",
    price: 1500,
    days: 12,
    slug: "mustang",
    img: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800"
  },
  {
    name: "Kanchenjunga Trek",
    tag: "Challenging",
    difficulty: "Very High",
    price: 1800,
    days: 20,
    slug: "kanchenjunga",
    img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=800"
  },
  {
    name: "Gokyo Lakes",
    tag: "Adventure",
    difficulty: "Hard",
    price: 900,
    days: 12,
    slug: "gokyo",
    img: "https://images.unsplash.com/photo-1490730141103-6cac27bbe693?q=80&w=800"
  }
];

function Explore() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("All");
  const [maxPrice, setMaxPrice] = useState(2000);

  const filtered = treks.filter((trek) => {
    const matchSearch = trek.name
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchDifficulty =
      difficulty === "All" || trek.difficulty === difficulty;
    const matchPrice = trek.price <= maxPrice;
    return matchSearch && matchDifficulty && matchPrice;
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1C" }}>

      {/* HEADER */}
      <header style={{ backgroundColor: "#0A0F1C", borderBottom: "1px solid #1F2937" }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div
            className="text-2xl font-black cursor-pointer"
            style={{ color: "#AAFF00" }}
            onClick={() => navigate("/")}
          >
            WeTrekk
          </div>
          <nav className="hidden md:flex space-x-6 text-sm">
            {[
              { label: "Home", path: "/" },
              { label: "Explore", path: "/explore" },
              { label: "Contact Us", path: "/contact" },
              { label: "About Us", path: "/about" }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="transition-colors"
                style={{ color: item.path === "/explore" ? "#AAFF00" : "#9CA3AF" }}
              >
                {item.label}
              </button>
            ))}
          </nav>
          <div className="space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm rounded-md"
              style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-sm rounded-md font-semibold"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              Join Now
            </button>
          </div>
        </div>
      </header>

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
          <div className="grid md:grid-cols-3 gap-4">

            {/* SEARCH */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Search Trek
              </label>
              <input
                type="text"
                placeholder="e.g. Everest, Annapurna..."
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{ backgroundColor: "#0A0F1C", border: "1px solid #1F2937" }}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              />
            </div>

            {/* DIFFICULTY */}
            <div>
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

            {/* PRICE */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Max Budget: ${maxPrice}
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
                <span>$200</span>
                <span>$2000</span>
              </div>
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
          {(search || difficulty !== "All" || maxPrice < 2000) && (
            <button
              onClick={() => {
                setSearch("");
                setDifficulty("All");
                setMaxPrice(2000);
              }}
              className="text-sm font-semibold"
              style={{ color: "#EF4444" }}
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
                key={trek.slug}
                className="rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <div className="relative">
                  <img
                    src={trek.img}
                    className="w-full h-48 object-cover"
                    alt={trek.name}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800";
                    }}
                  />
                  <span
                    className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                  >
                    {trek.tag}
                  </span>
                  <span
                    className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold"
                    style={{ backgroundColor: "#0A0F1C80", color: "white" }}
                  >
                    {trek.days} Days
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-white text-lg">{trek.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span
                      className="text-xs px-2 py-1 rounded-full"
                      style={{
                        backgroundColor:
                          trek.difficulty === "Easy" ? "#AAFF0020" :
                          trek.difficulty === "Medium" ? "#F59E0B20" :
                          trek.difficulty === "Hard" ? "#EF444420" : "#9333EA20",
                        color:
                          trek.difficulty === "Easy" ? "#AAFF00" :
                          trek.difficulty === "Medium" ? "#F59E0B" :
                          trek.difficulty === "Hard" ? "#EF4444" : "#9333EA"
                      }}
                    >
                      {trek.difficulty}
                    </span>
                    <span className="font-bold text-lg" style={{ color: "#AAFF00" }}>
                      ${trek.price}
                    </span>
                  </div>
                  <button
                    onClick={() => navigate(`/trek/${trek.slug}`)}
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

      {/* FOOTER */}
      <footer style={{ backgroundColor: "#0A0F1C", borderTop: "1px solid #1F2937" }}
        className="mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center">
          <p className="text-sm" style={{ color: "#6B7280" }}>
            © 2025 WeTrekk. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Explore;