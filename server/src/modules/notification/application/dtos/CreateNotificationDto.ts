import { UserRole } from "../../../auth/domain/enum/UserRole";

export interface CreateNotificationDto {
  recipientId: string;
  recipientRole?: UserRole;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead?: boolean;
}
