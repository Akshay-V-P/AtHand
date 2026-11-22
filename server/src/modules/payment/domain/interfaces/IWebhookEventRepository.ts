import { WebhookEvent } from "../entities/WebhookEvent";

export interface IWebhookEventRepository {
    create(event: Omit<WebhookEvent, "id">): Promise<WebhookEvent>;
    findByEventId(eventId: string): Promise<WebhookEvent | null>;
}
