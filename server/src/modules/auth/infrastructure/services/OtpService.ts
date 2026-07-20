import { redisClient } from "../../../../config/redis";
import { OtpVerificationEnum } from "../../domain/enum/OtpVerificationEnum";
import { IOtpService } from "../../domain/services/IOtpService";
import { randomInt } from "node:crypto";

export class OtpService implements IOtpService{
    async generate(email: string): Promise<string> {
        const max = Math.pow(10, 6)
        const min = Math.pow(10, 5)

        const otp = randomInt(100000, 1000000).toString()
        await redisClient.set(`otp:${email}`, otp, {EX:60})
        return otp
    }

    async find(email: string): Promise<boolean> {
        const otp = await redisClient.get(`otp:${email}`)
        if (!otp) return false
        return true
    }

    async verify(email: string, enteredOtp: string): Promise<OtpVerificationEnum> {
        const otp = await redisClient.get(`otp:${email}`)
        if (!otp) return OtpVerificationEnum.EXPIRED
        if (otp !== enteredOtp) return OtpVerificationEnum.INVALID
        return OtpVerificationEnum.VALID
    }

    async delete(email: string): Promise<void> {
        await redisClient.del(`otp:${email}`)
    }

    async getRemainingTime(email: string): Promise<number> {
        const ttl = await redisClient.ttl(`otp:${email}`)
        if (ttl === -2) return 0
        return ttl
    }
}