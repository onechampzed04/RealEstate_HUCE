
import jwt from 'jsonwebtoken';
import { JWT_CONFIG } from '../config/jwt.js';

const generateToken = (userId, role = 'USER') => {
  return jwt.sign(
    { 
      id: userId, 
      userId: userId,
      role: role 
    }, 
    JWT_CONFIG.ACCESS_TOKEN_SECRET, 
    {
      expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export default generateToken;
