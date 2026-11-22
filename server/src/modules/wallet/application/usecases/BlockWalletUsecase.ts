import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Wallet, WalletStatus } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";

export class BlockWalletUsecase{
    constructor(
        private readonly repository:IWalletRepository
    ) { }
    
    async execute(id: string): Promise<Wallet | null>{

        const wallet = await this.repository.findById(id)

        if (!wallet) throw new NotFoundError("Wallet not found")
        if(wallet.status === WalletStatus.BLOCKED) throw new BadRequestError("Wallet is already blocked")
        
        return this.repository.update(id, {status:WalletStatus.BLOCKED})
    }
}