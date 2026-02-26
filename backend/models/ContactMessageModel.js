import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },

    senderName: {
      type: String,
      required: true,
      trim: true,
    },

    senderEmail: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    senderPhone: {
      type: String,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    status: {
      type: String,
      enum: ["NEW", "READ", "REPLIED"],
      default: "NEW",
    },

    packageInfo: {
      package: { type: mongoose.Schema.Types.ObjectId, ref: "Package" },
      expiredAt: Date,
      remainingPosts: Number,
    },
  },

  { timestamps: true },
);
const ContactMessage = mongoose.model("ContactMessage", contactSchema);

export default ContactMessage;
