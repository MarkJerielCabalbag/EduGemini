import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRouter.js";
import classRouter from "./routes/classRouter.js";
import classworkRouter from "./routes/classworkRouter.js";
import adminRouter from "./routes/adminRoutes.js";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

connectDB();
app.use(express.static("profile"));
app.use(express.static("classworks"));

app.use("/api/eduGemini", authRouter);
app.use("/api/eduGemini/classroom", classRouter);
app.use("/api/eduGemini/classwork", classworkRouter);
app.use("/api/eduGemini/ai", adminRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on: ${process.env.PORT || 7000}`);
});
