import sampleQueue from "../queues/sampleQueue";

export default async function (
    name: string,
    payload: Record<string, unknown>,
    options?: {
        priority?: number;
        delay?: number;
        attempts?: number;
        backoff?: number;
        jobId?: string;
        removeOnComplete?: boolean;
        removeOnFail?: boolean;
    }
) {

    try{
        await sampleQueue.add(name, payload, options);
         console.log("Successfully added a new job");
    }catch(err){
        console.log("failed to add job",err);
    }
}