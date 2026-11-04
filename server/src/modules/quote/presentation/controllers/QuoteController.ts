import { Request, Response, NextFunction } from "express";
import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { CreateQuoteDto } from "../../application/dtos/CreateQuoteDto";
import { EditQuoteDto } from "../../application/dtos/EditQuoteDto";
import { Quote } from "../../domain/entities/Quote";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class QuoteController {
    constructor(
        private readonly createQuoteUseCase: IUsecase<CreateQuoteDto, Quote>,
        private readonly getQuoteUseCase: IUsecase<{ id: string }, Quote>,
        private readonly editQuoteUseCase: IUsecase<EditQuoteDto, Quote>,
        private readonly getProviderQuotesUseCase: IUsecase<{ providerId: string; page?: number; limit?: number }, { data: Quote[], count: number }>,
        private readonly getQuotesByRequestIdUseCase: IUsecase<{ requestId: string; }, Quote[]>
    ) { }

    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = (req as any).user?.id || req.body.providerId;
            const dto: CreateQuoteDto = { ...req.body, providerId };

            const result = await this.createQuoteUseCase.execute(dto);
            ResponseHandler.success(res, HttpStatus.CREATED, "Quote created successfully", result);
        } catch (error) {
            next(error);
        }
    }

    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.getQuoteUseCase.execute({ id: req.params.id as string });
            ResponseHandler.success(res, HttpStatus.OK, "Quote retrieved successfully", result);
        } catch (error) {
            next(error);
        }
    }

    edit = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = (req as any).user?.id || req.body.providerId;
            const dto: EditQuoteDto = { ...req.body, id: req.params.id as string, providerId };

            const result = await this.editQuoteUseCase.execute(dto);
            ResponseHandler.success(res, HttpStatus.OK, "Quote updated successfully", result);
        } catch (error) {
            next(error);
        }
    }

    getByProviderId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await this.getProviderQuotesUseCase.execute({ providerId: String(req.params.providerId), page, limit });
            ResponseHandler.success(res, HttpStatus.OK, "Quotes retrieved successfully", result);
        } catch (error) {
            next(error);
        }
    }

    getByRequestId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const result = await this.getQuotesByRequestIdUseCase.execute({ requestId: String(req.params.requestId) });
            ResponseHandler.success(res, HttpStatus.OK, "Quotes retrieved successfully", result);
        } catch (error) {
            next(error);
        }
    }
}
