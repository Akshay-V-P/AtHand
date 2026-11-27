import { useCallback, useEffect, useMemo, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { socket } from "@/shared/services/socket/socket";
import { useAppSelector } from "@/hooks/storeHook";
import { notificationApi } from "../api/notificationApi";
import {
    getNotificationId,
    type GetNotificationsParams,
    type NotificationPayload,
    type PaginatedNotificationsResponse,
} from "../types/notification.types";

const DEFAULT_NOTIFICATION_PARAMS: Required<Pick<GetNotificationsParams, "page" | "limit">> = {
    page: 1,
    limit: 20,
};

export const notificationQueryKeys = {
    all: ["notifications"] as const,
    list: (params?: GetNotificationsParams) =>
        [...notificationQueryKeys.all, "list", params ?? DEFAULT_NOTIFICATION_PARAMS] as const,
};

export const useNotifications = () => {
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const queryClient = useQueryClient();
    const listQueryKey = useMemo(
        () => notificationQueryKeys.list(DEFAULT_NOTIFICATION_PARAMS),
        []
    );
    const wasDisconnectedRef = useRef(false);
    const prevUserIdRef = useRef<string | undefined>(user?.id);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: listQueryKey,
        queryFn: async () => {
            const response = await notificationApi.getNotifications(
                DEFAULT_NOTIFICATION_PARAMS
            );
            return response.data.data;
        },
        enabled: isAuthenticated,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
        staleTime: 30 * 1000,
    });

    // Clear cached notifications on logout or account switch
    useEffect(() => {
        if (!isAuthenticated) {
            queryClient.removeQueries({ queryKey: notificationQueryKeys.all });
            prevUserIdRef.current = undefined;
            return;
        }

        if (prevUserIdRef.current && user?.id && prevUserIdRef.current !== user.id) {
            queryClient.removeQueries({ queryKey: notificationQueryKeys.all });
        }

        prevUserIdRef.current = user?.id;
    }, [isAuthenticated, user?.id, queryClient]);

    // Listen for real-time notifications and sync missed ones after socket reconnect
    useEffect(() => {
        if (!isAuthenticated) {
            wasDisconnectedRef.current = false;
            return;
        }

        const handleNotification = (incoming: NotificationPayload) => {
            queryClient.setQueryData<PaginatedNotificationsResponse>(
                listQueryKey,
                (current) => {
                    const normalized: NotificationPayload = {
                        ...incoming,
                        isRead: Boolean(incoming.isRead),
                    };

                    if (!current) {
                        return {
                            items: [normalized],
                            totalItems: 1,
                            page: DEFAULT_NOTIFICATION_PARAMS.page,
                            limit: DEFAULT_NOTIFICATION_PARAMS.limit,
                            totalPages: 1,
                            unreadCount: normalized.isRead ? 0 : 1,
                        };
                    }

                    const incomingKey = incoming.id ?? getNotificationId(incoming, -1);
                    const alreadyExists = current.items.some((item, index) => {
                        if (incoming.id && item.id) {
                            return item.id === incoming.id;
                        }
                        return getNotificationId(item, index) === incomingKey;
                    });

                    if (alreadyExists) {
                        return current;
                    }

                    return {
                        ...current,
                        items: [normalized, ...current.items],
                        totalItems: current.totalItems + 1,
                        unreadCount: normalized.isRead
                            ? current.unreadCount
                            : current.unreadCount + 1,
                    };
                }
            );
        };

        const handleDisconnect = () => {
            wasDisconnectedRef.current = true;
        };

        const handleConnect = () => {
            if (wasDisconnectedRef.current) {
                wasDisconnectedRef.current = false;
                void queryClient.invalidateQueries({
                    queryKey: notificationQueryKeys.all,
                });
            }
        };

        socket.on("notification:new", handleNotification);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect", handleConnect);

        return () => {
            socket.off("notification:new", handleNotification);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect", handleConnect);
        };
    }, [isAuthenticated, listQueryKey, queryClient]);

    const markAsReadMutation = useMutation({
        mutationFn: async (id: string) => {
            const response = await notificationApi.markAsRead(id);
            return response.data.data;
        },
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: listQueryKey });
            const previous =
                queryClient.getQueryData<PaginatedNotificationsResponse>(listQueryKey);

            queryClient.setQueryData<PaginatedNotificationsResponse>(
                listQueryKey,
                (current) => {
                    if (!current) return current;

                    let decremented = false;
                    const nextItems = current.items.map((item) => {
                        if (item.id === id && !item.isRead) {
                            decremented = true;
                            return {
                                ...item,
                                isRead: true,
                                readAt: new Date().toISOString(),
                            };
                        }
                        return item;
                    });

                    return {
                        ...current,
                        items: nextItems,
                        unreadCount: decremented
                            ? Math.max(0, current.unreadCount - 1)
                            : current.unreadCount,
                    };
                }
            );

            return { previous };
        },
        onError: (_error, _id, context) => {
            if (context?.previous) {
                queryClient.setQueryData(listQueryKey, context.previous);
            }
        },
    });

    const markAllAsReadMutation = useMutation({
        mutationFn: async () => {
            const response = await notificationApi.markAllAsRead();
            return response.data.data;
        },
        onMutate: async () => {
            await queryClient.cancelQueries({ queryKey: listQueryKey });
            const previous =
                queryClient.getQueryData<PaginatedNotificationsResponse>(listQueryKey);

            queryClient.setQueryData<PaginatedNotificationsResponse>(
                listQueryKey,
                (current) => {
                    if (!current) return current;

                    const readAt = new Date().toISOString();
                    return {
                        ...current,
                        items: current.items.map((item) =>
                            item.isRead ? item : { ...item, isRead: true, readAt }
                        ),
                        unreadCount: 0,
                    };
                }
            );

            return { previous };
        },
        onError: (_error, _vars, context) => {
            if (context?.previous) {
                queryClient.setQueryData(listQueryKey, context.previous);
            }
        },
    });

    const { mutate: mutateMarkAsRead } = markAsReadMutation;
    const { mutate: mutateMarkAllAsRead } = markAllAsReadMutation;

    const markAsRead = useCallback(
        (id: string) => {
            if (!id) return;
            mutateMarkAsRead(id);
        },
        [mutateMarkAsRead]
    );

    const markAllAsRead = useCallback(() => {
        mutateMarkAllAsRead();
    }, [mutateMarkAllAsRead]);

    const notifications = useMemo(() => data?.items ?? [], [data?.items]);
    const unreadCount = data?.unreadCount ?? 0;

    return {
        notifications,
        unreadCount,
        isLoading,
        isError,
        markAsRead,
        markAllAsRead,
        refetch,
    };
};
