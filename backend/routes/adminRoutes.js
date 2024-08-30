import express from "express";
import adminController from "../controllers/adminController.js";

const adminRouter = express.Router();

adminRouter.post("/admin/login", adminController.loginAdmin);

adminRouter.get("/admin/allClass", adminController.allClass);

adminRouter.post("/admin/classApproval", adminController.approveClass);

adminRouter.post("/admin/declineApproval", adminController.declineClass);

export default adminRouter;
