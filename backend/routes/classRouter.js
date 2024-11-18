import express from "express";
import classroomControllers from "../controllers/classroomControllers.js";
import { protectRoutes } from "../middlewares/authMiddleware.js";
const classRouter = express.Router();
import multer from "multer";
import User from "../models/userModel.js";
import Classroom from "../models/classroomModel.js";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { nanoid } from "nanoid";
import fs from "fs-extra";
// classRouter.use(protectRoutes);
//create class
classRouter.post("/createClass", classroomControllers.createClass);

//all classroom from classroom collection
classRouter.get("/allClass/:userId", classroomControllers.allClass);

//get all class from user id
classRouter.get("/getAllClass/:userId", classroomControllers.getAllClass);

//get specific class
classRouter.get(
  "/getCreatedClassroom/:roomId",
  classroomControllers.getCreatedClassroom
);

// classRouter.get("/admin/adminAllClass", classroomControllers.adminAllClass);

// //create announcement in the class
// classRouter.post(
//   "/createAnnouncement/:roomId",
//   classroomControllers.createAnnouncement
// );

const __dirname = dirname(fileURLToPath(import.meta.url));
// const storage = multer.diskStorage({
//   destination: function (req, file, callback) {
//     callback(null, __dirname + "/announcements");
//   },
//   filename: function (req, file, callback) {
//     callback(null, file.originalname);
//   },
// });

// const announcementFiles = multer({ storage: storage });

// //@desc     POST create announcements
// //@route    POST /api/eduGemini/classroom/createAnnouncement/:roomId
// //@access   private
// classRouter.post(
//   "/createAnnouncement/:roomId",
//   announcementFiles.array("files"),
//   async (req, res) => {
//     const { title, description } = req.body;
//     const classroomId = req.params.roomId;
//     const files = req.files;

//     // Validate the request
//     if (!title || !description) {
//       return res
//         .status(400)
//         .json({ message: "Please at least fill out Title and Description" });
//     }

//     // Find the classroom
//     const classroomExist = await Classroom.findById(classroomId);

//     if (!classroomExist) {
//       return res
//         .status(404)
//         .json({ message: `Classroom with ID ${classroomId} does not exist` });
//     }

//     // Get the classroom owner details
//     const classroomOwner = classroomExist.owner;
//     const user = await User.findById(classroomOwner).select("-user_password");

//     if (!user) {
//       return res.status(404).json({ message: "Owner not found" });
//     }

//     const username = user.user_username;
//     const email = user.user_email;

//     // Add the announcement with file paths
//     const announcementFiles = files.map((file) => ({
//       filename: file.originalname,
//       path: `/announcements/${file.originalname}`,
//     }));

//     classroomExist.announcement.unshift({
//       _id: nanoid(),
//       username,
//       email,
//       title,
//       description,
//       profile_path: user.profile_path,
//       user_img: user.profile.filename,
//       files: announcementFiles,
//     });

//     // Save the updated classroom document
//     await classroomExist.save();

//     res.status(200).json({
//       message: "Announcement created successfully",
//       classroom: classroomExist,
//     });
//   }
// );

const storageAnnouncement = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      const { userId, title } = req.body;
      const user = await User.findById(userId).select("-user_password");
      if (!user) {
        return callback(new Error("User not found"), null);
      }

      const { roomId } = req.params;

      const roomExist = await Classroom.findById(roomId);

      if (!roomExist) {
        return callback(new Error("Room not found"), null);
      }

      const locationSave = `classworks/${user.user_username}/${roomExist.class_code}/announcements/${title}`;

      await roomExist.save();
      fs.mkdirsSync(locationSave);
      callback(null, locationSave);
    } catch (error) {
      return callback(error, null);
    }
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const announcementFiles = multer({ storage: storageAnnouncement });

//@desc     POST create announcements
//@route    POST /api/eduGemini/classroom/createAnnouncement/:roomId
//@access   private
classRouter.post(
  "/createAnnouncement/:roomId",
  announcementFiles.array("files"),
  async (req, res) => {
    const { title, description } = req.body;
    const classroomId = req.params.roomId;
    const files = req.files;

    // Validate the request
    if (!title || !description) {
      return res
        .status(400)
        .json({ message: "Please at least fill out Title and Description" });
    }

    // Find the classroom
    const classroomExist = await Classroom.findById(classroomId);

    if (!classroomExist) {
      return res
        .status(404)
        .json({ message: `Classroom with ID ${classroomId} does not exist` });
    }

    // Get the classroom owner details
    const classroomOwner = classroomExist.owner;
    const user = await User.findById(classroomOwner).select("-user_password");

    if (!user) {
      return res.status(404).json({ message: "Owner not found" });
    }

    const username = user.user_username;
    const email = user.user_email;

    // Add the announcement with file paths
    const announcementFiles = files.map((file) => ({
      originalname: file.originalname,
      path: `${user.user_username}/${classroomExist.class_code}/announcements/${title}/${file.originalname}`,
    }));

    classroomExist.announcement.unshift({
      _id: nanoid(),
      username,
      email,
      title,
      description,
      profile_path: user.profile_path,
      user_img: user.profile.filename,
      files: announcementFiles,
      path: `${user.user_username}/${classroomExist.class_code}/announcements/${title}`,
      publicComment: [],
    });

    // Save the updated classroom document
    await classroomExist.save();

    res.status(200).json({
      message: "Announcement created successfully",
      classroom: classroomExist,
    });
  }
);

//create announcement in the class
classRouter.get(
  "/getAnnouncement/:roomId",
  classroomControllers.getAnnouncements
);

classRouter.post(
  "/comment/:roomId/:announceId",
  classroomControllers.createPublicComment
);

classRouter.delete(
  "/deleteAnnouncement/:roomId",
  classroomControllers.deleteAnnouncement
);

//create classwork type
classRouter.post("/createClasswork", classroomControllers.classworkType);

//get all classwork type
classRouter.get(
  "/getClassworkType/:roomId",
  classroomControllers.getClassworkType
);

//remove classwork type
classRouter.delete(
  "/deleteClassworkType",
  classroomControllers.deleteClassworkType
);

//join student
classRouter.post("/join", classroomControllers.joinStudent);
// classRouter.get("/joinedClass/:userId", classroomControllers.joinedClass);

//reject student
classRouter.post("/rejectStudent", classroomControllers.rejectJoinStudent);

classRouter.post("/acceptStudent", classroomControllers.acceptJoinStudent);

//reject multiple students
classRouter.post(
  "/rejectStudents",
  classroomControllers.rejectMultipleStudents
);

//approve multople students
classRouter.post(
  "/approveStudents",
  classroomControllers.approveMultipleStudents
);

//plagiarism checker
classRouter.post(
  "/plagiarismChecker/:userId",
  classroomControllers.plagiarismChecker
);
export default classRouter;
