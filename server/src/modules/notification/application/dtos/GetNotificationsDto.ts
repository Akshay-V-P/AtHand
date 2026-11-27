export interface GetNotificationsDto {
  recipientId: string;
  page?: number;
  limit?: number;
  isRead?: boolean;
}
