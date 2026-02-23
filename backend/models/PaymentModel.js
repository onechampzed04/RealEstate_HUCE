import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    package: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Package",
      required: true,
    },

    amount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["VNPAY", "MOMO", "BANK_TRANSFER"],
      required: true,
    },

    orderCode: {
      type: String,
      required: true,
      unique: true,
    },
    transactionId: String,
    paidAt: Date,
    gatewayResponse: Object,
    isProcessed: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
  },
  { timestamps: true },
);

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;
