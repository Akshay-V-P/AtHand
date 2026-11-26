import { Server as HttpServer } from "http"
import { SocketRoomManager } from "./SocketRoomManager"
import { SocketAuthMiddleware } from "./SocketAuthMiddleware"
import { jwtService } from "../../../../modules/auth/container"
import { SocketServer } from "./SocketServer"
import { SocketGateway } from "./SocketGateway"

export function createRealtimeInfrastructure(httpServer:HttpServer) {
    const roomManager = new SocketRoomManager()
    const authMiddleware = new SocketAuthMiddleware(jwtService)
    const socketServer = new SocketServer(httpServer, authMiddleware, roomManager)

    const gateway = new SocketGateway(socketServer.getIO(), roomManager)

    return {
        socketServer, 
        gateway, 
        roomManager
    }
}