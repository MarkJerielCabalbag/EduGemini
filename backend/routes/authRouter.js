import express from "express";
import User from "../models/userModel.js";
import fs from "fs-extra";
import multer from "multer";
import { dirname } from "path";
import { fileURLToPath } from "url";
import authController from "../controllers/authController.js";
import bcrypt from "bcrypt";
import path from "path";
const authRouter = express.Router();
import asyncHandler from "express-async-handler";
import Classroom from "../models/classroomModel.js";
const __dirname = dirname(fileURLToPath(import.meta.url));
// import admin from "firebase-admin";
// import { createRequire } from "module";
// import { ref, deleteObject } from "firebase/storage";

// import { getApp } from "firebase/app";
// import { getStorage } from "firebase/storage";

// // Get a non-default Storage bucket
// const firebaseApp = getApp();
// const storageFirebase = getStorage(
//   firebaseApp,
//   "gs://edugemini-bucket-849f9.appspot.com"
// );
// register user
// authRouter.post("/register", authController.registerUser);

const storage = multer.diskStorage({
  destination: async (req, file, callback) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const locationSave = `profile/${user.profile_path}`;

    callback(null, locationSave);
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

//@desc     register user
//@route    POST /api/eduGemini/register
//@access   public
authRouter.post("/register", authController.registerUser);

//@desc     Update User Profile
//@route    POST /api/eduGemini/profile
//@access   private
authRouter.post(
  "/profile/:userId",
  upload.single("user_profile"),
  asyncHandler(async (req, res, next) => {
    const { userId } = req.params;
    const user = await User.findById(userId);
    const roomExist = await Classroom.findOne({ owner: userId });

    if (user) {
      user.user_username = req.body.user_username || user.user_username;

      await user.save();
      if (req.file) {
        console.log(`${user.profile_path}/${user.profile.filename}`);
        if (user.profile_path && user.profile.filename) {
          fs.rm(
            `profile/${user.profile_path}/${user.profile.filename}`,
            function (err) {
              if (err)
                console.log(
                  err,
                  `${user.profile_path}/${user.profile.filename}`
                );
              else console.log("File deleted successfully");
            }
          );
        }

        if (roomExist) {
          roomExist.user_img = req.file.filename;
          await roomExist.save();
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
    // console.log(newUpdatedUser);
    return res.status(200).json({
      _id: newUpdatedUser._id,
      user_email: newUpdatedUser.user_email,
      user_username: newUpdatedUser.user_username,
      message: `${newUpdatedUser.user_username} is now successfully updated`,
    });
  })
);

//login user
authRouter.post("/login", authController.loginUser);

//logout user
authRouter.post("/logout", authController.logoutUser);

authRouter.get("/profile/:userId", authController.getUserProfile);

//all user
authRouter.get("/allUser", authController.getAllUser);

export default authRouter;
