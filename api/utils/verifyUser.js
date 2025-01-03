import jwt from 'jsonwebtoken';
import { errorHandler } from './error.js';

export const verifyToken = (req, res, next) => {
  // First, try to get the token from cookies, or from the Authorization header
  const token =
    req.cookies.access_token ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null);

  if (!token) {
    console.log("Token Missing"); // Debug log
    return next(errorHandler(401, 'You are not authenticated!'));
  }

  console.log("Token Received:", token); // Debug log

  // Verify the JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT Verification Error:", err); // Debug log
      return next(errorHandler(403, 'Token is not valid or expired!'));
    }

    console.log("Decoded User:", user); // Debug log
    req.user = user; // Attach the user to the request
    next(); // Proceed to the next middleware
  });
};
