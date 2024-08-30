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
  const roomExist = await Classroom.findById(req.params.roomId);
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
//@route    POST /api/eduGemini/classwork/getAttachments/:roomId/:workId
//@access   private
const getAttachments = asyncHandler(async (req, res, next) => {
  const { roomId, workId, userId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  const classworks = roomExist.classwork.find((work) => work._id === workId);

  const studentOutputs = classworks.classwork_outputs.filter(
    (outputs) => outputs._id === userId
  );

  // const classworks = roomExist.map((room) =>
  //   room.classwork.find((work) => work._id === workId)
  // );
  // const studentOutput = classworks.map((outputs) =>
  //   outputs.classwork_outputs.find(
  //     (studentAttachments) => studentAttachments._id === userId
  //   )
  // );

  res.status(200).send(studentOutputs);
});

export default {
  getClasswork,
  getClassworkInformation,
  deleteClasswork,
  getClassworks,
  getAttachments,
};
