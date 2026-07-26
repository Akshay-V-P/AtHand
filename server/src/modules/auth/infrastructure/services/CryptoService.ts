import { ICryptoService } from "../../domain/services/ICryptoService";
import crypto from "node:crypto"

export class CryptoService implements ICryptoService{
    generate(): string {
        return crypto.randomBytes(32).toString("hex")
    }

    hash(token:string): string {
        return crypto.createHash("sha256").update(token).digest("hex")
    }
}