import { IWebhookEventRepository } from "../../../domain/interfaces/IWebhookEventRepository";
import { WebhookEvent } from "../../../domain/entities/WebhookEvent";
import { WebhookEventModel } from "../models/WebhookEventModel";

export class WebhookEventRepository implements IWebhookEventRepository {
    async create(event: Omit<WebhookEvent, "id">): Promise<WebhookEvent> {
        const doc = new WebhookEventModel(event);
        const saved = await doc.save();
        return {
            id: saved._id.toString(),
            eventId: saved.eventId,
            eventType: saved.eventType,
            payload: saved.payload,
            processedAt: saved.processedAt,
        };
    }

    async findByEventId(eventId: string): Promise<WebhookEvent | null> {
        const doc = await WebhookEventModel.findOne({ eventId }).exec();
        if (!doc) return null;
        return {
            id: doc._id.toString(),
            eventId: doc.eventId,
            eventType: doc.eventType,
            payload: doc.payload,
            processedAt: doc.processedAt,
        };
    }
}
