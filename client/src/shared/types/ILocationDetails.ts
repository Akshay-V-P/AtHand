export interface ILocationDetails{
    address: {
        street: string;
        city: string;
        district: string;
        state: string;
        pincode: string;
    },
    coordinates: {
        type: "Point",
        coordinates:[number, number]
    }
}

