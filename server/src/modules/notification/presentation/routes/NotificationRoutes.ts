import { Router } from "express";
import { AuthMiddleware } from "../../../auth/presentation/middlewares/AuthMiddleware";
import { NotificationController } from "../controllers/NotificationController";

export const createNotificationRoutes = (
  controller: NotificationController,
  authMiddleware: AuthMiddleware
): Router => {
  const router = Router();

  router.use(authMiddleware.execute);

  router.get("/", controller.getAll);
  router.patch("/read-all", controller.markAllAsRead);
  router.get("/:id", controller.getById);
  router.patch("/:id/read", controller.markAsRead);
  router.delete("/:id", controller.delete);

  return router;
};
