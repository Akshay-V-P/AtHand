export interface LoginDto{
    email: string;
    password: string;
    context: "USER" | "ADMIN";
}