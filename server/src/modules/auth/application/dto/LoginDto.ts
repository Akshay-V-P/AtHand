import { AuthContext } from "../../domain/enum/AuthContext";

export interface LoginDto{
    email: string;
    password: string;
    context: AuthContext;
}