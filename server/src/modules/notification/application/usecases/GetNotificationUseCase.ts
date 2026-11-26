import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export class GetNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(id: string) {
    return this.repository.findById(id);
  }
}

