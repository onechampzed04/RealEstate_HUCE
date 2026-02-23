import generateToken from "../utils/generateToken.js";
import User from "../models/UserModel.js";
import otpStore from "../utils/otpStore.js";
import emailService from "../utils/emailService.js";
import bcrypt from "bcrypt";

class AuthService {
  async register({ name, email, phone, password }) {
    const lowerEmail = email.toLowerCase();
    
    // Kiểm tra email đã tồn tại
    const existingEmail = await User.findOne({ email: lowerEmail });
    if (existingEmail) throw new Error("Email đã được sử dụng");

    // Tạo pending registration và gửi OTP
    const otp = otpStore.createPendingRegistration(name, lowerEmail, password);
    
    try {
      await emailService.sendOtpEmail(lowerEmail, otp);
    } catch (err) {
      otpStore.removePendingRegistration(lowerEmail);
      throw new Error("Gửi email OTP thất bại. Vui lòng thử lại.");
    }

    return { 
      message: "OTP đã được gửi. Vui lòng kiểm tra email của bạn.",
      email: lowerEmail 
    };
  }

  async verifyRegistrationOtp({ email, otp }) {
    const lowerEmail = email.toLowerCase();
    
    // Lấy pending registration
    const pending = otpStore.getPendingRegistration(lowerEmail);
    if (!pending) {
      throw new Error("Không tìm thấy yêu cầu đăng ký hoặc OTP đã hết hạn");
    }

    // Xác thực OTP
    if (pending.otp !== otp) {
      throw new Error("Mã OTP không chính xác");
    }

    // Kiểm tra lại email không bị sử dụng
    const existingEmail = await User.findOne({ email: lowerEmail });
    if (existingEmail) {
      otpStore.removePendingRegistration(lowerEmail);
      throw new Error("Email đã được sử dụng");
    }

    // Tạo user mới
    const user = await User.create({
      name: pending.name,
      email: lowerEmail,
      password: pending.password,
    });

    // Xóa pending registration
    otpStore.removePendingRegistration(lowerEmail);

    // Tạo access token
    const accessToken = generateToken(user._id, user.role);

    return { 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken 
    };
  }

  async login({ email, password }) {
    const lowerEmail = email.toLowerCase();
    
    const user = await User.findOne({ email: lowerEmail }).select("+password");
    if (!user) throw new Error("Email hoặc mật khẩu không hợp lệ");

    const isMatch = await user.comparePassword(password);
    if (!isMatch) throw new Error("Email hoặc mật khẩu không hợp lệ");

    if (!user.isActive) throw new Error("Tài khoản của bạn đã bị vô hiệu hóa");

    const accessToken = generateToken(user._id, user.role);
    
    return { 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      accessToken 
    };
  }

  async requestPasswordChange({ userId, newPassword }) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User không tồn tại");

    // Tạo pending password change
    const otp = otpStore.createPendingPasswordChange(userId, newPassword);

    try {
      await emailService.sendOtpEmail(user.email, otp);
    } catch (err) {
      otpStore.removePendingPasswordChange(userId);
      throw new Error("Gửi email OTP thất bại. Vui lòng thử lại.");
    }

    return { 
      message: "OTP đã được gửi đến email của bạn",
      email: user.email 
    };
  }

  async verifyPasswordChangeOtp({ userId, otp }) {
    const pending = otpStore.getPendingPasswordChange(userId);
    if (!pending) {
      throw new Error("Không tìm thấy yêu cầu thay đổi mật khẩu hoặc OTP đã hết hạn");
    }

    if (pending.otp !== otp) {
      throw new Error("Mã OTP không chính xác");
    }

    // Cập nhật mật khẩu
    const user = await User.findById(userId);
    user.password = pending.newPassword;
    await user.save();

    otpStore.removePendingPasswordChange(userId);

    return { 
      message: "Mật khẩu đã được thay đổi thành công" 
    };
  }

  async requestNameChange({ userId, newName }) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User không tồn tại");

    // Kiểm tra tên mới không được sử dụng
    const existingName = await User.findOne({ name: newName });
    if (existingName && existingName._id.toString() !== userId) {
      throw new Error("Tên này đã được sử dụng bởi người dùng khác");
    }

    // Tạo pending name change
    const otp = otpStore.createPendingNameChange(userId, newName);

    try {
      await emailService.sendOtpEmail(user.email, otp);
    } catch (err) {
      otpStore.removePendingNameChange(userId);
      throw new Error("Gửi email OTP thất bại. Vui lòng thử lại.");
    }

    return { 
      message: "OTP đã được gửi đến email của bạn",
      email: user.email 
    };
  }

  async verifyNameChangeOtp({ userId, otp }) {
    const pending = otpStore.getPendingNameChange(userId);
    if (!pending) {
      throw new Error("Không tìm thấy yêu cầu thay đổi tên hoặc OTP đã hết hạn");
    }

    if (pending.otp !== otp) {
      throw new Error("Mã OTP không chính xác");
    }

    // Cập nhật tên
    const user = await User.findById(userId);
    user.name = pending.newName;
    await user.save();

    otpStore.removePendingNameChange(userId);

    return { 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      message: "Tên đã được thay đổi thành công" 
    };
  }

  async requestEmailChange({ userId, newEmail }) {
    const user = await User.findById(userId);
    if (!user) throw new Error("User không tồn tại");

    const lowerNewEmail = newEmail.toLowerCase();

    // Kiểm tra email mới không được sử dụng
    const existingEmail = await User.findOne({ email: lowerNewEmail });
    if (existingEmail) {
      throw new Error("Email này đã được sử dụng");
    }

    // Tạo pending email change
    const otp = otpStore.createPendingEmailChange(userId, lowerNewEmail);

    try {
      await emailService.sendOtpEmail(lowerNewEmail, otp);
    } catch (err) {
      otpStore.removePendingEmailChange(userId);
      throw new Error("Gửi email OTP thất bại. Vui lòng thử lại.");
    }

    return { 
      message: "OTP đã được gửi đến email mới của bạn",
      newEmail: lowerNewEmail 
    };
  }

  async verifyEmailChangeOtp({ userId, otp }) {
    const pending = otpStore.getPendingEmailChange(userId);
    if (!pending) {
      throw new Error("Không tìm thấy yêu cầu thay đổi email hoặc OTP đã hết hạn");
    }

    if (pending.otp !== otp) {
      throw new Error("Mã OTP không chính xác");
    }

    // Kiểm tra lại email không bị sử dụng
    const existingEmail = await User.findOne({ email: pending.newEmail });
    if (existingEmail) {
      otpStore.removePendingEmailChange(userId);
      throw new Error("Email này đã được sử dụng");
    }

    // Cập nhật email
    const user = await User.findById(userId);
    user.email = pending.newEmail;
    await user.save();

    otpStore.removePendingEmailChange(userId);

    return { 
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      message: "Email đã được thay đổi thành công" 
    };
  }
}

export default new AuthService();

