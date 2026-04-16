import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks and Rides", icon: "🏔️", path: "/explore" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

// Map failure reason codes to user-friendly messages
const FAILURE_REASONS = {
  no_data: "No payment data received from eSewa.",
  incomplete: "Payment was not completed by eSewa.",
  not_found: "Payment record not found. Please contact support.",
  cancelled: "Payment was cancelled.",
  server_error: "A server error occurred. Please try again.",
};

const PaymentVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // These params are set by the backend AFTER it processes the eSewa callback
  // Backend redirects to: /payment-verification?status=success|failed&bookingId=...&amount=...
  const status = searchParams.get("status");        // "success" or "failed"
  const bookingId = searchParams.get("bookingId");  // set on success
  const amount = searchParams.get("amount");         // set on success
  const reason = searchParams.get("reason");         // set on failure

  const [displayStatus, setDisplayStatus] = useState("verifying");
  const [message, setMessage] = useState("Processing your payment, please wait...");

  useEffect(() => {
    if (!status) {
      // No params — something went wrong before redirect
      setDisplayStatus("error");
      setMessage("No payment status received. If you completed payment, please check your bookings.");
      return;
    }

    if (status === "success") {
      setDisplayStatus("success");
      setMessage(
        `Payment of NPR ${amount ? parseFloat(amount).toLocaleString() : ""} confirmed! Your booking is secured.`
      );
      console.log("[eSewa] Payment verified. Booking ID:", bookingId);

      // Auto-redirect to bookings after 4 seconds
      setTimeout(() => navigate("/trekker/bookings"), 4000);

    } else if (status === "failed") {
      setDisplayStatus("error");
      const friendlyReason = FAILURE_REASONS[reason] || "Payment was unsuccessful. Please try again.";
      setMessage(friendlyReason);
      console.warn("[eSewa] Payment failed. Reason:", reason);
    }
  }, [status, bookingId, amount, reason, navigate]);

  return (
    <DashboardLayout menuItems={menuItems}>
      <div
        className="max-w-md mx-auto mt-20 p-8 rounded-2xl shadow-2xl text-center"
        style={{ backgroundColor: "#1A2235", border: "1px solid #1F2937" }}
      >
        {/* VERIFYING STATE */}
        {displayStatus === "verifying" && (
          <div className="space-y-4">
            <div
              className="w-16 h-16 border-4 border-t-transparent rounded-full animate-spin mx-auto"
              style={{ borderColor: "#AAFF00", borderTopColor: "transparent" }}
            />
            <h2 className="text-xl font-bold text-white">Processing Payment</h2>
            <p style={{ color: "#9CA3AF" }}>{message}</p>
          </div>
        )}

        {/* SUCCESS STATE */}
        {displayStatus === "success" && (
          <div className="space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white text-4xl"
              style={{ backgroundColor: "#34D399" }}
            >
              ✓
            </div>
            <h2 className="text-xl font-bold text-white">Payment Successful! 🎉</h2>
            <p style={{ color: "#9CA3AF" }}>{message}</p>
            {bookingId && (
              <p className="text-xs font-mono" style={{ color: "#6B7280" }}>
                Booking Ref: {bookingId.slice(-8).toUpperCase()}
              </p>
            )}
            <p className="text-xs" style={{ color: "#6B7280" }}>
              Redirecting to your bookings in a moment...
            </p>
            <button
              onClick={() => navigate("/trekker/bookings")}
              className="mt-4 px-6 py-2 rounded-lg font-bold text-sm transition-all"
              style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
            >
              View My Bookings
            </button>
          </div>
        )}

        {/* FAILURE STATE */}
        {displayStatus === "error" && (
          <div className="space-y-4">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto text-white text-4xl"
              style={{ backgroundColor: "#EF4444" }}
            >
              ✕
            </div>
            <h2 className="text-xl font-bold text-white">Payment Failed</h2>
            <p style={{ color: "#9CA3AF" }}>{message}</p>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={() => navigate("/trekker/bookings")}
                className="px-6 py-2 rounded-lg font-bold text-sm"
                style={{ backgroundColor: "#AAFF00", color: "#0A0F1C" }}
              >
                Back to Bookings
              </button>
            </div>
            <p className="text-xs mt-2" style={{ color: "#6B7280" }}>
              Your booking reservation is still held. You can retry payment from My Bookings.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default PaymentVerification;