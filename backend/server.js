import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRouter.js";
import cookieParser from "cookie-parser";
import classRouter from "./routes/classRouter.js";
import { protectRoutes } from "./middlewares/authMiddleware.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import classworkRouter from "./routes/classworkRouter.js";
import User from "./models/userModel.js";
import generateToken from "./utils/generateToken.js";
import expressAsyncHandler from "express-async-handler";
const app = express();
connectDB();

const corsOptions = {
  origin: "http://localhost:5000",
  methods: "GET, POST, PUT, DELETE, OPTIONS",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  var cookie = req.cookies.jwt;
  const userId = req.user._id;
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  if (!cookie) {
    res.cookie("jwt", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });
  } else {
    console.log("lets check that this is a valid cookie");
    // send cookie along to the validation functions...
  }
  next();
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  "/announcements",
  express.static(path.join(__dirname, "/routes/announcements"))
);

app.use("/api/eduGemini", authRouter);
app.use("/api/eduGemini/classroom", classRouter);
app.use("/api/eduGemini/classwork", classworkRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT || 7000}`);
});
