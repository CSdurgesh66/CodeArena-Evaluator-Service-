import express from  "express";

import serverConfig from "./config/serverConfig";
import redisConnection from "./config/redisConfig";

const app = express();

async function startserver() {
    try{

        // connect Redis
        await redisConnection.ping();
        console.log("Redis is ready");

        // start express server
        app.listen(serverConfig.PORT, () => {
            console.log(`Server starting at ${serverConfig.PORT}`);
        });

    }catch(error){
        console.error("Failed to start server",error);
        process.exit(1);
    }
}

startserver();
