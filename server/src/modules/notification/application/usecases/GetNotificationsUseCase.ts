import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export class GetNotificationsUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute() {
    return this.repository.findAll();
  }
}

