import { HttpStatus } from "../enums/HttpStatus";
import { AppError } from "./AppError";

export class UnauthorizedError extends AppError{
    constructor(message = "Unauthorized") {
        super(message, HttpStatus.UNAUTHORIZED)
    }
}