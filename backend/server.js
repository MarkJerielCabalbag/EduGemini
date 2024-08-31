import express from "express";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import authRouter from "./routes/authRouter.js";

import classRouter from "./routes/classRouter.js";

import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import classworkRouter from "./routes/classworkRouter.js";
import bodyParser from "body-parser";

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

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
