import {io, Socket} from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_API_URL

export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    withCredentials: true,
    transports:["websocket"],
})

socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
});

socket.on("connect_error", (error) => {
    console.error("Socket connection failed:", error.message);
});

socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
});