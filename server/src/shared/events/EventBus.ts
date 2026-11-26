import { EventEmitter } from "node:stream";
import { IEventBus } from "./IEventBus";

export class EventBus implements IEventBus{
    private readonly emitter = new EventEmitter()

    publish<T>(event: string, payload: T): void{
        this.emitter.emit(event, payload)
    }

    subscribe<T>(event: string, listner: (payload: T) => void): void{
        this.emitter.on(event, listner)
    }

    unsubscribe<T>(event: string, listner: (payload: T) => void): void{
        this.emitter.off(event, listner)
    }
}