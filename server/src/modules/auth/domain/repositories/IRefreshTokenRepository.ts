export interface IRefreshTokenRepository{
    save(id: string,sessionId:string, token: string): Promise<void>;
    find(id: string, sessionId:string): Promise<string | null>;
    delete(id:string, sessionId:string):Promise<void>
}