import jwt from 'jsonwebtoken';
import { errorHandler } from '../utils/error.js';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    console.error('No token found');
    return next(errorHandler(401, 'Unauthorized - No token provided'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return next(errorHandler(401, 'Unauthorized - Token expired'));
      }
      if (err.name === 'JsonWebTokenError') {
        return next(errorHandler(401, 'Unauthorized - Invalid token'));
      }
      return next(errorHandler(403, 'Forbidden - Token verification failed'));
    }

    req.user = decoded;
    next();
  });
};