import crypto from "crypto";
import Razorpay from "razorpay";
import {
    IRazorpayGateway,
    RazorpayOrderResult,
    RazorpayPaymentDetails,
    RazorpayRefundResult,
} from "../../domain/interfaces/IRazorpayGateway";
import { AppError } from "../../../../shared/errors/AppError";
import { HttpStatus } from "../../../../shared/enums/HttpStatus";

export class RazorpayGateway implements IRazorpayGateway {
    private client: Razorpay;
    private keySecret: string;

    constructor(keyId?: string, keySecret?: string) {
        const id = keyId || process.env.RAZORPAY_KEY_ID || "";
        const secret = keySecret || process.env.RAZORPAY_KEY_SECRET || "";

        this.keySecret = secret;
        this.client = new Razorpay({
            key_id: id,
            key_secret: secret,
        });
    }

    async createOrder(
        amountInPaise: number,
        currency: string = "INR",
        receipt: string,
        notes?: Record<string, string>
    ): Promise<RazorpayOrderResult> {
        try {
            const order = await this.client.orders.create({
                amount: Math.round(amountInPaise),
                currency,
                receipt: receipt.slice(0, 40), // Razorpay limits receipt to 40 characters
                notes: notes || {},
            });

            return {
                id: order.id,
                amount: typeof order.amount === "number" ? order.amount : Number(order.amount),
                currency: order.currency,
                receipt: order.receipt,
                status: order.status,
            };
        } catch (error: any) {
            console.error("Razorpay order creation error:", error);
            throw new AppError(
                error.error?.description || error.message || "Failed to create Razorpay order",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    verifyPaymentSignature(
        razorpayOrderId: string,
        razorpayPaymentId: string,
        signature: string
    ): boolean {
        if (!razorpayOrderId || !razorpayPaymentId || !signature || !this.keySecret) {
            return false;
        }

        try {
            const expectedSignature = crypto
                .createHmac("sha256", this.keySecret)
                .update(`${razorpayOrderId}|${razorpayPaymentId}`)
                .digest("hex");

            const signatureBuffer = Buffer.from(signature, "utf8");
            const expectedBuffer = Buffer.from(expectedSignature, "utf8");

            if (signatureBuffer.length !== expectedBuffer.length) {
                return false;
            }

            return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
        } catch (error) {
            console.error("Payment signature verification error:", error);
            return false;
        }
    }

    verifyWebhookSignature(
        rawBody: string | Buffer,
        signature: string,
        webhookSecret?: string
    ): boolean {
        const secret = webhookSecret || process.env.RAZORPAY_WEBHOOK_SECRET;
        if (!rawBody || !signature || !secret) {
            return false;
        }

        try {
            const payloadBuffer = typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : rawBody;
            const expectedSignature = crypto
                .createHmac("sha256", secret)
                .update(payloadBuffer)
                .digest("hex");

            const signatureBuffer = Buffer.from(signature, "utf8");
            const expectedBuffer = Buffer.from(expectedSignature, "utf8");

            if (signatureBuffer.length !== expectedBuffer.length) {
                return false;
            }

            return crypto.timingSafeEqual(signatureBuffer, expectedBuffer);
        } catch (error) {
            console.error("Webhook signature verification error:", error);
            return false;
        }
    }

    async fetchPayment(razorpayPaymentId: string): Promise<RazorpayPaymentDetails> {
        try {
            const payment: any = await this.client.payments.fetch(razorpayPaymentId);
            return {
                id: payment.id,
                order_id: payment.order_id,
                amount: typeof payment.amount === "number" ? payment.amount : Number(payment.amount),
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                captured: payment.captured === true || payment.status === "captured",
                email: payment.email,
                contact: payment.contact,
                error_code: payment.error_code,
                error_description: payment.error_description,
            };
        } catch (error: any) {
            console.error("Razorpay fetch payment error:", error);
            throw new AppError(
                error.error?.description || error.message || "Failed to fetch payment details from Razorpay",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }

    async createRefund(
        razorpayPaymentId: string,
        amountInPaise?: number,
        notes?: Record<string, string>
    ): Promise<RazorpayRefundResult> {
        try {
            const payload: any = {};
            if (amountInPaise !== undefined && amountInPaise > 0) {
                payload.amount = Math.round(amountInPaise);
            }
            if (notes) {
                payload.notes = notes;
            }

            const refund: any = await this.client.payments.refund(razorpayPaymentId, payload);
            return {
                id: refund.id,
                payment_id: refund.payment_id,
                amount: typeof refund.amount === "number" ? refund.amount : Number(refund.amount),
                status: refund.status,
                currency: refund.currency,
            };
        } catch (error: any) {
            console.error("Razorpay refund error:", error);
            throw new AppError(
                error.error?.description || error.message || "Failed to process refund with Razorpay",
                HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
