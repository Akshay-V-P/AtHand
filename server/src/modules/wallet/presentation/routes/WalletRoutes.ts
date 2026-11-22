import { Router } from "express";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/AuthMiddleware";
import { WalletControllersType } from "../../container";

export const createWalletRoutes = (controllers: WalletControllersType, authMiddleware: AuthMiddleware): Router => {
    const router = Router();

    router.use(authMiddleware.execute);

    // Specific customer & provider wallet routes (defined before :id to prevent route shadowing)
    router.get('/customer/transactions', controllers.getCustomerWalletTransactionsController.handler);
    router.get('/customer', controllers.getCustomerWalletController.handler);

    router.get('/provider/transactions', controllers.getProviderWalletTransactionsController.handler);
    router.get('/provider', controllers.getProviderWalletController.handler);

    // Generic transaction routes
    router.post('/transactions', controllers.createWalletTransactionController.handler);
    router.post('/:id/transactions', controllers.createWalletTransactionController.handler);
    router.get('/transactions', controllers.getWalletTransactionsController.handler);
    router.get('/transactions/:id', controllers.getWalletTransactionByIdController.handler);
    router.get('/:id/transactions', controllers.getWalletTransactionsController.handler);

    // Generic wallet CRUD and status routes
    router.post('/', controllers.createWalletController.handler);
    router.get('/:id', controllers.getWalletController.handler);
    router.patch('/:id/balance', controllers.updateWalletBalanceController.handler);
    router.patch('/:id/block', controllers.blockWalletController.handler);
    router.patch('/:id/unblock', controllers.unblockWalletController.handler);

    return router;
};

