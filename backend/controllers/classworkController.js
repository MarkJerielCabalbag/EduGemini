import asyncHandler from "express-async-handler";
import Classroom from "../models/classroomModel.js";
import User from "../models/userModel.js";

import fs from "fs";
import path from "path";
import multer from "multer";
import { rimraf } from "rimraf";
import { fileURLToPath } from "url";
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

  res.status(200).send(studentOutputs);
});

//@desc     delete classwork attachment
//@route    POST /api/eduGemini/classwork/deleteAttachment/:roomId/:workId/:userId
//@access   private
const deleteAttachment = asyncHandler(async (req, res) => {
  const { roomId, workId, userId } = req.params;
  const { filename } = req.body;

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

    console.log("classworks", classwork);
    console.log("exactStudent", studentOutput);

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
    // console.log("not filtered", studentOutput.files);
    // console.log("filtered", filteredFile);
    // console.log("success", studentOutput.files);

    studentOutput.files = filteredFile;

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

    res.status(200).json({ message: `${filename} is successfully deleted` });
  } catch (error) {
    console.error("Error deleting attachment:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default {
  getClasswork,
  getClassworkInformation,
  deleteClasswork,
  getClassworks,
  getAttachments,
  deleteAttachment,
};
