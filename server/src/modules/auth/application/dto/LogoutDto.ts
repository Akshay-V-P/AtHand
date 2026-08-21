import { AuthContext } from "../../domain/enum/AuthContext";

export interface LogoutDto{
    id: string;
    sessionId: string;
    context: AuthContext;
}