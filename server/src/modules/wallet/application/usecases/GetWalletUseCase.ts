import { IWalletRepository } from "../../domain/repositories/IWalletRepository";

export class GetWalletUseCase {
  constructor(private readonly repository: IWalletRepository) {}

  async execute(id: string) {
    
    return this.repository.findById(id);
  }
}

