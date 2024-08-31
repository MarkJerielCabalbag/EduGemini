import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectRoutes = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;
  console.log(token);

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-user_password");

      next();
    } catch (err) {
      res.status(401).json({ message: "Not Authorized, invalid token 1" });
      console.log("Not authorized, invalid token 1");
    }
  } else {
    const userId = req.user._id;
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    console.log(token);
  }
});

export { protectRoutes };
