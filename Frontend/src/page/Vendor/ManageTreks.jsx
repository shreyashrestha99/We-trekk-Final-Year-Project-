import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/vendor/dashboard" },
  { label: "My Treks", icon: "🏔️", path: "/vendor/treks" },
  { label: "My Schedules", icon: "📅", path: "/vendor/schedules" },
  { label: "My Groups", icon: "👥", path: "/vendor/groups" },
  { label: "Bookings", icon: "📋", path: "/vendor/bookings" },
  { label: "Earnings", icon: "💰", path: "/vendor/earnings" },
  { label: "My Profile", icon: "👤", path: "/vendor/profile" },
];

function ManageTreks() {
  const [showForm, setShowForm] = useState(false);
  const [treks, setTreks] = useState([]);
  const [form, setForm] = useState({
    trek_name: "",
    difficulty_level: "",
    duration_days: "",
    cost: "",
    max_group_size: "",
    description: ""
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!form.trek_name.trim()) newErrors.trek_name = "Trek name is required";
    if (!form.difficulty_level) newErrors.difficulty_level = "Select difficulty";
    if (!form.duration_days) newErrors.duration_days = "Duration is required";
    if (!form.cost) newErrors.cost = "Cost is required";
    if (!form.max_group_size) newErrors.max_group_size = "Group size is required";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setTreks([...treks, { ...form, id: Date.now() }]);
    setForm({
      trek_name: "", difficulty_level: "",
      duration_days: "", cost: "",
      max_group_size: "", description: ""
    });
    setErrors({});
    setShowForm(false);
  };

  const difficultyColors = {
    Easy: "#AAFF00",
    Medium: "#F59E0B",
    Hard: "#EF4444",
    "Very High": "#9333EA"
  };

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#AAFF00" }}>
            Trek Management
          </p>
          <h1 className="text-3xl font-black text-white mt-1">My Treks</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 rounded-md font-bold text-sm"
          style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
        >
          + Create Trek
        </button>
      </div>

      {/* CREATE TREK FORM */}
      {showForm && (
        <div
          className="p-6 rounded-xl mb-6"
          style={{ backgroundColor: "#1A2235", border: "1px solid #AAFF00" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Create New Trek</h2>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">

            {[
              { label: "Trek Name", key: "trek_name", type: "text", placeholder: "e.g. Everest Base Camp" },
              { label: "Duration (days)", key: "duration_days", type: "number", placeholder: "e.g. 14" },
              { label: "Cost (USD)", key: "cost", type: "number", placeholder: "e.g. 1200" },
              { label: "Max Group Size", key: "max_group_size", type: "number", placeholder: "e.g. 15" },
            ].map((field) => (
              <div key={field.key}>
                <label className="block text-sm font-medium mb-2 text-white">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full rounded-md p-3 text-white text-sm outline-none"
                  style={{
                    backgroundColor: "#0A0F1C",
                    border: `1px solid ${errors[field.key] ? "#EF4444" : "#1F2937"}`
                  }}
                  value={form[field.key]}
                  onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                  onFocus={e => e.target.style.borderColor = "#AAFF00"}
                  onBlur={e => e.target.style.borderColor = errors[field.key] ? "#EF4444" : "#1F2937"}
                />
                {errors[field.key] && (
                  <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                    ⚠ {errors[field.key]}
                  </p>
                )}
              </div>
            ))}

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Difficulty Level
              </label>
              <select
                className="w-full rounded-md p-3 text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.difficulty_level ? "#EF4444" : "#1F2937"}`,
                  color: form.difficulty_level ? "white" : "#6B7280"
                }}
                value={form.difficulty_level}
                onChange={e => setForm({ ...form, difficulty_level: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.difficulty_level ? "#EF4444" : "#1F2937"}
              >
                <option value="">Select difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Very High">Very High</option>
              </select>
              {errors.difficulty_level && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.difficulty_level}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Description (optional)
              </label>
              <textarea
                rows={3}
                placeholder="Describe this trek..."
                className="w-full rounded-md p-3 text-white text-sm outline-none resize-none"
                style={{ backgroundColor: "#0A0F1C", border: "1px solid #1F2937" }}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = "#1F2937"}
              />
            </div>

            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="px-6 py-2 rounded-md font-bold text-sm"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
              >
                Create Trek
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2 rounded-md font-bold text-sm"
                style={{ border: "1px solid #1F2937", color: "#9CA3AF" }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TREKS LIST */}
      {treks.length === 0 ? (
        <div
          className="p-12 rounded-xl text-center"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <p className="text-5xl mb-4">🏔️</p>
          <p className="text-white font-bold text-xl">No treks created yet!</p>
          <p className="text-sm mt-2" style={{ color: "#9CA3AF" }}>
            Click "Create Trek" to add your first trek
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {treks.map((trek) => (
            <div
              key={trek.id}
              className="p-5 rounded-xl"
              style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-white text-lg">
                  {trek.trek_name}
                </h3>
                <span
                  className="text-xs px-2 py-1 rounded-full font-bold"
                  style={{
                    backgroundColor: (difficultyColors[trek.difficulty_level] || "#9CA3AF") + "20",
                    color: difficultyColors[trek.difficulty_level] || "#9CA3AF"
                  }}
                >
                  {trek.difficulty_level}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: "Duration", value: `${trek.duration_days} days` },
                  { label: "Cost", value: `$${trek.cost}` },
                  { label: "Max Group", value: trek.max_group_size }
                ].map((info) => (
                  <div
                    key={info.label}
                    className="p-2 rounded-lg text-center"
                    style={{ backgroundColor: "#0A0F1C" }}
                  >
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      {info.label}
                    </p>
                    <p className="text-sm font-bold text-white mt-1">
                      {info.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex space-x-2">
                <button
                  className="flex-1 py-2 rounded-md text-sm font-semibold"
                  style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setTreks(treks.filter(t => t.id !== trek.id))}
                  className="flex-1 py-2 rounded-md text-sm font-semibold"
                  style={{ border: "1px solid #EF4444", color: "#EF4444" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageTreks;