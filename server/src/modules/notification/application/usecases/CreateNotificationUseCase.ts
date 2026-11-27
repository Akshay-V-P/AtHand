import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { UserRole } from "../../../auth/domain/enum/UserRole";
import { Notification } from "../../domain/entities/Notification";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";
import { CreateNotificationDto } from "../dtos/CreateNotificationDto";

export class CreateNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: CreateNotificationDto): Promise<Notification> {
    if (!input.recipientId || !isValidObjectId(input.recipientId)) {
      throw new BadRequestError("Valid recipientId is required");
    }

    if (!input.type || !input.type.trim()) {
      throw new BadRequestError("Notification type is required");
    }

    if (!input.title || !input.title.trim()) {
      throw new BadRequestError("Notification title is required");
    }

    if (!input.message || !input.message.trim()) {
      throw new BadRequestError("Notification message is required");
    }

    return this.repository.create({
      recipientId: input.recipientId,
      recipientRole: input.recipientRole ?? UserRole.USER,
      type: input.type.trim(),
      title: input.title.trim(),
      message: input.message.trim(),
      data: input.data ?? {},
      isRead: input.isRead ?? false,
    });
  }
}
