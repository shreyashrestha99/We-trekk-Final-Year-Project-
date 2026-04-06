import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { guideMenuItems } from "./GuideDashboard";
import API from "../../utils/axios";
import { useNavigate } from "react-router-dom";

function CreateTrek() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    trek_name: "Gosaikunda Trek",
    location: "Rasuwa",
    difficulty_level: "Moderate",
    duration_days: "7",
    cost: "15000",
    max_group_size: 10,
    description: "Experience the sacred lakes and alpine landscapes of the Langtang region.",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      if (image) {
        data.append("image", image);
      }

      await API.post("/api/treks", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setSuccess(true);
      setTimeout(() => navigate("/guide/treks"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create Trek");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout menuItems={guideMenuItems}>
      <div className="mb-8 border-b border-gray-800 pb-4 flex justify-between items-end">
         <div>
            <p className="text-[#AAFF00] text-sm font-bold tracking-widest uppercase">Blueprint Tool</p>
            <h1 className="text-4xl font-black text-white mt-1">Design New Trek</h1>
            <p className="text-gray-400 mt-2 text-sm italic">Create the structural blueprint. Dates come later in Schedules.</p>
         </div>
         <div className="hidden md:block">
            <span className="text-xs bg-[#AAFF00]/10 text-[#AAFF00] px-3 py-2 rounded-full border border-[#AAFF00]/20 font-bold uppercase tracking-tighter">Phase 01: Structural Draft</span>
         </div>
      </div>

      <div className="max-w-4xl bg-[#1A2235] rounded-2xl border border-gray-800 p-0 shadow-2xl overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT: Image Preview / Upload Area */}
        <div className="md:w-1/3 bg-[#0A0F1C] border-r border-gray-800 p-6 flex flex-col items-center justify-center relative group min-h-[300px]">
           {imagePreview ? (
             <div className="w-full h-full relative">
               <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl shadow-lg border border-gray-800" />
               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl cursor-pointer">
                  <label htmlFor="image-upload" className="cursor-pointer text-[#AAFF00] font-bold text-sm">Change Image</label>
               </div>
             </div>
           ) : (
             <label htmlFor="image-upload" className="w-full h-64 border-2 border-dashed border-gray-800 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#AAFF00]/50 transition-colors group">
                <span className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">📸</span>
                <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Select Cover Photo</p>
                <p className="text-[0.6rem] text-gray-500 mt-2 italic px-4 text-center">Trekker's first impression matters!</p>
             </label>
           )}
           <input id="image-upload" type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
        </div>

        {/* RIGHT: Form Fields */}
        <div className="md:w-2/3 p-8">
          {error && <div className="p-4 bg-red-500/10 border border-red-500 text-red-500 rounded-lg mb-6 text-sm">{error}</div>}
          {success && <div className="p-4 bg-green-500/10 border border-green-500 text-[#AAFF00] rounded-lg mb-6 text-sm">✓ Trek Blueprint Created! Redirecting to library...</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
             <div className="space-y-1">
                <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Trek Name</label>
                <input required type="text" name="trek_name" value={formData.trek_name} onChange={handleChange} 
                   placeholder="e.g. Everest Base Camp"
                   className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] placeholder:text-gray-700 transition-all" />
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Location</label>
                   <input required type="text" name="location" value={formData.location} onChange={handleChange} 
                      placeholder="e.g. Solukhumbu"
                      className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] placeholder:text-gray-700 transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Difficulty</label>
                   <select name="difficulty_level" value={formData.difficulty_level} onChange={handleChange}
                      className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-all">
                      <option value="Easy">Easy</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Hard">Hard</option>
                      <option value="Extreme">Extreme</option>
                   </select>
                </div>
             </div>

             <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-1">
                   <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Duration (Days)</label>
                   <input required type="number" min="1" name="duration_days" value={formData.duration_days} onChange={handleChange} 
                      className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-all" />
                </div>
                <div className="space-y-1">
                   <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Cost Per Person (Rs.)</label>
                   <input required type="number" min="0" name="cost" value={formData.cost} onChange={handleChange} 
                      className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-all" />
                </div>
             </div>

             <div className="space-y-1">
                <label className="text-[0.65rem] font-black text-gray-500 uppercase tracking-widest ml-1">Structure Description</label>
                <textarea required name="description" rows="4" value={formData.description} onChange={handleChange} 
                   placeholder="Describe the landscape, altitude, and experience..."
                   className="w-full bg-[#0A0F1C] border border-gray-800 rounded-xl p-4 text-white text-sm focus:outline-none focus:border-[#AAFF00] placeholder:text-gray-700 transition-all" />
             </div>

             <button 
                type="submit" disabled={loading}
                className={`w-full py-5 rounded-xl font-black text-[#0A0F1C] uppercase tracking-widest transition-all shadow-xl hover:shadow-[#AAFF00]/10 ${loading ? 'bg-gray-500 cursor-not-allowed opacity-50' : 'bg-[#AAFF00] hover:bg-white active:scale-[0.98]'}`}>
                {loading ? "Syncing Structural Data..." : "Deploy New Trek Blueprint"}
             </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default CreateTrek;
