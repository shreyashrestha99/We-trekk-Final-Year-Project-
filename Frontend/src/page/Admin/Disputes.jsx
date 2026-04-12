import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "All Users", icon: "👥", path: "/admin/users" },
  { label: "Browse Treks & Rides", icon: "🧭", path: "/admin/browse" },
  { label: "Manage Treks", icon: "🏔️", path: "/admin/treks" },
  { label: "Verifications", icon: "✅", path: "/admin/verify" },
  { label: "Disputes", icon: "⚠️", path: "/admin/disputes" },
];

function Disputes() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [resolving, setResolving] = useState(null);

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await API.get("/api/admin/disputes");
      setDisputes(res.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id) => {
    setResolving(id);
    try {
      await API.put(`/api/admin/disputes/${id}`);
      setDisputes(disputes.map(d => d._id === id ? { ...d, dispute_status: "Resolved" } : d));
      alert("Dispute marked as resolved");
    } catch (err) {
      alert("Failed to resolve dispute");
    } finally {
      setResolving(null);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase" style={{ color: "#AAFF00" }}>
          Conflict Resolution
        </p>
        <h1 className="text-3xl font-black text-white mt-1">Manage Disputes</h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: "#AAFF00" }} className="font-bold">Loading disputes...</p>
        </div>
      ) : disputes.length === 0 ? (
        <div className="p-12 rounded-xl text-center" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
          <p className="text-5xl mb-4">🛡️</p>
          <p className="text-white font-bold text-xl">All clear!</p>
          <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>No active disputes at the moment</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((dispute) => (
            <div key={dispute._id} className="p-5 rounded-xl" style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs font-black uppercase px-2 py-0.5 rounded bg-red-500/20 text-red-500">
                      Issue Reported
                    </span>
                    <span className="text-xs text-gray-500 font-bold">
                      Booking ID: #{dispute._id.slice(-6).toUpperCase()}
                    </span>
                  </div>
                  <h3 className="text-white font-bold text-lg">
                    {dispute.trekker_id?.name || "Trekker"} reported an issue
                  </h3>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${dispute.dispute_status === "Resolved" ? "bg-green-500/20 text-green-500" : "bg-yellow-500/20 text-yellow-500"}`}>
                  {dispute.dispute_status}
                </span>
              </div>

              <div className="bg-[#0A0F1C] p-4 rounded-lg mb-4 border border-gray-800">
                <p className="text-xs text-gray-500 uppercase font-black mb-1">Reason for Dispute:</p>
                <p className="text-white text-sm italic">"{dispute.dispute_reason || "No reason provided"}"</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">
                   Reported by: <span className="text-white">{dispute.trekker_id?.email}</span>
                </div>
                {dispute.dispute_status !== "Resolved" && (
                  <button
                    onClick={() => handleResolve(dispute._id)}
                    disabled={resolving === dispute._id}
                    className="px-4 py-2 rounded-md font-bold text-sm transition-all"
                    style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                  >
                    {resolving === dispute._id ? "Processing..." : "✓ Mark as Resolved"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Disputes;
