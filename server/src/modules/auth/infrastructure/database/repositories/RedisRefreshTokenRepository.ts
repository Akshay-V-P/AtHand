import { redisClient } from "../../../../../config/redis";
import { IRefreshTokenRepository } from "../../../domain/repositories/IRefreshTokenRepository";

export class RedisRefreshTokenRepository implements IRefreshTokenRepository{
    async save(id: string, sessionId:string, token: string): Promise<void> {
        await redisClient.set(`refresh:${id}:${sessionId}`, token, {EX:60*60*24*7})
    }

    async find(id: string, sessionId:string): Promise<string | null> {
        return redisClient.get(`refresh:${id}:${sessionId}`)
    }

    async delete(id: string, sessionId: string): Promise<void> {
        await redisClient.del(`refresh:${id}:${sessionId}`)
    }
}