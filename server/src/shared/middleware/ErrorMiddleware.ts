import { NextFunction, Request } from "express";

export class ErrorMiddleware{
    constructor() { }
    execute = (error:Error, req:Request, res:Response, next:NextFunction) => {
        
    }
}