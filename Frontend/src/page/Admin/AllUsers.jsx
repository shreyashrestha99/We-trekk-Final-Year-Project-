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

function AllUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await API.get("/api/admin/users");
      setUsers(res.data.users || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || u.role === filter;
    return matchSearch && matchFilter;
  });

  const roleColors = {
    Trekker: "#60A5FA",
    Guide: "#34D399",
    LocalVendor: "#F59E0B",
    Admin: "#AAFF00"
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          User Management
        </p>
        <h1 className="text-3xl font-black text-white mt-1">All Users</h1>
      </div>

      {/* FILTERS */}
      <div
        className="p-4 rounded-xl mb-6 flex flex-wrap gap-4"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <input
          type="text"
          placeholder="Search by name or email..."
          className="flex-1 rounded-md p-3 text-white text-sm outline-none min-w-48"
          style={{ backgroundColor: "#0A0F1C", border: "1px solid #1F2937" }}
          value={search}
          onChange={e => setSearch(e.target.value)}
          onFocus={e => e.target.style.borderColor = "#AAFF00"}
          onBlur={e => e.target.style.borderColor = "#1F2937"}
        />
        <div className="flex space-x-2">
          {["All", "Trekker", "Guide", "LocalVendor", "Admin"].map(role => (
            <button
              key={role}
              onClick={() => setFilter(role)}
              className="px-3 py-2 rounded-md text-xs font-bold"
              style={{
                backgroundColor: filter === role ? "#AAFF00" : "#0A0F1C",
                color: filter === role ? "#0A0F1C" : "#9CA3AF",
                border: "1px solid #1F2937"
              }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* USERS TABLE */}
      <div
        className="rounded-xl overflow-hidden"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <div
          className="p-4 flex justify-between items-center"
          style={{ borderBottom: "1px solid #1F2937" }}
        >
          <h2 className="font-bold text-white">
            {filtered.length} Users Found
          </h2>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <p style={{ color: "#AAFF00" }} className="font-bold">
              Loading users...
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">👥</p>
            <p className="text-white font-bold">No users found!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: "1px solid #1F2937" }}>
                  {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                    <th
                      key={h}
                      className="text-left p-4 text-xs font-bold uppercase tracking-wider"
                      style={{ color: "#6B7280" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((user) => (
                  <tr
                    key={user._id}
                    style={{ borderBottom: "1px solid #1F2937" }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0A0F1C"}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
                  >
                    <td className="p-4">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black"
                          style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-white font-semibold text-sm">
                          {user.name}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-sm" style={{ color: "#9CA3AF" }}>
                        {user.email}
                      </span>
                    </td>
                    <td className="p-4">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-bold"
                        style={{
                          backgroundColor: (roleColors[user.role] || "#9CA3AF") + "20",
                          color: roleColors[user.role] || "#9CA3AF"
                        }}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-sm" style={{ color: "#9CA3AF" }}>
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        className="text-xs px-3 py-1 rounded font-bold"
                        style={{ color: "#EF4444", border: "1px solid #EF444440" }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default AllUsers;