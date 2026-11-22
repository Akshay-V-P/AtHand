import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Wallet, WalletStatus } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";

export class UnblockWalletUsecase{
    constructor(
        private readonly repository:IWalletRepository
    ) { }
    
    async execute(id: string): Promise<Wallet | null>{

        const wallet = await this.repository.findById(id)

        if (!wallet) throw new NotFoundError("Wallet not found")
        if(wallet.status === WalletStatus.ACTIVE) throw new BadRequestError("Wallet is already Active")
        
        return this.repository.update(id, {status:WalletStatus.ACTIVE})
    }
}