import express, { Express } from "express";

import serverConfig from "./config/serverConfig";
import redisConnection from "./config/redisConfig";
import SampleWorker from "./workers/SampleWorker";
import serverAdapter from "./config/bullBoardConfig";
import apiRouter from "./routes";
// import runPython from "./containers/runPythonDocker";
// import runJava from "./containers/runJavaDocker";
import runCpp from "./containers/runCppDocker";

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

        SampleWorker("SampleQueue");


const code = `
#include <iostream>
#include <vector>
#include <numeric>

using namespace std;

int main() {
    int n;
    
    // 1. Read the size of the array
    if (!(cin >> n)) return 0;

    
    // 2. Read the elements
    vector<int> arr(n);
    for (int i = 0; i < n; i++) {
        cin >> arr[i];
    }
    
    // 3. Process the array (Calculate Sum)
    long long sum = 0;
    for (int num : arr) {
        sum += num;
    }
    
    cout << "Array Size: " << n << endl;
    cout << "Array Elements: ";
    for(int x : arr) cout << x << " ";
    cout << endl;
    cout << "Sum: " << sum << endl;
    
    return 0;
}
`;
const testcases = `5
10 20 30 40 50`;


const finaloutput = await runCpp(code,testcases);
console.log(finaloutput);


    } catch (error) {
        console.error("Failed to start server", error);
        process.exit(1);
    }
}

startserver();
