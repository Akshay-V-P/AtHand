import { Schema, model } from "mongoose";
import { WebhookEvent } from "../../../domain/entities/WebhookEvent";

const webhookEventSchema = new Schema<WebhookEvent>(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        eventType: {
            type: String,
            required: true,
            index: true,
        },
        payload: {
            type: Schema.Types.Mixed,
        },
        processedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    }
);

export const WebhookEventModel = model<WebhookEvent>("WebhookEvent", webhookEventSchema);
