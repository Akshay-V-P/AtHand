import { IUsecase } from "../../../../shared/application/interfaces/IUsecase";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Provider } from "../../../provider/domain/entities/Provider";
import { DocumentVerificationStatus } from "../../../provider/domain/enums/DocumentVerificationStatus";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";
import { IProviderDocumentRepository } from "../../../provider/domain/repositories/IProviderDocumentRepository";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { UpdateProviderStatusDTO } from "../dtos/UpdateProviderStatusDTO";
import { IWalletRepository } from "../../../wallet/domain/repositories/IWalletRepository";
import { WalletStatus, WalletType } from "../../../wallet/domain/entities/Wallet";

export class UpdateProviderStatusUsecase implements IUsecase<UpdateProviderStatusDTO, Provider>{
    constructor(
        private readonly providerRepository: IProviderRepository,
        private readonly documentRepository: IProviderDocumentRepository,
        private readonly walletRepository?: IWalletRepository,
    ) { }
    
    async execute(data: UpdateProviderStatusDTO): Promise<Provider> {
        const payload = {
            status: data.status
        }

        const provider = await this.providerRepository.findById(data.id)
        if(!provider) throw new NotFoundError("Provider not found")

        const isApprovedStatus = data.status === ProviderStatus.ACTIVE || (data.status as string) === "APPROVED";

        if (isApprovedStatus) {
            const documents = await this.documentRepository.findByProviderId(data.id)
            if (!documents || documents.length <= 0) throw new BadRequestError("Cannot approve provider, No documents uploaded")
            
            const allVerified = documents?.every(doc => doc.verificationStatus == DocumentVerificationStatus.APPROVED)
            if(!allVerified) throw new BadRequestError("Cannot approve provider, documents not verified")
        }

        const updatedProvider = await this.providerRepository.update(data.id, payload)
        if (!updatedProvider) throw new NotFoundError("Provider not found")

        // Automatically create PROVIDER wallet upon successful approval
        if (isApprovedStatus && this.walletRepository && updatedProvider.userId) {
            await this.walletRepository.create({
                userId: updatedProvider.userId,
                balance: 0,
                currency: "INR",
                status: WalletStatus.ACTIVE,
                type: WalletType.PROVIDER,
            });
        }
        
        return updatedProvider
    }
}
