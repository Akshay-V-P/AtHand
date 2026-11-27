import { Bell, BellOff, Wallet, X } from "lucide-react";
import {
    formatNotificationTimestamp,
    type NotificationListItem,
} from "../types/notification.types";

interface NotificationModalProps {
    isOpen: boolean;
    notifications: NotificationListItem[];
    unreadCount: number;
    isLoading?: boolean;
    onClose: () => void;
    onMarkAsRead?: (id: string) => void;
    onMarkAllAsRead?: () => void;
}

export const NotificationModal = ({
    isOpen,
    notifications,
    unreadCount,
    isLoading = false,
    onClose,
    onMarkAsRead,
    onMarkAllAsRead,
}: NotificationModalProps) => {
    if (!isOpen) return null;

    return (
        <>
            {/* Mobile backdrop */}
            <div
                className="fixed inset-0 bg-gray-900/25 backdrop-blur-[1px] z-90 sm:hidden"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Notification panel */}
            <div
                role="dialog"
                aria-labelledby="notifications-modal-heading"
                className="fixed inset-x-4 top-20 sm:inset-auto sm:absolute sm:right-0 sm:top-full sm:mt-3 w-auto sm:w-96 z-100 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden flex flex-col max-h-[75vh] sm:max-h-[460px]"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-2.5">
                        <h3
                            id="notifications-modal-heading"
                            className="text-base font-bold text-gray-900 tracking-tight"
                        >
                            Notifications
                        </h3>
                        {unreadCount > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-600">
                                {unreadCount > 99 ? "99+" : unreadCount} new
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5">
                        {unreadCount > 0 && onMarkAllAsRead && (
                            <button
                                type="button"
                                onClick={onMarkAllAsRead}
                                className="text-xs font-medium text-gray-600 hover:text-gray-900 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                            >
                                Mark all read
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close notifications"
                            className="text-gray-400 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 p-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 cursor-pointer"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="overflow-y-auto flex-1 divide-y divide-gray-100">
                    {isLoading && notifications.length === 0 ? (
                        <div className="divide-y divide-gray-100">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="px-5 py-3.5 flex items-start gap-3.5 animate-pulse"
                                >
                                    <div className="w-9 h-9 rounded-full bg-gray-200 shrink-0" />
                                    <div className="flex-1 space-y-2">
                                        <div className="w-24 h-3 bg-gray-200 rounded" />
                                        <div className="w-48 h-3.5 bg-gray-200 rounded" />
                                        <div className="w-16 h-2.5 bg-gray-100 rounded" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="px-6 py-12 flex flex-col items-center justify-center text-center">
                            <div className="w-12 h-12 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center mb-3">
                                <BellOff className="w-5 h-5 text-gray-400" />
                            </div>
                            <p className="text-sm font-semibold text-gray-900">
                                You&apos;re all caught up!
                            </p>
                            <p className="text-xs text-gray-500 mt-1 max-w-[220px]">
                                New wallet updates and alerts will appear here.
                            </p>
                        </div>
                    ) : (
                        notifications.map(({ id, notification, isRead }) => {
                            const formattedTime = formatNotificationTimestamp(
                                notification.createdAt
                            );
                            const isWalletNotification =
                                notification.type === "WALLET_CREDITED";
                            const canMarkSingleRead =
                                !isRead && Boolean(notification.id) && Boolean(onMarkAsRead);

                            return (
                                <div
                                    key={id}
                                    onClick={
                                        canMarkSingleRead && notification.id && onMarkAsRead
                                            ? () => onMarkAsRead(notification.id!)
                                            : undefined
                                    }
                                    className={`px-5 py-3.5 flex items-start gap-3.5 transition-colors ${
                                        isRead
                                            ? "bg-white hover:bg-gray-50"
                                            : "bg-red-50/40 hover:bg-red-50/70"
                                    } ${canMarkSingleRead ? "cursor-pointer" : ""}`}
                                >
                                    <div
                                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                                            isWalletNotification
                                                ? "bg-emerald-50 text-emerald-600"
                                                : "bg-gray-100 text-gray-600"
                                        }`}
                                    >
                                        {isWalletNotification ? (
                                            <Wallet className="w-4 h-4" />
                                        ) : (
                                            <Bell className="w-4 h-4" />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        {notification.title && (
                                            <p
                                                className={`text-xs uppercase tracking-wider mb-0.5 ${
                                                    isRead
                                                        ? "font-medium text-gray-500"
                                                        : "font-semibold text-gray-800"
                                                }`}
                                            >
                                                {notification.title}
                                            </p>
                                        )}
                                        <p
                                            className={`text-sm leading-snug break-words ${
                                                isRead
                                                    ? "font-normal text-gray-700"
                                                    : "font-semibold text-gray-900"
                                            }`}
                                        >
                                            {notification.message}
                                        </p>
                                        {formattedTime && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {formattedTime}
                                            </p>
                                        )}
                                    </div>

                                    {!isRead && (
                                        <span
                                            className="w-2 h-2 rounded-full bg-red-500 shrink-0 mt-2"
                                            aria-label="Unread notification"
                                        />
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </>
    );
};
