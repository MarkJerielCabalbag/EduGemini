import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectRoutes = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user._id = await User.findById(decoded.id).select("-user_password");

      next();
    } catch (err) {
      res.status(401).json({ message: "Not Authorized, invalid token" });
      console.log("Not authorized, invalid token");
    }
  } else {
    res.status(401).json({ message: "Not Authorized, no token" });
    console.log("Not authorized, no token");
  }
  next();
});

export { protectRoutes };
