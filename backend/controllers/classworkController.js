import asyncHandler from "express-async-handler";
import Classroom from "../models/classroomModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
import { GoogleGenerativeAI } from "@google/generative-ai";
import officeParser from "officeparser";

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

  return res.status(200).send([classworkInformation]);
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
  //student files
  const studentFiles = studentExist.files;
  //student folder path
  const studentFolderpath = studentExist.files.path;
  //classwork folder path
  const classworkPath = workIndex.classwork_folder_path;
  //classwork attach file
  const classworkAttachFile = workIndex.classwork_attach_file.originalname;

  studentFiles.forEach(async (file) => {
    let studentFiles;
    try {
      let answerPath = fs.readFileSync(
        `./${classworkPath}/answers${file.path}/${file.filename}`
      );

      let answerformat = file.filename.split(".").pop();

      if (
        answerformat === "docx" ||
        answerformat === "pptx" ||
        answerformat === "xlsx" ||
        answerformat === "pdf"
      ) {
        studentFiles = await officeParser.parseOfficeAsync(answerPath);
      }

      let instructionFile;
      let instructionPath = fs.readFileSync(
        `./${classworkPath}/instruction/${classworkAttachFile}`
      );

      let instructionFormat = classworkAttachFile.split(".").pop();

      if (
        instructionFormat === "docx" ||
        instructionFormat === "pdf" ||
        instructionFormat === "txt"
      ) {
        instructionFile = await officeParser.parseOfficeAsync(instructionPath);
      }

      console.log("INSTRUCTION FILE", instructionFile);

      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      async function run() {
        const prompt = `comapre this ${instructionFile} and ${studentFiles} and give constructive feedback and try to score the answers`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log(text);
        console.log(
          "######################################################################################################################################################"
        );
        const scorePrompt = `So, what is the total score of the output ${studentFiles} from the ${instructionFile}, return the accumulated points of the students from that activity as a number `;
        const resultScore = await model.generateContent(scorePrompt);
        const scoreResponse = await resultScore.response;
        const scoretext = scoreResponse.text();
        console.log(scoretext);
        studentExist.feedback = text;
        studentExist.score = scoretext;
        roomExist.classwork[findClasswork] = workIndex;

        await roomExist.save();
      }

      run();
    } catch (error) {
      console.log(error);
    }
  });

  studentExist.workStatus = {
    id: 3,
    name: "Turned in",
  };
  studentExist.timeSubmition = `${date}, ${timeAction}`;

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You ${studentExist.workStatus.name} the ${findClasswork.classwork_title}`,
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

  studentExist.workStatus = {
    id: 4,
    name: "Cancelled",
  };

  let chances = studentExist.chancesResubmition - 1;

  studentExist.feedback = "";
  studentExist.score = "";

  studentExist.chancesResubmition = chances < 0 ? 0 : chances;

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You ${studentExist.workStatus.name} the ${findClasswork.classwork_title}`,
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

  console.log(targetClasswork._id);

  const classworkOutputs = targetClasswork.classwork_outputs;
  const dueTime = targetClasswork.classwork_due_time;
  const dueDate = targetClasswork.classwork_due_date;
  const now = moment();
  const formattedTime = now.format("h:mm A");
  const formattedDate = now.format("MMM Do YYYY");

  const isOverdue = now.isAfter(
    moment(`${dueDate} ${dueTime}`, "MMM Do YYYY h:mm A")
  );

  const listedStudent = roomExist.acceptedStudents.map((student) => {
    const studentActivity = classworkOutputs.find(
      (output) => output._id.toString() === student._id.toString()
    );
    console.log(studentActivity?.score);
    let workStatus;

    if (
      isOverdue &&
      !studentActivity?.files &&
      isOverdue &&
      studentActivity?.files?.length !== 0
    ) {
      workStatus = {
        id: 2,
        name: "Missing",
      };
    } else if (!studentActivity) {
      workStatus = {
        id: 5,
        name: "No Action Yet",
      };
    } else if (studentActivity) {
      workStatus = studentActivity?.workStatus;
    }

    return {
      _id: student._id,
      studentName: `${student.user_lastname}, ${student.user_firstname} ${
        student.user_middlename.charAt(0) + "."
      }`,
      // email: student.user_email,
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
      chancesResubmition:
        studentActivity?.chancesResubmition === undefined
          ? "No Action Yet"
          : studentActivity?.chancesResubmition,
      score: studentActivity?.score ? studentActivity?.score : 0,
      roomId: roomId,
      isOverdue: `${dueDate} ${dueTime}`,
    };
  });

  res.status(200).send(listedStudent);
});

//@desc     get all classworks activities
//@route    POST /api/eduGemini/classwork/allactivities/:roomId
//@access   private
export const getAllActivities = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  const allactivities = roomExist.acceptedStudents.map((student) => {
    const eachClassworkTitle = () =>
      roomExist.classwork.map((classwork) => {
        const title = classwork.classwork_title;
        const score = classwork.classwork_outputs.find(
          (s) => s._id.toString() === student._id.toString()
        );

        let scores = score?.score ? score?.score : 0;

        return { title, scores };
      });
    return {
      studentNames: `${student.user_lastname}, ${
        student.user_firstname
      } ${student.user_middlename.charAt(0)}`,
      classwork: eachClassworkTitle(),
      gender:
        student.user_gender === "male"
          ? {
              id: 1,
              name: "Male",
            }
          : {
              id: 2,
              name: "Female",
            },
    };
  });

  return res.status(200).send(allactivities);
});

//@desc     add a chance
//@route    POST /api/eduGemini/classwork/addchance/:workId/:roomId/:userId
//@access   private
const addChance = asyncHandler(async (req, res, next) => {
  const { workId, roomId, userId } = req.params;
  const { chances } = req.body;

  const roomExist = await Classroom.findById(roomId);

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

  studentExist.chancesResubmition = chances;

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();
  return res
    .status(200)
    .json({ message: `You suucessfully added ${chances} chances` });
});

//@desc     cancel classwork attachment
//@route    POST /api/eduGemini/classwork/late/:roomId/:workId/:userId
//@access   private
const acceptLateClasswork = asyncHandler(async (req, res, next) => {
  const { roomId, workId, userId } = req.params;

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

  studentExist.workStatus = {
    id: 6,
    name: "Late",
  };

  studentExist.feedback = "";
  studentExist.score = "";

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You successfully accepted the Late output`,
  });
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
  getAllActivities,
  addChance,
  acceptLateClasswork,
};
