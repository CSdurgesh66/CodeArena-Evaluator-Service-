import { ZodSchema } from "zod";
import { Request, Response, NextFunction } from "express";

export const zodValidate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    try {
        const parsedData = schema.parse(req.body);
        req.body = parsedData;
        next();

    } catch (err: any) {
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "Invalid request params received",
            errors: err.errors,
        });
    }
}