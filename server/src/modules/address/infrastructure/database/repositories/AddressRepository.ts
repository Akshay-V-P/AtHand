import { Address } from "../../../domain/entities/Address";
import { IAddressRepository } from "../../../domain/repositories/IAddressRepository";
import AddressModel from "../models/AddressModel";
import { AddressMapper } from "../mappers/AddressMapper";

export class AddressRepository implements IAddressRepository {
    async create(address: Address): Promise<Address> {
        const newAddress = new AddressModel({
            userId: address.userId,
            label: address.label,
            houseName: address.houseName,
            area: address.area,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            coordinates: address.coordinates,
            isPrimary: address.isPrimary
        });
        const savedAddress = await newAddress.save();
        return AddressMapper.toDomain(savedAddress);
    }

    async findByUserId(userId: string): Promise<Address[]> {
        const addresses = await AddressModel.find({ userId }).sort({ createdAt: -1 });
        return AddressMapper.toDomainMultiple(addresses) as Address[];
    }

    async findById(id: string): Promise<Address | null> {
        const address = await AddressModel.findById(id);
        if (!address) return null;
        return AddressMapper.toDomain(address);
    }

    async update(address: Address): Promise<Address | null> {
        const updated = await AddressModel.findByIdAndUpdate(address.id, {
            label: address.label,
            houseName: address.houseName,
            area: address.area,
            city: address.city,
            state: address.state,
            pincode: address.pincode,
            coordinates: address.coordinates,
            isPrimary: address.isPrimary
        }, { new: true });

        if (!updated) return null;
        return AddressMapper.toDomain(updated);
    }

    async delete(id: string): Promise<void> {
        await AddressModel.findByIdAndDelete(id);
    }

    async removePrimaryFlag(userId: string): Promise<void> {
        await AddressModel.updateMany({ userId }, { isPrimary: false });
    }
}
