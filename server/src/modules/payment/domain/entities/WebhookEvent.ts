export interface WebhookEvent {
    id?: string;
    eventId: string;
    eventType: string;
    payload: Record<string, any>;
    processedAt: Date;
}
