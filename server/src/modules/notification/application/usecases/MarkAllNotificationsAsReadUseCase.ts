import { isValidObjectId } from "mongoose";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export class MarkAllNotificationsAsReadUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(recipientId: string): Promise<{ modifiedCount: number }> {
    if (!recipientId || !isValidObjectId(recipientId)) {
      throw new BadRequestError("Valid recipientId is required");
    }

    const modifiedCount = await this.repository.markAllAsRead(recipientId);
    return { modifiedCount };
  }
}
