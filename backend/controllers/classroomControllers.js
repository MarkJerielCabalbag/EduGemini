import User from "../models/userModel.js";
import Classroom from "../models/classroomModel.js";
import asyncHandler from "express-async-handler";
import { nanoid } from "nanoid";
import multer from "multer";
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

//@desc     get all classroom from classroom collection
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
//@route    GET /api/eduGemini/classroom/getCreatedClassroom/:classroomId
//@access   private
const getCreatedClassroom = asyncHandler(async (req, res, next) => {
  //get the request from req route params

  //find that classroom from classroom collection
  const classroomExist = await Classroom.findById(req.params.roomId);

  if (!classroomExist) {
    return res
      .status(404)
      .json({ message: `${classroomExist._id} does not exist` });
  }

  res.status(200).send([classroomExist]);
});

//@desc     GET announcment
//@route    GET /api/eduGemini/classroom/getCreatedClassroom/getAnnouncements/:roomId
//@access   private
const getAnnouncements = asyncHandler(async (req, res, next) => {
  const classroomId = req.params.roomId;

  const classroomExist = await Classroom.findById(req.params.roomId);

  const announcements = classroomExist.announcement;
  res.status(200).send(announcements);
});

//@desc     DELETE announcement
//@route    DELETE /api/eduGemini/classroom/getCreatedClassroom/deleteAnnouncement/:roomId
//@access   private
// const deleteAnnouncement = asyncHandler(async (req, res, next) => {
//   const classroomId = req.params.roomId;
//   const { announceId } = req.body; // Extract announceId from req.body

//   if (!announceId) {
//     return res.status(400).json({ message: "Announcement ID is required" });
//   }

//   const classroomExist = await Classroom.findById(classroomId);

//   if (!classroomExist) {
//     return res.status(404).json({ message: "Classroom not found" });
//   }

//   const getAllAnnouncement = classroomExist.announcement;

//   const updatedAnnouncements = getAllAnnouncement.filter(
//     (announcement) => announcement._id.toString() !== announceId
//   );

//   if (updatedAnnouncements.length === getAllAnnouncement.length) {
//     return res.status(404).json({ message: "Announcement not found" });
//   }

//   classroomExist.announcement = updatedAnnouncements;
//   await classroomExist.save();

//   res.status(200).json({ message: "Deleted successfully" });
// });

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
    user_username,
    user_email,
    user_profile_path,
    user_img,
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
      .status(200)
      .json({ message: `class code ${class_code} doesnt exits` });
  }

  const studentDuplication = classroomExist.students.find(
    (student) => student.user_email === user_email
  );

  if (studentDuplication) {
    return res.status(400).json({
      message: `The account ${user_email} is already registered here`,
    });
  }

  const accountInstructorExistAsStudent = classroomExist.students.find(
    (student) => student.user_email === classroomExist.owner_email
  );

  if (accountInstructorExistAsStudent) {
    return res
      .status(400)
      .json({ message: "You can not join the class you created" });
  }

  classroomExist.students.unshift({
    _id,
    user_username,
    user_email,
    user_profile_path,
    user_img,
    user_lastname,
    user_firstname,
    user_middlename,
    user_gender,
    class_code,
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
    (student) => student._id === userId
  );

  const studentToBeUpdated = getStudent[studentIndex];

  studentToBeUpdated.approvalStatus = "approved";

  getStudent[studentIndex] = studentToBeUpdated;

  await roomExist.save();
  res
    .status(200)
    .json({ message: `${studentToBeUpdated.user_username} is accepted` });
});

//@desc     reject join student
//@route    POST /api/eduGemini/classroom/reject
//@access   private
const rejectJoinStudent = asyncHandler(async (req, res, next) => {
  const { userId, roomId } = req.body;

  const roomExist = await Classroom.findOne({ _id: roomId });
  const getStudent = roomExist.students;
  const studentIndex = roomExist.students.findIndex(
    (student) => student._id === userId
  );

  const studentToBeUpdated = getStudent[studentIndex];

  studentToBeUpdated.approvalStatus = "declined";

  getStudent[studentIndex] = studentToBeUpdated;

  await roomExist.save();
  res
    .status(200)
    .json({ message: `${studentToBeUpdated.user_username} is declined` });
});

export default {
  createClass,
  allClass,
  getAllClass,
  getCreatedClassroom,
  getAnnouncements,
  // deleteAnnouncement,
  classworkType,
  getClassworkType,
  deleteClassworkType,
  joinStudent,
  // joinedClass,
  acceptJoinStudent,
  rejectJoinStudent,
};
