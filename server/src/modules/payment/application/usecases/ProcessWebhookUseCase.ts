import { IPaymentRepository } from "../../domain/interfaces/IPaymentRepository";
import { IWebhookEventRepository } from "../../domain/interfaces/IWebhookEventRepository";
import { IRazorpayGateway } from "../../domain/interfaces/IRazorpayGateway";
import { PaymentStatus } from "../../domain/enums/PaymentStatus";
import { PaymentPurpose } from "../../domain/enums/PaymentPurpose";
import { ProcessOrderPaymentUseCase } from "../../../order/application/usecases/ProcessOrderPaymentUseCase";
import { CreateWalletTransactionUseCase } from "../../../wallet/application/usecases/CreateWalletTransactionUseCase";
import {
    WalletTransactionCategory,
    WalletTransactionReferenceType,
    WalletTransactionType,
} from "../../../wallet/domain/entities/WalletTransaction";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";

export class ProcessWebhookUseCase {
    constructor(
        private readonly paymentRepository: IPaymentRepository,
        private readonly webhookEventRepository: IWebhookEventRepository,
        private readonly razorpayGateway: IRazorpayGateway,
        private readonly processOrderPaymentUseCase: ProcessOrderPaymentUseCase,
        private readonly createWalletTransactionUseCase: CreateWalletTransactionUseCase
    ) { }

    async execute(rawBody: string | Buffer, signature: string, payload: any): Promise<{ received: boolean; processed: boolean; reason?: string }> {
        
        const isSignatureValid = this.razorpayGateway.verifyWebhookSignature(rawBody, signature);
        if (!isSignatureValid) {
            console.error("Webhook signature mismatch for event");
            throw new BadRequestError("Invalid webhook signature");
        }

        const eventId = payload?.event_id || payload?.id;
        const eventType = payload?.event;

        if (!eventId || !eventType) {
            throw new BadRequestError("Invalid webhook payload format");
        }

        
        const existingEvent = await this.webhookEventRepository.findByEventId(eventId);
        if (existingEvent) {
            return {
                received: true,
                processed: false,
                reason: "Webhook event already processed (idempotent)",
            };
        }

        
        switch (eventType) {
            case "payment.captured":
            case "order.paid": {
                await this.handlePaymentSuccess(payload);
                break;
            }
            case "payment.failed": {
                await this.handlePaymentFailure(payload);
                break;
            }
            default: {
                
                console.log(`Unhandled Razorpay webhook event received: ${eventType}`);
                break;
            }
        }

        
        await this.webhookEventRepository.create({
            eventId,
            eventType,
            payload,
            processedAt: new Date(),
        });

        return { received: true, processed: true };
    }

    private async handlePaymentSuccess(payload: any): Promise<void> {
        const paymentEntity = payload?.payload?.payment?.entity;
        const orderEntity = payload?.payload?.order?.entity;

        const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
        const razorpayPaymentId = paymentEntity?.id;

        if (!razorpayOrderId) return;

        const payment = await this.paymentRepository.findByRazorpayOrderId(razorpayOrderId);
        if (!payment || !payment.id) {
            console.warn(`Payment record not found for webhook order ID: ${razorpayOrderId}`);
            return;
        }

        
        if (payment.status === PaymentStatus.COMPLETED) {
            return;
        }

        
        const amountInPaise = paymentEntity?.amount || (orderEntity?.amount_paid || 0);
        const expectedPaise = Math.round(payment.amount * 100);
        if (amountInPaise && amountInPaise !== expectedPaise) {
            console.error(`Webhook amount mismatch for payment ${payment.id}`);
            return;
        }

        
        await this.paymentRepository.update(payment.id, {
            status: PaymentStatus.COMPLETED,
            razorpayPaymentId: razorpayPaymentId || payment.razorpayPaymentId,
            metadata: {
                ...(payment.metadata || {}),
                paymentMethod: paymentEntity?.method || "ONLINE",
                webhookCapturedAt: new Date(),
            },
        });

        
        try {
            if (payment.purpose === PaymentPurpose.ORDER_PAYMENT) {
                await this.processOrderPaymentUseCase.execute({
                    orderId: payment.referenceId,
                    customerId: payment.userId,
                    paymentMethod: `RAZORPAY_${paymentEntity?.method?.toUpperCase() || "ONLINE"}`,
                });
            } else if (payment.purpose === PaymentPurpose.WALLET_TOPUP) {
                await this.createWalletTransactionUseCase.execute({
                    userId: payment.userId,
                    walletId: payment.referenceId,
                    amount: payment.amount,
                    type: WalletTransactionType.CREDIT,
                    category: WalletTransactionCategory.PAYMENT,
                    referenceType: WalletTransactionReferenceType.PAYMENT,
                    referenceId: payment.id,
                    description: `Wallet top-up via Razorpay webhook (${razorpayPaymentId || razorpayOrderId})`,
                });
            }
        } catch (fulfillmentError) {
            console.error("Error executing fulfillment from webhook:", fulfillmentError);
            
        }
    }

    private async handlePaymentFailure(payload: any): Promise<void> {
        const paymentEntity = payload?.payload?.payment?.entity;
        const razorpayOrderId = paymentEntity?.order_id;
        if (!razorpayOrderId) return;

        const payment = await this.paymentRepository.findByRazorpayOrderId(razorpayOrderId);
        if (!payment || !payment.id) return;

        
        if (payment.status === PaymentStatus.COMPLETED) return;

        await this.paymentRepository.update(payment.id, {
            status: PaymentStatus.FAILED,
            razorpayPaymentId: paymentEntity?.id,
            failureReason: paymentEntity?.error_description || paymentEntity?.error_code || "Payment failed at gateway",
            metadata: {
                ...(payment.metadata || {}),
                errorCode: paymentEntity?.error_code,
                errorDescription: paymentEntity?.error_description,
                errorSource: paymentEntity?.error_source,
                errorStep: paymentEntity?.error_step,
                errorReason: paymentEntity?.error_reason,
            },
        });
    }
}
