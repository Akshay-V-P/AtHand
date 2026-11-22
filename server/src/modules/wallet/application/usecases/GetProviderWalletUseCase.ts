import { UnauthorizedError } from "../../../../shared/errors/UnauthorizedError";
import { UserRole } from "../../../auth/domain/enum/UserRole";
import { ProviderStatus } from "../../../provider/domain/enums/ProviderStatus";
import { IProviderRepository } from "../../../provider/domain/repositories/IProviderRepository";
import { Wallet, WalletStatus, WalletType } from "../../domain/entities/Wallet";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";

export interface GetProviderWalletInput {
  userId: string;
  roles?: UserRole[];
}

export class GetProviderWalletUseCase {
  constructor(
    private readonly walletRepository: IWalletRepository,
    private readonly providerRepository: IProviderRepository
  ) {}

  async execute(input: GetProviderWalletInput): Promise<Wallet> {
    const { userId, roles } = input;

    if (!userId) {
      throw new UnauthorizedError("Unauthorized access");
    }

    // Role check: must possess PROVIDER role or ADMIN
    const isProviderRole = roles?.includes(UserRole.PROVIDER);
    const isAdmin = roles?.includes(UserRole.ADMIN);

    const provider = await this.providerRepository.findByUserId(userId);
    if (!provider && !isAdmin) {
      throw new UnauthorizedError("Provider profile not found");
    }

    if (provider) {
      const isApproved =
        provider.status === ProviderStatus.ACTIVE ||
        (provider.status as string) === "APPROVED";
      if (!isApproved && !isAdmin) {
        throw new UnauthorizedError("Provider is not approved yet");
      }
    }

    let wallet = await this.walletRepository.findByUserAndType(userId, WalletType.PROVIDER);

    if (!wallet) {
      // Auto-initialize approved provider's wallet idempotently
      const result = await this.walletRepository.create({
        userId,
        balance: 0,
        currency: "INR",
        status: WalletStatus.ACTIVE,
        type: WalletType.PROVIDER,
      });
      wallet = result.wallet;
    }

    return wallet;
  }
}
