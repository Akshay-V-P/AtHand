import { api } from "@/services/axios";
import type {
    GetNotificationsParams,
    NotificationPayload,
    PaginatedNotificationsResponse,
} from "../types/notification.types";

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const notificationApi = {
    getNotifications: (params?: GetNotificationsParams) =>
        api.get<ApiResponse<PaginatedNotificationsResponse>>("/notifications", {
            params,
        }),

    getNotificationById: (id: string) =>
        api.get<ApiResponse<NotificationPayload>>(`/notifications/${id}`),

    markAsRead: (id: string) =>
        api.patch<ApiResponse<NotificationPayload>>(`/notifications/${id}/read`),

    markAllAsRead: () =>
        api.patch<ApiResponse<{ modifiedCount: number }>>("/notifications/read-all"),

    deleteNotification: (id: string) =>
        api.delete<ApiResponse<void>>(`/notifications/${id}`),
};
