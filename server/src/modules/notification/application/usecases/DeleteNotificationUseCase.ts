import { NotificationRepository } from "../../domain/repositories/NotificationRepository.interface";

export class DeleteNotificationUseCase {
  constructor(private readonly repository: NotificationRepository) {}

  async execute(id: string) {
    return this.repository.delete(id);
  }
}

