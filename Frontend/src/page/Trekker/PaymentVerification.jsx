import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../../utils/axios";
import DashboardLayout from "../../components/DashboardLayout";

const menuItems = [
  { label: "Dashboard", icon: "🏠", path: "/trekker/dashboard" },
  { label: "Browse Treks and Rides", icon: "🏔️", path: "/explore" },
  { label: "My Bookings", icon: "📋", path: "/trekker/bookings" },
  { label: "Expense Tracker", icon: "💰", path: "/trekker/expenses" },
  { label: "My Profile", icon: "👤", path: "/trekker/profile" },
];

const PaymentVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("Verifying your payment, please wait...");

    const pidx = searchParams.get("pidx");
    const status_from_url = searchParams.get("status");
    const purchase_order_id = searchParams.get("purchase_order_id");

    useEffect(() => {
        const verify = async () => {
            if (!pidx) {
                setStatus("error");
                setMessage("Invalid payment session.");
                return;
            }

            try {
                const bookingId = localStorage.getItem("khalti_booking_id") || purchase_order_id;
                const amount = localStorage.getItem("khalti_amount");

                const response = await axios.post("/api/payments/verify", {
                    pidx,
                    bookingId,
                    amount: parseFloat(amount)
                });

                if (response.data.success) {
                    setStatus("success");
                    setMessage("Payment Verified Successfully! Redirecting...");
                    localStorage.removeItem("khalti_booking_id");
                    localStorage.removeItem("khalti_amount");
                    
                    setTimeout(() => {
                        navigate("/trekker/bookings");
                    }, 3000);
                } else {
                    setStatus("error");
                    setMessage(response.data.message || "Payment verification failed.");
                }
            } catch (error) {
                console.error("Verification Error:", error);
                setStatus("error");
                setMessage("An error occurred during verification.");
            }
        };

        verify();
    }, [pidx, navigate, purchase_order_id]);

    return (
        <DashboardLayout menuItems={menuItems}>
            <div className="max-w-md mx-auto mt-20 p-8 bg-[#1A2235] border border-[#1F2937] rounded-2xl shadow-2xl text-center">
                {status === "verifying" && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 border-4 border-[#AAFF00] border-t-transparent rounded-full animate-spin mx-auto"></div>
                        <h2 className="text-xl font-bold text-white">Verifying Payment</h2>
                        <p className="text-gray-400">{message}</p>
                    </div>
                )}

                {status === "success" && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-3xl">✓</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Payment Successful!</h2>
                        <p className="text-gray-400">{message}</p>
                    </div>
                )}

                {status === "error" && (
                    <div className="space-y-4">
                        <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto">
                            <span className="text-white text-3xl">✕</span>
                        </div>
                        <h2 className="text-xl font-bold text-white">Payment Failed</h2>
                        <p className="text-gray-400">{message}</p>
                        <button 
                            onClick={() => navigate("/trekker/bookings")}
                            className="mt-4 px-6 py-2 bg-[#AAFF00] text-[#0A0F1C] rounded-lg font-bold"
                        >
                            Back to Bookings
                        </button>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default PaymentVerification;
