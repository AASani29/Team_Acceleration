import express from 'express';
import multer from 'multer';
import {
  test,
  updateUser,
  deleteUser,
  searchUserByUsername,
  uploadUserImage,
} from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js'; // Middleware for verifying token

const router = express.Router();

// Multer configuration for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  }
});

// Test Route
router.get('/', test);
router.get("/search", searchUserByUsername);


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

// Image Upload Route
router.post('/upload-image', verifyToken, upload.single('image'), uploadUserImage);

export default router;
