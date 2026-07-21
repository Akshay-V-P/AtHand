import { HttpStatus } from "../enums/HttpStatus";
import { AppError } from "./AppError";

export class ConflictError extends AppError{
    constructor(message = "Conflict") {
        super(message, HttpStatus.CONFLICT)
    }
}