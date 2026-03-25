import { useState, useEffect } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import API from "../../utils/axios";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/admin/dashboard" },
  { label: "All Users", icon: "👥", path: "/admin/users" },
  { label: "All Treks", icon: "🏔️", path: "/admin/treks" },
  { label: "Verifications", icon: "✅", path: "/admin/verify" },
  { label: "Disputes", icon: "⚠️", path: "/admin/disputes" },
  { label: "Platform Stats", icon: "📊", path: "/admin/stats" },
];

function Verifications() {
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(null);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const res = await API.get("/api/admin/pending-verifications");
      setPending(res.data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (userId) => {
    setVerifying(userId);
    try {
      await API.put(`/api/admin/verify/${userId}`);
      setPending(pending.filter(u => u._id !== userId));
      alert("User verified successfully!");
    } catch (err) {
      alert("Verification failed!");
    } finally {
      setVerifying(null);
    }
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Verification
        </p>
        <h1 className="text-3xl font-black text-white mt-1">
          Pending Verifications
        </h1>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p style={{ color: "#AAFF00" }} className="font-bold">
            Loading...
          </p>
        </div>
      ) : pending.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <p className="text-5xl mb-4">✅</p>
          <p className="text-white font-bold text-xl">
            All caught up!
          </p>
          <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
            No pending verifications at the moment
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {pending.map((user) => (
            <div
              key={user._id}
              className="p-5 rounded-xl flex justify-between items-center"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div className="flex items-center space-x-4">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center font-black"
                  style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                >
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-white font-bold">{user.name}</p>
                  <p className="text-sm" style={{ color: "#9CA3AF" }}>
                    {user.email}
                  </p>
                  <span
                    className="text-xs px-2 py-1 rounded-full font-bold"
                    style={{
                      backgroundColor: "#F59E0B20",
                      color: "#F59E0B"
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => handleVerify(user._id)}
                  disabled={verifying === user._id}
                  className="px-4 py-2 rounded-md font-bold text-sm"
                  style={{
                    backgroundColor: "#AAFF00",
                    color: "#0A0F1C",
                    opacity: verifying === user._id ? 0.7 : 1
                  }}
                >
                  {verifying === user._id ? "Verifying..." : "✓ Verify"}
                </button>
                <button
                  className="px-4 py-2 rounded-md font-bold text-sm"
                  style={{ border: "1px solid #EF4444", color: "#EF4444" }}
                >
                  ✕ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default Verifications;