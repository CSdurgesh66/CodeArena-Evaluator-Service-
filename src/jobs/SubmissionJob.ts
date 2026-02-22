
import { Job } from "bullmq";

import { IJob } from "../types/bullMqJobDefinition";
import { SubmissionPayload } from "../types/submissionPayload";
import { getExecutionStrategy } from "../utils/executionStrategyFactory";
import evaluationQueueProducer from "../producers/evaluationQueueProducer";

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

                let finalCode = data?.code;
                finalCode = finalCode.replace(/\\n/g, "\n").replace(/\\"/g, '"').replace(/^"|"$/g, "");

                const input = data?.inputCase;
                const expectedOutput = data?.outputCase?.trim();

                const strategy = getExecutionStrategy(language);

                const finalOutput = await strategy.run(
                    finalCode,
                    input,
                    expectedOutput,
                );

                evaluationQueueProducer({finalOutput, userId:data.userId, submissionId:data.submission_id});


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

