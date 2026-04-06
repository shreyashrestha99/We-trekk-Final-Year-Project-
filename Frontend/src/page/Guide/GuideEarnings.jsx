import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";
import API from "../../utils/axios";

function GuideEarnings() {
  const [earningsData, setEarningsData] = useState({ totalEarnings: 0, earningsPerTrek: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      const res = await API.get("/api/treks/earnings");
      setEarningsData({
        totalEarnings: res.data.totalEarnings || 0,
        earningsPerTrek: res.data.earningsPerTrek || []
      });
    } catch (error) {
      console.error("Failed to load guide earnings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 flex justify-between items-center bg-[#111827] border border-gray-800 p-6 rounded-xl shadow-2xl">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Financials</p>
          <h1 className="text-3xl font-black text-white mt-1">Earnings Report</h1>
          <p className="text-gray-400 mt-2 text-sm">Real-time revenue computed directly from active schedules and booked seats.</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-1 p-8 rounded-xl bg-gradient-to-br from-[#1A2235] to-[#0A0F1C] border border-[#AAFF00]/50 shadow-[0_0_20px_rgba(170,255,0,0.1)] flex flex-col justify-center items-center">
            <h2 className="text-sm font-black tracking-widest uppercase text-gray-400 mb-2">Total Gross Volume</h2>
            {loading ? (
                <div className="animate-pulse h-12 w-48 bg-gray-800 rounded mt-2"></div>
            ) : (
               <div className="flex items-start gap-1">
                  <span className="text-[#AAFF00] font-black text-2xl mt-2 p-1">Rs.</span>
                  <span className="text-white font-black text-6xl tracking-tighter">
                    {earningsData.totalEarnings.toLocaleString()}
                  </span>
               </div>
            )}
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mt-6">Secure Calculation</p>
        </div>

        <div className="lg:col-span-2 bg-[#1A2235] border border-gray-800 rounded-xl p-8 shadow-2xl overflow-y-auto max-h-[500px]">
           <h2 className="text-lg font-black text-white mb-6 border-b border-gray-800 pb-2">Revenue Breakdown by Trek Blueprint</h2>
           
           {loading ? (
               <p className="text-gray-400">Computing financial streams...</p>
           ) : earningsData.earningsPerTrek.length === 0 ? (
               <div className="text-center py-10 opacity-70">
                   <p className="text-5xl mb-3">🧮</p>
                   <p className="text-gray-400 font-bold">No revenue streams detected yet.</p>
               </div>
           ) : (
               <div className="space-y-4">
                  {earningsData.earningsPerTrek.map((trek) => (
                     <div key={trek._id} className="p-5 border border-gray-800 bg-[#0A0F1C] rounded-xl flex flex-col md:flex-row justify-between items-center transition-all hover:border-[#AAFF00]/30 shadow-lg">
                        <div className="flex items-center gap-4 mb-4 md:mb-0">
                           <div className="w-12 h-12 bg-[#1A2235] rounded-full flex items-center justify-center text-xl shadow-inner border border-gray-700">
                             💰
                           </div>
                           <div>
                              <p className="font-black text-xl text-white">{trek.trek_name}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <p className="text-xs bg-[#1A2235] px-2 py-1 rounded text-gray-400 font-bold uppercase tracking-widest">
                                   Fee: Rs. {trek.trek_cost.toLocaleString()}
                                </p>
                                <p className="text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded font-bold uppercase tracking-widest border border-blue-900">
                                   {trek.total_seats_booked} Seats Booked
                                </p>
                              </div>
                           </div>
                        </div>
                        <div className="text-right">
                           <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Generated</p>
                           <p className="text-3xl font-black text-[#AAFF00] tracking-tighter hover:scale-105 transition-transform">
                             Rs. {trek.trek_earnings.toLocaleString()}
                           </p>
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

export default GuideEarnings;
