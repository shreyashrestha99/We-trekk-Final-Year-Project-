import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainHome() {
  const navigate = useNavigate();
  const [dbTreks, setDbTreks] = useState([]);
  const [publicRides, setPublicRides] = useState([]);

  useEffect(() => {
    API.get("/api/treks")
      .then(res => setDbTreks(res.data))
      .catch(err => console.error(err));

    API.get("/api/rides")
      .then(res => setPublicRides(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleBookRide = async (rideId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login as a Trekker to book a ride.");
      navigate("/login");
      return;
    }
    
    try {
      await API.post(`/api/bookings/ride/${rideId}`, { seats: 1 });
      alert("Ride booked successfully!");
      const res = await API.get("/api/rides");
      setPublicRides(res.data);
    } catch (error) {
       alert(error.response?.data?.message || "Failed to book ride (Only Trekkers can book)");
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0A0F1C" }}>

      <Navbar />

      {/* HERO */}
      <section
        className="relative h-screen flex items-center justify-center text-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: "rgba(10,15,28,0.7)" }}></div>

        <div className="relative text-white px-4">
          <p className="text-sm font-semibold mb-4 tracking-widest uppercase"
            style={{ color: "#AAFF00" }}>
            Nepal's #1 Trek Platform
          </p>
          <h1 className="text-6xl md:text-8xl font-black uppercase leading-none">
            WETREKK
          </h1>
          <p className="mt-4 text-xl" style={{ color: "#9CA3AF" }}>
            Discover. Connect. Trek.
          </p>
          <p className="mt-2 text-lg max-w-2xl mx-auto" style={{ color: "#9CA3AF" }}>
            Find verified guides, join groups and book treks across Nepal
          </p>

          <div className="mt-8 space-x-4">
            <button
              onClick={() => navigate("/explore")}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
            >
              Explore Treks
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-8 py-3 rounded-md font-bold text-lg transition-colors"
              style={{ border: "2px solid #AAFF00", color: "#AAFF00", backgroundColor: "transparent" }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#AAFF00" + "20"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* TOP TREKKING PLACES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#AAFF00" }}>
              Popular Routes
            </p>
            <h2 className="text-3xl font-bold text-white">
              Top Trekking Places
            </h2>
          </div>
          <button
            onClick={() => navigate("/explore")}
            className="px-4 py-2 rounded-md text-sm font-semibold"
            style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
          >
            View All →
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {(dbTreks.length > 0 ? dbTreks.slice(0, 3) : [
            {
              trek_name: "Annapurna Base Camp",
              difficulty_level: "Hard",
              cost: 15000,
              duration_days: 14,
              image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800",
              _id: "annapurna"
            },
            {
              trek_name: "Everest Base Camp",
              difficulty_level: "Hard",
              cost: 18000,
              duration_days: 16,
              image_url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800",
              _id: "everest"
            },
            {
              trek_name: "Gosaikunda Trek",
              difficulty_level: "Moderate",
              cost: 8000,
              duration_days: 7,
              image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800",
              _id: "gosaikunda"
            }
          ]).map((trek) => (
            <div
              key={trek.name}
              className="rounded-xl overflow-hidden transition-transform hover:-translate-y-1"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div className="relative">
                <img
                  src={trek.image_url ? `http://localhost:5000${trek.image_url}` : "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2000"} 
                  className="w-full h-48 object-cover"
                  alt={trek.trek_name}
                />
                <span
                  className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                >
                  {trek.difficulty_level || "Adventure"}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-bold text-white text-lg">{trek.trek_name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm" style={{ color: "#9CA3AF" }}>
                    {trek.duration_days} Days
                  </span>
                  <span className="font-bold" style={{ color: "#AAFF00" }}>
                    Rs. {trek.cost}
                  </span>
                </div>
                <button
                  onClick={() => navigate(`/trek/${trek._id}`)}
                  className="mt-4 w-full py-2 rounded-md font-semibold text-sm transition-colors"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PUBLIC RIDES SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-widest uppercase mb-2"
            style={{ color: "#AAFF00" }}>
            Hassle-free traveling
          </p>
          <h2 className="text-3xl font-bold text-white">Shared Rides</h2>
        </div>

        {publicRides.length === 0 ? (
          <div className="p-8 text-center rounded-xl" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
             <p className="text-gray-400">No shared rides available right now. Check back later!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {publicRides.map((ride) => (
              <div key={ride._id} className="p-6 rounded-xl relative" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-xl text-white">{ride.destination}</h3>
                    <p className="text-sm text-gray-400">{ride.vehicle_type} by {ride.vendor_id?.name || "Vendor"}</p>
                  </div>
                  <span className="text-[#AAFF00] font-bold">Rs. {ride.price}</span>
                </div>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="w-6 text-center">📅</span> {new Date(ride.departure_time).toLocaleString()}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <span className="w-6 text-center">💺</span> {ride.available_seats} Seats Available
                  </div>
                </div>

                <button
                  onClick={() => handleBookRide(ride._id)}
                  className="w-full py-2 rounded-md font-bold text-sm transition-colors"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
                >
                  Book 1 Seat
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* WHY WETREKK */}
      <section className="py-16" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#AAFF00" }}>
              Why Us
            </p>
            <h2 className="text-3xl font-bold text-white">
              Why Choose WeTrekk?
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "Verified Guides", desc: "All guides are licensed and verified by NTB", icon: "✓" },
              { title: "Group Coordination", desc: "Join or create trek groups easily", icon: "👥" },
              { title: "Safety First", desc: "Real-time seat tracking and safety protocols", icon: "🛡" },
              { title: "Expense Tracking", desc: "Track and split expenses with your group", icon: "💰" }
            ].map((item) => (
              <div
                key={item.title}
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-white mb-2">{item.title}</h3>
                <p className="text-sm" style={{ color: "#9CA3AF" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MORE ADVENTURES */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <p className="text-sm font-semibold tracking-widest uppercase mb-2"
              style={{ color: "#AAFF00" }}>
              More Routes
            </p>
            <h2 className="text-3xl font-bold text-white">More Adventures</h2>
          </div>
          <div className="flex space-x-4 items-center">
            <div className="flex space-x-2">
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z" />
                </svg>
              </button>
              <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-600 hover:border-[#AAFF00] hover:text-[#AAFF00] transition-colors text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" />
                </svg>
              </button>
            </div>
            <button
              onClick={() => navigate("/explore")}
              className="px-4 py-2 rounded-md text-sm font-semibold"
              style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
            >
              See More →
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { trek_name: "Gosaikunda Trek", duration_days: 7, _id: "gosaikunda", image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800" },
            { trek_name: "Mardi Himal", duration_days: 5, _id: "mardi", image_url: "https://images.unsplash.com/photo-1517824806704-9040b037703b?q=80&w=800" },
            { trek_name: "Manaslu Circuit", duration_days: 14, _id: "manaslu", image_url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800" }
          ].map((trek) => (
            <div
              key={trek._id}
              className="p-6 rounded-xl flex justify-between items-center"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                  <img src={trek.image_url} alt={trek.trek_name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">{trek.trek_name}</h3>
                  <span className="text-[0.7rem] font-bold" style={{ color: "#AAFF00" }}>{trek.duration_days} Days</span>
                </div>
              </div>
              <button
                onClick={() => navigate(`/trek/${trek._id}`)}
                className="px-4 py-2 rounded-md text-sm font-semibold whitespace-nowrap"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = "#88CC00"}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = "#AAFF00"}
              >
                Explore →
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section className="py-16" style={{ backgroundColor: "#111827" }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              { number: "500+", label: "Verified Guides" },
              { number: "1000+", label: "Happy Trekkers" },
              { number: "50+", label: "Trek Routes" },
              { number: "98%", label: "Success Rate" }
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black" style={{ color: "#AAFF00" }}>
                  {stat.number}
                </p>
                <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default MainHome;