import { Job, Worker } from "bullmq";
import redisConnection from "../config/redisConfig";
import SampleJob from "../jobs/SampleJob";


export default function SampleWorker(queueName:string){
    new Worker(
        queueName,
        async (job:Job) => {
            console.log("Sample job worker kicking",job);
            if(job.name === "SampleJob"){
                const sampleJobInstance  = new SampleJob(job.data);
                console.log("this is sample worker job",sampleJobInstance);
                sampleJobInstance.handle(job);
                return true;
                // return sampleJobInstance;
            }
        },
        {
            connection:redisConnection
        }
    )
}