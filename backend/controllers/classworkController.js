import asyncHandler from "express-async-handler";
import Classroom from "../models/classroomModel.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import moment from "moment";
import { GoogleGenerativeAI } from "@google/generative-ai";
import officeParser from "officeparser";
import { nanoid } from "nanoid";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { processInstrcutionFile } from "../utils/processInstructionFile.js";

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
  const folderPath = `classworks/${roomExist.owner_name}/${roomExist.class_code}/${classworkToDelete.classwork_title}`;
  console.log(folderPath);

  fs.rm(folderPath, { recursive: true, force: true }, (err) => {
    if (err) {
      throw err;
    }
    console.log(`${folderPath} is deleted!`);
  });

  const updatedClassworks = getIdFromRoom.filter(
    (matchId) => matchId._id !== classworkToDelete._id
  );

  roomExist.classwork = updatedClassworks;

  await roomExist.save();
  res.status(200).json({
    message: `${classworkToDelete.classwork_title} is successfully deleted`,
  });
});

//@desc     create private comment
//@route    POST /api/eduGemini/classwork/comment/:roomId/:workId/:userId
//@access   private
const createPrivateComment = asyncHandler(async (req, res, next) => {
  const { roomId, workId, userId } = req.params;
  const { comment, date, timeAction, teacherId, studentId } = req.body;

  const roomExist = await Classroom.findById(roomId);

  if (!roomExist) {
    return res.status(400).json({ message: `${roomId} id does not exist` });
  }

  const foundStudent = roomExist.students.find(
    (student) => student._id.toString() === studentId
  );

  if (!foundStudent) {
    return res.status(400).json({ message: `Student ${studentId} not found` });
  }

  const findClasswork = roomExist.classwork.findIndex(
    (classwork) => classwork._id.toString() === workId
  );

  if (findClasswork === -1) {
    return res.status(400).json({ message: `Classwork ${workId} not found` });
  }

  if (!comment) {
    return res.status(400).json({ message: "Please fill out the field" });
  }

  const workIndex = roomExist.classwork[findClasswork];

  let studentExist = workIndex.classwork_outputs.find(
    (output) => output._id.toString() === studentId
  );

  if (studentId === userId) {
    const username = `${foundStudent.user_lastname}, ${
      foundStudent.user_firstname
    } ${foundStudent.user_middlename.charAt(0)}.`;

    const profile = `${foundStudent.user_profile_path}/${foundStudent.user_img}`;

    studentExist.privateComment.push({
      _id: nanoid(),
      user: userId,
      comment: comment,
      username: username,
      date: date,
      time: timeAction,
      profile: profile,
    });
  }

  if (teacherId === userId) {
    studentExist.privateComment.push({
      _id: nanoid(),
      user: teacherId,
      comment: comment,
      username: roomExist.owner_name,
      date: date,
      time: timeAction,
      profile: `${roomExist.profile_path}/${roomExist.user_img}`,
    });
  }

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({ message: "Comment sent" });
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
      (file) => file.originalname === filename
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

    const filePath = `classworks/${classwork.classwork_folder_path}${studentOutput.path}/${filename}`;

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

  let instructionFile;
  let instructionPath = fs.readFileSync(
    `classworks/${classworkPath}/${classworkAttachFile}`
  );
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
  let instructionFormat = classworkAttachFile.split(".").pop();

  if (
    instructionFormat === "docx" ||
    instructionFormat === "pdf" ||
    instructionFormat === "txt"
  ) {
    instructionFile = await officeParser.parseOfficeAsync(instructionPath);
  } else if (instructionFormat === "png") {
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

    const uploadResult = await fileManager.uploadFile(
      `${classworkPath}/instruction/${classworkAttachFile}`,
      {
        mimeType: "image/png",
        displayName: `${file.filename}`,
      }
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    instructionFile = result.response.text();
  } else if (instructionFormat === "jpg") {
    const uploadResult = await fileManager.uploadFile(
      `${classworkPath}/instruction/${classworkAttachFile}`,
      {
        mimeType: "image/jpeg",
        displayName: `${file.filename}`,
      }
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    instructionFile = result.response.text();
  }

  const filesToBeprompted = await Promise.all(
    studentFiles.map(async (file) => {
      let fileFormat = file.originalname.split(".").pop();
      let studentFiles;
      let answerPath = fs.readFileSync(
        `classworks/${classworkPath}/answers${file.path}/${file.originalname}`
      );

      if (
        fileFormat === "html" ||
        fileFormat === "css" ||
        fileFormat === "js" ||
        fileFormat === "php" ||
        fileFormat === "dart" ||
        fileFormat === "py" ||
        fileFormat === "c" ||
        fileFormat === "cpp" ||
        fileFormat === "cs" ||
        fileFormat === "swift" ||
        fileFormat === "rs" ||
        fileFormat === "go" ||
        fileFormat === "ru" ||
        fileFormat === "r" ||
        fileFormat === "sql" ||
        fileFormat === "java"
      ) {
        studentFiles = answerPath;
      } else if (
        fileFormat === "docx" ||
        fileFormat === "pptx" ||
        fileFormat === "xlsx" ||
        fileFormat === "pdf"
      ) {
        studentFiles = await officeParser.parseOfficeAsync(answerPath);
      }
      //Visuals picture
      else if (fileFormat === "png") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "image/png",
            displayName: `${file.originalname}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      } else if (fileFormat === "jpg") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "image/png",
            displayName: `${file.originalname}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      }
      //Visuals video
      else if (fileFormat === "mp4") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "video/mp4",
            displayName: `${file.originalname}`,
          }
        );

        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the video provided as this serves as the answer of the student.",
          },
        ]);

        studentFiles = result.response.text();
      } else if (fileFormat === "mpeg") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "video/mpeg",
            displayName: `${file.originalname}`,
          }
        );

        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the video provided as this serves as the answer of the student.",
          },
        ]);

        studentFiles = result.response.text();
      } else if (fileFormat === "mov") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "video/mov",
            displayName: `${file.originalname}`,
          }
        );

        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the video provided as this serves as the answer of the student.",
          },
        ]);

        studentFiles = result.response.text();
      }
      //Audio
      else if (fileFormat === "wav") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "audio/wav",
            displayName: `${file.originalname}`,
          }
        );

        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the video provided as this serves as the answer of the student.",
          },
        ]);

        studentFiles = result.response.text();
      } else if (fileFormat === "mp3") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "audio/mp3",
            displayName: `${file.originalname}`,
          }
        );

        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the video provided as this serves as the answer of the student.",
          },
        ]);

        studentFiles = result.response.text();
      }

      return studentFiles;
    })
  );

  console.log("Files to be prompted", filesToBeprompted);
  console.log("INSTRUCTION FILE", instructionFile);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function runGemini() {
    const studentFeedbackPrompt = `Evaluate the submissions [${filesToBeprompted.toString()}] against the guidelines set in the instruction file [${instructionFile}]. Highlight effective elements and provide recommendations for improving coherence and argumentation.`;
    const generateStudentFeedback = await model.generateContent([
      studentFeedbackPrompt,
      ...filesToBeprompted.toString(),
    ]);
    const geminiResponseStudentFeedback =
      await generateStudentFeedback.response;
    const studentFeedbackResult = geminiResponseStudentFeedback.text();
    console.log(studentFeedbackResult);

    // Request a numerical score
    const scorePrompt = `Based on the feedback provided [${studentFeedbackResult}], assign a total score provided in the [${instructionFile}] for the student's submission. Return only a number, dont include any explanations, i just want the exact number or total score. `;
    const generateStudentScore = await model.generateContent(scorePrompt);
    const geminiStudentScoreResponse = await generateStudentScore.response;

    // Ensure the score is parsed as a number
    const studentScoreResult = parseFloat(
      geminiStudentScoreResponse.text().trim()
    );
    console.log("Student Score:", studentScoreResult);

    const teacherFeedbackPrompt = `As you generate a feedback for students submission feedback [${studentFeedbackResult}], based on this student feedback, what or how do I improved my teaching to student based on the student submission feedback [${studentFeedbackResult}]. Suggest improvements to further nurture my student`;
    const generateTeacherFeedback = await model.generateContent(
      teacherFeedbackPrompt
    );
    const geminiTeacherFeedbackResponse =
      await generateTeacherFeedback.response;
    const teacherFeedbackResult = geminiTeacherFeedbackResponse.text();
    console.log(teacherFeedbackResult);

    studentExist.studentFeedback = studentFeedbackResult;
    studentExist.score = studentScoreResult;
    studentExist.teacherFeedback = teacherFeedbackResult;
    roomExist.classwork[findClasswork] = workIndex;

    await roomExist.save();
  }
  runGemini();

  studentExist.workStatus = {
    id: 3,
    name: "Turned in",
  };
  studentExist.timeSubmition = `${date}, ${timeAction}`;

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You ${studentExist.workStatus.name} your work`,
  });
});

//@desc     check similarity index
//@route    GET /api/eduGemini/classwork/similarityIndex/:roomId/:workId/:userId
//@access   private
const similarityIndex = asyncHandler(async (req, res, next) => {
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

  const students = workIndex.classwork_outputs.map(
    (output) => output._id.toString() === userId
  );

  console.log(students);

  if (
    (students && !studentExist) ||
    (studentExist && studentExist.workStatus.name === "Shelved") ||
    (studentExist && studentExist.workStatus.name === "Cancelled") ||
    (studentExist && studentExist.workStatus.name === "No Action Yet")
  ) {
    return res.status(400).send({ message: "No output yet" });
  }

  //student files
  const studentFiles = studentExist.files;

  const filterStudent = workIndex.classwork_outputs.filter(
    (student) => student._id !== foundStudent._id
  );

  //student folder path
  const studentFolderpath = studentExist.files.path;
  //classwork folder path
  const classworkPath = workIndex.classwork_folder_path;
  //classwork attach file
  const classworkAttachFile = workIndex.classwork_attach_file.originalname;
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

  const filesToBeprompted = await Promise.all(
    studentFiles.map(async (file) => {
      let fileFormat = file.originalname.split(".").pop();
      let studentFiles;
      let answerPath = fs.readFileSync(
        `classworks/${classworkPath}/answers${file.path}/${file.originalname}`
      );

      if (
        fileFormat === "html" ||
        fileFormat === "css" ||
        fileFormat === "js" ||
        fileFormat === "php" ||
        fileFormat === "dart" ||
        fileFormat === "py" ||
        fileFormat === "c" ||
        fileFormat === "cpp" ||
        fileFormat === "cs" ||
        fileFormat === "swift" ||
        fileFormat === "rs" ||
        fileFormat === "go" ||
        fileFormat === "ru" ||
        fileFormat === "r" ||
        fileFormat === "sql" ||
        fileFormat === "java"
      ) {
        studentFiles = answerPath;
      } else if (
        fileFormat === "docx" ||
        fileFormat === "pptx" ||
        fileFormat === "xlsx" ||
        fileFormat === "pdf"
      ) {
        studentFiles = await officeParser.parseOfficeAsync(answerPath);
      } else if (fileFormat === "png") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "image/png",
            displayName: `${file.originalname}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      } else if (fileFormat === "jpg") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "image/png",
            displayName: `${file.originalname}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      }

      return studentFiles;
    })
  );

  //student output
  const studentOutput = {
    _id: foundStudent._id,
    name: `${foundStudent.user_lastname}, ${
      foundStudent.user_firstname
    } ${foundStudent.user_middlename.charAt(0)}.`,
    output: filesToBeprompted,
  };

  const studentsOutput = filterStudent.filter(
    (students) =>
      students.workStatus.name === "Turned in" ||
      students.workStatus.name === "Late"
  );

  const fileOutputs = studentsOutput.map((outputFiles) => outputFiles);

  const studentListOutputs = await Promise.all(
    fileOutputs.map(async (file) => {
      let fileFormat = file.files
        .map((fileFormat) => fileFormat.originalname.split(".").pop())
        .toString();

      let studentFiles;
      let answerPath = fs.readFileSync(
        `classworks/${classworkPath}${file.path}/${file.files.map(
          (file) => file.originalname
        )}`
      );

      if (
        fileFormat === "html" ||
        fileFormat === "css" ||
        fileFormat === "js" ||
        fileFormat === "php" ||
        fileFormat === "dart" ||
        fileFormat === "py" ||
        fileFormat === "c" ||
        fileFormat === "cpp" ||
        fileFormat === "cs" ||
        fileFormat === "swift" ||
        fileFormat === "rs" ||
        fileFormat === "go" ||
        fileFormat === "ru" ||
        fileFormat === "r" ||
        fileFormat === "sql" ||
        fileFormat === "java"
      ) {
        studentFiles = answerPath;
      } else if (
        fileFormat === "docx" ||
        fileFormat === "pptx" ||
        fileFormat === "xlsx" ||
        fileFormat === "pdf"
      ) {
        studentFiles = await officeParser.parseOfficeAsync(answerPath);
      } else if (fileFormat === "png") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}${file.path}/${file.files.map(
            (file) => file.originalname
          )}`,
          {
            mimeType: "image/png",
            displayName: `${file.files.map((file) => file.originalname)}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      } else if (fileFormat === "jpg") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}${file.path}/${file.files.map(
            (file) => file.originalname
          )}`,
          {
            mimeType: "image/jpeg",
            displayName: `${file.files.map((file) => file.originalname)}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      }

      const foundStudent = roomExist.students.find(
        (student) => student._id.toString() === file._id
      );

      return {
        _id: foundStudent._id,
        name: `${foundStudent.user_lastname}, ${
          foundStudent.user_firstname
        } ${foundStudent.user_middlename.charAt(0)}.`,
        output: studentFiles,
      };
    })
  );

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Compare the similarity between this student's output: ${JSON.stringify(
      studentOutput.output
    )} 
    and the following students' outputs: ${JSON.stringify(studentListOutputs)}. 
    Return only an array of objects in the format: [{ "name": "student full name", "similarityIndex": percentage }]. 
    The result should be pure JSON type with no extra characters included.
  `;

  try {
    const result = await model.generateContent(prompt);

    const similarityData = result.response.text();

    return res.status(200).send(similarityData);
  } catch (error) {
    console.error("Error generating similarity index:", error);
    return res
      .status(500)
      .json({ message: "Failed to generate similarity index." });
  }
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
  studentExist.timeSubmition = `${date}, ${timeAction}`;
  studentExist.studentFeedback = "";
  studentExist.score = "";
  studentExist.teacherFeedback = "";

  studentExist.chancesResubmition = chances < 0 ? 0 : chances;

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You ${studentExist.workStatus.name} your work`,
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

  console.log(targetClasswork);

  const classworkOutputs = targetClasswork.classwork_outputs;
  const dueTime = targetClasswork.classwork_due_time;
  const dueDate = targetClasswork.classwork_due_date;
  const now = moment();

  const isOverdue = now.isAfter(
    moment(`${dueDate} ${dueTime}`, "MMM Do YYYY h:mm A")
  );

  const listedStudent = roomExist.acceptedStudents.map((student) => {
    const studentActivity = classworkOutputs.find(
      (output) => output._id.toString() === student._id.toString()
    );

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
      studentFeedback: !studentActivity?.studentFeedback
        ? "No feedback for student available"
        : studentActivity?.studentFeedback,
      teacherFeedback: studentActivity?.teacherFeedback
        ? studentActivity?.teacherFeedback
        : "No feedback for teacher available",
      user_img: `${student.user_profile_path}/${student.user_img}`,
      chancesResubmition:
        studentActivity?.chancesResubmition === undefined
          ? "No Action Yet"
          : studentActivity?.chancesResubmition,
      score: studentActivity?.score ? studentActivity?.score : 0,
      roomId: roomId,
      isOverdue: `${dueDate} ${dueTime}`,
      teacherId: roomExist.owner,
      classwork_path: targetClasswork.classwork_folder_path,
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
      studentNames: `${student.user_lastname}, ${student.user_firstname} ${
        student.user_middlename.charAt(0) + "."
      }`,
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

  let instructionFile;
  let instructionPath = fs.readFileSync(
    `classworks/${classworkPath}/${classworkAttachFile}`
  );
  const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);
  let instructionFormat = classworkAttachFile.split(".").pop();

  if (
    instructionFormat === "docx" ||
    instructionFormat === "pdf" ||
    instructionFormat === "txt"
  ) {
    instructionFile = await officeParser.parseOfficeAsync(instructionPath);
  } else if (instructionFormat === "png") {
    const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY);

    const uploadResult = await fileManager.uploadFile(
      `${classworkPath}/instruction/${classworkAttachFile}`,
      {
        mimeType: "image/png",
        displayName: `${file.filename}`,
      }
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    instructionFile = result.response.text();
  } else if (instructionFormat === "jpg") {
    const uploadResult = await fileManager.uploadFile(
      `${classworkPath}/instruction/${classworkAttachFile}`,
      {
        mimeType: "image/jpeg",
        displayName: `${file.filename}`,
      }
    );

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      "I want you to copy the text of this image because this will serve as instruction, if any visual elements are included in this image, i want you to describe it accurately without changing the instructions.",
      {
        fileData: {
          fileUri: uploadResult.file.uri,
          mimeType: uploadResult.file.mimeType,
        },
      },
    ]);

    instructionFile = result.response.text();
  }

  const filesToBeprompted = await Promise.all(
    studentFiles.map(async (file) => {
      let fileFormat = file.originalname.split(".").pop();
      let studentFiles;
      let answerPath = fs.readFileSync(
        `classworks/${classworkPath}/answers${file.path}/${file.originalname}`
      );

      if (
        fileFormat === "html" ||
        fileFormat === "css" ||
        fileFormat === "js" ||
        fileFormat === "php" ||
        fileFormat === "dart" ||
        fileFormat === "py" ||
        fileFormat === "c" ||
        fileFormat === "cpp" ||
        fileFormat === "cs" ||
        fileFormat === "swift" ||
        fileFormat === "rs" ||
        fileFormat === "go" ||
        fileFormat === "ru" ||
        fileFormat === "r" ||
        fileFormat === "sql" ||
        fileFormat === "java"
      ) {
        studentFiles = answerPath;
      } else if (
        fileFormat === "docx" ||
        fileFormat === "pptx" ||
        fileFormat === "xlsx" ||
        fileFormat === "pdf"
      ) {
        studentFiles = await officeParser.parseOfficeAsync(answerPath);
      } else if (fileFormat === "png") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "image/png",
            displayName: `${file.originalname}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      } else if (fileFormat === "jpg") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "image/png",
            displayName: `${file.originalname}`,
          }
        );
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          "Analyze and describe the image provided as this serves as the answer of the student.",
          {
            fileData: {
              fileUri: uploadResult.file.uri,
              mimeType: uploadResult.file.mimeType,
            },
          },
        ]);
        studentFiles = result.response.text();
      }

      return studentFiles;
    })
  );

  console.log("Files to be prompted", filesToBeprompted);
  console.log("INSTRUCTION FILE", instructionFile);

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  async function runGemini() {
    const studentFeedbackPrompt = `Evaluate the submissions [${filesToBeprompted.toString()}] against the guidelines set in the instruction file [${instructionFile}]. Highlight effective elements and provide recommendations for improving coherence and argumentation.`;
    const generateStudentFeedback = await model.generateContent([
      studentFeedbackPrompt,
      ...filesToBeprompted.toString(),
    ]);
    const geminiResponseStudentFeedback =
      await generateStudentFeedback.response;
    const studentFeedbackResult = geminiResponseStudentFeedback.text();
    console.log(studentFeedbackResult);

    // Request a numerical score
    const scorePrompt = `Based on the feedback provided [${studentFeedbackResult}], assign a total score provided in the [${instructionFile}] for the student's submission. Return only a number, dont include any explanations, i just want the exact number or total score. Additionally, this submission is late so I want you to deduct 10% of the score`;
    const generateStudentScore = await model.generateContent(scorePrompt);
    const geminiStudentScoreResponse = await generateStudentScore.response;

    // Ensure the score is parsed as a number
    const studentScoreResult = parseFloat(
      geminiStudentScoreResponse.text().trim()
    );
    console.log("Student Score:", studentScoreResult);

    const teacherFeedbackPrompt = `As you generate a feedback for students submission feedback [${studentFeedbackResult}], based on this student feedback, what or how do I improved my teaching to student based on the student submission feedback [${studentFeedbackResult}]. Suggest improvements to further nurture my student`;
    const generateTeacherFeedback = await model.generateContent(
      teacherFeedbackPrompt
    );
    const geminiTeacherFeedbackResponse =
      await generateTeacherFeedback.response;
    const teacherFeedbackResult = geminiTeacherFeedbackResponse.text();
    console.log(teacherFeedbackResult);

    studentExist.studentFeedback = studentFeedbackResult;
    studentExist.score = studentScoreResult;
    studentExist.teacherFeedback = teacherFeedbackResult;
    roomExist.classwork[findClasswork] = workIndex;

    await roomExist.save();
  }
  runGemini();

  studentExist.workStatus = {
    id: 6,
    name: "Late",
  };
  studentExist.timeSubmition = `${date}, ${timeAction}`;

  roomExist.classwork[findClasswork] = workIndex;

  await roomExist.save();

  return res.status(200).json({
    message: `You accepted the ${studentExist.workStatus.name} output`,
  });
});

//@desc     get classwork attachment
//@route    GET /api/eduGemini/classwork/exportData/:roomId
//@access   private
export const getExportActivities = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const roomExist = await Classroom.findById(roomId);

  if (!roomExist) {
    return res.status(404).send({ message: "Room not found" });
  }

  let allActivities = roomExist.acceptedStudents.map((student) => {
    let eachClassworkTitle = () =>
      roomExist.classwork.map((classwork) => {
        const title = classwork.classwork_title;
        const score = classwork.classwork_outputs.find(
          (s) => s._id.toString() === student._id.toString()
        );

        let targetClassworkTitle = { title: classwork.classwork_title };
        let scores = score?.score ? { score: score?.score } : { score: 0 };

        const mergedTitleScore = Object.assign(targetClassworkTitle, scores);
        return { ...mergedTitleScore };
      });

    return {
      studentNames: `${student.user_lastname}, ${student.user_firstname} ${
        student.user_middlename.charAt(0) + "."
      }`,
      classwork: eachClassworkTitle(),
      gender:
        student.user_gender === "male"
          ? { id: 1, name: "Male" }
          : { id: 2, name: "Female" },
    };
  });

  allActivities.sort((a, b) => {
    if (a.gender.id !== b.gender.id) {
      return a.gender.id - b.gender.id; // Sort by gender first
    }
    return a.studentNames.localeCompare(b.studentNames);
  });

  let excelExportData = allActivities.map((activity) => {
    const dynamicClasswork = activity.classwork.reduce((acc, curr) => {
      acc[curr.title] = curr.score;
      return acc;
    }, {});

    return Object.assign(
      {
        Name: activity.studentNames,
        Gender: activity.gender.name,
      },
      dynamicClasswork
    );
  });

  return res.status(200).send(excelExportData);
});

//@desc     get details to export the activity
//@route    POST /api/eduGemini/classwork/exportActivity/:workId/:roomId
//@access   private
const exportSpecificActivity = asyncHandler(async (req, res, next) => {
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
      studentName: `${student.user_lastname}, ${student.user_firstname} ${
        student.user_middlename.charAt(0) + "."
      }`,
      timeSubmition: !studentActivity?.timeSubmition
        ? "No time save"
        : studentActivity?.timeSubmition,
      studentFeedback: !studentActivity?.studentFeedback
        ? "No feedback for student available"
        : studentActivity?.studentFeedback,
      teacherFeedback: studentActivity?.teacherFeedback
        ? studentActivity?.teacherFeedback
        : "No feedback for teacher available",
      score: studentActivity?.score ? studentActivity?.score : 0,
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
  getAllActivities,
  addChance,
  acceptLateClasswork,
  createPrivateComment,
  getExportActivities,
  exportSpecificActivity,
  similarityIndex,
};
