import express from "express";

import serverConfig from "./config/serverConfig";
import redisConnection from "./config/redisConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/SampleWorker";
import serverAdapter from "./config/bullBoardConfig";

const app = express();

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

        

        sampleQueueProducer("SampleJob", {
            name: "Durgesh",
            company: "startup",
            position: "backend"

        }, {
            priority: 1,
            attempts: 3,
            backoff: 2000,
            removeOnComplete: false
        });

        SampleWorker("SampleQueue");


    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startserver();
