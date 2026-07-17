export class User{
    constructor(
        public readonly id:string|undefined,
        public readonly name: string,
        public readonly email: string,
        public readonly phone:string,
        public readonly password:string,
        public readonly role: string,
        public readonly isVerified:boolean
    ){}
}