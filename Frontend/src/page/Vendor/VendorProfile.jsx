import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";
import EditProfileModal from "../../components/EditProfileModal";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "Create Ride", icon: "➕", path: "/vendor/create-ride" },
  { label: "My Rides", icon: "🚙", path: "/vendor/rides" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "Notifications", icon: "🔔", path: "/vendor/notifications" },
  { label: "Profile", icon: "👤", path: "/vendor/profile" },
];

function VendorProfile() {
  const { user, defaultImg } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await API.get("/api/auth/profile");
      setProfileData(res.data);
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdate = () => {
    fetchProfile();
  };

  if (loading) return <div className="p-8 text-[#AAFF00] font-black animate-pulse text-center mt-20 uppercase tracking-widest">Syncing Identity...</div>;

  const displayUser = profileData?.user || user;
  const vendor = profileData?.vendor || {};
  const profileImg = displayUser?.profile_image ? `http://localhost:5000${displayUser.profile_image}` : defaultImg;

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center bg-[#1A2235]/50 p-6 rounded-2xl border border-gray-800 gap-4">
        <div>
          <p className="text-[#AAFF00] font-black text-[0.65rem] uppercase tracking-[0.2em] mb-1">Business Identity</p>
          <h1 className="text-2xl font-black text-white">Vendor Profile</h1>
          <p className="text-xs text-gray-500 mt-1 italic">Maintain your corporate credentials and contact details.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-[#AAFF00] text-[#0A0F1C] font-black uppercase text-[0.65rem] tracking-widest rounded-lg hover:bg-white transition-all shadow-xl active:scale-95"
        >
          Customize Profile
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#1A2235] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative group">
          {/* Subtle Accent Background */}
          <div className="h-32 bg-gradient-to-r from-[#AAFF00]/10 via-[#AAFF00]/5 to-transparent"></div>
          
          <div className="px-10 pb-10 -mt-16">
            <div className="flex flex-col md:flex-row items-end gap-8 mb-10 pb-8 border-b border-[#AAFF00]/10">
              <div className="w-40 h-40 rounded-full border-4 border-[#1A2235] overflow-hidden bg-[#0A0F1C] shadow-2xl relative z-10 ring-8 ring-[#AAFF00]/5 transition-transform hover:scale-105">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow pb-4">
                <h2 className="text-4xl font-black text-white tracking-tight">{displayUser?.name}</h2>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-[#AAFF00] font-black text-xs uppercase tracking-widest bg-[#AAFF00]/10 px-3 py-1 rounded-full">{displayUser?.role}</span>
                  <span className="text-gray-500 font-bold text-sm tracking-tight">{displayUser?.email}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <div className="flex flex-col gap-1 py-1 border-b border-[#AAFF00]/20">
                  <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest">Business Name</span>
                  <span className="text-lg font-black text-white">{vendor?.company_name || "Official Venue"}</span>
                </div>
                <div className="flex flex-col gap-1 py-1 border-b border-[#AAFF00]/20">
                  <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest">Support Line</span>
                  <span className="text-lg font-black text-white">{displayUser?.phone || "Pending Entry"}</span>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex flex-col gap-1 py-1 border-b border-[#AAFF00]/20">
                  <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest">Operating License</span>
                  <span className="text-lg font-black text-white uppercase tracking-tighter">{vendor?.license_no || "Registration Required"}</span>
                </div>
                <div className="flex flex-col gap-1 py-1 border-b border-[#AAFF00]/20">
                  <span className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest">Trust Status</span>
                  <span className={`text-xs font-black uppercase tracking-[0.1em] mt-1 flex items-center gap-2 ${vendor?.is_verified ? "text-[#AAFF00]" : "text-gray-500"}`}>
                    <div className={`w-2 h-2 rounded-full ${vendor?.is_verified ? "bg-[#AAFF00] animate-pulse" : "bg-gray-700"}`}></div>
                    {vendor?.is_verified ? "Member Confirmed" : "Identity In Review"}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-[#0A0F1C] rounded-2xl border border-gray-800/50 text-xs text-gray-500 leading-relaxed font-bold tracking-tight">
              ⚡ <span className="text-gray-400">Merchant Protocol:</span> Your business credentials are used to build trust within the WeTrekk ecosystem. Accurate company names and license numbers are verified periodically to ensure platform safety.
            </div>
          </div>
        </div>
      </div>

      <EditProfileModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        profileData={profileData} 
        onUpdate={handleUpdate} 
      />
    </DashboardLayout>
  );
}

export default VendorProfile;
