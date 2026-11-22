import { test, describe } from "node:test";
import assert from "node:assert";
import crypto from "crypto";
import { PaymentPurpose } from "./domain/enums/PaymentPurpose";
import { PaymentStatus } from "./domain/enums/PaymentStatus";
import { Payment } from "./domain/entities/Payment";
import { WebhookEvent } from "./domain/entities/WebhookEvent";
import { IPaymentRepository } from "./domain/interfaces/IPaymentRepository";
import { IWebhookEventRepository } from "./domain/interfaces/IWebhookEventRepository";
import {
    IRazorpayGateway,
    RazorpayOrderResult,
    RazorpayPaymentDetails,
    RazorpayRefundResult,
} from "./domain/interfaces/IRazorpayGateway";
import { InitiatePaymentUseCase } from "./application/usecases/InitiatePaymentUseCase";
import { VerifyPaymentUseCase } from "./application/usecases/VerifyPaymentUseCase";
import { ProcessWebhookUseCase } from "./application/usecases/ProcessWebhookUseCase";
import { ProcessRefundUseCase } from "./application/usecases/ProcessRefundUseCase";
import { ReportPaymentFailureUseCase } from "./application/usecases/ReportPaymentFailureUseCase";
import { OrderStatus } from "../order/domain/enums/OrderStatus";
import { ServiceMode } from "../../shared/enums/ServiceMode";
import { WorkStage } from "../order/domain/entities/OrderEntity";

// Mock Repositories & Gateway for isolated test execution
class InMemoryPaymentRepository implements IPaymentRepository {
    private items: Map<string, Payment> = new Map();
    private idCounter = 1;

    async create(payment: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
        const id = `pay_mock_${this.idCounter++}`;
        const record: Payment = {
            ...payment,
            id,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.items.set(id, record);
        return record;
    }

    async findById(id: string): Promise<Payment | null> {
        return this.items.get(id) || null;
    }

    async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
        for (const p of this.items.values()) {
            if (p.razorpayOrderId === orderId) return p;
        }
        return null;
    }

    async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
        for (const p of this.items.values()) {
            if (p.razorpayPaymentId === paymentId) return p;
        }
        return null;
    }

    async findByReferenceId(referenceId: string): Promise<Payment[]> {
        return Array.from(this.items.values()).filter(p => p.referenceId === referenceId);
    }

    async findByUserId(userId: string): Promise<Payment[]> {
        return Array.from(this.items.values()).filter(p => p.userId === userId);
    }

    async update(id: string, update: Partial<Payment>): Promise<Payment | null> {
        const existing = this.items.get(id);
        if (!existing) return null;
        const updated: Payment = {
            ...existing,
            ...update,
            updatedAt: new Date(),
        };
        this.items.set(id, updated);
        return updated;
    }
}

class InMemoryWebhookEventRepository implements IWebhookEventRepository {
    private events: Map<string, WebhookEvent> = new Map();

    async create(event: Omit<WebhookEvent, "id">): Promise<WebhookEvent> {
        const record: WebhookEvent = { ...event, id: `evt_${Date.now()}` };
        this.events.set(event.eventId, record);
        return record;
    }

    async findByEventId(eventId: string): Promise<WebhookEvent | null> {
        return this.events.get(eventId) || null;
    }
}

class MockRazorpayGateway implements IRazorpayGateway {
    public secret: string = "test_key_secret_12345";
    public webhookSecret: string = "test_webhook_secret_67890";
    public simulatedPaymentDetails: Partial<RazorpayPaymentDetails> = {};
    public ordersCreated: any[] = [];
    public refundsCreated: any[] = [];

    async createOrder(
        amountInPaise: number,
        currency: string,
        receipt: string,
        notes?: Record<string, string>
    ): Promise<RazorpayOrderResult> {
        const id = `order_mock_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
        const r: RazorpayOrderResult = {
            id,
            amount: amountInPaise,
            currency,
            receipt,
            status: "created",
        };
        this.ordersCreated.push(r);
        return r;
    }

    verifyPaymentSignature(razorpayOrderId: string, razorpayPaymentId: string, signature: string): boolean {
        const expected = crypto
            .createHmac("sha256", this.secret)
            .update(`${razorpayOrderId}|${razorpayPaymentId}`)
            .digest("hex");
        const a = Buffer.from(signature, "utf8");
        const b = Buffer.from(expected, "utf8");
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    }

    verifyWebhookSignature(rawBody: string | Buffer, signature: string, customSecret?: string): boolean {
        const secret = customSecret || this.webhookSecret;
        const buf = typeof rawBody === "string" ? Buffer.from(rawBody, "utf8") : rawBody;
        const expected = crypto
            .createHmac("sha256", secret)
            .update(buf)
            .digest("hex");
        const a = Buffer.from(signature, "utf8");
        const b = Buffer.from(expected, "utf8");
        if (a.length !== b.length) return false;
        return crypto.timingSafeEqual(a, b);
    }

    async fetchPayment(razorpayPaymentId: string): Promise<RazorpayPaymentDetails> {
        return {
            id: razorpayPaymentId,
            order_id: this.simulatedPaymentDetails.order_id || "order_default",
            amount: this.simulatedPaymentDetails.amount ?? 250000,
            currency: this.simulatedPaymentDetails.currency || "INR",
            status: this.simulatedPaymentDetails.status || "captured",
            method: this.simulatedPaymentDetails.method || "card",
            captured: this.simulatedPaymentDetails.captured ?? true,
            email: "test@example.com",
            contact: "9999999999",
            ...this.simulatedPaymentDetails,
        };
    }

    async createRefund(razorpayPaymentId: string, amountInPaise?: number, notes?: Record<string, string>): Promise<RazorpayRefundResult> {
        const refund: RazorpayRefundResult = {
            id: `rfnd_${Date.now()}`,
            payment_id: razorpayPaymentId,
            amount: amountInPaise || 1000,
            status: "processed",
            currency: "INR",
        };
        this.refundsCreated.push(refund);
        return refund;
    }

    generateValidSignature(orderId: string, paymentId: string): string {
        return crypto
            .createHmac("sha256", this.secret)
            .update(`${orderId}|${paymentId}`)
            .digest("hex");
    }

    generateValidWebhookSignature(rawBody: string): string {
        return crypto
            .createHmac("sha256", this.webhookSecret)
            .update(rawBody)
            .digest("hex");
    }
}

// Helpers for mock orders and usecases
const createMockOrder = (overrides?: any) => ({
    id: "order_test_123",
    orderNumber: "REP-4001",
    requestId: "req_test_123",
    quoteId: "quote_test_123",
    providerId: "prov_user_456",
    customerId: "cust_user_789",
    serviceMode: ServiceMode.ONSITE,
    initialQuoteAmount: 2500,
    finalAmount: 2500,
    isAmountRevised: false,
    status: OrderStatus.WAITING_FOR_PAYMENT,
    workStage: WorkStage.TESTING,
    ...overrides,
});

describe("Payment Module Test Suite", () => {
    test("1. Successful payment initiation with trusted amount calculation", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderRepo = {
            findById: async () => createMockOrder({ finalAmount: 3200 }),
        } as any;
        const walletRepo = {} as any;

        const usecase = new InitiatePaymentUseCase(paymentRepo, gateway, orderRepo, walletRepo);

        const result = await usecase.execute("cust_user_789", {
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
        });

        assert.ok(result.paymentId);
        assert.ok(result.razorpayOrderId.startsWith("order_mock_"));
        assert.strictEqual(result.amount, 3200);
        assert.strictEqual(result.amountInPaise, 320000);
        assert.strictEqual(result.currency, "INR");

        const storedPayment = await paymentRepo.findById(result.paymentId);
        assert.ok(storedPayment);
        assert.strictEqual(storedPayment?.status, PaymentStatus.PENDING);
        assert.strictEqual(storedPayment?.razorpayOrderId, result.razorpayOrderId);
    });

    test("2. Rejection for non-existent order ID", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderRepo = {
            findById: async () => null,
        } as any;
        const walletRepo = {} as any;

        const usecase = new InitiatePaymentUseCase(paymentRepo, gateway, orderRepo, walletRepo);

        await assert.rejects(
            async () => {
                await usecase.execute("cust_user_789", {
                    purpose: PaymentPurpose.ORDER_PAYMENT,
                    referenceId: "invalid_order_id",
                });
            },
            { message: "Order not found" }
        );
    });

    test("3. Rejection for unauthorized payment initiation (customer mismatch)", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderRepo = {
            findById: async () => createMockOrder({ customerId: "cust_user_789" }),
        } as any;
        const walletRepo = {} as any;

        const usecase = new InitiatePaymentUseCase(paymentRepo, gateway, orderRepo, walletRepo);

        await assert.rejects(
            async () => {
                await usecase.execute("attacker_user_999", {
                    purpose: PaymentPurpose.ORDER_PAYMENT,
                    referenceId: "order_test_123",
                });
            },
            { message: "Unauthorized: You do not own this order" }
        );
    });

    test("4. Payment signature verification with constant-time HMAC SHA256", async () => {
        const gateway = new MockRazorpayGateway();
        const orderId = "order_abc123";
        const paymentId = "pay_xyz789";
        const validSig = gateway.generateValidSignature(orderId, paymentId);

        const isValid = gateway.verifyPaymentSignature(orderId, paymentId, validSig);
        assert.strictEqual(isValid, true);
    });

    test("5. Invalid payment signature rejection", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderPaymentMock = { execute: async () => ({}) } as any;
        const walletMock = { execute: async () => ({}) } as any;

        // Seed payment record
        const payment = await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: "order_test_rzp",
            status: PaymentStatus.PENDING,
        });

        const usecase = new VerifyPaymentUseCase(paymentRepo, gateway, orderPaymentMock, walletMock);

        await assert.rejects(
            async () => {
                await usecase.execute("cust_user_789", {
                    razorpayOrderId: "order_test_rzp",
                    razorpayPaymentId: "pay_test_123",
                    razorpaySignature: "invalid_tampered_signature",
                });
            },
            { message: "Invalid payment signature" }
        );

        const updated = await paymentRepo.findById(payment.id!);
        assert.strictEqual(updated?.status, PaymentStatus.FAILED);
    });

    test("6. Amount mismatch detection against Razorpay API", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderPaymentMock = { execute: async () => ({}) } as any;
        const walletMock = { execute: async () => ({}) } as any;

        const orderId = "order_mismatch_1";
        const paymentId = "pay_mismatch_1";
        const validSig = gateway.generateValidSignature(orderId, paymentId);

        // Expected amount is 2500 rupees (250000 paise)
        await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: orderId,
            status: PaymentStatus.PENDING,
        });

        // Gateway returns 150000 paise (different amount)
        gateway.simulatedPaymentDetails = {
            order_id: orderId,
            amount: 150000,
            currency: "INR",
            captured: true,
        };

        const usecase = new VerifyPaymentUseCase(paymentRepo, gateway, orderPaymentMock, walletMock);

        await assert.rejects(
            async () => {
                await usecase.execute("cust_user_789", {
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    razorpaySignature: validSig,
                });
            },
            { message: "Payment amount mismatch" }
        );
    });

    test("7. Currency mismatch detection against Razorpay API", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderPaymentMock = { execute: async () => ({}) } as any;
        const walletMock = { execute: async () => ({}) } as any;

        const orderId = "order_curr_1";
        const paymentId = "pay_curr_1";
        const validSig = gateway.generateValidSignature(orderId, paymentId);

        await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: orderId,
            status: PaymentStatus.PENDING,
        });

        // Gateway returns USD currency
        gateway.simulatedPaymentDetails = {
            order_id: orderId,
            amount: 250000,
            currency: "USD",
            captured: true,
        };

        const usecase = new VerifyPaymentUseCase(paymentRepo, gateway, orderPaymentMock, walletMock);

        await assert.rejects(
            async () => {
                await usecase.execute("cust_user_789", {
                    razorpayOrderId: orderId,
                    razorpayPaymentId: paymentId,
                    razorpaySignature: validSig,
                });
            },
            { message: "Payment currency mismatch" }
        );
    });

    test("8. Idempotency: duplicate verification request returns completed status without re-triggering order fulfillment", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        let fulfillmentCallCount = 0;
        const orderPaymentMock = {
            execute: async () => {
                fulfillmentCallCount++;
                return {};
            },
        } as any;
        const walletMock = { execute: async () => ({}) } as any;

        const orderId = "order_idempotent_1";
        const paymentId = "pay_idempotent_1";
        const validSig = gateway.generateValidSignature(orderId, paymentId);

        gateway.simulatedPaymentDetails = {
            order_id: orderId,
            amount: 250000,
            currency: "INR",
            captured: true,
        };

        await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: orderId,
            status: PaymentStatus.PENDING,
        });

        const usecase = new VerifyPaymentUseCase(paymentRepo, gateway, orderPaymentMock, walletMock);

        // First verification
        const first = await usecase.execute("cust_user_789", {
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: validSig,
        });
        assert.strictEqual(first.success, true);
        assert.strictEqual(fulfillmentCallCount, 1);

        // Duplicate verification request
        const second = await usecase.execute("cust_user_789", {
            razorpayOrderId: orderId,
            razorpayPaymentId: paymentId,
            razorpaySignature: validSig,
        });
        assert.strictEqual(second.success, true);
        assert.strictEqual(fulfillmentCallCount, 1); // Fulfillment was NOT called a second time
    });

    test("9. Webhook signature verification and payment.captured processing", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const eventRepo = new InMemoryWebhookEventRepository();
        const gateway = new MockRazorpayGateway();
        let orderFulfillmentTriggered = false;
        const orderPaymentMock = {
            execute: async () => {
                orderFulfillmentTriggered = true;
                return {};
            },
        } as any;
        const walletMock = { execute: async () => ({}) } as any;

        const rzpOrderId = "order_webhook_capture";
        await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: rzpOrderId,
            status: PaymentStatus.PENDING,
        });

        const rawPayload = JSON.stringify({
            event_id: "evt_test_1001",
            event: "payment.captured",
            payload: {
                payment: {
                    entity: {
                        id: "pay_captured_999",
                        order_id: rzpOrderId,
                        amount: 250000,
                        currency: "INR",
                        method: "upi",
                    },
                },
            },
        });

        const validSig = gateway.generateValidWebhookSignature(rawPayload);
        const usecase = new ProcessWebhookUseCase(
            paymentRepo,
            eventRepo,
            gateway,
            orderPaymentMock,
            walletMock
        );

        const res = await usecase.execute(rawPayload, validSig, JSON.parse(rawPayload));
        assert.strictEqual(res.received, true);
        assert.strictEqual(res.processed, true);
        assert.strictEqual(orderFulfillmentTriggered, true);

        // Verify stored event in DB
        const event = await eventRepo.findByEventId("evt_test_1001");
        assert.ok(event);

        // Verify payment updated to COMPLETED
        const payment = await paymentRepo.findByRazorpayOrderId(rzpOrderId);
        assert.strictEqual(payment?.status, PaymentStatus.COMPLETED);
    });

    test("10. Webhook duplicate event idempotency (same event ID discarded gracefully)", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const eventRepo = new InMemoryWebhookEventRepository();
        const gateway = new MockRazorpayGateway();
        let fulfillCount = 0;
        const orderPaymentMock = {
            execute: async () => {
                fulfillCount++;
                return {};
            },
        } as any;
        const walletMock = { execute: async () => ({}) } as any;

        const rzpOrderId = "order_webhook_dup";
        await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: rzpOrderId,
            status: PaymentStatus.PENDING,
        });

        const rawPayload = JSON.stringify({
            event_id: "evt_duplicate_2002",
            event: "order.paid",
            payload: {
                payment: {
                    entity: {
                        id: "pay_captured_888",
                        order_id: rzpOrderId,
                        amount: 250000,
                    },
                },
            },
        });

        const sig = gateway.generateValidWebhookSignature(rawPayload);
        const usecase = new ProcessWebhookUseCase(
            paymentRepo,
            eventRepo,
            gateway,
            orderPaymentMock,
            walletMock
        );

        // First execution
        const first = await usecase.execute(rawPayload, sig, JSON.parse(rawPayload));
        assert.strictEqual(first.processed, true);
        assert.strictEqual(fulfillCount, 1);

        // Duplicate webhook execution
        const second = await usecase.execute(rawPayload, sig, JSON.parse(rawPayload));
        assert.strictEqual(second.received, true);
        assert.strictEqual(second.processed, false);
        assert.strictEqual(fulfillCount, 1); // Fulfill count remains 1
    });

    test("11. Multiple payment attempts for the same order without overwriting previous records", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();
        const orderRepo = {
            findById: async () => createMockOrder({ finalAmount: 2000 }),
        } as any;
        const walletRepo = {} as any;

        const usecase = new InitiatePaymentUseCase(paymentRepo, gateway, orderRepo, walletRepo);

        // Customer attempts payment first time (e.g. cancelled in modal or failed)
        const attempt1 = await usecase.execute("cust_user_789", {
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
        });

        // Customer attempts payment second time
        const attempt2 = await usecase.execute("cust_user_789", {
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
        });

        assert.notStrictEqual(attempt1.paymentId, attempt2.paymentId);
        assert.notStrictEqual(attempt1.razorpayOrderId, attempt2.razorpayOrderId);

        // Verify both attempts exist in the database for the order
        const orderPayments = await paymentRepo.findByReferenceId("order_test_123");
        assert.strictEqual(orderPayments.length, 2);
    });

    test("12. Refund processing: validates refundable amount and prevents excessive refunds", async () => {
        const paymentRepo = new InMemoryPaymentRepository();
        const gateway = new MockRazorpayGateway();

        // Completed payment of ₹3000
        const payment = await paymentRepo.create({
            userId: "cust_user_789",
            amount: 3000,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayPaymentId: "pay_rzp_to_refund",
            status: PaymentStatus.COMPLETED,
        });

        const usecase = new ProcessRefundUseCase(paymentRepo, gateway);

        // Partial refund of ₹1000
        const partial = await usecase.execute("cust_user_789", payment.id!, { amount: 1000 });
        assert.strictEqual(partial.success, true);
        assert.strictEqual(partial.amount, 1000);
        assert.strictEqual(partial.status, PaymentStatus.PARTIALLY_REFUNDED);

        // Attempt excessive refund (₹2500 when only ₹2000 remains)
        await assert.rejects(
            async () => {
                await usecase.execute("cust_user_789", payment.id!, { amount: 2500 });
            },
            { message: "Requested refund (₹2500) exceeds remaining refundable amount (₹2000)" }
        );

        // Remaining refund of ₹2000 (completes full refund)
        const full = await usecase.execute("cust_user_789", payment.id!, { amount: 2000 });
        assert.strictEqual(full.success, true);
        assert.strictEqual(full.amount, 2000);
        assert.strictEqual(full.status, PaymentStatus.REFUNDED);
    });

    test("13. Report payment failure records failure reason and persists FAILED status", async () => {
        const paymentRepo = new InMemoryPaymentRepository();

        const payment = await paymentRepo.create({
            userId: "cust_user_789",
            amount: 2500,
            currency: "INR",
            purpose: PaymentPurpose.ORDER_PAYMENT,
            referenceId: "order_test_123",
            gateway: "RAZORPAY",
            razorpayOrderId: "order_rzp_failed_test",
            status: PaymentStatus.PENDING,
        });

        const usecase = new ReportPaymentFailureUseCase(paymentRepo);

        const updated = await usecase.execute("cust_user_789", {
            razorpayOrderId: "order_rzp_failed_test",
            reason: "Bank server declined transaction",
            code: "BAD_REQUEST_ERROR",
        });

        assert.strictEqual(updated?.status, PaymentStatus.FAILED);
        assert.strictEqual(updated?.failureReason, "Bank server declined transaction");

        // Verify retrieval matches
        const stored = await paymentRepo.findById(payment.id!);
        assert.strictEqual(stored?.status, PaymentStatus.FAILED);
        assert.strictEqual(stored?.failureReason, "Bank server declined transaction");
    });
});
