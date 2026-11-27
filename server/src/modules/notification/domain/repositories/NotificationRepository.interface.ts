import { PaginatedResult } from "../../../../shared/application/dtos/PaginatedResultDTO";
import { CreateNotificationDto } from "../../application/dtos/CreateNotificationDto";
import { GetNotificationsDto } from "../../application/dtos/GetNotificationsDto";
import { UpdateNotificationDto } from "../../application/dtos/UpdateNotificationDto";
import { Notification } from "../entities/Notification";

export interface NotificationRepository {
  create(input: CreateNotificationDto): Promise<Notification>;
  findById(id: string): Promise<Notification | null>;
  findAll(): Promise<Notification[]>;
  findPaginatedByRecipientId(options: GetNotificationsDto): Promise<PaginatedResult<Notification>>;
  countUnreadByRecipientId(recipientId: string): Promise<number>;
  markAsRead(id: string, recipientId: string): Promise<Notification | null>;
  markAllAsRead(recipientId: string): Promise<number>;
  update(id: string, input: UpdateNotificationDto): Promise<Notification | null>;
  delete(id: string, recipientId?: string): Promise<boolean>;
}
