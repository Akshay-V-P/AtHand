import { CreateNotificationDto } from "../dtos/CreateNotificationDto";
import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export class CreateNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(input: CreateNotificationDto) {
    return this.repository.create(input);
  }
}

