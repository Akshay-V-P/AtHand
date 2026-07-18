import { IOtpService } from "../../domain/services/IOtpService";
import { randomInt } from "node:crypto";

export class OtpService implements IOtpService{
    async generate(email: string): Promise<string> {
        const max = Math.pow(10, 6)
        const min = Math.pow(10, 5)

        const otp = randomInt(100000, 1000000).toString()
        return otp
    }
}