import { Request, Response, NextFunction } from "express";
import { InitiatePaymentUseCase } from "../../application/usecases/InitiatePaymentUseCase";
import { VerifyPaymentUseCase } from "../../application/usecases/VerifyPaymentUseCase";
import { ProcessWebhookUseCase } from "../../application/usecases/ProcessWebhookUseCase";
import { ProcessRefundUseCase } from "../../application/usecases/ProcessRefundUseCase";
import { GetPaymentByIdUseCase } from "../../application/usecases/GetPaymentByIdUseCase";
import { GetPaymentsByOrderUseCase } from "../../application/usecases/GetPaymentsByOrderUseCase";
import { ReportPaymentFailureUseCase } from "../../application/usecases/ReportPaymentFailureUseCase";
import { PayOrderWithWalletUseCase } from "../../application/usecases/PayOrderWithWalletUseCase";
import { GetFinancialSummaryUseCase } from "../../application/usecases/GetFinancialSummaryUseCase";
import { GetCommissionLedgerUseCase } from "../../application/usecases/GetCommissionLedgerUseCase";
import { ResponseHandler } from "../../../../shared/presentation/ResponseHandler";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";
import { AppError } from "../../../../shared/errors/AppError";
import { UserRole } from "../../../auth/domain/enum/UserRole";

export class PaymentController {
    constructor(
        private readonly initiatePaymentUseCase: InitiatePaymentUseCase,
        private readonly verifyPaymentUseCase: VerifyPaymentUseCase,
        private readonly processWebhookUseCase: ProcessWebhookUseCase,
        private readonly processRefundUseCase: ProcessRefundUseCase,
        private readonly getPaymentByIdUseCase: GetPaymentByIdUseCase,
        private readonly getPaymentsByOrderUseCase: GetPaymentsByOrderUseCase,
        private readonly reportPaymentFailureUseCase: ReportPaymentFailureUseCase,
        private readonly payOrderWithWalletUseCase: PayOrderWithWalletUseCase,
        private readonly getFinancialSummaryUseCase: GetFinancialSummaryUseCase,
        private readonly getCommissionLedgerUseCase: GetCommissionLedgerUseCase
    ) { }

    initiatePayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { purpose, referenceId, amount } = req.body;
            const result = await this.initiatePaymentUseCase.execute(userId, {
                purpose,
                referenceId,
                amount,
            });

            ResponseHandler.success(res, HttpStatus.CREATED, "Payment initiated successfully", result);
        } catch (error) {
            next(error);
        }
    };

    verifyPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;
            const result = await this.verifyPaymentUseCase.execute(userId, {
                razorpayOrderId,
                razorpayPaymentId,
                razorpaySignature,
            });

            ResponseHandler.success(res, HttpStatus.OK, "Payment verified successfully", result);
        } catch (error) {
            next(error);
        }
    };

    payWithWallet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { orderId } = req.body;
            const result = await this.payOrderWithWalletUseCase.execute({
                orderId,
                userId,
            });

            ResponseHandler.success(res, HttpStatus.OK, "Payment successful via wallet", result);
        } catch (error) {
            next(error);
        }
    };

    handleWebhook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const signature = req.headers["x-razorpay-signature"] as string;
            if (!signature) {
                ResponseHandler.error(res, HttpStatus.BAD_REQUEST, "Missing webhook signature");
                return;
            }

            const rawBody: Buffer | string = (req as any).rawBody || JSON.stringify(req.body);
            const result = await this.processWebhookUseCase.execute(rawBody, signature, req.body);
            res.status(HttpStatus.OK).json({ status: "ok", ...result });
        } catch (error: any) {
            console.error("Webhook processing error:", error.message);
            res.status(error.statusCode || HttpStatus.BAD_REQUEST).json({ error: error.message });
        }
    };

    refundPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const paymentId = req.params.id as string;
            const { amount, reason } = req.body;
            const userRole = req.user?.role as any;
            const isAdmin = Array.isArray(userRole) ? userRole.includes(UserRole.ADMIN) : userRole === UserRole.ADMIN;

            const result = await this.processRefundUseCase.execute(
                userId,
                paymentId,
                { amount, reason },
                isAdmin
            );

            ResponseHandler.success(res, HttpStatus.OK, "Refund processed successfully", result);
        } catch (error) {
            next(error);
        }
    };

    getPaymentById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const paymentId = req.params.id as string;
            const userRole = req.user?.role as any;
            const isAdmin = Array.isArray(userRole) ? userRole.includes(UserRole.ADMIN) : userRole === UserRole.ADMIN;

            const payment = await this.getPaymentByIdUseCase.execute(userId, paymentId, isAdmin);
            ResponseHandler.success(res, HttpStatus.OK, "Payment details retrieved", payment);
        } catch (error) {
            next(error);
        }
    };

    getPaymentsByOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const orderId = req.params.orderId as string;
            const userRole = req.user?.role as any;
            const isAdmin = Array.isArray(userRole) ? userRole.includes(UserRole.ADMIN) : userRole === UserRole.ADMIN;

            const payments = await this.getPaymentsByOrderUseCase.execute(userId, orderId, isAdmin);
            ResponseHandler.success(res, HttpStatus.OK, "Order payment attempts retrieved", payments);
        } catch (error) {
            next(error);
        }
    };

    getFinancialSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userRole = req.user?.role as any;
            const isAdmin = Array.isArray(userRole) ? userRole.includes(UserRole.ADMIN) : userRole === UserRole.ADMIN;
            if (!isAdmin) {
                throw new AppError("Forbidden: Admin access required", HttpStatus.FORBIDDEN);
            }

            const { startDate, endDate } = req.query;
            const sDate = startDate ? new Date(startDate as string) : undefined;
            const eDate = endDate ? new Date(endDate as string) : undefined;

            const summary = await this.getFinancialSummaryUseCase.execute(sDate, eDate);
            ResponseHandler.success(res, HttpStatus.OK, "Platform financial summary retrieved", summary);
        } catch (error) {
            next(error);
        }
    };

    getCommissionLedger = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userRole = req.user?.role as any;
            const isAdmin = Array.isArray(userRole) ? userRole.includes(UserRole.ADMIN) : userRole === UserRole.ADMIN;
            if (!isAdmin) {
                throw new AppError("Forbidden: Admin access required", HttpStatus.FORBIDDEN);
            }

            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 10;
            const categoryId = req.query.categoryId as string | undefined;
            const providerId = req.query.providerId as string | undefined;
            const status = req.query.status as string | undefined;
            const search = req.query.search as string | undefined;
            const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
            const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

            const result = await this.getCommissionLedgerUseCase.execute({
                page,
                limit,
                categoryId,
                providerId,
                status,
                search,
                startDate,
                endDate,
            });

            ResponseHandler.success(res, HttpStatus.OK, "Commission ledger retrieved", result);
        } catch (error) {
            next(error);
        }
    };

    reportFailure = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userId = req.user?.id;
            if (!userId) throw new AppError("Unauthorized", HttpStatus.UNAUTHORIZED);

            const { razorpayOrderId, razorpayPaymentId, internalPaymentId, reason, code } = req.body;
            const updatedPayment = await this.reportPaymentFailureUseCase.execute(userId, {
                razorpayOrderId,
                razorpayPaymentId,
                internalPaymentId,
                reason,
                code,
            });

            ResponseHandler.success(res, HttpStatus.OK, "Payment failure recorded", updatedPayment);
        } catch (error) {
            next(error);
        }
    };
}
