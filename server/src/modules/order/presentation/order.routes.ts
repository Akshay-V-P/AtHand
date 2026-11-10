import { Router } from "express";
import { OrderController } from "./controllers/OrderController";
import { AuthMiddleware } from "../../auth/presentation/middlewares/AuthMiddleware";

export const createOrderRoutes = (controller: OrderController, authMiddleware: AuthMiddleware): Router => {
    const router = Router();

    // All order operations require authentication
    router.use(authMiddleware.execute);

    // Initial offer acceptance and order creation
    router.post('/accept-quote', controller.acceptQuote);

    // Order queries
    router.get('/customer/orders', controller.getCustomerOrders);
    router.get('/provider/orders', controller.getProviderOrders);
    router.get('/by-request/:requestId', controller.getOrderByRequestId);
    router.get('/:id', controller.getOrderById);

    // Lifecycle transitions
    router.patch('/:id/diagnosis', controller.submitDiagnosis);
    router.patch('/:id/estimate', controller.submitRepairEstimate);
    router.patch('/:id/estimate-decision', controller.estimateDecision);
    router.patch('/:id/complete', controller.completeRepair);
    router.post('/:id/payment', controller.processPayment);
    router.post('/:id/review', controller.submitReview);

    return router;
};
