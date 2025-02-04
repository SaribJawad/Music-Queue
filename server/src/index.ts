import { app } from "./app";
import connectDb from "./config/db";
import { PORT } from "./config/config";

connectDb()
  .then(() => {
    app.on("error", (error) => {
      console.log(`ERROR: ${error}`);
      throw error;
    });
    app.listen(PORT, () => {
      console.log(`Server is running at port: ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log(`MONGODB connection failure: ${error}`);
  });
