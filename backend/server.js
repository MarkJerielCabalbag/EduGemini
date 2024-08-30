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
import adminRouter from "./routes/adminRoutes.js";
import User from "./models/userModel.js";
import bodyParser from "body-parser";
const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({ origin: true, credentials: true }));
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(
  "/announcements",
  express.static(path.join(__dirname, "/routes/announcements"))
);

app.use("/profile", express.static("profile"));
app.use("/outputs", express.static("classworks"));

app.use("/api/eduGemini", authRouter);
app.use("/api/eduGemini/classroom", classRouter);
app.use("/api/eduGemini/classwork", classworkRouter);
app.use("/api/eduGemini/ai", adminRouter);
app.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT || 7000}`);
});

// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", req.headers.origin);
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept"
//   );
//   next();
// });

// app.options("*", function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5000");
//   res.header("Access-Control-Allow-Credentials", "true");
//   res.header("Access-Control-Allow-Headers", [
//     "X-Requested-With",
//     "content-type",
//     "credentials",
//   ]);
//   res.header("Access-Control-Allow-Methods", "GET,POST,DELETE,PUT");
//   res.status(200);
//   next();
// });
