import { IAddressRepository } from "../../domain/repositories/IAddressRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";

export class DeleteAddressUsecase {
    constructor(private readonly addressRepository: IAddressRepository) { }

    async execute(id: string, userId: string): Promise<void> {
        const existing = await this.addressRepository.findById(id);
        if (!existing || existing.userId !== userId) {
            throw new NotFoundError("Address not found");
        }

        await this.addressRepository.delete(id);
    }
}
