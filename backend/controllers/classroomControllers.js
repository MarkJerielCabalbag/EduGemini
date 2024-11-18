import User from "../models/userModel.js";
import Classroom from "../models/classroomModel.js";
import asyncHandler from "express-async-handler";
import { nanoid } from "nanoid";
import multer from "multer";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FileState, GoogleAIFileManager } from "@google/generative-ai/server";
import officeParser from "officeparser";
import { GoogleGenerativeAI } from "@google/generative-ai";
const __dirname = dirname(fileURLToPath(import.meta.url));
//@desc     create class
//@route    POST /api/eduGemini/classroom/createClass
//@access   private
const createClass = asyncHandler(async (req, res, next) => {
  //get all the request first from client request body
  const { classname, section, subject, room, userId } = req.body;

  //validate the request
  if (!classname || !section || !subject || !room) {
    return res.status(400).json({ message: "Please fill all fields" });
  }
  const user = await User.findById(userId);

  //then create your class
  const newClass = new Classroom({
    classname,
    section,
    subject,
    room,
    owner: user._id,
    owner_name: user.user_username,
    owner_email: user.user_email,
    profile_path: user.profile_path,
    user_img: user.profile.filename,
    class_code: "",
  });

  //if not created successfully
  if (!newClass) {
    return res
      .status(400)
      .json({ message: `Your ${newClass.classname} not successfully created` });
  }

  await newClass.save();

  //else return successfull message
  res.status(200).json({
    message: `${newClass.classname} is in pending approval`,
    newClass: newClass,
  });
});

//@desc     filter all classroom that has the userId on it
//@route    GET /api/eduGemini/classroom/allClass/:roomId
//@access   private
const allClass = asyncHandler(async (req, res, next) => {
  //just find all the classroom documents then return it
  const { userId } = req.params;
  const filteredClassrooms = await Classroom.find({
    "students._id": userId,
  });

  res.status(200).send(filteredClassrooms);
});

//@desc     get all classroom from classroom collection
//@route    GET /api/eduGemini/classroom/allClass/:roomId
//@access   private
const adminAllClass = asyncHandler(async (req, res, next) => {
  const adminAllClasses = await Classroom.find();

  res.status(200).send(adminAllClass);
});

//@desc     get all created classroom created by user id
//@route    GET /api/eduGemini/classroom/getAllClass/:userId
//@access   private
const getAllClass = asyncHandler(async (req, res, next) => {
  //get the class information based on the user or owner id

  const userId = req.params.userId;

  //find the owner in Classroom collection based on user id
  const ownerExistOnClassroom = await Classroom.find({ owner: userId });

  //if owner id doenst exist in any classroom
  if (!ownerExistOnClassroom) {
    return res
      .status(400)
      .json({ message: `${ownerExistOnClassroom.classname} doesnt exist` });
  }

  //else
  res.status(200).send(ownerExistOnClassroom);
});

//@desc     get specific classroom based on classroom id
//@route    GET /api/eduGemini/classroom/getCreatedClassroom/:roomId
//@access   private
const getCreatedClassroom = asyncHandler(async (req, res, next) => {
  //get the request from req route params
  const { roomId } = req.params;
  //find that classroom from classroom collection
  const classroomExist = await Classroom.findById(roomId);

  if (!classroomExist) {
    return res.status(404).json({ message: `${roomId} does not exist` });
  }

  res.status(200).send([classroomExist]);
});

//@desc     GET announcment
//@route    GET /api/eduGemini/classroom/getCreatedClassroom/getAnnouncements/:roomId
//@access   private
const getAnnouncements = asyncHandler(async (req, res, next) => {
  const { roomId } = req.params;

  const classroomExist = await Classroom.findById(roomId);

  const announcements = classroomExist.announcement;
  res.status(200).send(announcements);
});

//@desc     create public comment
//@route    post /api/eduGemini/classroom/comment/:roomId/:announceId
//@access   private
const createPublicComment = asyncHandler(async (req, res, next) => {
  const { roomId, announceId } = req.params;
  const { comment, userId, date, timeAction } = req.body;

  if (!comment) {
    return res.status(400).json({ message: "Cannot send without a comment" });
  }

  const roomExist = await Classroom.findById(roomId);
  const user = await User.findById(userId);
  // console.log(user._id.toString());

  const findAnnouncement = roomExist.announcement.findIndex(
    (announce) => announce._id.toString() === announceId
  );
  const anounceIndex = roomExist.announcement[findAnnouncement]; //announcement Index

  const findStudent = roomExist.students.find(
    (student) => student._id === userId
  );

  console.log(findStudent);

  if (user._id.toString() === findStudent._id) {
    // console.log(findStudent);

    const username = `${findStudent.user_lastname}, ${
      findStudent.user_firstname
    } ${findStudent.user_middlename.charAt(0)}.`;

    anounceIndex.publicComment.push({
      _id: nanoid(),
      user: userId,
      comment: comment,
      username: username,
      date: date,
      time: timeAction,
    });
  } else {
    anounceIndex.publicComment.push({
      _id: nanoid(),
      user: roomExist.owner,
      comment: comment,
      username: roomExist.owner_name,
      date: date,
      time: timeAction,
    });
  }

  roomExist.announcement[findAnnouncement] = anounceIndex;
  await roomExist.save();

  return res.status(200).json({ message: "Comment sent" });
});

//@desc     DELETE announcement
//@route    DELETE /api/eduGemini/classroom/getCreatedClassroom/deleteAnnouncement/:roomId
//@access   private
const deleteAnnouncement = asyncHandler(async (req, res) => {
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

  fs.rm(
    `classworks/${announcementToDelete.path}`,
    { recursive: true, force: true },
    (err) => {
      if (err) {
        throw err;
      }
      console.log(`${announcementToDelete.path} is deleted!`);
    }
  );

  classroomExist.announcement = updatedAnnouncements;
  await classroomExist.save();

  res.status(200).json({ message: "Deleted successfully" });
});

//@desc     Create classwork-type
//@route    POST /api/eduGemini/classroom/createClasswork
//@access   private
const classworkType = asyncHandler(async (req, res, next) => {
  //get the request sa req.body
  const { classwork, roomId } = req.body;

  //then check that field
  if (!classwork) {
    return res.status(400).json({ message: "Please fill this field" });
  }

  //find the room if exist
  const roomExist = await Classroom.findById({ _id: roomId });

  //check if room is exist
  if (!roomExist) {
    return res.status(400).json({ message: "Classroom does not exist" });
  }

  //check for class duplication
  const duplicateClassworkType = roomExist.classwork_type.find(
    (cw) =>
      cw.classwork ===
      classwork.charAt(0).toUpperCase() + classwork.slice(1).toLowerCase()
  );

  if (duplicateClassworkType) {
    return res.status(400).json({
      message: `${classwork} is already exist`,
    });
  }
  //else if no duplication
  roomExist.classwork_type.unshift({
    _id: nanoid(),
    classwork:
      classwork.charAt(0).toUpperCase() + classwork.slice(1).toLowerCase(),
  });

  await roomExist.save();

  return res.status(200).json({ message: "New classwork type added" });
});

//@desc     get classwork-type
//@route    POST /api/eduGemini/classroom/getClassworkType/:roomId
//@access   private
const getClassworkType = asyncHandler(async (req, res, next) => {
  //get the params
  const { roomId } = req.params;

  //check if the the room exist
  const roomExist = await Classroom.findById({ _id: roomId });

  // if not exist
  if (!roomExist) {
    return res.status(400).json({ message: `${roomExist._id} doesn exist` });
  }

  //else if exist
  const getAllClassworkType = roomExist.classwork_type.map(
    (classType) => classType
  );

  res.status(200).send(getAllClassworkType);
});

//@desc     delete classwork-type
//@route    POST /api/eduGemini/classroom/deleteClassworkType
//@access   private
const deleteClassworkType = asyncHandler(async (req, res, next) => {
  //get the _id of the classwork
  const { classworkId, roomId } = req.body;

  //check room if exist
  const roomExist = await Classroom.findById({ _id: roomId });

  const updateClassworkType = roomExist.classwork_type.filter(
    (classType) => classType._id.toString() !== classworkId
  );

  roomExist.classwork_type = updateClassworkType;

  await roomExist.save();

  res.status(200).json({ message: "Deleted successfully" });
});

//@desc     join student
//@route    POST /api/eduGemini/classroom/join
//@access   private
const joinStudent = asyncHandler(async (req, res, next) => {
  const {
    _id,
    // user_username,
    user_email,
    // user_profile_path,
    // user_img,
    user_lastname,
    user_firstname,
    user_middlename,
    user_gender,
    class_code,
  } = req.body;

  if (
    !user_lastname ||
    !user_firstname ||
    !user_middlename ||
    !user_gender ||
    !class_code
  ) {
    return res.status(400).json({ message: "Please fill all fields" });
  }

  const classroomExist = await Classroom.findOne({ class_code });

  if (!classroomExist) {
    return res
      .status(400)
      .json({ message: `class code: ${class_code} doesnt exist` });
  }

  const studentDuplication = classroomExist.students.find(
    (student) => student.user_email === user_email
  );

  if (studentDuplication) {
    return res.status(400).json({
      message: `The account ${user_email} is already registered here`,
    });
  }

  if (classroomExist.owner_email === user_email) {
    return res
      .status(400)
      .json({ message: "You can not join the class you created" });
  }

  classroomExist.students.unshift({
    _id,
    // user_username,
    // user_email,
    // user_profile_path,
    // user_img,
    user_lastname,
    user_firstname,
    user_middlename,
    user_gender,
    // class_code,
    approvalStatus: "pending",
  });

  await classroomExist.save();

  return res
    .status(200)
    .json({ message: "Your request to join is already on process" });
});

// //@desc     get joined class info
// //@route    get /api/eduGemini/classroom/joinedClass/:userId
// //@access   private
// const joinedClass = asyncHandler(async (req, res, next) => {
//   const classroomExist = await Classroom.find();
//   const { userId } = req.params;
//   console.log(classroomExist.students.map((student) => student._id === userId));
//   // classroomExist.students.find((student) => student._id === userId);

//   // console.log(classroomExist);
// });

//@desc     accept join student
//@route    POST /api/eduGemini/classroom/join
//@access   private
const acceptJoinStudent = asyncHandler(async (req, res, next) => {
  const { userId, roomId } = req.body;

  const roomExist = await Classroom.findOne({ _id: roomId });
  const getStudent = roomExist.students;
  const studentIndex = roomExist.students.findIndex(
    (student) => student._id.toString() === userId
  );

  const studentToBeUpdated = getStudent[studentIndex];
  studentToBeUpdated.approvalStatus = "approved";
  getStudent[studentIndex] = studentToBeUpdated;

  roomExist.acceptedStudents.push({
    _id: userId,
    // user_username: studentToBeUpdated.user_username,
    // user_email: studentToBeUpdated.user_email,
    // user_profile_path: studentToBeUpdated.user_profile_path,
    // user_img: studentToBeUpdated.user_img,
    // user_lastname: studentToBeUpdated.user_lastname,
    // user_firstname: studentToBeUpdated.user_firstname,
    // user_middlename: studentToBeUpdated.user_middlename,
    // user_gender: studentToBeUpdated.user_gender,
    //class_code: studentToBeUpdated.class_code,
    approvalStatus: "approved",
  });

  await roomExist.save();
  res
    .status(200)
    .json({ message: `${studentToBeUpdated.user_firstname} is accepted` });
});

//@desc     reject join student
//@route    POST /api/eduGemini/classroom/reject
//@access   private
const rejectJoinStudent = asyncHandler(async (req, res, next) => {
  const { userId, roomId } = req.body;

  const roomExist = await Classroom.findOne({ _id: roomId });
  const getStudent = roomExist.students;
  const getStudentList = roomExist.acceptedStudents;
  const studentIndex = roomExist.students.findIndex(
    (student) => student._id === userId
  );

  const studentToBeUpdated = getStudent[studentIndex];

  studentToBeUpdated.approvalStatus = "declined";

  const removedFromAcceptedList = getStudentList.filter(
    (student) => student._id !== userId
  );

  getStudent[studentIndex] = studentToBeUpdated;

  roomExist.acceptedStudents = removedFromAcceptedList;

  await roomExist.save();
  return res
    .status(200)
    .json({ message: `${studentToBeUpdated.user_firstname} is declined` });
});

//@desc     reject join student
//@route    POST /api/eduGemini/classroom/rejectStudents
//@access   private
const rejectMultipleStudents = asyncHandler(async (req, res, next) => {
  const { checkedList, roomId } = req.body;

  const roomExist = await Classroom.findOne({ _id: roomId });
  const getStudent = roomExist.students;

  checkedList.forEach((listedStudent) => {
    const studentIndex = roomExist.students.findIndex(
      (student) => student._id.toString() === listedStudent._id.toString()
    );

    const studentToBeUpdated = getStudent[studentIndex];

    studentToBeUpdated.approvalStatus = "declined";

    getStudent[studentIndex] = studentToBeUpdated;

    const removedFromAcceptedList = roomExist.acceptedStudents.filter(
      (student) => student._id.toString() !== listedStudent._id.toString()
    );

    roomExist.acceptedStudents = removedFromAcceptedList;
  });

  roomExist.markModified("acceptedStudents");
  roomExist.markModified("students");
  await roomExist.save();

  return res
    .status(200)
    .json({ message: `${checkedList.length} students successfully declined` });
});

//@desc     reject join student
//@route    POST /api/eduGemini/classroom/approveStudents
//@access   private
const approveMultipleStudents = asyncHandler(async (req, res, next) => {
  const { checkedList, roomId } = req.body;

  const roomExist = await Classroom.findOne({ _id: roomId });
  const getStudent = roomExist.students;

  checkedList.map((listedStudent) => {
    const studentIndex = roomExist.students.findIndex(
      (student) => student._id === listedStudent._id
    );

    const studentToBeUpdated = getStudent[studentIndex];
    studentToBeUpdated.approvalStatus = "approved";
    getStudent[studentIndex] = studentToBeUpdated;

    roomExist.acceptedStudents.push({
      _id: listedStudent._id,
      // user_username: studentToBeUpdated.user_username,
      // user_email: studentToBeUpdated.user_email,
      // user_profile_path: studentToBeUpdated.user_profile_path,
      // user_img: studentToBeUpdated.user_img,
      // user_lastname: studentToBeUpdated.user_lastname,
      // user_firstname: studentToBeUpdated.user_firstname,
      // user_middlename: studentToBeUpdated.user_middlename,
      // user_gender: studentToBeUpdated.user_gender,
      // class_code: studentToBeUpdated.class_code,
      approvalStatus: "approved",
    });
  });
  await roomExist.save();

  return res
    .status(200)
    .json({ message: `${checkedList.length} students successfully approved` });
});

//@desc     check plagiarsm
//@route    GET /api/eduGemini/classroom/plagiarismChecker/:roomId/:workId/:userId
//@access   private
const plagiarismChecker = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;
  const { workId, roomId } = req.body;
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
            mimeType: "image/jpeg",
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
      } //Visuals video
      else if (fileFormat === "mp4") {
        const uploadResult = await fileManager.uploadFile(
          `classworks/${classworkPath}/answers${file.path}/${file.originalname}`,
          {
            mimeType: "video/mp4",
            displayName: `${file.originalname}`,
          }
        );

        const name = uploadResult.file.name;

        let fileState = await fileManager.getFile(name);
        while (fileState.state === FileState.PROCESSING) {
          process.stdout.write("processing");
          // Sleep for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 10_000));
          // Fetch the file from the API again
          fileState = await fileManager.getFile(name);
        }

        if (fileState.state === FileState.FAILED) {
          return res.status(400).json({ message: "Video processing failed." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const name = uploadResult.file.name;

        let fileState = await fileManager.getFile(name);
        while (fileState.state === FileState.PROCESSING) {
          process.stdout.write("processing");
          // Sleep for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 10_000));
          // Fetch the file from the API again
          fileState = await fileManager.getFile(name);
        }

        if (fileState.state === FileState.FAILED) {
          return res.status(400).json({ message: "Video processing failed." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

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

        const name = uploadResult.file.name;

        let fileState = await fileManager.getFile(name);
        while (fileState.state === FileState.PROCESSING) {
          process.stdout.write("processing");
          // Sleep for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 10_000));
          // Fetch the file from the API again
          fileState = await fileManager.getFile(name);
        }

        if (fileState.state === FileState.FAILED) {
          return res.status(400).json({ message: "Video processing failed." });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
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

        const name = uploadResult.file.name;

        let fileState = await fileManager.getFile(name);
        while (fileState.state === FileState.PROCESSING) {
          process.stdout.write("processing");
          // Sleep for 10 seconds
          await new Promise((resolve) => setTimeout(resolve, 10_000));
          // Fetch the file from the API again
          fileState = await fileManager.getFile(name);
        }

        if (fileState.state === FileState.FAILED) {
          return res.status(400).json({ message: "Audio processing failed." });
        }
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the audio provided as this serves as the answer of the student.",
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
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const result = await model.generateContent([
          {
            fileData: {
              mimeType: uploadResult.file.mimeType,
              fileUri: uploadResult.file.uri,
            },
          },
          {
            text: "Analyze and describe the audio provided as this serves as the answer of the student.",
          },
        ]);

        studentFiles = result.response.text();
      }

      return studentFiles;
    })
  );

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
Analyze the following student's output for potential plagiarism by comparing it with external internet sources.

Student Output:
${filesToBeprompted}

Perform a thorough search across external internet sources. For each detected match, return a JSON array in the following format:
[
  {
    "source": "exact URL of the internet source",
    "similarityPercentage": percentage,
    "matchingContent": "exact content matching the student's output"
  }
]

If no matches are found, return the following JSON array:
[
  {
    "source": "no matches found",
    "similarityPercentage": 0,
    "matchingContent": "no matching content"
  }
]

Return only the JSON array in the specified format. Do not include any additional text, explanation, or formatting. Ensure that "source" contains the exact internet URL of the identified external source.
`;

  console.log(prompt);

  const result = await model.generateContent(prompt);

  const plagiarismData = result.response.text();
  console.log(plagiarismData);
  try {
    const jsonStart = plagiarismData.indexOf("[");
    const jsonEnd = plagiarismData.lastIndexOf("]") + 1;
    const jsonFormat = JSON.parse(plagiarismData.slice(jsonStart, jsonEnd));
    console.log(jsonFormat);
    return res.status(200).send(jsonFormat);
  } catch (error) {
    console.error("Failed to extract JSON:", error);
  }
  return res.status(200).send(plagiarismData);
});

export default {
  createClass,
  allClass,
  getAllClass,
  getCreatedClassroom,
  getAnnouncements,
  deleteAnnouncement,
  classworkType,
  getClassworkType,
  deleteClassworkType,
  joinStudent,
  // joinedClass,
  acceptJoinStudent,
  rejectJoinStudent,
  rejectMultipleStudents,
  approveMultipleStudents,
  adminAllClass,
  createPublicComment,
  plagiarismChecker,
};
