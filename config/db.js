import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const dbConnect = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log("✅ DATABASE CONNECTED!!");
  } catch (err) {
    console.error("❌ DATABASE NOT CONNECTED:", err.message);
    process.exit(1); // Stop app if DB fails
  }
};