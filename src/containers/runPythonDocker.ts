

import { PYTHON_IMAGE } from "../utils/constants";

import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";



const TIMELIMIT = 2000;

async function runPython(code: string, testcases: string) {

    console.log("Initialising a new docker container");

    const b64Code = Buffer.from(code).toString('base64');
    const b64Input = Buffer.from(testcases || "").toString('base64');

    const cmd = ['/bin/sh', '-c', `echo "${b64Code}" | base64 -d > main.py && echo "${b64Input}" | base64 -d > input.txt && python -u main.py < input.txt`];
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, cmd);

    console.log(" Starting container");
    await pythonDockerContainer.start();


    const outputPromise = new Promise((resolve, reject) => {
        const rawLogBuffer: Buffer[] = [];

        pythonDockerContainer.logs({
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
        console.log("Execution finished successfully");
        await pythonDockerContainer.remove();

        return finalOutput;

    } catch (error) {
        if (error instanceof Error && error.message === "Time Limit Exceeded") {

            console.log("Time Limit Exceeded");

            try {
                await pythonDockerContainer.kill();
            } catch (e) {
                console.log("Container already stopped");
            }

            await pythonDockerContainer.remove();

            return { stdout: "", stderr: "Time Limit Exceeded!" };

        }

        throw error;

    }

}

export default runPython;