import { OrderRepository } from "./infrastructure/database/repositories/OrderRepository";
import { CreateOrderUseCase } from "./application/usecases/CreateOrderUseCase";
import { GetOrderUseCase } from "./application/usecases/GetOrderUseCase";
import { SubmitDiagnosisUseCase } from "./application/usecases/SubmitDiagnosisUseCase";
import { SubmitRepairEstimateUseCase } from "./application/usecases/SubmitRepairEstimateUseCase";
import { CustomerEstimateDecisionUseCase } from "./application/usecases/CustomerEstimateDecisionUseCase";
import { CompleteRepairUseCase } from "./application/usecases/CompleteRepairUseCase";
import { ProcessOrderPaymentUseCase } from "./application/usecases/ProcessOrderPaymentUseCase";
import { SubmitOrderReviewUseCase } from "./application/usecases/SubmitOrderReviewUseCase";
import { OrderController } from "./presentation/controllers/OrderController";
import { createOrderRoutes } from "./presentation/order.routes";
import { authMiddleware } from "../auth/container";
import { QuoteRepository } from "../quote/infrastructure/database/repositories/QuoteRepository";
import { ServiceRequestRepository } from "../service-request/infrastructure/database/repositories/ServiceRequestRepository";

const orderRepository = new OrderRepository();
const quoteRepository = new QuoteRepository();
const serviceRequestRepository = new ServiceRequestRepository();

const createOrderUseCase = new CreateOrderUseCase(orderRepository, quoteRepository, serviceRequestRepository);
const getOrderUseCase = new GetOrderUseCase(orderRepository);
const submitDiagnosisUseCase = new SubmitDiagnosisUseCase(orderRepository);
const submitRepairEstimateUseCase = new SubmitRepairEstimateUseCase(orderRepository);
const customerEstimateDecisionUseCase = new CustomerEstimateDecisionUseCase(orderRepository, serviceRequestRepository);
const completeRepairUseCase = new CompleteRepairUseCase(orderRepository);
const processOrderPaymentUseCase = new ProcessOrderPaymentUseCase(orderRepository, serviceRequestRepository);
const submitOrderReviewUseCase = new SubmitOrderReviewUseCase(orderRepository);

const orderController = new OrderController(
    createOrderUseCase,
    getOrderUseCase,
    submitDiagnosisUseCase,
    submitRepairEstimateUseCase,
    customerEstimateDecisionUseCase,
    completeRepairUseCase,
    processOrderPaymentUseCase,
    submitOrderReviewUseCase
);

export const orderRoutes = createOrderRoutes(orderController, authMiddleware);
