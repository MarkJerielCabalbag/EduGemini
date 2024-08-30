import mongoose, { Schema } from "mongoose";

const adminSchema = new Schema(
  {
    admin_username: {
      type: String,
    },
    admin_password: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;
