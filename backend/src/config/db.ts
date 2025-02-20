import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, {
      dbName: process.env.DB_NAME,
    });
    console.log("Connected to database");
  } catch (error) {
    console.log("Error connecting to database", error);
  }
};

export default connectDB;
