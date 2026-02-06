import User from '../models/UserModel.js';
import generateToken from '../utils/generateToken.js';

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
      const error = new Error('Invalid email or password');
      error.statusCode = 401;
      throw error;
    }
  }

  // Logic Đăng ký
  async registerUser(name, email, password) {
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
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
  }
}

export default new UserService();