import { IPasswordService } from "../../domain/services/IPasswordService";
import bcrypt from 'bcrypt'

export class PasswordService implements IPasswordService{
    async hash(password: string): Promise<string> {
        return bcrypt.hash(password, Number(process.env.HASH_SALT))
        
    }

    async compare(password: string, hashedPassword: string): Promise<boolean> {
        return bcrypt.compare(password, hashedPassword)
    }
}