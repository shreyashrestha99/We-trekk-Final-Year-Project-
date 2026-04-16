import Payment from "../models/Payment.js";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import crypto from "crypto";

// ==============================
// HELPER: Generate eSewa HMAC-SHA256 Signature
// ==============================
const generateEsewaSignature = (totalAmount, transactionUuid) => {
  const secretKey = process.env.ESEWA_SECRET_KEY;
  const merchantId = process.env.ESEWA_MERCHANT_ID;
  const signatureString = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${merchantId}`;

  console.log("[eSewa] Signature string:", signatureString);

  return crypto
    .createHmac("sha256", secretKey)
    .update(signatureString)
    .digest("base64");
};

// ==============================
// POST /api/payments/initiate
// Called by frontend to get eSewa form payload
// ==============================
export const initiatePayment = async (req, res) => {
  try {
    const { amount, bookingId, purchase_order_name } = req.body;

    // --- Validation ---
    if (!amount || isNaN(parseFloat(amount))) {
      return res.status(400).json({ success: false, message: "Invalid amount provided" });
    }
    if (!bookingId) {
      return res.status(400).json({ success: false, message: "Booking ID is required" });
    }

    // --- Fetch booking to confirm it exists ---
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // --- Prepare eSewa payload ---
    const totalAmount = parseFloat(amount).toFixed(2);
    const transactionUuid = `${bookingId}_${Date.now()}`;
    const merchantId = process.env.ESEWA_MERCHANT_ID;
    const signature = generateEsewaSignature(totalAmount, transactionUuid);

    const esewaPayload = {
      amount: totalAmount,
      tax_amount: "0",
      total_amount: totalAmount,
      transaction_uuid: transactionUuid,
      product_code: merchantId,
      product_service_charge: "0",
      product_delivery_charge: "0",
      success_url: process.env.ESEWA_SUCCESS_URL,
      failure_url: process.env.ESEWA_FAILURE_URL,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      signature: signature,
    };

    console.log("[eSewa] Initiate payload:", esewaPayload);

    // --- Store a Pending payment record in DB ---
    await Payment.create({
      booking_id: bookingId,
      amount: parseFloat(amount),
      payment_method: "esewa",
      payment_status: "Pending",
      transaction_id: transactionUuid,
    });

    res.status(200).json({
      success: true,
      esewaUrl: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
      formData: esewaPayload,
    });

  } catch (error) {
    console.error("[eSewa] Initiate Error:", error.message);
    res.status(500).json({ success: false, message: "Payment initiation failed", error: error.message });
  }
};

// ==============================
// GET /api/payments/esewa-success
// eSewa redirects here after successful payment
// ==============================
export const esewaSuccess = async (req, res) => {
  try {
    const { data } = req.query;

    if (!data) {
      console.error("[eSewa] Success callback: no data param");
      return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=failed&reason=no_data`);
    }

    // Decode the base64 response from eSewa
    const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
    console.log("[eSewa] Success callback decoded:", decodedData);

    const { transaction_uuid, total_amount, status } = decodedData;

    if (status !== "COMPLETE") {
      console.warn("[eSewa] Payment not complete. Status:", status);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=failed&reason=incomplete`);
    }

    // Extract the real bookingId from the transaction_uuid (format: bookingId_timestamp)
    const cleanBookingId = transaction_uuid.split("_")[0];

    // Find the pending payment record
    const payment = await Payment.findOne({ transaction_id: transaction_uuid });
    if (!payment) {
      console.error("[eSewa] No pending payment found for transaction_uuid:", transaction_uuid);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=failed&reason=not_found`);
    }

    // Prevent double-processing
    if (payment.payment_status === "Completed") {
      console.log("[eSewa] Payment already processed:", transaction_uuid);
      return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=success&bookingId=${cleanBookingId}`);
    }

    // Update payment record
    payment.payment_status = "Completed";
    payment.gateway_token = transaction_uuid;
    await payment.save();

    // Update booking status to Confirmed
    const booking = await Booking.findById(cleanBookingId);
    if (booking && booking.booking_status !== "Confirmed") {
      booking.booking_status = "Confirmed";
      await booking.save();
      console.log("[eSewa] Booking confirmed:", cleanBookingId);
    }

    // Redirect to frontend verification page with success status
    return res.redirect(
      `${process.env.FRONTEND_URL}/payment-verification?status=success&bookingId=${cleanBookingId}&amount=${total_amount}`
    );

  } catch (error) {
    console.error("[eSewa] Success callback error:", error.message);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=failed&reason=server_error`);
  }
};

// ==============================
// GET /api/payments/esewa-failure
// eSewa redirects here on payment failure or cancel
// ==============================
export const esewaFailure = async (req, res) => {
  try {
    console.log("[eSewa] Failure callback received. Query:", req.query);

    // Mark any pending payment for this session as Failed
    const { data } = req.query;
    if (data) {
      try {
        const decodedData = JSON.parse(Buffer.from(data, "base64").toString("utf-8"));
        const { transaction_uuid } = decodedData;
        if (transaction_uuid) {
          await Payment.findOneAndUpdate(
            { transaction_id: transaction_uuid },
            { payment_status: "Failed" }
          );
          console.log("[eSewa] Marked payment as failed for:", transaction_uuid);
        }
      } catch (e) {
        console.warn("[eSewa] Could not decode failure data:", e.message);
      }
    }

    return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=failed&reason=cancelled`);
  } catch (error) {
    console.error("[eSewa] Failure callback error:", error.message);
    return res.redirect(`${process.env.FRONTEND_URL}/payment-verification?status=failed&reason=server_error`);
  }
};

// ==============================
// GET /api/payments/:bookingId
// Get payment status for a booking
// ==============================
export const getPaymentStatus = async (req, res) => {
  try {
    const payments = await Payment.find({ booking_id: req.params.bookingId });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};