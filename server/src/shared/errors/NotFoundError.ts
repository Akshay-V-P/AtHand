import { HttpStatus } from "../enums/HttpStatus";
import { AppError } from "./AppError";

export class NotFoundError extends AppError{
    constructor(message = "Not found") {
        super(message, HttpStatus.NOT_FOUND)
    }
}