import { CreateWalletDto } from "../dtos/CreateWalletDto";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { IUserRepository } from "../../../auth/domain/repositories/IUserRepository";
import { NotFoundError } from "../../../../shared/errors/NotFoundError";
import { UserStatus } from "../../../auth/domain/enum/UserStatus";
import { BadRequestError } from "../../../../shared/errors/BadRequestError";
import { Wallet, WalletStatus, WalletType } from "../../domain/entities/Wallet";
import { ConflictError } from "../../../../shared/errors/ConflictError";

export class CreateWalletUseCase {
  constructor(
    private readonly repository: IWalletRepository,
    private readonly userRepository: IUserRepository
  ) { }

  async execute(input: CreateWalletDto) {
    const user = await this.userRepository.findById(input.userId);

    if (!user) throw new NotFoundError("User not found");
    
    if (user.status === UserStatus.BLOCKED) throw new BadRequestError("Unauthorized user");
    
    const targetType = input.type || WalletType.CUSTOMER;
    const newWallet: Wallet = {
      userId: input.userId,
      balance: 0,
      currency: "INR",
      status: WalletStatus.ACTIVE,
      type: targetType,
    };
    
    const { wallet, created } = await this.repository.create(newWallet);
    
    if (!created) throw new ConflictError("Wallet already exists");
    
    return wallet;
  }
}


