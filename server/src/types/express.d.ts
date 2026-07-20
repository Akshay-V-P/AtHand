import { JwtPayload, RegTokenPayload } from "../modules/auth/domain/services/ITokenService";


declare global{
    namespace Express{
        interface Request{
            user?: JwtPayload;
            registration?: RegTokenPayload;
        }
    }
}

export {}