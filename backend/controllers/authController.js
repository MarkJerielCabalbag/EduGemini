import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
// import generateToken from "../utils/generateToken.js";
import fs from "fs";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
//@desc     register user
//@route    POST /api/eduGemini/register
//@access   public
const registerUser = asyncHandler(async (req, res, next) => {
  //deconstruct all the user rquest body from client uo
  const { user_username, user_email, user_password } = req.body;

  //next lets validate the request to make sure that all fields are filled out
  if (!user_email || !user_username || !user_password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  //find account duplication based on the user_email
  const userDuplicate = await User.findOne({ user_email });

  if (userDuplicate) {
    return res
      .status(400)
      .json({ message: `${userDuplicate.user_email} has already in used` });
  }

  //then encrypt the password of the created user before storing them into database
  const hashPassword = await bcrypt.hash(user_password, 10);

  const profileDir = path.join("profile", user_email);
  fs.mkdirSync(profileDir, {
    recursive: true,
  });

  const srcImg = path.resolve(__dirname, "../R.png");
  const srcImgResolvePath = path.join(profileDir, "R.png");
  fs.copyFileSync(srcImg, srcImgResolvePath);

  //if no duplicate then lets create that account
  const user = await User.create({
    user_email,
    user_username,
    user_password: hashPassword,
    profile_path: `profile/${user_email}`,
    profile: {
      filename: "R.png",
      destination: srcImgResolvePath,
    },
  });

  if (user) {
    return res.status(200).json({
      _id: user.id,
      user_email: user.user_email,
      user_username: user.user_username,
      token: generateToken(user._id),
      message: `Welcome ${user.user_username} :)`,
    });
  } else {
    return res
      .status(400)
      .json({ message: "There's seems to be a problem creating your account" });
  }
});

//@desc     login user
//@route    POST /api/eduGemini/login
//@access   public
const loginUser = asyncHandler(async (req, res, next) => {
  //get the data from the request body first
  const { user_email, user_password } = req.body;

  //validate that body request made from client side
  if (!user_email || !user_password) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  //then find the user from user model
  const user = await User.findOne({ user_email });

  if (user && (await bcrypt.compare(user_password, user.user_password))) {
    return res.status(200).json({
      _id: user.id,
      message: `Welcome back ${user.user_username}!`,
      user_username: user.user_username,
      user_email: user.user_email,
      token: generateToken(user._id),
    });
  } else {
    return res.status(400).json({ message: "Invalid email or password" });
  }
});

//@desc     logout
//@route    POST /api/eduGemini/logout
//@access   public
const logoutUser = asyncHandler(async (req, res) => {
  res
    .cookie("jwt", "", { httpOnly: true, expires: new Date(0) })
    .status(200)
    .json({ message: "You are successfully logout" });
});

//@desc     Get User Profile
//@route    POST /api/eduGemini/profile/:userId
//@access   private
const getUserProfile = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);

  return res.status(200).send([user]);
});

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};
// //@desc     Update User Profile
// //@route    POST /api/eduGemini/profile
// //@access   private
// const updateUserProfile = asyncHandler(async (req, res, next) => {
//   const user = await User.findById(req.user._id);

//   if (user) {
//     user.user_username = req.body.user_username || user.user_username;
//     user.user_email = req.body.user_email || user.user_email;

//     if (req.body.user_password) {
//       let newPassword = await bcrypt.hash(req.body.user_password, 10);
//       user.user_password = newPassword;

//       await user.save();
//       const newUpdatedUser = await User.findById(user._id).select(
//         "-user_password"
//       );

//       await newUpdatedUser.save();
//       //generateToken(res, newUpdatedUser._id, next);
//       console.log(newUpdatedUser);
//       return res.status(200).json({
//         _id: newUpdatedUser._id,
//         user_email: newUpdatedUser.user_email,
//         user_username: newUpdatedUser.user_username,
//         message: `${newUpdatedUser.user_username} is now successfully updated`,
//       });
//     }
//   }

//   res.status(400).json({ message: "Please fill all fields" });
// });

export default {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  // updateUserProfile,
};
