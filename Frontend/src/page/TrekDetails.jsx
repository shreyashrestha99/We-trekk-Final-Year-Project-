import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/axios";
import { mockTreks } from "../data/treksData";
import Navbar from "../components/Navbar";

function TrekDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [trek, setTrek] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      // 1. Fetch specific trek details
      try {
        const trekRes = await API.get(`/api/treks/${id}`);
        setTrek(trekRes.data);

        // 2. Fetch schedules matched to this trek
        const scheduleRes = await API.get("/api/schedules");
        const matchedSchedules = scheduleRes.data.filter(s => 
          (s.trek_id?._id || s.trek_id) === id
        );
        setSchedules(matchedSchedules);

        // 3. Fetch groups (Optional matching logic)
        const groupRes = await API.get("/api/groups");
        const matchedGroups = groupRes.data.filter(g => 
          matchedSchedules.some(s => s._id === (g.schedule_id?._id || g.schedule_id))
        );
        setGroups(matchedGroups);

        setLoading(false);
      } catch (error) {
        console.error("Project-level Data Fetch Failed:", error);
        
        // MOCK FALLBACK for missing IDs or offline testing
        if (id === "annapurna" || id === "everest" || id === "langtang" || id.length < 5) {
          setTrek({
            trek_name: id.toUpperCase() + " ADVENTURE",
            difficulty_level: "Hard",
            cost: 15000,
            duration_days: 14,
            description: "Default mock details displayed because the API returned an error or ID was a slug.",
            image_url: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?q=80&w=800"
          });
          setLoading(false);
        } else {
          setLoading(false);
        }
      }
    };
    fetchDetails();
  }, [id]);

  const handleJoinGroup = async (groupId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Group Joining requires Login. Please sign in as a Trekker.");
      navigate("/login");
      return;
    }
    try {
      await API.post(`/api/groups/${groupId}/join`, { 
        needs_transport: false, 
        needs_accommodation: false, 
        needs_guide: false 
      });
      alert("Successfully joined the group!");
      
      // Refresh groups visually by incrementing member count on success
      setGroups(groups.map(g => {
        if (g._id === groupId) {
          return { ...g, current_members: g.current_members + 1 };
        }
        return g;
      }));
    } catch (error) {
       alert(error.response?.data?.message || "Failed to join group.");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center font-sans" style={{ backgroundColor: "#0A0F1C", color: "white" }}>
      <p className="text-xl font-bold" style={{ color: "#AAFF00" }}>Loading Trek Details...</p>
    </div>
  );
  
  if (!trek) return (
    <div className="min-h-screen flex flex-col items-center justify-center font-sans" style={{ backgroundColor: "#0A0F1C", color: "white" }}>
      <h2 className="text-4xl font-black mb-4" style={{ color: "#EF4444" }}>404</h2>
      <p className="text-xl mb-6 text-gray-300">We couldn't find the trek you're looking for.</p>
      <button 
        onClick={() => navigate("/")} 
        className="px-6 py-2 rounded-md font-bold transition-colors"
        style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
      >
        Return Home
      </button>
    </div>
  );

  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#0A0F1C", color: "white" }}>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-black mb-4 uppercase">{trek.trek_name}</h1>
        <div className="flex space-x-4 mb-8">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1A2235] text-[#AAFF00] border border-[#AAFF00]">
            Level: {trek.difficulty_level}
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1A2235] text-white">
            {trek.duration_days} Days
          </span>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#1A2235] text-white">
            Cost: Rs. {trek.cost}
          </span>
        </div>

        <div className="mb-10 text-gray-300 bg-[#1A2235] p-6 rounded-xl border border-gray-800">
          <h2 className="text-xl font-bold text-white mb-2">Description</h2>
          <p>{trek.description || "No description provided yet."}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Schedules / Vendors / Guides */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#AAFF00" }}>Available Schedules</h2>
            {schedules.length === 0 ? (
              <p className="text-gray-400">No scheduled departures right now.</p>
            ) : (
              <div className="space-y-4">
                {schedules.map(sch => (
                  <div key={sch._id} className="p-5 rounded-xl border border-gray-800" style={{ backgroundColor: "#111827" }}>
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-bold text-lg">Departure: {new Date(sch.start_date).toLocaleDateString()}</p>
                        <p className="text-sm text-gray-400">Return: {new Date(sch.end_date).toLocaleDateString()}</p>
                      </div>
                      <span className="text-sm font-bold px-2 py-1 bg-green-900 text-green-300 rounded">
                        {sch.available_seats} Seats Left
                      </span>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-gray-800 text-sm space-y-2">
                      <p><span className="text-gray-400">Vendor:</span> {sch.vendor_id?.company_name || "Independent"} (Verified: {sch.vendor_id?.is_verified ? "Yes" : "Pending"})</p>
                      <p><span className="text-gray-400">Assigned Guide:</span> {sch.guide_id?.user_id?.name || "Pending Assignment"}</p>
                    </div>

                    <button 
                      onClick={() => navigate("/trekker/bookings", { state: { scheduleId: sch._id } })}
                      className="mt-4 w-full py-2 rounded-md font-bold text-[#0A0F1C] transition-colors"
                      style={{ backgroundColor: "#AAFF00" }}
                    >
                      Book This Schedule
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Ride Sharing / Open Groups */}
          <div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: "#AAFF00" }}>Ride Sharing & Groups</h2>
            {groups.length === 0 ? (
              <p className="text-gray-400">No open groups for these schedules. Create one after booking!</p>
            ) : (
              <div className="space-y-4">
                {groups.map(grp => (
                  <div key={grp._id} className="p-5 rounded-xl border border-gray-800" style={{ backgroundColor: "#111827" }}>
                    <h3 className="font-bold text-lg mb-1">{grp.group_name}</h3>
                    <p className="text-sm text-gray-400">Meeting Point: {grp.meeting_point}</p>
                    
                    <div className="flex items-center space-x-4 mt-4 text-sm">
                      <p>Members: <span className="text-white font-bold">{grp.current_members} / {grp.max_members}</span></p>
                      <p>Status: <span className="text-[#AAFF00]">{grp.status}</span></p>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      {grp.include_transport && <span className="text-xs bg-blue-900 text-blue-300 px-2 py-1 rounded">Ride Share Available</span>}
                      {grp.include_guide && <span className="text-xs bg-purple-900 text-purple-300 px-2 py-1 rounded">Shared Guide</span>}
                    </div>

                    <button 
                      onClick={() => handleJoinGroup(grp._id)}
                      className="mt-4 w-full py-2 rounded-md font-bold transition-colors border border-[#AAFF00] text-[#AAFF00] hover:bg-[#AAFF00] hover:text-[#0A0F1C]"
                    >
                      Request to Join Group
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default TrekDetails;
