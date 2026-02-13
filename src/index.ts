import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import redisConnection from "./config/redisConfig";
// import SampleWorker from "./workers/SampleWorker";
import serverAdapter from "./config/bullBoardConfig";
import apiRouter from "./routes";

import submissionQueueProducer from "./producers/submissionQueueProducer";
import SubmissionWorker from "./workers/SubmissionWorker";
import { Submission_Queue } from "./utils/constants";

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', apiRouter);


async function startserver() {
    try {

        // connect Redis
        await redisConnection.ping();
        console.log("Redis is ready");

        app.use("/ui", serverAdapter.getRouter());
        console.log("Bull dashboard running");

        // start express server
        app.listen(serverConfig.PORT, () => {
            console.log(`Server starting at ${serverConfig.PORT}`);
        });

        // SampleWorker("SampleQueue");

       SubmissionWorker(Submission_Queue);


const code = `
#include <iostream>
#include <string>
using namespace std;

int main() {
    string s;
    cin >> s;
    for(int i = s.length() - 1; i >= 0; i--) {
        cout << s[i];
    }

    return 0;
}
`;

const inputCase = "hello";

        submissionQueueProducer("SubmissionJob", {
            language:"cpp",
            inputCase,
            code
        })


        // sampleQueueProducer("SampleJob", {
        //     name: "Durgesh",
        //     company: "startup",
        //     position: "backend"
        // }, {
        //     priority: 1,
        //     attempts: 3,
        //     backoff: 2000,
        //     removeOnComplete: true
        // });



    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startserver();
