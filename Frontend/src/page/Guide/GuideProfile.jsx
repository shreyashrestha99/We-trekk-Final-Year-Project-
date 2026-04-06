import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";

function GuideProfile() {
  const { user, defaultImg } = useAuth();
  const profileImg = user?.profile_image || defaultImg;

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>Identity</p>
        <h1 className="text-3xl font-black text-white mt-1">Guide Profile</h1>
      </div>

      <div className="bg-[#1A2235] border border-gray-800 rounded-xl p-8 shadow-2xl max-w-2xl">
        <div className="flex flex-col md:flex-row items-center gap-8 border-b border-gray-800 pb-8">
          <div className="w-32 h-32 rounded-full border-4 border-[#AAFF00] overflow-hidden bg-[#0A0F1C] shadow-[0_0_20px_rgba(170,255,0,0.3)] shrink-0">
             <img src={profileImg} alt="Profile" className="w-full h-full object-cover" />
          </div>
          <div className="text-center md:text-left">
             <h2 className="text-3xl font-black text-white">{user?.name}</h2>
             <p className="text-[#AAFF00] font-bold tracking-widest uppercase mt-1">{user?.role}</p>
             <p className="text-gray-400 mt-2">{user?.email}</p>
          </div>
        </div>

        <div className="pt-8 space-y-6">
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Phone Number</p>
              <p className="text-lg font-bold text-white mt-1">{user?.phone || 'Not Provided'}</p>
           </div>
           <div>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Account Status</p>
              <div className="inline-block mt-2 px-4 py-2 bg-[#AAFF00]/10 border border-[#AAFF00]/30 rounded-lg">
                 <p className="text-[#AAFF00] font-black uppercase tracking-widest text-sm">Active Guide</p>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default GuideProfile;
