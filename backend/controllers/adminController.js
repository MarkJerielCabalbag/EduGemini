import asyncHandler from "express-async-handler";
import Admin from "../models/adminModel.js";
import Classroom from "../models/classroomModel.js";
import { nanoid } from "nanoid";

//@desc     login admin
//@route    POST /api/eduGemini/register
//@access   private
const loginAdmin = asyncHandler(async (req, res, next) => {
  const { admin_username, admin_password } = req.body;

  const admin = await Admin.findOne({ admin_username: admin_username });
  if (!admin_username || !admin_password) {
    return res.status(400).json({ message: "Please fill all fields" });
  } else if (
    admin.admin_username === admin_username &&
    admin.admin_password === admin_password
  ) {
    return res.status(200).json({ message: "Hello admin :)" });
  }
});

//@desc     get all classroom from classroom collection
//@route    GET /api/eduGemini/ai/admin/allClass
//@access   private
const allClass = asyncHandler(async (req, res, next) => {
  //just find all the classroom documents then return it

  const allClassroom = await Classroom.find();

  res.status(200).send(allClassroom);
});

//@desc     approve a class
//@route    POST /api/eduGemini/ai/admin/classApproval
//@access   private
const approveClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.body;
  const classroom = await Classroom.findById(classId);

  if (!classroom) {
    return res.status(404).json({ message: "Class not found" });
  }

  classroom.approvalStatus = "approved";
  classroom.class_code = nanoid(11);

  await classroom.save();

  res.status(200).json({ message: `${classroom.classname} approved` });
});

//@desc     decline a class
//@route    POST /api/eduGemini/ai/admin/classApproval
//@access   private
const declineClass = asyncHandler(async (req, res, next) => {
  const { classId } = req.body;
  const classroom = await Classroom.findById(classId);

  if (!classroom) {
    return res.status(404).json({ message: "Class not found" });
  }

  classroom.approvalStatus = "declined";

  await classroom.save();

  res.status(200).json({ message: `${classroom.classname} declined` });
});

export default { loginAdmin, allClass, approveClass, declineClass };
