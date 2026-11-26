export interface IEventBus {
    publish<T>(event: string, payload: T): void;

    subscribe<T>(
        event: string,
        listener: (payload: T) => void
    ): void;

    unsubscribe<T>(
        event: string,
        listener: (payload: T) => void
    ): void;
}