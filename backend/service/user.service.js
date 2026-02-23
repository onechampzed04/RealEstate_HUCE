import User from "../models/UserModel.js";
import generateToken from "../utils/generateToken.js";

class UserService {
  // Logic Đăng nhập
  async loginUser(email, password) {
    const user = await User.findOne({ email });

    // Kiểm tra user và password (matchPassword là method định nghĩa trong Model)
    if (user && (await user.matchPassword(password))) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };
    } else {
      // Quăng lỗi để Controller hoặc Middleware bắt
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }
  }

  // Logic Đăng ký
  async registerUser(name, email, password) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new Error("User already exists");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };
    } else {
      const error = new Error("Invalid user data");
      error.statusCode = 400;
      throw error;
    }
  }

  // Create user directly (used after OTP verification)
  async createUser(name, email, password) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    const user = await User.create({ name, email, password });

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      };
    } else {
      const error = new Error('Invalid user data');
      error.statusCode = 400;
      throw error;
    }
  }

  // Logic lấy Profile
  async getUserProfile(userId) {
    const user = await User.findById(userId);

    if (user) {
      return {
        _id: user._id,
        name: user.name,
        email: user.email,
      };
    } else {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }
  }
  async updateUserProfile(userId, name, email, password) {
    const user = await User.findById(userId);
    
    if (user) {
      user.name = name;
      user.email = email;
      if (password) {
        user.password = password;
      }
      const updatedUser = await user.save();
      return {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
      };
    } else {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
  }

  // Change password after OTP verification
  async changePasswordAfterOtp(userId, newPassword) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.password = newPassword;
    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: 'Password changed successfully',
    };
  }

  // Change name after OTP verification
  async changeNameAfterOtp(userId, newName) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    user.name = newName;
    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: 'Name changed successfully',
    };
  }

  // Change email after OTP verification
  async changeEmailAfterOtp(userId, newEmail) {
    const user = await User.findById(userId);

    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    // Check if new email is already taken
    const existingUser = await User.findOne({ email: newEmail });
    if (existingUser && existingUser._id.toString() !== userId) {
      const error = new Error('Email already in use');
      error.statusCode = 400;
      throw error;
    }

    user.email = newEmail;
    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      message: 'Email changed successfully',
    };
  }
}

export default new UserService();
