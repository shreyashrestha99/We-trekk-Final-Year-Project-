import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import axios from "axios";

// POST /api/payments/verify
export const verifyPayment = async (req, res) => {
  try {
    const { token, amount, bookingId } = req.body;

    // 1. Call Khalti Verification API
    const config = {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
      },
    };

    const khaltiResponse = await axios.post(
      "https://khalti.com/api/v2/payment/verify/",
      { token, amount },
      config
    );

    if (khaltiResponse.data) {
      // 2. Update Booking Status
      const booking = await Booking.findById(bookingId);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      booking.booking_status = "Confirmed";
      await booking.save();

      // 3. Create/Update Payment Record
      const payment = new Payment({
        booking_id: bookingId,
        amount: amount / 100, // Khalti amount is in paisa
        payment_method: "khalti",
        payment_status: "Completed",
        khalti_token: token,
        transaction_id: khaltiResponse.data.idx
      });
      await payment.save();

      return res.status(200).json({
        message: "Payment successfully verified",
        payment
      });
    }

    res.status(400).json({ message: "Khalti verification failed" });
  } catch (error) {
    console.error("Khalti Verify Error:", error.response?.data || error.message);
    res.status(500).json({ 
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
