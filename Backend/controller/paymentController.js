import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import axios from "axios";

// POST /api/payments/initiate
export const initiatePayment = async (req, res) => {
  try {
    const { amount, bookingId, purchase_order_name } = req.body;

    // Khalti expects amount as an integer in paisa
    const amountInPaisa = Math.round(parseFloat(amount) * 100);

    const payload = {
      return_url: "http://localhost:5173/payment-verification",
      website_url: "http://localhost:5173",
      amount: amountInPaisa,
      purchase_order_id: `${bookingId}_${Date.now()}`, // Unique ID for each attempt
      purchase_order_name: purchase_order_name || `Booking for ${bookingId}`,
    };

    console.log("--- Khalti Initiation Start ---");
    console.log("Payload:", payload);
    console.log("Secret Key (hidden):", process.env.KHALTI_SECRET_KEY ? "EXISTS" : "MISSING");

    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json"
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      config
    );

    console.log("Khalti Success Response:", response.data);
    console.log("--- Khalti Initiation End ---");

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("--- Khalti Initiate Error ---");
    console.error("Error Data:", error.response?.data || error.message);
    console.error("Status Code:", error.response?.status);
    console.error("-----------------------------");
    
    res.status(500).json({
      success: false,
      message: "Khalti payment initiation failed",
      error: error.response?.data || error.message,
    });
  }
};

// POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { pidx, bookingId, amount } = req.body;

    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      config
    );

    if (response.data.status === "Completed") {
      // 1. Update Booking Status
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.booking_status = "Confirmed";
      await booking.save();

      // 2. Create/Update Payment Record
      const payment = new Payment({
        booking_id: bookingId,
        amount: amount,
        payment_method: "khalti",
        payment_status: "Completed",
        transaction_id: response.data.transaction_id || pidx,
        khalti_token: pidx // storing pidx here
      });
      await payment.save();

      return res.status(200).json({
        success: true,
        message: "Payment successfully verified",
        payment
      });
    }

    res.status(400).json({ 
      success: false, 
      message: "Khalti verification failed", 
      status: response.data.status 
    });
  } catch (error) {
    console.error("Khalti Verify Error:", error.response?.data || error.message);
    res.status(500).json({ 
      success: false,
      message: "Khalti verification error", 
      error: error.response?.data || error.message 
    });
  }
};

// GET /api/payments/:bookingId
export const getPaymentStatus = async (req, res) => {
  try {
    const payments = await Payment.find({ booking_id: req.params.bookingId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
