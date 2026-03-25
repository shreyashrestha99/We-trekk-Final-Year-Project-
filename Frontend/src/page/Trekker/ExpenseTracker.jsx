import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks", icon: "🏔️", path: "/explore" },
  { label: "Browse Groups", icon: "👥", path: "/trekker/groups" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState({
    amount: "",
    category: "",
    date: "",
    description: ""
  });
  const [errors, setErrors] = useState({});
  const [showForm, setShowForm] = useState(false);

  const categories = [
    "food", "transport", "accommodation", "gear", "other"
  ];

  const categoryColors = {
    food: "#F59E0B",
    transport: "#60A5FA",
    accommodation: "#34D399",
    gear: "#A78BFA",
    other: "#9CA3AF"
  };

  const validate = () => {
    const newErrors = {};
    if (!form.amount) newErrors.amount = "Amount is required";
    else if (isNaN(form.amount) || Number(form.amount) <= 0)
      newErrors.amount = "Enter a valid amount";
    if (!form.category) newErrors.category = "Category is required";
    if (!form.date) newErrors.date = "Date is required";
    return newErrors;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setExpenses([...expenses, { ...form, id: Date.now() }]);
    setForm({ amount: "", category: "", date: "", description: "" });
    setErrors({});
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const total = expenses.reduce((sum, e) => sum + Number(e.amount), 0);

  const byCategory = categories.map(cat => ({
    category: cat,
    total: expenses
      .filter(e => e.category === cat)
      .reduce((sum, e) => sum + Number(e.amount), 0)
  })).filter(c => c.total > 0);

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <p className="text-sm font-semibold tracking-widest uppercase"
            style={{ color: "#AAFF00" }}>
            Finance
          </p>
          <h1 className="text-3xl font-black text-white mt-1">
            Expense Tracker
          </h1>
        </div>
        <div className="space-x-3">
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 rounded-md font-bold text-sm"
            style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
          >
            + Add Expense
          </button>
          {expenses.length > 0 && (
            <button
              className="px-4 py-2 rounded-md font-bold text-sm"
              style={{ border: "1px solid #AAFF00", color: "#AAFF00" }}
            >
              📄 Download PDF
            </button>
          )}
        </div>
      </div>

      {/* ADD EXPENSE FORM */}
      {showForm && (
        <div
          className="p-6 rounded-xl mb-6"
          style={{ backgroundColor: "#1A2235", border: "1px solid #AAFF00" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">Add New Expense</h2>
          <form onSubmit={handleAdd} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Amount (NPR)
              </label>
              <input
                type="number"
                placeholder="e.g. 500"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.amount ? "#EF4444" : "#1F2937"}`
                }}
                value={form.amount}
                onChange={e => setForm({ ...form, amount: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.amount ? "#EF4444" : "#1F2937"}
              />
              {errors.amount && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.amount}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Category
              </label>
              <select
                className="w-full rounded-md p-3 text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.category ? "#EF4444" : "#1F2937"}`,
                  color: form.category ? "white" : "#6B7280"
                }}
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.category ? "#EF4444" : "#1F2937"}
              >
                <option value="">Select category</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Date
              </label>
              <input
                type="date"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
                style={{
                  backgroundColor: "#0A0F1C",
                  border: `1px solid ${errors.date ? "#EF4444" : "#1F2937"}`,
                  colorScheme: "dark"
                }}
                value={form.date}
                onChange={e => setForm({ ...form, date: e.target.value })}
                onFocus={e => e.target.style.borderColor = "#AAFF00"}
                onBlur={e => e.target.style.borderColor = errors.date ? "#EF4444" : "#1F2937"}
              />
              {errors.date && (
                <p className="text-xs mt-1" style={{ color: "#EF4444" }}>
                  ⚠ {errors.date}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-white">
                Description (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Lunch at teahouse"
                className="w-full rounded-md p-3 text-white text-sm outline-none"
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
                Add Expense
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

      {/* SUMMARY CARDS */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div
          className="p-5 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
            Total Spent
          </p>
          <p className="text-3xl font-black" style={{ color: "#AAFF00" }}>
            NPR {total.toLocaleString()}
          </p>
        </div>
        <div
          className="p-5 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
            Total Entries
          </p>
          <p className="text-3xl font-black" style={{ color: "#60A5FA" }}>
            {expenses.length}
          </p>
        </div>
        <div
          className="p-5 rounded-xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <p className="text-sm mb-1" style={{ color: "#9CA3AF" }}>
            Categories Used
          </p>
          <p className="text-3xl font-black" style={{ color: "#34D399" }}>
            {byCategory.length}
          </p>
        </div>
      </div>

      {/* BY CATEGORY */}
      {byCategory.length > 0 && (
        <div
          className="p-6 rounded-xl mb-6"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <h2 className="text-lg font-bold text-white mb-4">
            Spending by Category
          </h2>
          <div className="space-y-3">
            {byCategory.map(({ category, total: catTotal }) => (
              <div key={category}>
                <div className="flex justify-between mb-1">
                  <span
                    className="text-sm font-semibold capitalize"
                    style={{ color: categoryColors[category] }}
                  >
                    {category}
                  </span>
                  <span className="text-sm text-white font-bold">
                    NPR {catTotal.toLocaleString()}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full"
                  style={{ backgroundColor: "#1F2937" }}
                >
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(catTotal / total) * 100}%`,
                      backgroundColor: categoryColors[category]
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* EXPENSE LIST */}
      <div
        className="rounded-xl"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        <div className="p-4" style={{ borderBottom: "1px solid #1F2937" }}>
          <h2 className="text-lg font-bold text-white">All Expenses</h2>
        </div>

        {expenses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-4xl mb-3">💰</p>
            <p className="text-white font-bold">No expenses added yet!</p>
            <p className="text-sm mt-1" style={{ color: "#9CA3AF" }}>
              Click "Add Expense" to start tracking
            </p>
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "#1F2937" }}>
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="p-4 flex justify-between items-center"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold uppercase"
                    style={{
                      backgroundColor: categoryColors[expense.category] + "20",
                      color: categoryColors[expense.category],
                      border: `1px solid ${categoryColors[expense.category]}`
                    }}
                  >
                    {expense.category.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-semibold capitalize">
                      {expense.category}
                    </p>
                    <p className="text-xs" style={{ color: "#6B7280" }}>
                      {expense.description || "No description"} • {expense.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="font-black" style={{ color: "#AAFF00" }}>
                    NPR {Number(expense.amount).toLocaleString()}
                  </p>
                  <button
                    onClick={() => handleDelete(expense.id)}
                    className="text-xs px-2 py-1 rounded"
                    style={{ color: "#EF4444", border: "1px solid #EF444440" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ExpenseTracker;