import { server } from "./app.js";
import connectDb from "./config/db.js";
import { PORT } from "./config/config.js";
connectDb()
    .then(() => {
    server.on("error", (error) => {
        console.log(`ERROR: ${error}`);
        throw error;
    });
    server.listen(PORT, () => {
        console.log(`Server is running at port: ${process.env.PORT}`);
    });
})
    .catch((error) => {
    console.log(`MONGODB connection failure: ${error}`);
});
