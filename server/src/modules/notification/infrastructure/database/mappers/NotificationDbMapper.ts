import { Notification } from "../../../domain/entities/Notification";

export class NotificationDbMapper {
  static toDomain(record: any): Notification {
    return {
      id: String(record.id),
      recipientId: String(record.recipientId),
      recipientRole: record.recipientRole,
      type: record.type,
      title: record.title,
      message: record.message,
      data: record.data,
      isRead: record.isRead,
      readAt:record.readAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static toPersistence(entity: Partial<Notification>) {
    return { ...entity };
  }
}

