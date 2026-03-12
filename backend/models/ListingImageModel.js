import mongoose from "mongoose";

const listingImageSchema = new mongoose.Schema(
  {
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
      index: true,
    },

    url: {
      type: String,
      required: true,
      trim: true,
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

listingImageSchema.index(
  { listing: 1, isPrimary: 1 },
  { unique: true, partialFilterExpression: { isPrimary: true } },
);

const ListingImage = mongoose.model("ListingImage", listingImageSchema);
export default ListingImage;