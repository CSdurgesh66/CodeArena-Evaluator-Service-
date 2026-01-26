import Redis from "ioredis";

import serverConfig from "./serverConfig";


const redisConfig = {
    port:Number(serverConfig.REDIS_PORT),
    host:(serverConfig.REDIS_HOST)
}


const redisConnection = new Redis(redisConfig);

redisConnection.on("connect", () => {
    console.log("Connected to redis with ioredis");
});

redisConnection.on("error", (err) => {
    console.log("Redis error:",err);
});


export default redisConnection;