import { authMiddleware } from "../auth/container";
import { UserRepository } from "../auth/infrastructure/database/repositories/UserRepository";
import { providerRepository } from "../provider/container";
import { BlockWalletUsecase } from "./application/usecases/BlockWalletUsecase";
import { CreateWalletUseCase } from "./application/usecases/CreateWalletUseCase";
import { GetCustomerWalletUseCase } from "./application/usecases/GetCustomerWalletUseCase";
import { GetProviderWalletUseCase } from "./application/usecases/GetProviderWalletUseCase";
import { GetWalletUseCase } from "./application/usecases/GetWalletUseCase";
import { UnblockWalletUsecase } from "./application/usecases/UnblockWalletUsecase";
import { UpdateWalletBalanceUseCase } from "./application/usecases/UpdateWalletBalanceUseCase";
import { CreateWalletTransactionUseCase } from "./application/usecases/CreateWalletTransactionUseCase";
import { GetWalletTransactionByIdUseCase } from "./application/usecases/GetWalletTransactionByIdUseCase";
import { GetWalletTransactionsUseCase } from "./application/usecases/GetWalletTransactionsUseCase";
import { WalletRepositoryImpl } from "./infrastructure/database/repositories/WalletRepositoryImpl";
import { WalletTransactionRepositoryImpl } from "./infrastructure/database/repositories/WalletTransactionRepositoryImpl";
import { BlockWalletController } from "./presentation/controllers/BlockWallet.controller";
import { CreateWalletController } from "./presentation/controllers/CreateWallet.controller";
import { GetCustomerWalletController } from "./presentation/controllers/GetCustomerWallet.controller";
import { GetCustomerWalletTransactionsController } from "./presentation/controllers/GetCustomerWalletTransactions.controller";
import { GetProviderWalletController } from "./presentation/controllers/GetProviderWallet.controller";
import { GetProviderWalletTransactionsController } from "./presentation/controllers/GetProviderWalletTransactions.controller";
import { GetWalletController } from "./presentation/controllers/GetWallet.controller";
import { UnblockWalletController } from "./presentation/controllers/UnblockWallet.Controller";
import { UpdateWalletBalanceController } from "./presentation/controllers/UpdateWalletBalance.controller";
import { CreateWalletTransactionController } from "./presentation/controllers/CreateWalletTransaction.controller";
import { GetWalletTransactionByIdController } from "./presentation/controllers/GetWalletTransactionById.controller";
import { GetWalletTransactionsController } from "./presentation/controllers/GetWalletTransactions.controller";
import { createWalletRoutes } from "./presentation/routes/WalletRoutes";

const walletRepository = new WalletRepositoryImpl();
const walletTransactionRepository = new WalletTransactionRepositoryImpl();
const userRepository = new UserRepository();

const createWalletUsecase = new CreateWalletUseCase(walletRepository, userRepository);
const updateWalletUsecase = new UpdateWalletBalanceUseCase(walletRepository);
const getWalletUsecase = new GetWalletUseCase(walletRepository);
const blockWalletUsecase = new BlockWalletUsecase(walletRepository);
const unblockWalletUsecase = new UnblockWalletUsecase(walletRepository);

const getCustomerWalletUseCase = new GetCustomerWalletUseCase(walletRepository);
const getProviderWalletUseCase = new GetProviderWalletUseCase(walletRepository, providerRepository);

const createWalletTransactionUseCase = new CreateWalletTransactionUseCase(
  walletRepository,
  walletTransactionRepository
);
const getWalletTransactionByIdUseCase = new GetWalletTransactionByIdUseCase(
  walletRepository,
  walletTransactionRepository
);
const getWalletTransactionsUseCase = new GetWalletTransactionsUseCase(
  walletRepository,
  walletTransactionRepository
);

const createWalletController = new CreateWalletController(createWalletUsecase);
const getWalletController = new GetWalletController(getWalletUsecase);
const updateWalletBalanceController = new UpdateWalletBalanceController(updateWalletUsecase);
const blockWalletController = new BlockWalletController(blockWalletUsecase);
const unblockWalletController = new UnblockWalletController(unblockWalletUsecase);

const getCustomerWalletController = new GetCustomerWalletController(getCustomerWalletUseCase);
const getProviderWalletController = new GetProviderWalletController(getProviderWalletUseCase);
const getCustomerWalletTransactionsController = new GetCustomerWalletTransactionsController(
  getWalletTransactionsUseCase
);
const getProviderWalletTransactionsController = new GetProviderWalletTransactionsController(
  getWalletTransactionsUseCase,
  getProviderWalletUseCase
);

const createWalletTransactionController = new CreateWalletTransactionController(
  createWalletTransactionUseCase
);
const getWalletTransactionByIdController = new GetWalletTransactionByIdController(
  getWalletTransactionByIdUseCase
);
const getWalletTransactionsController = new GetWalletTransactionsController(
  getWalletTransactionsUseCase
);

const controllers = {
  createWalletController,
  getWalletController,
  getCustomerWalletController,
  getProviderWalletController,
  getCustomerWalletTransactionsController,
  getProviderWalletTransactionsController,
  updateWalletBalanceController,
  blockWalletController,
  unblockWalletController,
  createWalletTransactionController,
  getWalletTransactionByIdController,
  getWalletTransactionsController,
};

export type WalletControllersType = typeof controllers;

export { walletRepository, walletTransactionRepository, createWalletTransactionUseCase };
export const walletRoutes = createWalletRoutes(controllers, authMiddleware);

