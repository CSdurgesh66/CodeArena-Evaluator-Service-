import express from "express";

import serverConfig from "./config/serverConfig";
import redisConnection from "./config/redisConfig";
import sampleQueueProducer from "./producers/sampleQueueProducer";
import SampleWorker from "./workers/SampleWorker";

const app = express();

async function startserver() {
    try {

        // connect Redis
        await redisConnection.ping();
        console.log("Redis is ready");

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
            removeOnComplete: true
        });

        SampleWorker("SampleQueue");


    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startserver();
