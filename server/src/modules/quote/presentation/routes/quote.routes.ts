import { Router } from "express";
import { QuoteController } from "../controllers/QuoteController";

export const createQuoteRoutes = (controller: QuoteController): Router => {
    const router = Router();

    router.post('/', controller.create);
    router.get('/provider/:providerId', controller.getByProviderId);
    router.get('/request/:requestId', controller.getByRequestId);
    router.get('/:id', controller.getById);
    router.put('/:id', controller.edit);

    return router;
};
