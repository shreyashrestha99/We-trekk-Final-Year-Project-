import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import Navbar from "../components/Navbar";

function TrekDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trek, setTrek] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [rides, setRides] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    setLoading(true);
    try {
      // 1. Trek Details
      const trekRes = await API.get(`/api/treks/${id}`);
      setTrek(trekRes.data);

      // 2. Guide Schedules (Real-time Filter)
      const scheduleRes = await API.get("/api/schedules");
      const matchedSchedules = scheduleRes.data.filter(s => 
        (s.trek_id?._id || s.trek_id) === id
      );
      setSchedules(matchedSchedules);

      // 3. Vendor Rides (Using our new API filter)
      const rideRes = await API.get(`/api/rides?trek_id=${id}`);
      setRides(rideRes.data);

      // 4. Community Groups
      const groupRes = await API.get("/api/groups");
      const matchedGroups = groupRes.data.filter(g => 
        matchedSchedules.some(s => s._id === (g.schedule_id?._id || g.schedule_id))
      );
      setGroups(matchedGroups);

    } catch (error) {
      console.error("Failed to load trek details", error);
      // Fallback for demo if needed
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleBookRide = async (rideId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a ride.");
      navigate("/login");
      return;
    }

    const seats = prompt("How many seats do you want to book?", "1");
    if (!seats || isNaN(seats) || seats <= 0) return;

    try {
      await API.post(`/api/bookings/ride/${rideId}`, { seats: Number(seats) });
      alert(`Successfully booked ${seats} seat(s)!`);
      fetchDetails(); // Refresh to update available seats
    } catch (error) {
       alert(error.response?.data?.message || "Booking failed");
    }
  };

  const handleJoinGroup = async (groupId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Login required to join groups.");
      navigate("/login");
      return;
    }
    try {
      await API.post(`/api/groups/${groupId}/join`, { 
        needs_transport: false, 
        needs_accommodation: false, 
        needs_guide: false 
      });
      alert("Joined group successfully!");
      fetchDetails();
    } catch (error) {
       alert(error.response?.data?.message || "Failed to join group.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0F1C] text-[#AAFF00] font-black uppercase tracking-widest animate-pulse">
      Syncing Adventure Details...
    </div>
  );

  if (!trek) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0F1C] text-white">
      <h1 className="text-6xl font-black text-[#EF4444] mb-4">404</h1>
      <p className="text-gray-400 mb-8">Trek not discovered in our database.</p>
      <button onClick={() => navigate("/")} className="px-8 py-3 bg-[#AAFF00] text-black font-black uppercase text-xs rounded-xl">Back to Basecamp</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0A0F1C] text-white font-sans selection:bg-[#AAFF00] selection:text-black">
      <Navbar />

      {/* HERO SECTION */}
      <div className="relative h-[40vh] overflow-hidden border-b border-gray-800">
         <img 
            src={trek.image_url ? `http://localhost:5000${trek.image_url}` : "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2000"} 
            alt={trek.trek_name} 
            className="w-full h-full object-cover opacity-60"
         />
         <div className="absolute inset-0 bg-gradient-to-t from-[#0A0F1C] to-transparent"></div>
         <div className="absolute bottom-10 left-6 max-w-7xl mx-auto w-full px-6">
            <p className="text-[#AAFF00] font-black tracking-widest uppercase text-xs mb-2">Adventure Blueprint</p>
            <h1 className="text-6xl font-black uppercase tracking-tighter leading-none">{trek.trek_name}</h1>
            <div className="flex gap-4 mt-6">
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-[0.6rem] text-gray-400 font-bold uppercase">Difficulty</p>
                  <p className="text-sm font-black text-[#AAFF00]">{trek.difficulty_level}</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-[0.6rem] text-gray-400 font-bold uppercase">Duration</p>
                  <p className="text-sm font-black">{trek.duration_days} Days</p>
               </div>
               <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
                  <p className="text-[0.6rem] text-gray-400 font-bold uppercase">Base Price</p>
                  <p className="text-sm font-black">Rs. {trek.cost.toLocaleString()}</p>
               </div>
            </div>
         </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-12 gap-12">
        {/* LEFT: DESCRIPTION & SCHEDULES */}
        <div className="lg:col-span-7 space-y-12">
           <section>
              <h2 className="text-lg font-black text-white uppercase tracking-widest mb-4 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-[#AAFF00]/10 text-[#AAFF00] flex items-center justify-center text-xs">📜</span>
                 Expedition Brief
              </h2>
              <div className="bg-[#1A2235] p-8 rounded-2xl border border-gray-800 leading-relaxed text-gray-300 font-medium">
                 {trek.description || "No specific briefing available for this expedition."}
              </div>
           </section>

           <section>
              <h2 className="text-lg font-black text-[#AAFF00] uppercase tracking-widest mb-6 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-[#AAFF00]/10 text-[#AAFF00] flex items-center justify-center text-xs italic">📅</span>
                 Official Departures (Guides)
              </h2>
              {schedules.length === 0 ? (
                <div className="bg-gray-900/40 p-8 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 font-bold uppercase text-xs">
                   No official departures scheduled by guides yet.
                </div>
              ) : (
                <div className="grid gap-6">
                  {schedules.map(sch => (
                    <div key={sch._id} className="bg-[#1A2235] p-6 rounded-2xl border border-gray-800 hover:border-[#AAFF00]/30 transition-all group">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <p className="text-2xl font-black text-white">{new Date(sch.start_date).toLocaleDateString(undefined, {month: 'long', day: 'numeric', year: 'numeric'})}</p>
                             <p className="text-xs text-gray-500 font-bold uppercase mt-1">Expedition Launch</p>
                          </div>
                          <div className="text-right">
                             <span className="bg-[#AAFF00] text-black px-3 py-1 rounded-lg text-xs font-black uppercase">{sch.available_seats} Seats Open</span>
                          </div>
                       </div>
                       
                       <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800/50">
                          <div>
                             <p className="text-[0.6rem] text-gray-500 font-black uppercase tracking-widest">Assigned Guide</p>
                             <p className="text-sm font-bold text-white mt-1">{sch.guide_id?.name || "Professional Guide"}</p>
                          </div>
                          <div className="text-right">
                             <button 
                                onClick={() => navigate("/trekker/bookings", { state: { scheduleId: sch._id } })}
                                className="px-6 py-3 bg-[#AAFF00] text-black font-black uppercase text-[0.65rem] tracking-widest rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-xl shadow-[#AAFF00]/5"
                             >
                                Join Expedition
                             </button>
                          </div>
                       </div>
                    </div>
                  ))}
                </div>
              )}
           </section>
        </div>

        {/* RIGHT: RIDE SHARING & GROUPS */}
        <div className="lg:col-span-5 space-y-12">
           <section>
              <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center text-xs">🚙</span>
                 Vendor Logistics (Transports)
              </h2>
              {rides.length === 0 ? (
                <div className="bg-gray-900/40 p-8 rounded-2xl border border-dashed border-gray-800 text-center text-gray-500 font-bold uppercase text-xs">
                   No official transport slots listed by vendors.
                </div>
              ) : (
                <div className="grid gap-4">
                   {rides.map(ride => (
                      <div key={ride._id} className="bg-[#1A2235] p-5 rounded-2xl border border-gray-800 hover:border-blue-500/30 transition-all flex justify-between items-center group">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl shadow-inner">
                               🚗
                            </div>
                            <div>
                               <h3 className="text-sm font-black text-white uppercase leading-tight">{ride.ride_name}</h3>
                               <p className="text-[0.65rem] text-gray-500 font-bold uppercase tracking-tighter mt-0.5">{ride.pickup_location} → {ride.drop_location}</p>
                               <div className="flex items-center gap-2 mt-2">
                                  <span className="text-[0.6rem] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-black uppercase">Rs. {ride.price}</span>
                                  <span className="text-[0.6rem] text-gray-500 font-bold uppercase">{ride.available_seats} Seats Left</span>
                               </div>
                            </div>
                         </div>
                         <button 
                            onClick={() => handleBookRide(ride._id)}
                            className="bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white p-3 rounded-xl border border-blue-500/20 transition-all transform active:scale-90"
                            title="Book Ride"
                         >
                            ✨
                         </button>
                      </div>
                   ))}
                </div>
              )}
           </section>

           <section>
              <h2 className="text-lg font-black text-white uppercase tracking-widest mb-6 flex items-center gap-3">
                 <span className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center text-xs">👥</span>
                 Trekker Communities
              </h2>
              {groups.length === 0 ? (
                <div className="bg-[#AAFF00]/5 p-8 rounded-2xl border border-[#AAFF00]/10 text-center">
                   <p className="text-2xl mb-2 grayscale">🎒</p>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-widest leading-loose">No open communities found. Be the first to start a group after booking!</p>
                </div>
              ) : (
                <div className="grid gap-4">
                   {groups.map(grp => (
                      <div key={grp._id} className="bg-[#111827] p-6 rounded-2xl border border-gray-800 transition-all hover:bg-[#1A2235]">
                         <div className="flex justify-between items-center mb-4">
                            <h3 className="font-black text-white uppercase tracking-tight">{grp.group_name}</h3>
                            <span className="text-[0.6rem] bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full font-black uppercase">{grp.status}</span>
                         </div>
                         <div className="flex items-center justify-between text-xs text-gray-400 font-bold uppercase mb-4">
                            <span>{grp.current_members} / {grp.max_members} Members</span>
                            <span className="text-gray-600">|</span>
                            <span>{grp.meeting_point}</span>
                         </div>
                         <button 
                            onClick={() => handleJoinGroup(grp._id)}
                            className="w-full py-3 border border-purple-500/30 text-purple-400 font-black uppercase text-[0.6rem] tracking-widest rounded-xl hover:bg-purple-500 hover:text-white transition-all shadow-lg active:scale-95"
                         >
                            Join Community
                         </button>
                      </div>
                   ))}
                </div>
              )}
           </section>
        </div>
      </main>
    </div>
  );
}

export default TrekDetails;
