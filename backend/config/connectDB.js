import mongoose from "mongoose";

const connectDB = async () => {
  console.log("Connect", process.env.MONGO_URL);
  const conn = await mongoose.connect(process.env.MONGO_URL);
  console.log(`database ${conn.connection.host} is successfully connnected`);
};

export default connectDB;
