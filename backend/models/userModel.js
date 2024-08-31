import mongoose from "mongoose";

const userSchema = mongoose.Schema(
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

export default mongoose.model("User", userSchema);
