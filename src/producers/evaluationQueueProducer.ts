import evaluationQueue from "../queues/evaluationQueue";

export default async function (payload: Record<string, unknown>) {
    try{
        await evaluationQueue.add("EvaluationJob", payload);
        console.log("Successfully added a new evaluation job");
    }catch(err){
        console.log("failed to add job",err);
    }
}