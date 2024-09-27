import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import fs from "fs-extra";
import path from "path";
import { v4 as uuidv4 } from "uuid";
const classworkRouter = express.Router();
import asyncHandler from "express-async-handler";
import Classroom from "../models/classroomModel.js";
import User from "../models/userModel.js";
import { protectRoutes } from "../middlewares/authMiddleware.js";
import { nanoid } from "nanoid";
import classworkController from "../controllers/classworkController.js";
import moment from "moment";

const handleFileValidationError = (err, req, res, next) => {
  if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// classworkRouter.use(protectRoutes);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const storageClasswork = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      const { userId } = req.body;
      const user = await User.findById(userId).select("-user_password");
      if (!user) {
        return callback(new Error("User not found"), null);
      }

      const { roomId } = req.params;
      const { classworkTitle } = req.body;
      const roomExist = await Classroom.findById(roomId);

      if (!roomExist) {
        return callback(new Error("Room not found"), null);
      }

      const getClassCode = roomExist.class_code;

      const classworkTitleDuplicate = roomExist.classwork.find(
        (classwork) =>
          classwork.classwork_title === classworkTitle && getClassCode
      );

      if (classworkTitleDuplicate) {
        return callback(new Error("Classwork title already exists"), null);
      }

      const locationSave = `classworks/${user.user_username}/${roomExist.class_code}/${req.body.classworkTitle}/instruction`;

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

const uploadClasswork = multer({ storage: storageClasswork });

//@desc     create classwork
//@route    POST /api/eduGemini/classwork/createClasswork/:roomId
//@access   private
classworkRouter.post(
  "/createClasswork/:roomId",
  uploadClasswork.single("classworkAttachFile"),
  handleFileValidationError,
  asyncHandler(async (req, res, next) => {
    const {
      classworkTitle,
      classworkType,
      classworkDescription,
      classworkDueDate,
      classworkDueTime,
      userId,
    } = req.body;

    const classworkAttachFile = req.file;

    const { roomId } = req.params;

    const roomExist = await Classroom.findById(roomId);
    const user = await User.findById(userId);

    if (
      !classworkTitle ||
      !classworkType ||
      !classworkDueDate ||
      !classworkDueTime
    ) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    if (!roomExist) {
      return res.status(404).json({ message: `${roomId} ID does not exist` });
    }

    const getIdFromRoom = roomExist.classwork;
    const classworkTitleDuplicate = getIdFromRoom.find(
      (classwork) => classwork.classwork_title === classworkTitle
    );

    if (classworkTitleDuplicate) {
      return res
        .status(400)
        .json({ message: `${classworkTitle} is already exist` });
    }

    const classworkCreated = roomExist.classwork.unshift({
      _id: uuidv4(),
      classwork_title: classworkTitle,
      classwork_type: classworkType,
      classwork_description: classworkDescription,
      classwork_due_date: classworkDueDate,
      classwork_due_time: classworkDueTime,
      classwork_attach_file: classworkAttachFile,

      classwork_folder_path: `classworks/${user.user_username}/${roomExist.class_code}/${classworkTitle}`,
      classwork_outputs: [],
    });

    await roomExist.save();

    res.status(200).json({
      message: "New classwork has been added",
      workId: classworkCreated._id,
    });
  })
);

//@desc     update classwork information
//@route    POST /api/eduGemini/classwork/updateClasswork/:roomId/:workId
//@access   private
const storageUpdatedClassworkInstruction = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      const { workId, roomId } = req.params;

      const roomExist = await Classroom.findById(roomId);
      const getIdFromRoom = roomExist.classwork;
      const classworkIndex = getIdFromRoom.findIndex(
        (classwork) => classwork._id === workId
      );

      const classworkToUpdate = getIdFromRoom[classworkIndex];

      if (!workId) {
        return callback(new Error("Classwork not found"), false);
      }

      const classworkFolderFile =
        classworkToUpdate.classwork_attach_file.destination;

      console.log(classworkFolderFile);
      callback(null, classworkFolderFile);
    } catch (error) {
      callback(error, false);
    }
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const uploadUpdatedClassworkInstruction = multer({
  storage: storageUpdatedClassworkInstruction,
});

classworkRouter.post(
  "/updateClasswork/:roomId/:workId",
  uploadUpdatedClassworkInstruction.single("classworkAttachFile"),
  asyncHandler(async (req, res, next) => {
    const { roomId, workId } = req.params;
    const { userId } = req.body;
    const classworkAttachFile = req.file;
    const user = await User.findById(userId);
    const roomExist = await Classroom.findById(roomId);

    if (!roomExist) {
      return res.status(404).json({ message: "Id doesn't exist" });
    }

    const getIdFromRoom = roomExist.classwork;
    const classworkIndex = getIdFromRoom.findIndex(
      (classwork) => classwork._id.toString() === workId
    );

    const classworkToUpdate = getIdFromRoom[classworkIndex];

    // Check if a new file is uploaded
    if (classworkAttachFile) {
      // Delete the old file
      console.log(classworkToUpdate.classwork_attach_file.destination);
      console.log(classworkToUpdate.classwork_attach_file.filename);

      fs.rm(
        `${classworkToUpdate.classwork_folder_path}/instruction/${classworkToUpdate.classwork_attach_file.filename}`,
        function (err) {
          if (err) return console.log(err);
          console.log("file deleted successfully");
        }
      );
      classworkToUpdate.classwork_attach_file = classworkAttachFile;
    }
    classworkToUpdate.classwork_title =
      req.body.classworkTitle || classworkToUpdate.classwork_title;
    classworkToUpdate.classwork_type =
      req.body.classworkType || classworkToUpdate.classwork_type;
    classworkToUpdate.classwork_description =
      req.body.classworkDescription || classworkToUpdate.classwork_description;

    if (req.body.classworkDueDate) {
      classworkToUpdate.classwork_due_date = req.body.classworkDueDate;
    }

    if (req.body.classworkDueTime) {
      classworkToUpdate.classwork_due_time = req.body.classworkDueTime;
    }

    getIdFromRoom[classworkIndex] = classworkToUpdate;

    await roomExist.save();

    console.log(classworkToUpdate);

    return res.status(200).json({ message: "Successfully updated" });
  })
);

//get classworks
classworkRouter.get("/getClasswork/:roomId", classworkController.getClassworks);

//get classwork
classworkRouter.get("/classworkData/:workId", classworkController.getClasswork);

//get classwork info
classworkRouter.get(
  "/getClasswork/:roomId/:workId",
  classworkController.getClassworkInformation
);

//remove classwork
classworkRouter.post(
  "/deleteClasswork/:roomId/:workId",
  classworkController.deleteClasswork
);

const storageAddfiles = multer.diskStorage({
  destination: async (req, file, callback) => {
    try {
      const { workId } = req.params;
      const { userId, roomId } = req.body;

      const roomExist = await Classroom.findById(roomId);
      if (!roomExist) {
        return callback(new Error("Classroom not found"), null);
      }

      const foundStudent = roomExist.students.find(
        (student) => student._id.toString() === userId
      );
      if (!foundStudent) {
        return callback(new Error("Student not found"), null);
      }

      const pathFile = roomExist.classwork.find(
        (path) => path._id.toString() === workId
      );
      if (!pathFile) {
        return callback(new Error("Classwork not found"), null);
      }

      const pathStore = `${pathFile.classwork_folder_path}/answers/${foundStudent.user_lastname}, ${foundStudent.user_firstname} ${foundStudent.user_middlename}`;

      fs.mkdirsSync(pathStore);
      callback(null, pathStore);
    } catch (error) {
      callback(error, null);
    }
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const uploadAddedFiles = multer({
  storage: storageAddfiles,
});

//@desc   POST student works
//@route    POST /api/eduGemini/classwork/addFiles/:workId
//@access   private
classworkRouter.post(
  "/addFiles/:workId",
  uploadAddedFiles.array("files"),
  handleFileValidationError,
  asyncHandler(async (req, res) => {
    try {
      const { workId } = req.params;
      const { roomId, userId, date, timeAction } = req.body;
      const files = req.files;

      const roomExist = await Classroom.findById(roomId);
      if (!roomExist) {
        return res.status(400).json({ message: `${roomId} id does not exist` });
      }

      const foundStudent = roomExist.students.find(
        (student) => student._id.toString() === userId
      );
      if (!foundStudent) {
        return res.status(400).json({ message: `Student ${userId} not found` });
      }

      const findClasswork = roomExist.classwork.findIndex(
        (classwork) => classwork._id.toString() === workId
      );

      if (findClasswork === -1) {
        return res
          .status(400)
          .json({ message: `Classwork ${workId} not found` });
      }

      const workIndex = roomExist.classwork[findClasswork];

      let studentExist = workIndex.classwork_outputs.find(
        (output) => output._id.toString() === userId
      );

      // Collect existing filenames for the student
      const existingFilenames = studentExist
        ? studentExist.files.map((file) => file.filename)
        : [];

      // Check for file duplication
      const duplicatedFiles = files.filter((file) =>
        existingFilenames.includes(file.originalname)
      );

      if (duplicatedFiles.length > 0) {
        const duplicatedFileNames = duplicatedFiles
          .map((file) => file.originalname)
          .join(", ");
        return res.status(400).json({
          message: `The file(s) ${duplicatedFileNames} already exist.`,
        });
      }

      // If no duplication, proceed to add files
      const addedFiles = files.map((file) => ({
        filename: file.originalname,
        path: `/${foundStudent.user_lastname}, ${foundStudent.user_firstname} ${foundStudent.user_middlename}`,
        size: file.size,
      }));

      if (studentExist) {
        studentExist.files.push(...addedFiles);
        studentExist.workStatus = {
          id: 1,
          name: "Shelved",
        };
        studentExist.timeSubmition = `${date}, ${timeAction}`;
      } else {
        workIndex.classwork_outputs.unshift({
          _id: userId,
          files: addedFiles,
          workStatus: {
            id: 1,
            name: "Shelved",
          },
          path: `/answers/${foundStudent.user_lastname}, ${foundStudent.user_firstname} ${foundStudent.user_middlename}`,
          timeSubmition: `${date}, ${timeAction}`,
          studentFeedback: null,
          teacherFeedback: null,
          score: null,
          chancesResubmition: 3,
          privateComment: [],
        });
      }

      console.log(`shelved : ${date}, ${timeAction}`);

      roomExist.classwork[findClasswork] = workIndex;

      await roomExist.save();

      res.status(200).json({ message: "Files uploaded successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error saving files", error });
    }
  })
);

//get attachments
classworkRouter.get(
  "/getAttachments/:roomId/:workId/:userId",
  classworkController.getAttachments
);

//delete attachment
classworkRouter.post(
  "/deleteAttachment/:roomId/:workId/:userId",
  classworkController.deleteAttachment
);

//submit classwork
classworkRouter.post(
  "/submit/:roomId/:workId/:userId",
  classworkController.submitAttachment
);

//cancel classwork submition
classworkRouter.post(
  "/cancel/:roomId/:workId/:userId",
  classworkController.cancelSubmition
);

//student list
classworkRouter.get(
  "/students/:workId/:roomId",
  classworkController.studentList
);

//get all student scores
classworkRouter.get(
  "/allactivities/:roomId",
  classworkController.getAllActivities
);

//add chance
classworkRouter.post(
  "/addchance/:workId/:roomId/:userId",
  classworkController.addChance
);

//accecpt late
classworkRouter.post(
  "/late/:roomId/:workId/:userId",
  classworkController.acceptLateClasswork
);

//private comment
classworkRouter.post(
  "/comment/:roomId/:workId/:userId",
  classworkController.createPrivateComment
);

//export excel
classworkRouter.get(
  "/exportData/:roomId",
  classworkController.getExportActivities
);

//export specific activity
classworkRouter.get(
  "/exportActivity/:workId/:roomId",
  classworkController.exportSpecificActivity
);

export default classworkRouter;
