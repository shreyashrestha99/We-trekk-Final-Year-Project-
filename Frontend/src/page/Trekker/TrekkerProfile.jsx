import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";
import EditProfileModal from "../../components/EditProfileModal";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks and Rides", icon: "🏔️", path: "/trekker/explore" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

function TrekkerProfile() {
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

  if (loading) return <div className="p-8 text-[#AAFF00] font-black animate-pulse text-center mt-20">Syncing Identity...</div>;

  const displayUser = profileData?.user || user;
  const trekker = profileData?.trekker || {};
  const profileImg = displayUser?.profile_image ? `${import.meta.env.VITE_API_URL || "http://localhost:5000"}${displayUser.profile_image}` : defaultImg;

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-6 flex justify-between items-center bg-[#1A2235]/50 p-6 rounded-2xl border border-gray-800">
        <div>
          <h1 className="text-2xl font-black text-white">Profile Overview</h1>
          <p className="text-xs text-gray-400 mt-1">Manage your identity and trekking preferences.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-5 py-3 bg-[#AAFF00] text-[#0A0F1C] font-black uppercase text-[0.65rem] tracking-widest rounded-lg hover:bg-white transition-all shadow-lg active:scale-95"
        >
          Edit Profile
        </button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-[#1A2235] border border-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-[#AAFF00]/10 to-transparent"></div>
          
          <div className="px-8 pb-8 -mt-12">
            <div className="flex flex-col md:flex-row items-end gap-6 mb-8">
              <div className="w-32 h-32 rounded-full border-4 border-[#1A2235] overflow-hidden bg-[#0A0F1C] shadow-xl relative z-10">
                <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
              </div>
              <div className="flex-grow pb-2">
                <h2 className="text-3xl font-black text-white">{displayUser?.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[#AAFF00] font-bold text-xs uppercase tracking-widest">{displayUser?.role}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600"></span>
                  <span className="text-gray-400 text-xs">{displayUser?.email}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 border-t border-[#AAFF00]/20 pt-8">
              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#AAFF00]/10">
                  <span className="text-xs font-bold text-gray-500 uppercase">Phone Number</span>
                  <span className="text-sm font-black text-white">{displayUser?.phone || "Not Set"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#AAFF00]/10">
                  <span className="text-xs font-bold text-gray-500 uppercase">Total Treks</span>
                  <span className="text-sm font-black text-white">{trekker?.total_treks || 0} Trips</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2 border-b border-[#AAFF00]/10">
                  <span className="text-xs font-bold text-gray-500 uppercase">Address</span>
                  <span className="text-sm font-black text-white">{trekker?.address || "Not Set"}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-[#AAFF00]/10">
                  <span className="text-xs font-bold text-gray-500 uppercase">Account Status</span>
                  <span className="text-[0.65rem] font-black uppercase px-2 py-1 rounded bg-[#AAFF00]/10 text-[#AAFF00]">
                    Active Explorer
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 p-5 bg-[#0A0F1C] rounded-xl border border-gray-800 text-xs text-gray-400 leading-relaxed italic">
              Your profile information helps us customize your trekking suggestions and ensures guides can reach you during emergencies. Keep your contact details up to date.
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

export default TrekkerProfile;