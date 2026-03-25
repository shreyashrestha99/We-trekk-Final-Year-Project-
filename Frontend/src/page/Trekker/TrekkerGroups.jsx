import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks", icon: "🏔️", path: "/explore" },
  { label: "Browse Groups", icon: "👥", path: "/trekker/groups" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

function TrekkerGroups() {
  const navigate = useNavigate();

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Groups
        </p>
        <h1 className="text-3xl font-black text-white mt-1">Browse Groups</h1>
      </div>

      {/* FILTER */}
      <div
        className="p-4 rounded-xl mb-6 flex space-x-4"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <input
          type="text"
          placeholder="Search groups..."
          className="flex-1 rounded-md p-3 text-white text-sm outline-none"
          style={{ backgroundColor: "#0A0F1C", border: "1px solid #1F2937" }}
          onFocus={e => e.target.style.borderColor = "#AAFF00"}
          onBlur={e => e.target.style.borderColor = "#1F2937"}
        />
        <select
          className="rounded-md p-3 text-sm outline-none"
          style={{
            backgroundColor: "#0A0F1C",
            border: "1px solid #1F2937",
            color: "white"
          }}
        >
          <option>All Treks</option>
          <option>Everest</option>
          <option>Annapurna</option>
          <option>Langtang</option>
        </select>
      </div>

      {/* EMPTY STATE */}
      <div
        className="p-12 rounded-xl text-center"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <p className="text-5xl mb-4">👥</p>
        <p className="text-white font-bold text-xl">No groups available yet!</p>
        <p className="text-sm mt-2 mb-6" style={{ color: "#9CA3AF" }}>
          Vendors create groups — check back soon!
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-2 rounded-md font-bold"
          style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
        >
          Browse Treks Instead
        </button>
      </div>
    </DashboardLayout>
  );
}

export default TrekkerGroups;