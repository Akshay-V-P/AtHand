export interface CreateAddressDTO {
    label: string;
    houseName: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
        type: "Point";
        coordinates: [number, number];
    };
    isPrimary?: boolean;
}

export interface UpdateAddressDTO extends Partial<CreateAddressDTO> {
    id: string;
}

export interface AddressResponseDTO {
    id: string;
    userId: string;
    label: string;
    houseName: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    coordinates: {
        type: "Point";
        coordinates: [number, number];
    };
    isPrimary: boolean;
}
