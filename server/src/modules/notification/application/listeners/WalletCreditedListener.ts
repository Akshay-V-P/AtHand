import { WalletCreditedEvent } from "../../../../shared/events/EventPayloads";
import { EVENT_TYPES } from "../../../../shared/events/EventTypes";
import { IEventBus } from "../../../../shared/events/IEventBus";
import { UserRole } from "../../../auth/domain/enum/UserRole";
import { INotificationPublisher } from "../ports/INotificationPublisher";
import { CreateNotificationUseCase } from "../usecases/CreateNotificationUseCase";

export class WalletCreditedListener {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly notificationPublisher: INotificationPublisher,
    private readonly createNotificationUseCase: CreateNotificationUseCase
  ) {}

  register(): void {
    this.eventBus.subscribe<WalletCreditedEvent>(
      EVENT_TYPES.WALLET_CREDITED,
      this.handler
    );
  }

  private handler = async (event: WalletCreditedEvent): Promise<void> => {
    console.log("WALLET_CREDITED event received:", event);

    const notificationInput = {
      recipientId: event.userId,
      recipientRole: UserRole.USER,
      type: "WALLET_CREDITED",
      title: "Wallet credited",
      message: `₹${event.amount} added to your wallet.`,
      data: {
        transactionId: event.transactionId,
        amount: event.amount,
        balanceAfter: event.balanceAfter,
      },
      isRead: false,
    };

    let savedId: string | undefined;
    let createdAt = new Date().toISOString();

    try {
      const saved = await this.createNotificationUseCase.execute(notificationInput);
      savedId = saved.id;
      if (saved.createdAt) {
        createdAt = new Date(saved.createdAt).toISOString();
      }
    } catch (error) {
      console.error("Failed to persist wallet notification ", error);
    }

    try {
      this.notificationPublisher.publishToUser(
        event.userId,
        "notification:new",
        {
          ...(savedId ? { id: savedId } : {}),
          type: notificationInput.type,
          title: notificationInput.title,
          message: notificationInput.message,
          data: notificationInput.data,
          isRead: false,
          createdAt,
        }
      );
    } catch (error) {
      console.error("Failed to publish wallet notification ", error);
    }
  };
}
