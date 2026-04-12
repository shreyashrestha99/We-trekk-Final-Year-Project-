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
            const response = await axios.post("/api/payments/initiate", {
                amount: parseFloat(amount),
                bookingId: bookingId,
                purchase_order_name: `${type} Payment`,
            });

            if (response.data.success && response.data.data.payment_url) {
                // Store necessary info in localStorage for verification after redirect
                localStorage.setItem("khalti_booking_id", bookingId);
                localStorage.setItem("khalti_amount", amount);
                
                // Redirect to Khalti's hosted page
                window.location.href = response.data.data.payment_url;
            } else {
                throw new Error("Failed to get payment URL");
            }
        } catch (error) {
            console.error("Payment Initiation Error:", error);
            alert("Failed to initiate payment. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (!bookingId || !amount) {
        return (
            <DashboardLayout menuItems={menuItems}>
                <div className="text-white p-8">Invalid Payment Request</div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout menuItems={menuItems}>
            <div className="max-w-2xl mx-auto mt-10">
                <div className="bg-[#1A2235] border border-[#1F2937] rounded-2xl p-8 shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center">
                        <span className="mr-3">🔒</span> Secure Payment
                    </h2>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between p-4 bg-[#0A0F1C] rounded-xl">
                            <span className="text-gray-400">Booking ID</span>
                            <span className="text-white font-mono">{bookingId.substring(0, 8)}...</span>
                        </div>
                        <div className="flex justify-between p-4 bg-[#0A0F1C] rounded-xl">
                            <span className="text-gray-400">Service</span>
                            <span className="text-white">{type}</span>
                        </div>
                        <div className="flex justify-between p-4 bg-[#0A0F1C] rounded-xl border-t border-[#1F2937] pt-6">
                            <span className="text-xl font-bold text-white">Total Amount</span>
                            <span className="text-2xl font-black" style={{ color: "#AAFF00" }}>
                                Rs. {amount}
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={handlePay}
                        disabled={loading}
                        className="w-full py-4 rounded-xl font-black text-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-3"
                        style={{ 
                            backgroundColor: "#AAFF00", 
                            color: "#0A0F1C",
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (
                            <span>Initiating Payment...</span>
                        ) : (
                            <>
                                <span>Pay with Khalti</span>
                                <span className="text-2xl">➔</span>
                            </>
                        )}
                    </button>
                    
                    <p className="text-center text-xs text-gray-500 mt-6 italic">
                        You will be redirected to Khalti's secure payment gateway.
                    </p>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Payment;