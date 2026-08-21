import { redisClient } from "../../../../../config/redis";
import { IPasswordResetTokenRepository } from "../../../domain/repositories/IPasswordResetTokenRepository";

// TODO: direct redisclient dependency
export class PasswordResetTokenRepository implements IPasswordResetTokenRepository{
    async save(token: string, userId: string): Promise<void> {
        await redisClient.set(`password_reset:${token}`, userId, {EX:900})
    }

    async find(token: string): Promise<string | null> {
        return redisClient.get(`password_reset:${token}`)
    }
}