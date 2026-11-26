import { UpdateNotificationDto } from "../dtos/UpdateNotificationDto";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export class UpdateNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(id: string, input: UpdateNotificationDto) {
    return this.repository.update(id, input);
  }
}

