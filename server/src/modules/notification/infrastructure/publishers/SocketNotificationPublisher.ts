import { SocketGateway } from "../../../../shared/infrastructure/services/realtime/SocketGateway";
import { INotificationPublisher } from "../../application/ports/INotificationPublisher";

export class SocketNotificationPublisher implements INotificationPublisher {
    constructor(
        private readonly socketGateway: SocketGateway
    ) {}

    publishToUser(
        userId: string,
        event: string,
        payload: unknown
    ): void {
        this.socketGateway.emitToUser(userId, event, payload);
    }
}