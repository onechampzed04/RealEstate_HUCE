import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import crypto from "crypto";
import bcrypt from "bcrypt";

class AuthService {
  async register({ name, email, phone, password }) {
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) throw new Error("Email already in use");

    const existingName = await User.findOne({
      name: name.toLowerCase(),
    });
    if (existingName) throw new Error("Name already in use");

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Generate verification token

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      phone,
      password: hashedPassword,
    });

    const accessToken = generateToken(user._id, user.role);

    return { user, accessToken };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user) throw new Error("Invalid email or password");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid email or password");

    const accessToken = generateToken(user._id, user.role);
    return { user, accessToken };
  }

  //   export const refreshTokenService = async (refreshToken) => {
  //   try {
  //     const decoded = jwt.verify(
  //       refreshToken,
  //       process.env.JWT_REFRESH_SECRET
  //     );

  //     const user = await User.findById(decoded.userId);
  //     if (!user) {
  //       throw new Error('User không tồn tại');
  //     }

  //     const newAccessToken = generateAccessToken(user);

  //     return {
  //       accessToken: newAccessToken
  //     };
  //   } catch (error) {
  //     throw new Error('Refresh token không hợp lệ');
  //   }
}

export default new AuthService();
