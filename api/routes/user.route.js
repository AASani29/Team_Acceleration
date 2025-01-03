import express from 'express';
import {
  test,
  updateUser,
  deleteUser,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Middleware for verifying token

const router = express.Router();

// Test Route
router.get('/', test);

// Update User Route
router.post('/update/:id', verifyToken, async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Ensure req.user is set by verifyToken middleware
    if (!req.user || req.user.id !== req.params.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: You can only update your own account!" });
    }

    // Proceed to update user via the controller
    await updateUser(req, res, next);
  } catch (err) {
    console.error("Error in update route:", err);
    next(err); // Pass error to middleware
  }
});

// Delete User Route
router.delete('/delete/:id', verifyToken, async (req, res, next) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ success: false, message: "User ID is required." });
    }

    // Ensure req.user is set by verifyToken middleware
    if (!req.user || req.user.id !== req.params.id) {
      return res.status(401).json({ success: false, message: "Unauthorized: You can only delete your own account!" });
    }

    // Proceed to delete user via the controller
    await deleteUser(req, res, next);
  } catch (err) {
    console.error("Error in delete route:", err);
    next(err); // Pass error to middleware
  }
});

export default router;
