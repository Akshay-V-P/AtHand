import { NextFunction, Request, Response } from "express";
import { ResponseHandler } from "./ResponseHandler";
import { HttpStatus } from "../enums/HttpStatus";
import { createDisplayUrl } from "../infrastructure/services/s3.service";

export const getPresignedUrl = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const key = req.body.key
        if (!key) {
            ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Please provide image key")
            return
        }

        const presignedUrl = await createDisplayUrl(key)
        if (!presignedUrl) {
            ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Failed to create url")
            return
        }

        ResponseHandler.success(res, HttpStatus.OK, "Image url created", presignedUrl)
    } catch (error) {
        next(error)
    }
}