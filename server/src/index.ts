import dotenv from "dotenv";
import { app } from "./app";
import connectDb from "./config/db";

dotenv.config();

const port = process.env.PORT || 3000;

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log(`ERROR: ${error}`);
      throw error;
    });
    app.listen(port, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MONGODB connection failure: ${error}`);
  });
