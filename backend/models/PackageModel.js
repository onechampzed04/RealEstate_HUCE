import mongoose from "mongoose";

const packageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    maxPostsPerDay: {
      type: Number,
      default: 1,
    },

    price: {
      type: Number,
      required: true,
    },

    durationDays: {
      type: Number,
      required: true,
    },

    allowHotPost: {
      type: Boolean,
      default: false,
    },

    autoApprove: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

const Package = mongoose.model("Package", packageSchema);
export default Package;

//wAjtuwQqWAvIehKe
