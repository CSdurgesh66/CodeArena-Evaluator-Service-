

import DockerStreamOutput from "../types/dockerStreamOutput";
import { JAVA_IMAGE } from "../utils/constants";

import createContainer from "./containerFactory";
import decodeDockerStream from "./dockerHelper";



const TIMELIMIT = 1000;

async function runJava(code: string, inputCase: string,outputCase:string) {

    console.log("Initialising a new Java docker container");

    const b64Code = Buffer.from(code).toString('base64');
    const b64Input = Buffer.from(inputCase || "").toString('base64');

    const cmd = ['/bin/sh', '-c', `echo "${b64Code}" | base64 -d > Main.java && echo "${b64Input}" | base64 -d > input.txt && javac Main.java  && java Main < input.txt`];
    
    const javaDockerContainer = await createContainer(JAVA_IMAGE, cmd);

    console.log(" Starting container");
    await javaDockerContainer.start();


    let timerId: NodeJS.Timeout;


    const outputPromise = new Promise((resolve, reject) => {
        const rawLogBuffer: Buffer[] = [];

        javaDockerContainer.logs({
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
        timerId = setTimeout(() => {
            reject(new Error("TLE"));
        }, TIMELIMIT);
    });

    try {
        
        const finalOutput: DockerStreamOutput = await Promise.race([outputPromise, timeoutPromise]) as DockerStreamOutput;

        clearTimeout(timerId!);
        await javaDockerContainer.wait();
        console.log(" Java Execution finished successfully");
        await javaDockerContainer.remove();

         if (finalOutput.stderr) {
            return { output: finalOutput.stderr };

        } else {

            if ((finalOutput.stdout).trim() === outputCase.trim()) {
                return { output: finalOutput.stdout, status: "Accepted" }
            } else {
                return { status: "Wrong Answer", expected: outputCase, actual: finalOutput.stdout }
            }

        }

    } catch (error) {
        if (error instanceof Error && error.message === "TLE") {

            console.log("Time Limit Exceeded");

            try {
                await javaDockerContainer.kill();
            } catch (e) {
                console.log("Container already stopped");
            }

            await javaDockerContainer.remove();

            return { stdout: "", stderr: "Time Limit Exceeded!" };

        }

        throw error;

    }

}

export default runJava;