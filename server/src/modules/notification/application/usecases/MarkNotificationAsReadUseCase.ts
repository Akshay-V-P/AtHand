import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";
import { NotificationMapper } from "../mappers/NotificationMapper";

export interface MarkNotificationAsReadInput {
  id: string;
  recipientId: string;
}

export class MarkNotificationAsReadUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: MarkNotificationAsReadInput) {
    if (!input.id || !isValidObjectId(input.id)) {
      throw new BadRequestError("Valid notification id is required");
    }

    const existing = await this.repository.findById(input.id);
    if (!existing) {
      throw new NotFoundError("Notification not found");
    }

    if (existing.recipientId !== input.recipientId) {
      throw new UnauthorizedError("Unauthorized access to notification");
    }

    const updated = await this.repository.markAsRead(input.id, input.recipientId);
    if (!updated) {
      throw new NotFoundError("Notification not found");
    }

    return NotificationMapper.toResponse(updated);
  }
}
