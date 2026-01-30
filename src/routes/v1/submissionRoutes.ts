import express from "express";

import { addSubmission } from "../../controllers/submissionController";
import { zodValidate } from "../../validators/zodValidator";
import { createSubmissionZodSchema } from "../../dtos/createSubmissionDto";



const submissionRouter = express.Router();

submissionRouter.post('/',zodValidate(createSubmissionZodSchema),addSubmission);

export default submissionRouter;