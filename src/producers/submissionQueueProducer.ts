import submissionQueue from "../queues/submissionQueue";

export default async function (
    name: string,
    payload: Record<string, unknown>) {
    try{
        await submissionQueue.add(name, payload);
        console.log("Successfully added a new submission job");
    }catch(err){
        console.log("failed to add job",err);
    }
}