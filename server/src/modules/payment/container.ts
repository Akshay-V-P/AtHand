import { PaymentRepository } from "./infrastructure/database/repositories/PaymentRepository";
import { WebhookEventRepository } from "./infrastructure/database/repositories/WebhookEventRepository";
import { CommissionLedgerRepository } from "./infrastructure/database/repositories/CommissionLedgerRepository";
import { RazorpayGateway } from "./infrastructure/gateway/RazorpayGateway";

import { InitiatePaymentUseCase } from "./application/usecases/InitiatePaymentUseCase";
import { VerifyPaymentUseCase } from "./application/usecases/VerifyPaymentUseCase";
import { ProcessWebhookUseCase } from "./application/usecases/ProcessWebhookUseCase";
import { ProcessRefundUseCase } from "./application/usecases/ProcessRefundUseCase";
import { GetPaymentByIdUseCase } from "./application/usecases/GetPaymentByIdUseCase";
import { GetPaymentsByOrderUseCase } from "./application/usecases/GetPaymentsByOrderUseCase";
import { ReportPaymentFailureUseCase } from "./application/usecases/ReportPaymentFailureUseCase";
import { DistributeOrderPaymentUseCase } from "./application/usecases/DistributeOrderPaymentUseCase";
import { PayOrderWithWalletUseCase } from "./application/usecases/PayOrderWithWalletUseCase";
import { GetFinancialSummaryUseCase } from "./application/usecases/GetFinancialSummaryUseCase";
import { GetCommissionLedgerUseCase } from "./application/usecases/GetCommissionLedgerUseCase";

import { PaymentController } from "./presentation/controllers/PaymentController";
import { createPaymentRoutes } from "./presentation/payment.routes";

import { authMiddleware } from "../auth/container";
import { orderRepository, processOrderPaymentUseCase } from "../order/container";
import {
    walletRepository,
    walletTransactionRepository,
    createWalletTransactionUseCase,
} from "../wallet/container";
import { serviceRequestRepository } from "../service-request/container";
import { categoryRepository } from "../category/container";
import { providerRepository } from "../provider/container";
import { quoteRepository } from "../quote/container";

// Repositories & Gateway
const paymentRepository = new PaymentRepository();
const webhookEventRepository = new WebhookEventRepository();
const commissionLedgerRepository = new CommissionLedgerRepository();
const razorpayGateway = new RazorpayGateway();

// Distribution Use Case
const distributeOrderPaymentUseCase = new DistributeOrderPaymentUseCase(
    commissionLedgerRepository,
    orderRepository,
    walletRepository,
    walletTransactionRepository,
    serviceRequestRepository,
    categoryRepository,
    providerRepository,
    quoteRepository,
    paymentRepository
);

// Payment Use Cases
const initiatePaymentUseCase = new InitiatePaymentUseCase(
    paymentRepository,
    razorpayGateway,
    orderRepository,
    walletRepository,
    categoryRepository,
    serviceRequestRepository,
    providerRepository,
    quoteRepository
);

const verifyPaymentUseCase = new VerifyPaymentUseCase(
    paymentRepository,
    razorpayGateway,
    processOrderPaymentUseCase,
    createWalletTransactionUseCase,
    distributeOrderPaymentUseCase
);

const processWebhookUseCase = new ProcessWebhookUseCase(
    paymentRepository,
    webhookEventRepository,
    razorpayGateway,
    processOrderPaymentUseCase,
    createWalletTransactionUseCase,
    distributeOrderPaymentUseCase
);

const processRefundUseCase = new ProcessRefundUseCase(
    paymentRepository,
    razorpayGateway,
    walletRepository,
    walletTransactionRepository,
    commissionLedgerRepository
);

const payOrderWithWalletUseCase = new PayOrderWithWalletUseCase(
    orderRepository,
    walletRepository,
    walletTransactionRepository,
    paymentRepository,
    distributeOrderPaymentUseCase,
    processOrderPaymentUseCase,
    categoryRepository,
    serviceRequestRepository,
    providerRepository,
    quoteRepository
);

const getFinancialSummaryUseCase = new GetFinancialSummaryUseCase(commissionLedgerRepository);
const getCommissionLedgerUseCase = new GetCommissionLedgerUseCase(commissionLedgerRepository);

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
    reportPaymentFailureUseCase,
    payOrderWithWalletUseCase,
    getFinancialSummaryUseCase,
    getCommissionLedgerUseCase
);

// Routes
export const paymentRoutes = createPaymentRoutes(paymentController, authMiddleware);
export {
    paymentRepository,
    commissionLedgerRepository,
    razorpayGateway,
    distributeOrderPaymentUseCase,
    initiatePaymentUseCase,
    verifyPaymentUseCase,
    processWebhookUseCase,
    processRefundUseCase,
    payOrderWithWalletUseCase,
    getFinancialSummaryUseCase,
    getCommissionLedgerUseCase,
};
