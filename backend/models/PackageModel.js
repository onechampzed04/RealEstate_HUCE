import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },

    type: {
      type: String,
      enum: ["FREE", "BASIC", "STANDARD", "PREMIUM", "VIP", "PRO", "ENTERPRISE"],
      required: true,
      default: "STANDARD",
    },

    description: String,

    maxPostsPerDay: { type: Number, default: 1, min: 0 },

    // maxTotalPosts: { type: Number, default: 1, min: 0 },

    price: { type: Number, required: true, min: 0 },

    durationDays: { type: Number, required: true, min: 1 },

    allowHotPost: { type: Boolean, default: false },

    autoApprove: { type: Boolean, default: false },

    priority: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const Package = mongoose.model("Package", packageSchema);
export default Package;
