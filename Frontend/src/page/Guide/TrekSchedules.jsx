import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";
import API from "../../utils/axios";

function TrekSchedules() {
  const [blueprints, setBlueprints] = useState([]);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    trek_id: "",
    date: "",
    available_seats: 10
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [bRes, sRes] = await Promise.all([
        API.get("/api/treks/guide"),
        API.get("/api/schedules/guide")
      ]);
      setBlueprints(bRes.data);
      setSchedules(sRes.data);
      if (bRes.data.length > 0 && !formData.trek_id) {
        setFormData(prev => ({ ...prev, trek_id: bRes.data[0]._id }));
      }
    } catch (error) {
      console.error("Failed to load schedule data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSchedule = async (e) => {
    e.preventDefault();
    try {
      if (!formData.trek_id) return alert("Select a Trek Blueprint first!");
      
      await API.post("/api/schedules", {
        trek_id: formData.trek_id,
        date: formData.date,
        available_seats: formData.available_seats
      });
      
      fetchData();
      alert("New Schedule Opened Successfully!");
      setFormData({ ...formData, date: "" }); // Reset date only
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create Schedule");
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase text-[#AAFF00]">Logistics & Calendar</p>
          <h1 className="text-4xl font-black text-white mt-1">Departure Schedules</h1>
          <p className="text-sm text-gray-400 mt-2">Activate your Blueprints by assigning specific departure dates.</p>
        </div>
        <div className="flex gap-2 mb-1">
           <div className="w-3 h-3 rounded-full bg-[#AAFF00] animate-pulse"></div>
           <span className="text-[0.6rem] text-gray-500 uppercase font-black tracking-widest self-center">Live Operations</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
         {/* FORM PANE */}
         <div className="lg:col-span-4 bg-[#1A2235] rounded-2xl border border-gray-800 shadow-2xl overflow-hidden h-fit">
            <div className="bg-[#0A0F1C] p-6 border-b border-gray-800">
               <h2 className="text-lg font-black text-white flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-[#AAFF00]/10 text-[#AAFF00] flex items-center justify-center">📅</span>
                  Open New Date
               </h2>
            </div>
            
            <form onSubmit={handleCreateSchedule} className="p-6 space-y-6">
               
               <div className="space-y-1">
                  <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Select Trek Blueprint</label>
                  <select 
                    required 
                    value={formData.trek_id} 
                    onChange={e => setFormData({ ...formData, trek_id: e.target.value })}
                    className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-all cursor-pointer"
                  >
                     {blueprints.length === 0 && <option value="">No Blueprints Found</option>}
                     {blueprints.map(b => (
                       <option key={b._id} value={b._id}>{b.trek_name}</option>
                     ))}
                  </select>
               </div>

               <div className="space-y-1">
                  <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Departure Date</label>
                  <input 
                    required 
                    type="date" 
                    value={formData.date} 
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-all [color-scheme:dark]" 
                  />
               </div>

               <div className="space-y-1">
                  <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Max Available Seats</label>
                  <div className="relative">
                    <input 
                      required 
                      type="number" 
                      min="1"
                      value={formData.available_seats} 
                      onChange={e => setFormData({ ...formData, available_seats: e.target.value })}
                      className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-all pl-10" 
                    />
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 font-bold text-xs uppercase tracking-tighter">#</span>
                  </div>
               </div>

               <button 
                 type="submit" 
                 disabled={blueprints.length === 0}
                 className="w-full py-5 text-[#0A0F1C] font-black uppercase tracking-widest bg-[#AAFF00] rounded-xl hover:bg-white transition-all transform active:scale-95 shadow-lg shadow-[#AAFF00]/5 disabled:bg-gray-800 disabled:text-gray-600 disabled:cursor-not-allowed"
               >
                 Launch Departure
               </button>

               <p className="text-[0.6rem] text-center text-gray-500 italic mt-4">Once launched, trekkers can instantly book this date.</p>
            </form>
         </div>

         {/* LIST PANE */}
         <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4 border-b border-gray-800 pb-2 pl-2">Active Calendars</h2>
            {loading ? (
               <p className="text-gray-400 px-2">Reading chronologies...</p>
            ) : schedules.length === 0 ? (
               <div className="p-8 border border-gray-800 rounded-xl bg-[#0A0F1C] text-center">
                  <p className="text-4xl mb-2">📅</p>
                  <p className="text-gray-400 font-bold">No active departure dates</p>
               </div>
            ) : (
               <div className="space-y-4">
                  {schedules.map(schedule => (
                     <div key={schedule._id} className="flex flex-col md:flex-row bg-[#1A2235] border border-gray-800 rounded-xl overflow-hidden hover:border-[#AAFF00]/40 transition-colors shadow-lg">
                        <div className="bg-[#0A0F1C] md:w-32 flex flex-col justify-center items-center py-6 border-b md:border-b-0 md:border-r border-gray-800">
                           <span className="text-[#AAFF00] text-3xl font-black">
                             {new Date(schedule.start_date).getDate().toString().padStart(2, '0')}
                           </span>
                           <span className="text-gray-500 font-bold uppercase text-xs tracking-widest">
                             {new Date(schedule.start_date).toLocaleString('default', { month: 'short' })}
                           </span>
                        </div>
                        <div className="p-5 flex-1 flex flex-col justify-center">
                           <div className="flex justify-between items-start">
                              <div>
                                <h3 className="text-xl font-bold text-white">{schedule.trek_id?.trek_name || 'Missing Blueprint'}</h3>
                                <p className="text-xs text-gray-400 font-bold mt-1 tracking-widest uppercase">
                                   Duration: {schedule.trek_id?.duration_days} Days
                                </p>
                              </div>
                              <div className="text-right bg-black/40 px-4 py-2 rounded-xl border border-gray-800">
                                <p className="text-2xl font-black text-[#34D399] tracking-tighter block leading-none">{schedule.available_seats}</p>
                                <p className="text-[0.65rem] text-gray-500 font-bold uppercase mt-1">Seats Available</p>
                              </div>
                           </div>
                           <div className="mt-4 text-sm font-medium text-gray-300">
                             <span className="text-[#AAFF00]">✓</span> Automatically computes end date: {new Date(schedule.end_date).toLocaleDateString()}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>
      </div>
    </DashboardLayout>
  );
}

export default TrekSchedules;
