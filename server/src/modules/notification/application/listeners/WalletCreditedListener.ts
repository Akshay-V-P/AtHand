import { WalletCreditedEvent } from "../../../../shared/events/EventPayloads";
import { EVENT_TYPES } from "../../../../shared/events/EventTypes";
import { IEventBus } from "../../../../shared/events/IEventBus";
import { INotificationPublisher } from "../ports/INotificationPublisher";

export class WalletCreditedListener{
    constructor(
        private readonly eventBus: IEventBus,
        private readonly notificationPublisher:INotificationPublisher,
    ) { }
    
    register(): void{
        this.eventBus.subscribe<WalletCreditedEvent>(
            EVENT_TYPES.WALLET_CREDITED,
            this.handler
        )
    }

    private handler = (event: WalletCreditedEvent): void => {
        console.log("WALLET_CREDITED event received:", event);
        try {
            this.notificationPublisher.publishToUser(
                event.userId,
                "notification:new",
                {
                    type: "WALLET_CREDITED",
                    title: "Wallet credited",
                    message: `₹${event.amount} added to your wallet.`,
                    data: {
                        transactionId: event.transactionId,
                        amount: event.amount,
                        balanceAfter:event.balanceAfter
                    },
                    createdAt: new Date().toISOString(),
                }
            )
        } catch (error) {
            console.error("Failed to publish wallet notification ", error)
        }
    }
}