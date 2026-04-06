import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "Create Ride", icon: "➕", path: "/vendor/create-ride" },
  { label: "My Rides", icon: "🚙", path: "/vendor/rides" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "Notifications", icon: "🔔", path: "/vendor/notifications" },
  { label: "Profile", icon: "👤", path: "/vendor/profile" },
];

function VendorEarnings() {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [earningsPerRide, setEarningsPerRide] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await API.get("/api/rides/earnings");
        setTotalRevenue(res.data.totalEarnings || 0);
        setEarningsPerRide(res.data.earningsPerRide || []);
      } catch (error) {
        console.error("Failed to fetch earnings calculations", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, []);

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-end">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Financials</p>
          <h1 className="text-3xl font-black text-white mt-1">Ride Earnings Dashboard</h1>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        
        <div className="p-8 rounded-xl border border-gray-800" style={{ backgroundColor: "#1A2235" }}>
          <p className="text-sm text-gray-400 mb-2 font-bold uppercase tracking-widest">Total Gross Revenue</p>
          <p className="text-5xl font-black" style={{ color: "#AAFF00" }}>Rs. {totalRevenue.toLocaleString()}</p>
          <p className="mt-4 text-xs text-gray-500 max-w-sm">Calculated using <code className="bg-gray-800 px-1 rounded">sum(seats * price)</code> for all active Ride bookings. Funds are transferred upon ride schedule completion.</p>
        </div>

        <div className="p-8 rounded-xl border border-gray-800 text-center flex flex-col items-center justify-center" style={{ backgroundColor: "#111827" }}>
           <p className="text-3xl mb-2">💸</p>
           <h3 className="text-xl font-bold text-white mb-2">Automated Payouts</h3>
           <p className="text-sm text-gray-400 max-w-sm mx-auto mb-4">Your funds are automatically wired to your registered merchant account (eSewa/Khalti).</p>
           <button className="px-6 py-2 rounded font-bold text-sm text-[#AAFF00] border border-[#AAFF00] hover:bg-[#AAFF00] hover:text-[#0A0F1C] transition-colors">
              Manage Payout Settings
           </button>
        </div>

      </div>

      <div className="mb-6">
         <h2 className="text-lg font-bold text-white mb-4">Earnings Breakdown Per Ride</h2>
         {loading ? (
             <p className="text-gray-400">Calculating your ledger...</p>
         ) : earningsPerRide.length === 0 ? (
             <div className="p-6 bg-[#1A2235] rounded-xl border border-gray-800 text-center">
                 <p className="text-gray-400">No active ride earnings recorded yet.</p>
             </div>
         ) : (
             <div className="space-y-4">
               {earningsPerRide.map(earning => (
                 <div key={earning._id} className="p-5 flex justify-between items-center bg-[#1A2235] rounded-xl border border-gray-800">
                    <div>
                       <h3 className="font-bold text-lg text-white mb-1">{earning.ride_name}</h3>
                       <p className="text-xs text-gray-400">Seat Price: <strong className="text-gray-300">Rs. {earning.ride_price}</strong> • Total Seats Reserved: <strong className="text-gray-300">{earning.total_seats_booked}</strong></p>
                    </div>
                    <div className="text-right">
                       <span className="font-black text-2xl text-[#AAFF00]">Rs. {earning.ride_earnings.toLocaleString()}</span>
                       <p className="text-xs text-green-500 mt-1 uppercase font-bold tracking-wider">Gross</p>
                    </div>
                 </div>
               ))}
             </div>
         )}
      </div>

    </DashboardLayout>
  );
}

export default VendorEarnings;
