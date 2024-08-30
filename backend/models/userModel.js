import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    user_email: {
      type: String,
      required: true,
      unique: true,
    },
    user_username: {
      type: String,
      required: true,
      unique: false,
    },
    user_password: {
      type: String,
      required: true,
      unique: false,
    },
    profile: {
      type: Object,
    },
    profile_path: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;
