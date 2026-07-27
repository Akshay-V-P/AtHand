import { OAuth2Client } from "google-auth-library";
import { AuthServiceResponse, IAuthService } from "../../domain/services/IAuthService";

export class GoogleAuthService implements IAuthService{
    private readonly client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

    async verifyToken(token: string): Promise<AuthServiceResponse | null> {
        const ticket = await this.client.verifyIdToken({
            idToken: token,
            audience:process.env.GOOGLE_CLIENT_ID,
        })

        const payload = ticket.getPayload()
        if (!payload || !payload.email) return null
        
        return {email:payload.email, name:payload.name!, picture:payload.picture, googleId:payload.sub}
    }
}