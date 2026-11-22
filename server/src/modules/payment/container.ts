import { PaymentRepository } from "./infrastructure/database/repositories/PaymentRepository";
import { WebhookEventRepository } from "./infrastructure/database/repositories/WebhookEventRepository";
import { RazorpayGateway } from "./infrastructure/gateway/RazorpayGateway";
import { InitiatePaymentUseCase } from "./application/usecases/InitiatePaymentUseCase";
import { VerifyPaymentUseCase } from "./application/usecases/VerifyPaymentUseCase";
import { ProcessWebhookUseCase } from "./application/usecases/ProcessWebhookUseCase";
import { ProcessRefundUseCase } from "./application/usecases/ProcessRefundUseCase";
import { GetPaymentByIdUseCase } from "./application/usecases/GetPaymentByIdUseCase";
import { GetPaymentsByOrderUseCase } from "./application/usecases/GetPaymentsByOrderUseCase";
import { ReportPaymentFailureUseCase } from "./application/usecases/ReportPaymentFailureUseCase";
import { PaymentController } from "./presentation/controllers/PaymentController";
import { createPaymentRoutes } from "./presentation/payment.routes";
import { authMiddleware } from "../auth/container";
import { orderRepository, processOrderPaymentUseCase } from "../order/container";
import { walletRepository, createWalletTransactionUseCase } from "../wallet/container";

// Repositories & Gateway
const paymentRepository = new PaymentRepository();
const webhookEventRepository = new WebhookEventRepository();
const razorpayGateway = new RazorpayGateway();

// Use Cases
const initiatePaymentUseCase = new InitiatePaymentUseCase(
    paymentRepository,
    razorpayGateway,
    orderRepository,
    walletRepository
);

const verifyPaymentUseCase = new VerifyPaymentUseCase(
    paymentRepository,
    razorpayGateway,
    processOrderPaymentUseCase,
    createWalletTransactionUseCase
);

const processWebhookUseCase = new ProcessWebhookUseCase(
    paymentRepository,
    webhookEventRepository,
    razorpayGateway,
    processOrderPaymentUseCase,
    createWalletTransactionUseCase
);

const processRefundUseCase = new ProcessRefundUseCase(
    paymentRepository,
    razorpayGateway
);

const getPaymentByIdUseCase = new GetPaymentByIdUseCase(paymentRepository);
const getPaymentsByOrderUseCase = new GetPaymentsByOrderUseCase(paymentRepository, orderRepository);
const reportPaymentFailureUseCase = new ReportPaymentFailureUseCase(paymentRepository);

// Controller
const paymentController = new PaymentController(
    initiatePaymentUseCase,
    verifyPaymentUseCase,
    processWebhookUseCase,
    processRefundUseCase,
    getPaymentByIdUseCase,
    getPaymentsByOrderUseCase,
    reportPaymentFailureUseCase
);

// Routes
export const paymentRoutes = createPaymentRoutes(paymentController, authMiddleware);
export {
    paymentRepository,
    razorpayGateway,
    initiatePaymentUseCase,
    verifyPaymentUseCase,
    processWebhookUseCase,
    processRefundUseCase,
};
