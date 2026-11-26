import { Notification } from "../../domain/entities/Notification";

export class NotificationMapper {
  static toResponse(entity: Notification) {
    return { ...entity };
  }
}

