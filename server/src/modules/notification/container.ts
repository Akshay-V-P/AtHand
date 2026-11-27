import { eventBus } from "../../shared/events";
import { SocketGateway } from "../../shared/infrastructure/services/realtime/SocketGateway";
import { authMiddleware } from "../auth/container";
import { WalletCreditedListener } from "./application/listeners/WalletCreditedListener";
import { CreateNotificationUseCase } from "./application/usecases/CreateNotificationUseCase";
import { DeleteNotificationUseCase } from "./application/usecases/DeleteNotificationUseCase";
import { GetNotificationsUseCase } from "./application/usecases/GetNotificationsUseCase";
import { GetNotificationUseCase } from "./application/usecases/GetNotificationUseCase";
import { MarkAllNotificationsAsReadUseCase } from "./application/usecases/MarkAllNotificationsAsReadUseCase";
import { MarkNotificationAsReadUseCase } from "./application/usecases/MarkNotificationAsReadUseCase";
import { NotificationRepositoryImpl } from "./infrastructure/database/repositories/NotificationRepositoryImpl";
import { SocketNotificationPublisher } from "./infrastructure/publishers/SocketNotificationPublisher";
import { NotificationController } from "./presentation/controllers/NotificationController";
import { createNotificationRoutes } from "./presentation/routes/NotificationRoutes";

const notificationRepository = new NotificationRepositoryImpl();

const createNotificationUseCase = new CreateNotificationUseCase(notificationRepository);
const getNotificationsUseCase = new GetNotificationsUseCase(notificationRepository);
const getNotificationUseCase = new GetNotificationUseCase(notificationRepository);
const markNotificationAsReadUseCase = new MarkNotificationAsReadUseCase(notificationRepository);
const markAllNotificationsAsReadUseCase = new MarkAllNotificationsAsReadUseCase(notificationRepository);
const deleteNotificationUseCase = new DeleteNotificationUseCase(notificationRepository);

const notificationController = new NotificationController(
  getNotificationsUseCase,
  getNotificationUseCase,
  markNotificationAsReadUseCase,
  markAllNotificationsAsReadUseCase,
  deleteNotificationUseCase
);

export function initalizeNotificationModule(socketGateway: SocketGateway) {
  const notificationPublisher = new SocketNotificationPublisher(socketGateway);

  const walletCreditedListener = new WalletCreditedListener(
    eventBus,
    notificationPublisher,
    createNotificationUseCase
  );

  walletCreditedListener.register();

  return {
    notificationPublisher,
    walletCreditedListener,
  };
}

export { notificationRepository, createNotificationUseCase };
export const notificationRoutes = createNotificationRoutes(notificationController, authMiddleware);
