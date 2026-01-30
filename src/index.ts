import express,{Express} from "express";

import serverConfig from "./config/serverConfig";
import redisConnection from "./config/redisConfig";
import SampleWorker from "./workers/SampleWorker";
import serverAdapter from "./config/bullBoardConfig";
import apiRouter from "./routes";

const app:Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api',apiRouter);


async function startserver() {
    try {

        // connect Redis
        await redisConnection.ping();
        console.log("Redis is ready");

        app.use("/ui",serverAdapter.getRouter());
        console.log("Bull dashboard running");

        // start express server
        app.listen(serverConfig.PORT, () => {
            console.log(`Server starting at ${serverConfig.PORT}`);
        });

        SampleWorker("SampleQueue");


    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startserver();
