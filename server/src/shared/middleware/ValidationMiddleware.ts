import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";
import { HttpStatus } from "../enums/HttpStatus";
import { ResponseHandler } from "../presentation/ResponseHandler";



export const validate =
    (schema: ZodType) =>
        (req: Request, res: Response, next: NextFunction): void => {
    try {
        req.body = schema.parse(req.body)
        next()
    } catch (error) {
        if (error instanceof ZodError) {
            ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Validation failed",
                error.issues.map((issue) => ({
                    field: issue.path.join("."),
                    message:issue.message,
                }))
            )
            return
        }
        next(error)
    }
}