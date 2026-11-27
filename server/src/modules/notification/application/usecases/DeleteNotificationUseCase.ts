import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export interface DeleteNotificationInput {
  id: string;
  recipientId: string;
}

export class DeleteNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: DeleteNotificationInput): Promise<boolean> {
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

    return this.repository.delete(input.id, input.recipientId);
  }
}
