import { Response } from "express";

export class ResponseHandler{
    static success<T>( res: Response, status: number, message: string, data?:T ) {
        return res.status(status).json({success:true, message, ...(data !== undefined && {data})})
    }

    static error(res: Response, status: number, message: string, errors?:any) {
        return res.status(status).json({success:false, message, ...(errors !== undefined && {errors})})
    }
}