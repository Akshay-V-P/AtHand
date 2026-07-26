export interface ICryptoService{
    generate(): string;
    hash(token:string): string;
}