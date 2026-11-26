import { Server } from "socket.io";
import { SocketRoomManager } from "./SocketRoomManager";

export class SocketGateway{
    constructor(
        private readonly io: Server,
        private readonly roomManager:SocketRoomManager,
    ) { }
    
    emitToUser(userId: string, event: string, payload: unknown): void{
        const room = this.roomManager.getUserRoom(userId)

        this.io.to(room).emit(event, payload)
    }

    emitToRoom(room: string, event: string, payload: unknown): void{
        this.io.to(room).emit(event, payload)
    }
}