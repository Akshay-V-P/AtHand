import { NextFunction, Request, Response } from "express";
import { IUsecase } from "../../../../../shared/application/interfaces/IUsecase";
import { HttpStatus } from "../../../../../shared/enums/HttpStatus";
import { ResponseHandler } from "../../../../../shared/presentation/ResponseHandler";
import { UpdateProviderDto } from "../../../../provider/application/dtos/UpdateProviderDto";
import { Provider } from "../../../../provider/domain/entities/Provider";
import { RESPONSE_MESSAGES } from "../../constants/RESPONSE_MESSAGES";
import { z, ZodError } from "zod";

const businessDetailsUpdateSchema = z.object({
    businessName: z.string().trim().min(3),
    contactPerson: z.string().trim().min(3),
    phone: z.string().trim().min(10).max(15),
    email: z.email().trim(),
    location: z.object({
        address: z.object({
            street: z.string().trim().min(3),
            city: z.string().trim().min(3),
            district: z.string().trim().min(3),
            state: z.string().trim().min(2),
            pincode: z.string().trim().length(6),
        }),
        coordinates: z.object({
            type: z.literal("Point"),
            coordinates: z.tuple([z.number().min(-180).max(180), z.number().min(-90).max(90)]),
        }),
    }),
}).strict();

export class UpdateProviderController {
    constructor(private readonly updateProviderUsecase: IUsecase<UpdateProviderDto, Provider>) {}

    updateProvider = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const id = req.params.id as string;
            if (!id) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, RESPONSE_MESSAGES.PROVIDE_ID);
                return;
            }

            const updateData = businessDetailsUpdateSchema.parse(req.body);
            const provider = await this.updateProviderUsecase.execute({ id, updateData });
            ResponseHandler.success(res, HttpStatus.OK, RESPONSE_MESSAGES.UPDATED_PROVIDER, provider);
        } catch (error) {
            if (error instanceof ZodError) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Validation failed", error.issues);
                return;
            }
            next(error);
        }
    };
}
