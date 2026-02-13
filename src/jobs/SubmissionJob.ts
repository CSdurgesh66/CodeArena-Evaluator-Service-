// SampleJob.ts is the file that defines how a job is handle



// left ********************************** 


import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import { getExecutionStrategy } from "../utils/executionStrategyFactory";

export default class SubmissionJob implements IJob {
    name: string;
    payload: SubmissionPayload;
    constructor(payload: SubmissionPayload) {
        this.payload = payload;
        this.name = this.constructor.name;
    }

    handle = async (job?: Job) => {
        console.log("Handler of the Submission job called");
        console.log(this.payload);
        if (job) {
            const data = this.payload;
            const language = data?.language;

            try {

                const strategy = getExecutionStrategy(language);

                const finalOutput = await strategy.run(
                    data?.code,
                    data?.inputCase
                );

                console.log("Final output:", finalOutput);

                if (finalOutput.stderr) {

                    console.error("Execution Failed:", finalOutput.stderr);

                } else {

                    console.log("Execution Success:", finalOutput.stdout);

                }

            } catch (error) {
                console.error("Error executing container:", error);
            }

        }
    }

    failed = (job?: Job) => {
        console.log("Submission Job failed");
        if (job) {
            console.log(job.id);
        }
    };
}

