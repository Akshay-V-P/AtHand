export interface INotificationPublisher {
    publishToUser(
        userId: string,
        event: string,
        payload: unknown
    ): void;
}