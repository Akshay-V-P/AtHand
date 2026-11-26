import { SocketAuthMiddleware } from "./SocketAuthMiddleware";
import { SocketRoomManager } from "./SocketRoomManager";
import { Server, Socket } from "socket.io";
import http from "http"

export class SocketServer{
    private io:Server
    constructor(
        httpServer: http.Server,
        authMiddleware: SocketAuthMiddleware,
        roomManager:SocketRoomManager
    ) {
        this.io = new Server(httpServer, {
            cors: {
                origin: process.env.CLIENT_ORIGIN,
                credentials:true
            }
        })

        this.io.use(authMiddleware.authenticate)

        this.io.on("connection", (socket: Socket) => {
            const user = socket.data.user

            roomManager.joinUserRoom(socket, user.id)

            console.log(`Socket connected: ${user.id}`)

            socket.on("disconnect", (reason) => {
                console.log(`Socket disconnected: ${user.id}`, reason)
            })
        })
    }

    getIO(): Server{
        return this.io
    }
}