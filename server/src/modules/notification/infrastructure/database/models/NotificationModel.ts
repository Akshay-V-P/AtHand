import { InferSchemaType, Schema, model } from "mongoose";
import { UserRole } from "../../../../auth/domain/enum/UserRole";
import { Notification } from "../../../domain/entities/Notification";

const notificationSchema = new Schema(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    recipientRole: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.USER,
    },

    type: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    data: {
      type: Schema.Types.Mixed,
      default: {},
    },

    isRead: {
      type: Boolean,
      required: true,
      default: false,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ recipientId: 1, isRead: 1 });

export type NotificationSchemaType = InferSchemaType<typeof notificationSchema>;

export const NotificationModel = model<Notification>("Notification", notificationSchema);
