import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { Wallet, WalletStatus, WalletType } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";

export class GetCustomerWalletUseCase {
  constructor(private readonly walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<Wallet> {
    if (!userId) {
      throw new NotFoundError("User ID is required");
    }

    let wallet = await this.walletRepository.findByUserAndType(userId, WalletType.CUSTOMER);

    if (!wallet) {
      // Auto-initialize customer wallet idempotently
      const result = await this.walletRepository.create({
        userId,
        balance: 0,
        currency: "INR",
        status: WalletStatus.ACTIVE,
        type: WalletType.CUSTOMER,
      });
      wallet = result.wallet;
    }

    return wallet;
  }
}
