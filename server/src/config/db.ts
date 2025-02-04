import mongoose from "mongoose";

const connectDb = async (): Promise<void> => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`
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
