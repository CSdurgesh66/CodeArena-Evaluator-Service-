import { Request, Response } from "express";
import { CreateSubmissionDto } from "../dtos/createSubmissionDto";


export function addSubmission(req: Request, res: Response) {

    try {
        const submissionDto = req.body as CreateSubmissionDto;
        console.log(submissionDto);
        return res.status(201).json({
            success: true,
            error: {},
            message: "Successfully collected the submission",
            data: submissionDto
        });


    } catch (error: any) {
        console.error("Create submission error:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to create submission",
            error: error.message || "Internal server error"
        });
    }

}