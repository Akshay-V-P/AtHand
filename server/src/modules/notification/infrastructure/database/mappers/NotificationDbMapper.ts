import { Notification } from "../../../domain/entities/Notification";

export class NotificationDbMapper {
  static toDomain(record: any): Notification {
    return {
      id: String(record._id || record.id),
      recipientId: record.recipientId?.toString
        ? record.recipientId.toString()
        : String(record.recipientId),
      recipientRole: record.recipientRole,
      type: record.type,
      title: record.title,
      message: record.message,
      data: record.data ?? {},
      isRead: Boolean(record.isRead),
      readAt: record.readAt ?? undefined,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  static toPersistence(entity: Partial<Notification>) {
    return { ...entity };
  }
}
