import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },

    slug: { type: String, unique: true, sparse: true },

    type: {
      type: String,
      enum: ["SALE", "RENT"],
      default: "SALE",
      required: true,
    },

    propertyType: {
      type: String,
      enum: ["APARTMENT", "HOUSE", "LAND", "VILLA"],
      required: true,
    },

    price: { type: Number, required: true },
    area: { type: Number },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
      },
      address: String,
      city: String,
      district: String,
      ward: String,
    },

    bedrooms: Number,
    bathrooms: Number,

    images: [String],

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED", "EXPIRED"],
      default: "PENDING",
    },

    approvedAt: Date,
    expiredAt: Date,

    favoriteCount: {
      type: Number,
      default: 0,
    },

    isHot: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

// Index
listingSchema.index({ user: 1, createdAt: -1 });
listingSchema.index({ "location.city": 1 });
listingSchema.index({ price: 1 });
listingSchema.index({ location: "2dsphere" });

const Listing = mongoose.model("Listing", listingSchema);
export default Listing;

/// bài đăng yêu thích
/// admin client (lượt xem, thời gian đăng, bài đăng, ...)
/// auto duyệt bài
/// người dùng report bài đăng vi phạm
/// thanh toán gói đăng bài (vnpay)
/// quản lý gói đăng bài (số lượng bài đăng, thời gian hiệu lực, giá tiền, ...)
/// quản lý người dùng (đăng ký, đăng nhập, phân quyền, ...)
/// quản lý bài đăng (tạo, sửa, xóa, duyệt, ...)
/// quản lý hình ảnh bài đăng (tải lên, xóa, ...)
