import { UpdateWalletDto } from "../dtos/UpdateWalletDto";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { WalletStatus } from "../../domain/entities/Wallet";
import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";

export class UpdateWalletBalanceUseCase {
  constructor(private readonly repository: IWalletRepository) {}

  async execute(id: string, input: UpdateWalletDto) {

    const wallet = await this.repository.findById(id)
    if (!wallet) throw new NotFoundError("Wallet not found")
    
    if(wallet.status == WalletStatus.BLOCKED) throw new UnauthorizedError("Wallet is blocked")

    return this.repository.update(id, input);
  }
}

