import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectRoutes = asyncHandler(async (req, res, next) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.userId).select("-user_password");

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not Authorized no token " });
    }
  } else {
    return res.status(401).json({ message: "Not Authorized no token " });
  }
});

export { protectRoutes };
