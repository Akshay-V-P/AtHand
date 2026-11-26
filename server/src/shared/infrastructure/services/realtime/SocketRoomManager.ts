import { Socket } from "socket.io";

export class SocketRoomManager{
    joinUserRoom(socket: Socket, userId: string): void{
        socket.join(this.getUserRoom(userId))
    }

    getUserRoom(userId: string): string{
        return `user:${userId}`
    }

    leaveUserRoom(socket: Socket, userId: string): void{
        socket.leave(this.getUserRoom(userId))
    }
}