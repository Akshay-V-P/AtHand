import { useEffect } from "react";
import { socket } from "@/shared/services/socket/socket";

export const useNotifications = () => {
    useEffect(() => {
        const handleNotification = (notification: unknown) => {
            console.log("New notification received:", notification);
        };

        socket.on("notification:new", handleNotification);

        return () => {
            socket.off("notification:new", handleNotification);
        };
    }, []);
};