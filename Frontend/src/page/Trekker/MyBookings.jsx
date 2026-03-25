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

function MyBookings() {
  const navigate = useNavigate();

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8">
        <p className="text-sm font-semibold tracking-widest uppercase"
          style={{ color: "#AAFF00" }}>
          Bookings
        </p>
        <h1 className="text-3xl font-black text-white mt-1">My Bookings</h1>
      </div>

      {/* FILTER TABS */}
      <div className="flex space-x-2 mb-6">
        {["All", "Pending", "Confirmed", "Cancelled"].map((tab) => (
          <button
            key={tab}
            className="px-4 py-2 rounded-md text-sm font-semibold"
            style={{
              backgroundColor: tab === "All" ? "#AAFF00" : "#1A2235",
              color: tab === "All" ? "#0A0F1C" : "#9CA3AF",
              border: "1px solid #1F2937"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* EMPTY STATE */}
      <div
        className="p-12 rounded-xl text-center"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <p className="text-5xl mb-4">📋</p>
        <p className="text-white font-bold text-xl">No bookings yet!</p>
        <p className="text-sm mt-2 mb-6" style={{ color: "#9CA3AF" }}>
          Browse available treks and make your first booking
        </p>
        <button
          onClick={() => navigate("/explore")}
          className="px-6 py-2 rounded-md font-bold"
          style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
        >
          Browse Treks
        </button>
      </div>
    </DashboardLayout>
  );
}

export default MyBookings;