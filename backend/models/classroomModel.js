import mongoose, { Schema } from "mongoose";

const classroomSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    owner_name: {
      type: String,
    },
    owner_email: {
      type: String,
    },
    class_code: {
      type: String,
    },
    students: {
      type: Array,
      required: false,
    },
    classname: {
      type: String,
    },
    section: {
      type: String,
    },
    subject: {
      type: String,
    },
    room: {
      type: String,
    },
    announcement: {
      type: Array,
    },
    classwork: {
      type: Array,
    },
    classwork_type: {
      type: Array,
    },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    profile_path: {
      type: String,
    },
    user_img: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

const Classroom = mongoose.model("Classroom", classroomSchema);
export default Classroom;
