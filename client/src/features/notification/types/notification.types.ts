export interface NotificationPayloadData {
    transactionId?: string;
    amount?: string | number;
    balanceAfter?: string | number;
}

export interface NotificationPayload {
    id?: string;
    recipientId?: string;
    recipientRole?: string;
    type: string;
    title?: string;
    message: string;
    data?: NotificationPayloadData;
    isRead?: boolean;
    readAt?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface NotificationListItem {
    id: string;
    notification: NotificationPayload;
    isRead: boolean;
}

export interface GetNotificationsParams {
    page?: number;
    limit?: number;
    isRead?: boolean;
}

export interface PaginatedNotificationsResponse {
    items: NotificationPayload[];
    totalItems: number;
    page: number;
    limit: number;
    totalPages: number;
    unreadCount: number;
}

export const getNotificationId = (
    notification: NotificationPayload,
    index: number
): string => {
    if (notification.id) {
        return notification.id;
    }

    const timestamp =
        notification.createdAt instanceof Date
            ? notification.createdAt.toISOString()
            : String(notification.createdAt ?? "");
    const transactionId = notification.data?.transactionId ?? "";

    return `${notification.type}-${transactionId}-${timestamp}-${index}`;
};

export const formatNotificationTimestamp = (
    createdAt?: Date | string
): string | null => {
    if (!createdAt) return null;

    const parsedDate =
        createdAt instanceof Date ? createdAt : new Date(createdAt);

    if (Number.isNaN(parsedDate.getTime())) {
        return null;
    }

    const now = new Date();
    const isSameDay =
        parsedDate.getFullYear() === now.getFullYear() &&
        parsedDate.getMonth() === now.getMonth() &&
        parsedDate.getDate() === now.getDate();

    if (isSameDay) {
        return parsedDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return parsedDate.toLocaleDateString([], {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};
