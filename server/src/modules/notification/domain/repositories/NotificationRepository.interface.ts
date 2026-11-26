import { CreateNotificationDto } from "../../application/dtos/CreateNotificationDto";
import { UpdateNotificationDto } from "../../application/dtos/UpdateNotificationDto";
import { Notification } from "../entities/Notification";

export interface NotificationRepository {
  create(input: CreateNotificationDto): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findAll(): Promise<Notification[]>;
  update(id: string, input: UpdateNotificationDto): Promise<Notification | null>;
  delete(id: string): Promise<boolean>;
}

