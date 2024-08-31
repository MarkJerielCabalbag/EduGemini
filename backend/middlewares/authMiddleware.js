import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

const protectRoutes = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // get token from header
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-user_password");

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Not Authorized no token " });
    }
  } else {
    return res.status(401).json({ message: "Not Authorized no token " });
  }

  if (!token) {
    res.status(401);
    console.log("no token");
  }
});

export { protectRoutes };
