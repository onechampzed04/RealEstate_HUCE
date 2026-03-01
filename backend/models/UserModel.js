import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      select: false, // không trả password khi query
    },

    phone: {
      type: String,
      trim: true,
    },

    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    avatarUrl: {
      type: String,
      default: null,
    },

    avatarPublicId: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

// 🔐 Hash password trước khi save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// 🔎 So sánh password khi login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// 📈 Index cho email
userSchema.index({ email: 1 });

const User = mongoose.model("User", userSchema);

export default User;
