import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRouter.js";
import classRouter from "./routes/classRouter.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import classworkRouter from "./routes/classworkRouter.js";
import adminRouter from "./routes/adminRoutes.js";

const app = express();
connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(express.static("announcements"));
app.use(express.static("profile"));

app.use("/api/eduGemini", authRouter);
app.use("/api/eduGemini/classroom", classRouter);
app.use("/api/eduGemini/classwork", classworkRouter);
app.use("/api/eduGemini/ai", adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT || 7000}`);
});
