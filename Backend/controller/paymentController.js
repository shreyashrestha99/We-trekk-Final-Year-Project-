import Payment from "../models/Payment.js";

// POST /api/payments
export const createPayment = async (req, res) => {
  try {
    const payment = new Payment(req.body);
    const savedPayment = await payment.save();
    res.status(201).json(savedPayment);
  } catch (error) {
    res.status(400).json({ message: error.message });
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
