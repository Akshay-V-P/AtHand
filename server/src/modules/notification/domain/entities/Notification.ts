import { UserRole } from "../../../auth/domain/enum/UserRole";

export interface Notification {
  id?: string;
  recipientId: string;
  recipientRole: UserRole;
  type: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  isRead: boolean;
  readAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

