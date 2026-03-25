import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks", icon: "🏔️", path: "/explore" },
  { label: "Browse Groups", icon: "👥", path: "/trekker/groups" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

function TrekkerProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [address, setAddress] = useState("");

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Account
        </p>
        <h1 className="text-3xl font-black text-white mt-1">My Profile</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-6">

        {/* PROFILE CARD */}
        <div
          className="p-6 rounded-xl text-center"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-4"
            style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
          >
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <p className="text-white font-bold text-xl">{user?.name}</p>
          <span
            className="text-xs px-3 py-1 rounded-full font-bold mt-2 inline-block"
            style={{ backgroundColor: "#AAFF0020", color: "#AAFF00" }}
          >
            {user?.role}
          </span>
          <div className="mt-4 space-y-2">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "#0A0F1C" }}
            >
              <p className="text-xs" style={{ color: "#6B7280" }}>
                Member Since
              </p>
              <p className="text-white text-sm font-semibold">2025</p>
            </div>
          </div>
        </div>

        {/* EDIT PROFILE */}
        <div
          className="md:col-span-2 p-6 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-white">
              Profile Details
            </h2>
            <button
              onClick={() => setEditing(!editing)}
              className="px-4 py-2 rounded-md text-sm font-bold"
              style={editing
                ? { border: "1px solid #EF4444", color: "#EF4444" }
                : { border: "1px solid #AAFF00", color: "#AAFF00" }
              }
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Full Name
              </label>
              <input
                type="text"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: "1px solid #1F2937",
                  opacity: editing ? 1 : 0.6
                }}
                value={name}
                onChange={e => setName(e.target.value)}
                disabled={!editing}
                onFocus={e => editing && (e.target.style.borderColor = "#AAFF00")}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Email Address
              </label>
              <input
                type="email"
                className="w-full rounded-md p-3 text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: "1px solid #1F2937",
                  color: "#6B7280",
                  opacity: 0.6
                }}
                value={user?.email || ""}
                disabled
              />
              <p className="text-xs mt-1" style={{ color: "#6B7280" }}>
                Email cannot be changed
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Address
              </label>
              <input
                type="text"
                placeholder="Enter your address"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: "1px solid #1F2937",
                  opacity: editing ? 1 : 0.6
                }}
                value={address}
                onChange={e => setAddress(e.target.value)}
                disabled={!editing}
                onFocus={e => editing && (e.target.style.borderColor = "#AAFF00")}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Role
              </label>
              <input
                type="text"
                className="w-full rounded-md p-3 text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: "1px solid #1F2937",
                  color: "#AAFF00",
                  opacity: 0.6
                }}
                value={user?.role || ""}
                disabled
              />
            </div>

            {editing && (
              <button
                className="w-full py-3 rounded-md font-bold text-sm"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
                onClick={() => setEditing(false)}
              >
                Save Changes
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default TrekkerProfile;