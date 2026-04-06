import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";
import API from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function MyTreks() {
  const navigate = useNavigate();
  const [treks, setTreks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTreks();
  }, []);

  const fetchTreks = async () => {
    try {
      const res = await API.get("/api/treks/guide");
      setTreks(res.data);
    } catch (error) {
      console.error("Failed to load guide treks", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this Trek Blueprint? You cannot delete a trek that has active schedules assigned.")) {
      try {
        await API.delete(`/api/treks/${id}`);
        setTreks(treks.filter((t) => t._id !== id));
      } catch (error) {
        alert(error.response?.data?.message || "Failed to delete trek.");
      }
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 flex justify-between items-center bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-2xl">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Library</p>
          <h1 className="text-3xl font-black text-white mt-1">My Blueprints</h1>
        </div>
        <button 
          onClick={() => navigate("/guide/create-trek")}
          className="px-6 py-3 font-bold bg-[#AAFF00] text-black rounded-lg hover:bg-green-400 transition-colors shadow-lg"
        >
          + Build New Trek
        </button>
      </div>

      {loading ? (
         <p className="text-gray-400">Loading your library...</p>
      ) : treks.length === 0 ? (
         <div className="bg-[#1A2235] rounded-xl border border-gray-800 p-12 text-center shadow-xl">
             <p className="text-6xl mb-4">🏔️</p>
             <h2 className="text-2xl font-black text-white">No custom Treks found!</h2>
             <p className="text-gray-400 mt-2 mb-6 max-w-sm mx-auto">
               You haven't built any trek routes yet. Stand out by building an amazing journey.
             </p>
             <button 
               onClick={() => navigate("/guide/create-trek")}
               className="px-8 py-3 rounded-xl font-bold border-2 border-[#AAFF00] text-[#AAFF00] hover:bg-[#AAFF00] hover:text-black transition-all"
             >
               Start Designing
             </button>
         </div>
      ) : (
         <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {treks.map((trek) => (
                <div key={trek._id} className="bg-[#1A2235] border border-gray-800 rounded-xl overflow-hidden hover:border-[#AAFF00] transition-colors group shadow-lg">
                    <div className="h-32 bg-[#0A0F1C] border-b border-gray-800 relative flex items-center justify-center overflow-hidden">
                       <span className="text-5xl opacity-80 group-hover:scale-110 transition-transform">📍</span>
                       <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-3 py-1 text-xs font-bold text-[#AAFF00] rounded-full uppercase border border-[#AAFF00]/50">
                         {trek.difficulty_level}
                       </div>
                    </div>
                    <div className="p-6">
                        <h3 className="text-xl font-black text-white">{trek.trek_name}</h3>
                        <p className="text-sm text-gray-400 mt-1 flex items-center gap-1 font-medium"><span className="text-lg">🗺️</span> {trek.location}</p>
                        
                        <div className="flex justify-between items-center mt-5 mb-5 p-3 bg-[#0A0F1C] rounded-lg border border-gray-800">
                           <div className="text-center">
                              <p className="text-xs text-gray-500 uppercase font-black">Duration</p>
                              <p className="text-white font-bold">{trek.duration_days} Days</p>
                           </div>
                           <div className="text-center border-l border-gray-800 pl-4">
                              <p className="text-xs text-gray-500 uppercase font-black">Trek Guide Fee</p>
                              <p className="text-[#AAFF00] font-black tracking-tight">Rs. {trek.cost.toLocaleString()}</p>
                           </div>
                        </div>

                        <div className="flex gap-2 w-full mt-4">
                            <button 
                              onClick={() => navigate("/guide/schedules")}
                              className="flex-1 py-2 text-sm font-bold bg-[#111827] text-white border border-gray-600 rounded-lg hover:border-blue-400 hover:text-blue-400 transition-colors"
                            >
                              Schedules
                            </button>
                            {/* Edit disabled for now intentionally, as only Delete + Schedules were strictly requested, but we can allow edit later */}
                            <button 
                              onClick={() => handleDelete(trek._id)}
                              className="px-4 py-2 text-sm font-bold bg-red-900/20 text-red-500 border border-red-900 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                            >
                              Drop
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

export default MyTreks;
