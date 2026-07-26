export interface IPasswordResetTokenRepository{
    save(token: string, userId: string): Promise<void>;
    find(token: string): Promise<string | null>;
}