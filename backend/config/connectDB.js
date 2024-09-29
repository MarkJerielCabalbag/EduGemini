import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`database ${conn.connection.host} is successfully connnected`);
    console.log(process.env.MONGO_URI);
  } catch (err) {
    console.log(`database error ${err.message}`);
    process.exit(1);
  }
};

export default connectDB;
