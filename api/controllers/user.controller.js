import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

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
