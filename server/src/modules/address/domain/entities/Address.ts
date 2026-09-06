interface Coordinates{
    type: "Point",
    coordinates:[number, number]
}

export class Address{
    constructor(
        public readonly userId: string,
        public readonly label: string,
        public readonly houseName: string,
        public readonly area: string,
        public readonly city: string,
        public readonly state: string,
        public readonly pincode: string,
        public readonly coordinates: Coordinates,
        public readonly isPrimary: boolean,
        public readonly id?:string
    ){}
}