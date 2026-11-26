import { CreateNotificationDto } from "../../../application/dtos/CreateNotificationDto";
import { UpdateNotificationDto } from "../../../application/dtos/UpdateNotificationDto";
import { Notification } from "../../../domain/entities/Notification";
import { NotificationRepository } from "../../../domain/repositories/NotificationRepository.interface";

export class NotificationRepositoryImpl implements NotificationRepository {
  async create(input: CreateNotificationDto): Promise<Notification> {
    throw new Error("Not implemented");
  }

  async findById(id: string): Promise<Notification | null> {
    throw new Error("Not implemented");
  }

  async findAll(): Promise<Notification[]> {
    throw new Error("Not implemented");
  }

  async update(id: string, input: UpdateNotificationDto): Promise<Notification | null> {
    throw new Error("Not implemented");
  }

  async delete(id: string): Promise<boolean> {
    throw new Error("Not implemented");
  }
}

