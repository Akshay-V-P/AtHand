import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";
import { NotificationMapper } from "../mappers/NotificationMapper";

export interface GetNotificationInput {
  id: string;
  recipientId: string;
}

export class GetNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: GetNotificationInput) {
    if (!input.id || !isValidObjectId(input.id)) {
      throw new BadRequestError("Valid notification id is required");
    }

    const notification = await this.repository.findById(input.id);
    if (!notification) {
      throw new NotFoundError("Notification not found");
    }

    if (notification.recipientId !== input.recipientId) {
      throw new UnauthorizedError("Unauthorized access to notification");
    }

    return NotificationMapper.toResponse(notification);
  }
}
