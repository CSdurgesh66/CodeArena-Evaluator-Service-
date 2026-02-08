

import { CPP_IMAGE } from "../utils/constants";

import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";



const TIMELIMIT = 2000;

async function runCpp(code: string, testcases: string) {

    console.log("Initialising a new Cpp docker container");

    const b64Code = Buffer.from(code).toString('base64');
    const b64Input = Buffer.from(testcases || "").toString('base64');

    const cmd = ['/bin/sh', '-c', `echo "${b64Code}" | base64 -d > main.cpp && echo "${b64Input}" | base64 -d > input.txt && g++ -o main main.cpp  && ./main < input.txt`];
    
    const cppDockerContainer = await createContainer(CPP_IMAGE, cmd);

    console.log(" Starting container");
    await cppDockerContainer.start();

    const outputPromise = new Promise((resolve, reject) => {
        const rawLogBuffer: Buffer[] = [];

        cppDockerContainer.logs({
            stdout: true,
            stderr: true,
            timestamps: false,
            follow: true
        }).then(loggerStream => {
            loggerStream.on('data', (chunk) => {
                rawLogBuffer.push(chunk);
            });

            loggerStream.on('end', () => {
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodeStream = decodeDockerStream(completeBuffer);
                console.log("decode", decodeStream);
                resolve(decodeStream);
            });

            loggerStream.on('error', (err) => reject(err));
        });
    });

    const timeoutPromise = new Promise<{ stdout: string, stderr: string }>((_, reject) => {
        setTimeout(() => {
            reject(new Error("Time Limit Exceeded"));
        }, TIMELIMIT);
    });

    try {
        
        const finalOutput = await Promise.race([outputPromise, timeoutPromise]);
        console.log(" Cpp Execution finished successfully");
        await cppDockerContainer.remove();

        return finalOutput;

    } catch (error) {
        if (error instanceof Error && error.message === "Time Limit Exceeded") {

            console.log("Time Limit Exceeded");

            try {
                await cppDockerContainer.kill();
            } catch (e) {
                console.log("Container already stopped");
            }

            await cppDockerContainer.remove();

            return { stdout: "", stderr: "Time Limit Exceeded!" };

        }

        throw error;

    }

}

export default runCpp;