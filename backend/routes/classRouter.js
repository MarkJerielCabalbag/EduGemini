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
import fs from "fs";
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

// //create announcement in the class
// classRouter.post(
//   "/createAnnouncement/:roomId",
//   classroomControllers.createAnnouncement
// );

const __dirname = dirname(fileURLToPath(import.meta.url));
const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + "/announcements");
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  },
});

const announcementFiles = multer({ storage: storage });

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
      filename: file.originalname,
      path: `/announcements/${file.originalname}`,
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

// classRouter.delete(
//   "/deleteAnnouncement/:roomId",
//   classroomControllers.deleteAnnouncement
// );

//@desc     DELETE announcement
//@route    DELETE /api/eduGemini/classroom/getCreatedClassroom/deleteAnnouncement/:roomId
//@access   private
classRouter.delete("/deleteAnnouncement/:roomId", async (req, res) => {
  const classroomId = req.params.roomId;
  const { announceId } = req.body;

  if (!announceId) {
    return res.status(400).json({ message: "Announcement ID is required" });
  }

  const classroomExist = await Classroom.findById(classroomId);

  if (!classroomExist) {
    return res.status(404).json({ message: "Classroom not found" });
  }

  const getAllAnnouncement = classroomExist.announcement;
  const announcementToDelete = getAllAnnouncement.find(
    (announcement) => announcement._id.toString() === announceId
  );

  if (!announcementToDelete) {
    return res.status(404).json({ message: "Announcement not found" });
  }

  const updatedAnnouncements = getAllAnnouncement.filter(
    (announcement) => announcement._id.toString() !== announceId
  );

  // Remove files from the file system
  announcementToDelete.files.forEach((file) => {
    const filePath = __dirname + file.path;
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Failed to delete file: ${filePath}`, err);
      } else {
        console.log(`Deleted file: ${filePath}`);
      }
    });
  });

  classroomExist.announcement = updatedAnnouncements;
  await classroomExist.save();

  res.status(200).json({ message: "Deleted successfully" });
});

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
export default classRouter;
