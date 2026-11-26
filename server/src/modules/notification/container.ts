import { eventBus } from "../../shared/events";
import { SocketGateway } from "../../shared/infrastructure/services/realtime/SocketGateway";
import { WalletCreditedListener } from "./application/listeners/WalletCreditedListener";
import { SocketNotificationPublisher } from "./infrastructure/publishers/SocketNotificationPublisher";

export function initalizeNotificationModule(
    socketGateway:SocketGateway
) {
    const notificationPublisher = new SocketNotificationPublisher(socketGateway)

    const walletCreditedListener = new WalletCreditedListener(
        eventBus,
        notificationPublisher
    )

    walletCreditedListener.register()

    return {
        notificationPublisher,
        walletCreditedListener
    }
}