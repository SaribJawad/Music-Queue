import mongoose from "mongoose";
import { DB_NAME, MONGODB_URI } from "./config.js";

const connectDb = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `MongoDB connected! DB Host: ${connectionInstance.connection.host}`
    );
  } catch (error) {
    console.log(`Mongodb Connection Error: ${error}`);
    process.exit(1);
  }
};

export default connectDb;
