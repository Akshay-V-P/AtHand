import { Request, Response, NextFunction } from "express";
import { CreateOrderUseCase } from "../../application/usecases/CreateOrderUseCase";
import { GetOrderUseCase } from "../../application/usecases/GetOrderUseCase";
import { SubmitDiagnosisUseCase } from "../../application/usecases/SubmitDiagnosisUseCase";
import { SubmitRepairEstimateUseCase } from "../../application/usecases/SubmitRepairEstimateUseCase";
import { CustomerEstimateDecisionUseCase } from "../../application/usecases/CustomerEstimateDecisionUseCase";
import { CompleteRepairUseCase } from "../../application/usecases/CompleteRepairUseCase";
import { ProcessOrderPaymentUseCase } from "../../application/usecases/ProcessOrderPaymentUseCase";
import { SubmitOrderReviewUseCase } from "../../application/usecases/SubmitOrderReviewUseCase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { AppError } from "../../../../shared/errors/AppError";

export class OrderController {
    constructor(
        private createOrderUseCase: CreateOrderUseCase,
        private getOrderUseCase: GetOrderUseCase,
        private submitDiagnosisUseCase: SubmitDiagnosisUseCase,
        private submitRepairEstimateUseCase: SubmitRepairEstimateUseCase,
        private customerEstimateDecisionUseCase: CustomerEstimateDecisionUseCase,
        private completeRepairUseCase: CompleteRepairUseCase,
        private processOrderPaymentUseCase: ProcessOrderPaymentUseCase,
        private submitOrderReviewUseCase: SubmitOrderReviewUseCase
    ) { }

    acceptQuote = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const customerId = req.user?.id;
            const { quoteId, appointmentDate, timeSlot, accessInstructions } = req.body;

            if (!customerId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);
            if (!quoteId) throw new AppError("Quote ID is required", HttpStatus.BAD_REQUEST);

            const order = await this.createOrderUseCase.execute({
                customerId,
                quoteId,
                appointmentDate: appointmentDate ? new Date(appointmentDate) : undefined,
                timeSlot,
                accessInstructions
            });

            ResponseHandler.success(res, HttpStatus.CREATED, "Quote accepted and order created successfully", order);
        } catch (error: any) {
            next(error);
        }
    };

    getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const order = await this.getOrderUseCase.getById(req.params.id as string, userId);
            ResponseHandler.success(res, HttpStatus.OK, "Order retrieved successfully", order);
        } catch (error: any) {
            next(error);
        }
    };

    getOrderByRequestId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const order = await this.getOrderUseCase.getByRequestId(req.params.requestId as string, userId);
            ResponseHandler.success(res, HttpStatus.OK, "Order retrieved successfully", order);
        } catch (error: any) {
            next(error);
        }
    };

    getCustomerOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const customerId = req.user?.id;
            if (!customerId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;

            const result = await this.getOrderUseCase.getCustomerOrders(customerId, page, limit);
            ResponseHandler.success(res, HttpStatus.OK, "Customer orders retrieved successfully", result);
        } catch (error: any) {
            next(error);
        }
    };

    getProviderOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerId = (req.query.providerId as string) || req.user?.id;
            if (!providerId) throw new AppError("Provider identifier required", HttpStatus.BAD_REQUEST);

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 20;
            const status = req.query.status as string;

            const result = await this.getOrderUseCase.getProviderOrders(providerId, page, limit, status);
            ResponseHandler.success(res, HttpStatus.OK, "Provider orders retrieved successfully", result);
        } catch (error: any) {
            next(error);
        }
    };

    submitDiagnosis = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerUserId = req.user?.id;
            if (!providerUserId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { summary, identifiedIssues } = req.body;
            if (!summary) throw new AppError("Diagnosis summary is required", HttpStatus.BAD_REQUEST);

            const order = await this.submitDiagnosisUseCase.execute({
                orderId: req.params.id as string,
                providerUserId,
                summary,
                identifiedIssues: identifiedIssues || []
            });

            ResponseHandler.success(res, HttpStatus.OK, "Diagnosis recorded successfully", order);
        } catch (error: any) {
            next(error);
        }
    };

    submitRepairEstimate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerUserId = req.user?.id;
            if (!providerUserId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { items, laborCost, partsCost, otherCharges, totalAmount, estimatedRepairTime, warranty, notes, updatedIssues } = req.body;

            if (!items || !Array.isArray(items) || items.length === 0) {
                throw new AppError("Itemized estimate items are required", HttpStatus.BAD_REQUEST);
            }
            if (totalAmount === undefined || totalAmount === null) {
                throw new AppError("Total amount is required", HttpStatus.BAD_REQUEST);
            }

            const order = await this.submitRepairEstimateUseCase.execute({
                orderId: req.params.id as string,
                providerUserId,
                items,
                laborCost: Number(laborCost) || 0,
                partsCost: Number(partsCost) || 0,
                otherCharges: Number(otherCharges) || 0,
                totalAmount: Number(totalAmount),
                estimatedRepairTime,
                warranty,
                notes,
                updatedIssues
            });

            ResponseHandler.success(res, HttpStatus.OK, "Repair estimate submitted successfully", order);
        } catch (error: any) {
            next(error);
        }
    };

    estimateDecision = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const customerId = req.user?.id;
            if (!customerId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { action, reason } = req.body;
            if (action !== 'APPROVE' && action !== 'DECLINE') {
                throw new AppError("Action must be either APPROVE or DECLINE", HttpStatus.BAD_REQUEST);
            }

            const order = await this.customerEstimateDecisionUseCase.execute({
                orderId: req.params.id as string,
                customerId,
                action,
                rejectionReason: reason
            });

            const message = action === 'APPROVE' ? "Repair estimate approved" : "Repair estimate declined";
            ResponseHandler.success(res, HttpStatus.OK, message, order);
        } catch (error: any) {
            next(error);
        }
    };

    completeRepair = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const providerUserId = req.user?.id;
            if (!providerUserId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { notes, workProofPhotos } = req.body;

            const order = await this.completeRepairUseCase.execute({
                orderId: req.params.id as string,
                providerUserId,
                notes,
                workProofPhotos: workProofPhotos || []
            });

            ResponseHandler.success(res, HttpStatus.OK, "Repair marked as completed and awaiting payment", order);
        } catch (error: any) {
            next(error);
        }
    };

    processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const customerId = req.user?.id;
            if (!customerId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { paymentMethod } = req.body;

            const order = await this.processOrderPaymentUseCase.execute({
                orderId: req.params.id as string,
                customerId,
                paymentMethod: paymentMethod || 'ONLINE'
            });

            ResponseHandler.success(res, HttpStatus.OK, "Payment processed successfully", order);
        } catch (error: any) {
            next(error);
        }
    };

    submitReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const customerId = req.user?.id;
            if (!customerId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { rating, comment } = req.body;
            if (!rating) throw new AppError("Rating is required", HttpStatus.BAD_REQUEST);

            const order = await this.submitOrderReviewUseCase.execute({
                orderId: req.params.id as string,
                customerId,
                rating: Number(rating),
                comment
            });

            ResponseHandler.success(res, HttpStatus.OK, "Review submitted successfully", order);
        } catch (error: any) {
            next(error);
        }
    };
}
