import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "dd5d13l0p",
  api_key: process.env.CLOUDINARY_API_KEY || "394887866187762",
  api_secret: process.env.CLOUDINARY_API_SECRET || "3R9vwK-zY0twfi-stE3xZtpVzME",
});

export const test = (req, res) => {
  res.json({
    message: 'API is working!',
  });
};

// Update user
export const updateUser = async (req, res, next) => {
  // Check if the authenticated user matches the user being updated
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can update only your account!'));
  }
  try {
    // If the password is being updated, hash it
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    // Update the user in the database, including the coverPicture field
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          profilePicture: req.body.profilePicture,
          coverPicture: req.body.coverPicture, // Added coverPicture field
        },
      },
      { new: true } // Return the updated document
    );

    // Exclude the password from the response
    const { password, ...rest } = updatedUser._doc;

    // Send the updated user data as the response
    res.status(200).json(rest);
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};

// Delete user
export const deleteUser = async (req, res, next) => {
  // Check if the authenticated user matches the user being deleted
  if (req.user.id !== req.params.id) {
    return next(errorHandler(401, 'You can delete only your account!'));
  }
  try {
    // Delete the user from the database
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json('User has been deleted...');
  } catch (error) {
    // Pass any errors to the error handler middleware
    next(error);
  }
};



let userCache = []; // Temporary in-memory storage for user data

// Function to load all users into memory
const loadUsersIntoMemory = async () => {
  try {
    // Fetch all users and exclude password
    userCache = await User.find({}).select('-password');
    console.log('Users loaded into memory');
  } catch (err) {
    console.error('Error loading users into memory', err);
  }
};

// Load users when the server starts
loadUsersIntoMemory();

// Optionally, you can refresh this data at regular intervals (e.g., every 5 minutes)
setInterval(loadUsersIntoMemory, 5 * 60 * 1000);  // Refresh every 5 minutes

// Search user by username from memory
export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    // Validate input
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    // Search for the user in the cached data (in-memory)
    const user = userCache.find(user => user.username.toLowerCase() === username.toLowerCase());

    if (!user) {
      return res.status(404).json({ message: "No user found" });
    }

    // Return the user profile
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Upload user profile image
export const uploadUserImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    console.log('Uploading image to Cloudinary...', req.file.path);

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'user_profiles',
      resource_type: 'image',
    });

    console.log('Cloudinary upload successful:', result.secure_url);

    // Delete the temporary file
    fs.unlinkSync(req.file.path);
    
    res.status(200).json({ 
      message: 'Image uploaded successfully',
      imageUrl: result.secure_url 
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    // Clean up the temporary file if it exists
    if (req.file && req.file.path) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (unlinkError) {
        console.error('Error deleting temporary file:', unlinkError);
      }
    }
    next(error);
  }
};