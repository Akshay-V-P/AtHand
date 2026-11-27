import { Notification } from "../../domain/entities/Notification";

export class NotificationMapper {
  static toResponse(entity: Notification) {
    return {
      id: entity.id,
      recipientId: entity.recipientId,
      recipientRole: entity.recipientRole,
      type: entity.type,
      title: entity.title,
      message: entity.message,
      data: entity.data ?? {},
      isRead: entity.isRead,
      readAt: entity.readAt ?? null,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toResponseList(entities: Notification[]) {
    return entities.map((entity) => NotificationMapper.toResponse(entity));
  }
}
