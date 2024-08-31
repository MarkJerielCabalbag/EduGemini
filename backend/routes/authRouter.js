import express from "express";

import { protectRoutes } from "../middlewares/authMiddleware.js";
import User from "../models/userModel.js";
import fs from "fs-extra";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import authController from "../controllers/authController.js";

import bcrypt from "bcrypt";
const authRouter = express.Router();
import asyncHandler from "express-async-handler";

// register user
authRouter.post("/register", authController.registerUser);

//login user
authRouter.post("/login", authController.loginUser);

//logout user
authRouter.post("/logout", authController.logoutUser);

authRouter.get("/profile/:userId", authController.getUserProfile);

const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const user = await User.findById(req.user._id);
    const locationSave = user.profile_path;

    callback(null, locationSave);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

//user profile

authRouter.post(
  "/profile",
  upload.single("user_profile"),
  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.user_username = req.body.user_username || user.user_username;
      user.user_email = req.body.user_email || user.user_email;

      await user.save();
      if (req.file) {
        if (user.profile_path && user.profile.filename) {
          fs.rm(
            `${user.profile_path}/${user.profile.filename}`,
            function (err) {
              if (err) console.log(err);
              else console.log("File deleted successfully");
            }
          );
        }

        user.profile = req.file;
        await user.save();
      }

      if (req.body.user_password) {
        let newPassword = await bcrypt.hash(req.body.user_password, 10);
        user.user_password = newPassword;

        await user.save();
      }
    }
    const newUpdatedUser = await User.findById(user._id).select(
      "-user_password"
    );

    await newUpdatedUser.save();
    //generateToken(res, newUpdatedUser._id, next);
    console.log(newUpdatedUser);
    return res.status(200).json({
      _id: newUpdatedUser._id,
      user_email: newUpdatedUser.user_email,
      user_username: newUpdatedUser.user_username,
      message: `${newUpdatedUser.user_username} is now successfully updated`,
    });
  })
);

export default authRouter;
