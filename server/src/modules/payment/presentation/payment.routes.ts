import { Router } from "express";
import { PaymentController } from "./controllers/PaymentController";
import { AuthMiddleware } from "../../auth/presentation/middlewares/AuthMiddleware";

export const createPaymentRoutes = (
    controller: PaymentController,
    authMiddleware: AuthMiddleware
): Router => {
    const router = Router();

    // Webhook endpoint (public with Razorpay HMAC signature verification)
    router.post("/webhook", controller.handleWebhook);

    // Protected routes requiring user authentication
    router.post("/initiate", authMiddleware.execute, controller.initiatePayment);
    router.post("/verify", authMiddleware.execute, controller.verifyPayment);
    router.post("/failure", authMiddleware.execute, controller.reportFailure);
    router.get("/order/:orderId", authMiddleware.execute, controller.getPaymentsByOrder);
    router.get("/:id", authMiddleware.execute, controller.getPaymentById);
    router.post("/:id/refund", authMiddleware.execute, controller.refundPayment);

    return router;
};
