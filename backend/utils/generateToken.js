
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'aVerySecretKey', {
    expiresIn: '30d',
  });
};

export default generateToken;
