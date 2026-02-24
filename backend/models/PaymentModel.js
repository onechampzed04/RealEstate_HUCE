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
    orderCode: {
      type: Number,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["PENDING", "PAID", "CANCELLED"],
      default: "PENDING",
    },
    paymentMethod: {
      type: String,
      default: "PayOS",
    },
  },
  { timestamps: true },
);

paymentSchema.index({ user: 1 });
paymentSchema.index({ orderCode: 1 });

const Payment = mongoose.model("Payment", paymentSchema);
export default Payment;

// import mongoose from "mongoose";

// const paymentSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },

//     package: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Package",
//       required: true,
//     },

//     amount: { type: Number, required: true },

//     paymentMethod: {
//       type: String,
//       enum: ["VNPAY", "MOMO", "BANK_TRANSFER"],
//       required: true,
//     },

//     orderCode: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     transactionId: String,
//     paidAt: Date,
//     gatewayResponse: Object,
//     isProcessed: {
//       type: Boolean,
//       default: false,
//     },

//     status: {
//       type: String,
//       enum: ["PENDING", "SUCCESS", "FAILED"],
//       default: "PENDING",
//     },
//   },
//   { timestamps: true },
// );
// paymentSchema.index({ user: 1, status: 1 });
// const Payment = mongoose.model("Payment", paymentSchema);
// export default Payment;
