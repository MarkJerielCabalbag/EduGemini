import asyncHandler from "express-async-handler";
import Classroom from "../models/classroomModel.js";
import User from "../models/userModel.js";

import fs from "fs";
import path from "path";
import multer from "multer";
import { rimraf } from "rimraf";
import { fileURLToPath } from "url";
import moment from "moment";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
//@desc     get classwork
//@route    GET /api/eduGemini/classwork/getClasswork/:roomId
//@access   private
const getClassworks = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;
  const roomExist = await Classroom.findById(roomId);
  if (!roomExist) {
    return res.status(404).json({ message: "No classroom found" });
  }

  const rooms = roomExist.classwork;

  res.status(200).send(rooms);
});

//@desc     get classwork information
//@route    GET /api/eduGemini/classwork/getClasswork/:roomId/:workId
//@access   private
const getClassworkInformation = asyncHandler(async (req, res, next) => {
  const { workId, roomId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  if (!roomExist) {
    return res.status(404).json({ message: `${roomId} does not exist` });
  }

  const getIdFromRoom = roomExist.classwork;
  const classworkIndex = getIdFromRoom.findIndex(
    (classwork) => classwork._id.toString() === workId
  );

  const classworkInformation = getIdFromRoom[classworkIndex];

  res.status(200).send([classworkInformation]);
});

//@desc     get classwork information
//@route    GET /api/eduGemini/classwork/classworkData/:workId
//@access   private
const getClasswork = asyncHandler(async (req, res, next) => {
  const { workId } = req.params;
  const findClasswork = await Classroom.find({ "classwork._id": workId });
  res.status(200).send(findClasswork);
});

//@desc     delete classwork information
//@route    POST /api/eduGemini/classwork/deleteClasswork/:roomId/:workId
//@access   private
const deleteClasswork = asyncHandler(async (req, res, next) => {
  const { roomId, workId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  if (!roomExist) {
    return res.status(404).json({ message: "It does not exist" });
  }

  const getIdFromRoom = roomExist.classwork;
  const classworkIndex = getIdFromRoom.findIndex(
    (classwork) => classwork._id.toString() === workId
  );

  const classworkToDelete = getIdFromRoom[classworkIndex];
  // console.log(classworkToDelete);
  const folderPath = classworkToDelete.classwork_folder_path;
  console.log(folderPath);

  fs.rmSync(folderPath, { recursive: true, force: true });
  const updatedClassworks = getIdFromRoom.filter(
    (matchId) => matchId._id !== classworkToDelete._id
  );

  roomExist.classwork = updatedClassworks;

  await roomExist.save();
  res.status(200).json({
    message: `${classworkToDelete.classwork_title} is successfully deleted`,
  });
});

//@desc     get classwork attachments
//@route    POST /api/eduGemini/classwork/getAttachments/:roomId/:workId/:userId
//@access   private
const getAttachments = asyncHandler(async (req, res, next) => {
  const { roomId, workId, userId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  const classworks = roomExist.classwork.find((work) => work._id === workId);

  const studentOutputs = classworks.classwork_outputs.filter(
    (outputs) => outputs._id === userId
  );

  return res.status(200).send(studentOutputs);
});

//@desc     delete classwork attachment
//@route    POST /api/eduGemini/classwork/deleteAttachment/:roomId/:workId/:userId
//@access   private
const deleteAttachment = asyncHandler(async (req, res) => {
  const { roomId, workId, userId } = req.params;
  const { filename, date, timeAction } = req.body;

  try {
    const roomExist = await Classroom.findById(roomId);
    if (!roomExist) {
      return res.status(404).json({ message: "Classroom not found" });
    }

    const classwork = roomExist.classwork.find(
      (work) => work._id.toString() === workId
    );
    if (!classwork) {
      return res.status(404).json({ message: "Classwork not found" });
    }

    const studentOutput = classwork.classwork_outputs.find(
      (output) => output._id.toString() === userId
    );

    if (!studentOutput) {
      return res.status(404).json({ message: "Student output not found" });
    }

    // console.log("classworks", classwork);
    // console.log("exactStudent", studentOutput);

    const fileIndex = studentOutput.files.findIndex(
      (file) => file.filename === filename
    );

    if (fileIndex === -1) {
      return res.status(404).json({ message: "File not found" });
    }

    const exactFile = studentOutput.files[fileIndex];

    const filteredFile = studentOutput.files.filter(
      (file) => file !== exactFile
    );

    studentOutput.files = filteredFile;
    studentOutput.timeSubmition = `${date}, ${timeAction}`;
    // console.log("not filtered", studentOutput.files);
    // console.log("filtered", filteredFile);
    // console.log("success", studentOutput.files);
    console.log(`deleted ${filename}: ${date}, ${timeAction}`);

    //mongoose offered us a handy method called markModified() which manually marks a particular column as modified and make mongoose to update the DB accordingly.
    roomExist.markModified("classwork");

    await roomExist.save();

    const filePath = `${classwork.classwork_folder_path}${studentOutput.path}/${filename}`;

    try {
      fs.unlinkSync(filePath);
      console.log("File deleted successfully:", filePath);
    } catch (err) {
      console.error("Error deleting the file:", err);
      return res.status(500).json({ message: "Error deleting the file" });
    }

    return res
      .status(200)
      .json({ message: `${filename} is successfully deleted` });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//@desc     turn in classwork attachment
//@route    POST /api/eduGemini/classwork/submit/:roomId/:workId/:userId
//@access   private
const submitAttachment = asyncHandler(async (req, res, next) => {
  const { roomId, workId, userId } = req.params;

  const { date, timeAction } = req.body;

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
    return res.status(400).json({ message: `Classwork ${workId} not found` });
  }

  const workIndex = roomExist.classwork[findClasswork];

  let studentExist = workIndex.classwork_outputs.find(
    (output) => output._id.toString() === userId
  );

  const dueTime = workIndex.classwork_due_time;
  const dueDate = workIndex.classwork_due_date;

  const dateNow = new Date();
  const now = moment(dateNow).format("MMM Do YYY");

  const formattedTime = dateNow.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  if (
    (now > dueDate || (now === dueDate && formattedTime > dueTime)) &&
    (!studentExist || studentExist.files.length === 0)
  ) {
    studentExist.workStatus = "Missing";
  } else if (studentExist) {
    studentExist.workStatus = "Turned in";
    studentExist.timeSubmition = `${date}, ${timeAction}`;
    studentExist.feedback = "";
  } else {
    studentExist.workStatus = "No action yet";
  }

  // studentExist.workStatus = "Turned in";
  // studentExist.timeSubmition = `${date}, ${timeAction}`;
  // studentExist.feedback = "";
  // console.log(studentExist.workStatus, `: ${studentExist.timeSubmition}`);
  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You ${studentExist.workStatus} the ${findClasswork.classwork_title}`,
  });
});

//@desc     cancel classwork attachment
//@route    POST /api/eduGemini/classwork/cancel/:roomId/:workId/:userId
//@access   private
const cancelSubmition = asyncHandler(async (req, res, next) => {
  const { roomId, workId, userId } = req.params;

  const { date, timeAction } = req.body;

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
    return res.status(400).json({ message: `Classwork ${workId} not found` });
  }

  const workIndex = roomExist.classwork[findClasswork];

  let studentExist = workIndex.classwork_outputs.find(
    (output) => output._id.toString() === userId
  );

  const dueTime = workIndex.classwork_due_time;
  const dueDate = workIndex.classwork_due_date;

  const dateNow = new Date();
  const now = moment(dateNow).format("MMM Do YYY");

  const formattedTime = dateNow.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  if (
    (now > dueDate || (now === dueDate && formattedTime > dueTime)) &&
    (!studentExist || studentExist?.files?.length === 0)
  ) {
    studentExist.workStatus = "Missing";
  } else if (studentExist) {
    studentExist.workStatus = "cancelled";
    studentExist.timeSubmition = `${date}, ${timeAction}`;
    studentExist.feedback = "";
  } else {
    studentExist.workStatus = "No action yet";
  }

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You ${studentExist.workStatus} the ${findClasswork.classwork_title}`,
  });
});

//@desc     get student list of activities
//@route    POST /api/eduGemini/classwork/students/:workId/:roomId
//@access   private
const studentList = asyncHandler(async (req, res, next) => {
  const { workId, roomId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  const listOfClasswork = roomExist.classwork.map((work) => work);

  const targetClasswork = listOfClasswork.find(
    (targetId) => targetId._id === workId
  );

  const {
    classwork_outputs: classworkOutputs,
    classwork_due_time: dueTime,
    classwork_due_date: dueDate,
  } = targetClasswork;

  const now = moment();
  const formattedTime = now.format("h:mm A");
  const formattedDate = now.format("MMM Do YYYY");

  const isOverdue = now.isAfter(
    moment(`${dueDate} ${dueTime}`, "MMM Do YYYY h:mm A")
  );

  const listedStudent = roomExist.students.map((student) => {
    const studentActivity = classworkOutputs.find(
      (output) => output._id.toString() === student._id.toString()
    );

    let workStatus = "No Actions made";
    if (studentActivity) {
      if (
        (isOverdue && !studentActivity.files) ||
        (isOverdue && studentActivity?.files?.length === 0) ||
        (isOverdue && studentActivity.files.length !== 0)
      ) {
        workStatus = "Missing";
      } else {
        workStatus = studentActivity.workStatus;
      }
    } else if (isOverdue && !studentActivity?.files) {
      workStatus = "Missing";
    } else if (isOverdue && studentActivity?.files !== 0) {
      workStatus = "Missing";
    } else {
      workStatus = studentActivity.workStatus;
    }

    return {
      _id: student._id,
      studentName: `${student.user_lastname}, ${student.user_firstname} ${
        student.user_middlename ? student.user_middlename.charAt(0) + "." : ""
      }`,
      workStatus,
      files: !studentActivity?.files?.length ? [] : studentActivity?.files,
      timeSubmition: !studentActivity?.timeSubmition
        ? "No time save"
        : studentActivity?.timeSubmition,
      path: !studentActivity?.path
        ? "No path available"
        : studentActivity?.path,
      feedback: !studentActivity?.feedback
        ? "No feedback available"
        : studentActivity?.feedback,
      user_img: `${student.user_profile_path}/${student.user_img}`,
    };
  });

  res.status(200).send(listedStudent);
});
export default {
  getClasswork,
  getClassworkInformation,
  deleteClasswork,
  getClassworks,
  getAttachments,
  deleteAttachment,
  submitAttachment,
  cancelSubmition,
  studentList,
};
