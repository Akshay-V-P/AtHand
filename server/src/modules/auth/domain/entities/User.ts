export class User{
    constructor(
        public readonly id:string|undefined,
        public readonly name: string,
        public readonly email: string,
        public readonly role: "USER" | "PROVIDER" | "ADMIN",
        public readonly status: "ACTIVE" | "BLOCKED",
        public readonly isVerified: boolean,
        public readonly phone?:string ,
        public readonly password?:string ,
        public readonly googleId?: string,
        public readonly profilePhotoUrl?: string
    ){}
}