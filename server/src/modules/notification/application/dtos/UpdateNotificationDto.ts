export interface UpdateNotificationDto {
  title?: string;
  message?: string;
  data?: Record<string, unknown>;
  isRead?: boolean;
  readAt?: Date;
}
