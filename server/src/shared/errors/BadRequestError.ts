import { HttpStatus } from "../enums/HttpStatus";
import { AppError } from "./AppError";

export class BadRequestError extends AppError{
    constructor(message = "Bad request") {
        super(message, HttpStatus.BAD_REQUEST)
    }
}