import mongoose from "mongoose";

const userPackageSchema = new mongoose.Schema(
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

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    remainingPosts: { type: Number, required: true },

    postsToday: { type: Number, default: 0 },

    lastPostDate: { type: Date },

    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED"],
      default: "ACTIVE",
    },
  },
  { timestamps: true },
);
userPackageSchema.index({ user: 1, status: 1 });
const UserPackage = mongoose.model("UserPackage", userPackageSchema);
export default UserPackage;
