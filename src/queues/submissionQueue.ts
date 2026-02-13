import { Queue } from "bullmq";

import redisConnection from "../config/redisConfig";
import { Submission_Queue } from "../utils/constants";


export default new Queue(Submission_Queue, {connection:redisConnection});
