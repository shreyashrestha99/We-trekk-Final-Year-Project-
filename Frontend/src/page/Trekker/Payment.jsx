import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks and Rides", icon: "🏔️", path: "/explore" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const bookingId = queryParams.get("bookingId");
  const amount = queryParams.get("amount");
  const type = queryParams.get("type") || "Booking";

  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      // Step 1: Call backend to get eSewa form data + signature
      const response = await axios.post("/api/payments/initiate", {
        amount: parseFloat(amount),
        bookingId: bookingId,
        purchase_order_name: `${type} Payment`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to initiate payment");
      }

      const { esewaUrl, formData } = response.data;

      // Step 2: Create a hidden HTML form and submit it to eSewa
      // This is the CORRECT way to redirect to eSewa v2 — via HTTP form POST
      const form = document.createElement("form");
      form.method = "POST";
      form.action = esewaUrl;

      Object.entries(formData).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });

      document.body.appendChild(form);
      form.submit(); // Redirects browser to eSewa payment page

    } catch (error) {
      console.error("Payment initiation failed:", error);
      alert(error.response?.data?.message || error.message || "Failed to initiate payment.");
      setLoading(false);
    }
    // Note: setLoading(false) not called on success because the page redirects
  };

  if (!bookingId || !amount) {
    return (
      <DashboardLayout menuItems={menuItems}>
        <div style={{ color: "white", padding: "2rem" }}>
          <p>❌ Invalid payment request. Missing booking ID or amount.</p>
          <button
            onClick={() => navigate("/trekker/bookings")}
            style={{ marginTop: "1rem", padding: "0.5rem 1rem", backgroundColor: "#AAFF00", color: "#0A0F1C", border: "none", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}
          >
            Back to Bookings
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout menuItems={menuItems}>
      <div className="max-w-2xl mx-auto mt-10">
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
        >
          <h2 className="text-2xl font-black text-white mb-6 flex items-center">
            <span className="mr-3">🔒</span> Secure Payment via eSewa
          </h2>

          <div className="space-y-4 mb-8">
            <div
              className="flex justify-between p-4 rounded-xl"
              style={{ backgroundColor: "#0A0F1C" }}
            >
              <span style={{ color: "#9CA3AF" }}>Booking ID</span>
              <span className="text-white font-mono">{bookingId.substring(0, 8)}...</span>
            </div>
            <div
              className="flex justify-between p-4 rounded-xl"
              style={{ backgroundColor: "#0A0F1C" }}
            >
              <span style={{ color: "#9CA3AF" }}>Service</span>
              <span className="text-white">{type}</span>
            </div>
            <div
              className="flex justify-between p-4 rounded-xl"
              style={{ backgroundColor: "#0A0F1C", borderTop: "1px solid #1F2937" }}
            >
              <span className="text-xl font-bold text-white">Total Amount</span>
              <span className="text-2xl font-black" style={{ color: "#AAFF00" }}>
                NPR {parseFloat(amount).toLocaleString()}
              </span>
            </div>
          </div>

          {/* eSewa branding info */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl mb-6"
            style={{ backgroundColor: "#60BB46" + "20", border: "1px solid #60BB4640" }}
          >
            <span className="text-2xl">💚</span>
            <div>
              <p className="text-sm font-bold" style={{ color: "#60BB46" }}>Pay with eSewa</p>
              <p className="text-xs" style={{ color: "#9CA3AF" }}>
                You will be redirected to eSewa's secure sandbox payment page.
              </p>
            </div>
          </div>

          <button
            id="esewa-pay-button"
            onClick={handlePay}
            disabled={loading}
            className="w-full py-4 rounded-xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
            style={{
              backgroundColor: loading ? "#88AA00" : "#AAFF00",
              color: "#0A0F1C",
              opacity: loading ? 0.7 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span>Redirecting to eSewa...</span>
            ) : (
              <>
                <span>Pay NPR {parseFloat(amount).toLocaleString()} with eSewa</span>
                <span className="text-2xl">➔</span>
              </>
            )}
          </button>

          <p className="text-center text-xs mt-6 italic" style={{ color: "#6B7280" }}>
            🔐 Transactions are securely processed by eSewa Payment Gateway (Sandbox Mode)
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Payment;