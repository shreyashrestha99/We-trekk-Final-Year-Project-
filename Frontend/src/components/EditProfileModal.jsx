import { useState, useEffect } from "react";
import API from "../utils/axios";

function EditProfileModal({ isOpen, onClose, profileData, onUpdate }) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    experience_years: 0,
    license_no: "",
    company_name: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = profileData?.user?.role;

  useEffect(() => {
    if (profileData) {
      setFormData({
        name: profileData.user?.name || "",
        phone: profileData.user?.phone || "",
        experience_years: profileData.guide?.experience_years || 0,
        license_no: profileData.guide?.license_no || profileData.vendor?.license_no || "",
        company_name: profileData.vendor?.company_name || "",
      });
      setPreview(profileData.user?.profile_image || "");
    }
  }, [profileData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        // Only append relevant fields for the role to avoid cluttering request
        if (role === "Guide" && key === "company_name") return;
        if (role === "LocalVendor" && key === "experience_years") return;
        data.append(key, formData[key]);
      });
      if (image) data.append("profile_image", image);

      const res = await API.put("/api/auth/profile", data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      onUpdate(res.data.user);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-[#1A2235] border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden shadow-black animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-[#0A0F1C]/50">
          <h3 className="text-lg font-bold text-white">Update {role} Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl font-light">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">{error}</div>}

          {/* Profile Image */}
          <div className="flex flex-col items-center gap-4">
             <div className="w-24 h-24 rounded-full border border-gray-700 overflow-hidden bg-black flex items-center justify-center relative group shadow-inner">
                {preview ? (
                   <img src={preview.startsWith('blob') ? preview : `http://localhost:5000${preview}`} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                   <span className="text-2xl opacity-20">👤</span>
                )}
                <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer text-[0.6rem] text-[#AAFF00] font-bold uppercase text-center p-2">
                   Change Photo
                   <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                </label>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[0.65rem] font-bold text-gray-500 uppercase">Full Name</label>
              <input required type="text" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-[#0A0F1C] border border-gray-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-colors" />
            </div>
            <div className="space-y-1">
              <label className="text-[0.65rem] font-bold text-gray-500 uppercase">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange}
                className="w-full bg-[#0A0F1C] border border-gray-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#AAFF00] transition-colors" />
            </div>
          </div>

          {/* ROLE SPECIFIC FIELDS */}
          <div className="grid grid-cols-2 gap-4">
            {role === "Guide" && (
              <div className="space-y-1">
                <label className="text-[0.65rem] font-bold text-gray-500 uppercase">Experience (Yrs)</label>
                <input type="number" name="experience_years" value={formData.experience_years} onChange={handleChange}
                  className="w-full bg-[#0A0F1C] border border-gray-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#AAFF00]" />
              </div>
            )}
            
            {role === "LocalVendor" && (
              <div className="space-y-1">
                <label className="text-[0.65rem] font-bold text-gray-500 uppercase">Company Name</label>
                <input type="text" name="company_name" value={formData.company_name} onChange={handleChange}
                  className="w-full bg-[#0A0F1C] border border-gray-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#AAFF00]" />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[0.65rem] font-bold text-gray-500 uppercase">License No.</label>
              <input type="text" name="license_no" value={formData.license_no} onChange={handleChange}
                className="w-full bg-[#0A0F1C] border border-gray-800 rounded-lg p-3 text-white text-sm focus:outline-none focus:border-[#AAFF00]" />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
             <button type="submit" disabled={loading} className="flex-1 py-4 bg-[#AAFF00] text-[#0A0F1C] font-bold uppercase text-xs tracking-widest rounded-lg hover:bg-white transition-all disabled:opacity-50 shadow-lg shadow-[#AAFF00]/10 transform active:scale-95">
                {loading ? "Syncing..." : "Update Details"}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfileModal;
