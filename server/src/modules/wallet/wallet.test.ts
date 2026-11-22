import { test, describe } from "node:test";
import assert from "node:assert";
import { WalletStatus, WalletType, Wallet } from "./domain/entities/Wallet";
import {
  WalletTransaction,
  WalletTransactionCategory,
  WalletTransactionReferenceType,
  WalletTransactionStatus,
  WalletTransactionType,
} from "./domain/entities/WalletTransaction";
import { IWalletRepository } from "./domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "./domain/repositories/IWalletTransactionRepository";
import { IUserRepository } from "../auth/domain/repositories/IUserRepository";
import { IProviderRepository } from "../provider/domain/repositories/IProviderRepository";
import { IProviderDocumentRepository } from "../provider/domain/repositories/IProviderDocumentRepository";
import { UserRole } from "../auth/domain/enum/UserRole";
import { User } from "../auth/domain/entities/User";
import { Provider } from "../provider/domain/entities/Provider";
import { ProviderStatus } from "../provider/domain/enums/ProviderStatus";
import { DocumentVerificationStatus } from "../provider/domain/enums/DocumentVerificationStatus";
import { CreateWalletUseCase } from "./application/usecases/CreateWalletUseCase";
import { GetCustomerWalletUseCase } from "./application/usecases/GetCustomerWalletUseCase";
import { GetProviderWalletUseCase } from "./application/usecases/GetProviderWalletUseCase";
import { GetWalletTransactionsUseCase } from "./application/usecases/GetWalletTransactionsUseCase";
import { CreateWalletTransactionUseCase } from "./application/usecases/CreateWalletTransactionUseCase";
import { UpdateProviderStatusUsecase } from "../admin-provider-management/application/usecases/UpdateProviderStatusUsecase";
import { RegisterUserUsecase } from "../auth/application/usecases/RegisterUserUsecase";
import { PaginatedResult } from "../../shared/application/dtos/PaginatedResultDTO";
import { GetWalletTransactionsDto } from "./application/dtos/GetWalletTransactionsDto";

// In-Memory Mocks for Unit Testing
class InMemoryWalletRepository implements IWalletRepository {
  private wallets: Map<string, Wallet> = new Map();
  private idCounter = 1;

  async create(input: Wallet): Promise<{ wallet: Wallet; created: boolean }> {
    for (const w of this.wallets.values()) {
      if (w.userId === input.userId && w.type === input.type) {
        return { wallet: { ...w }, created: false };
      }
    }
    const hex = (this.idCounter++).toString(16).padStart(24, "0");
    const id = hex;
    const newWallet: Wallet = {
      ...input,
      id,
      balance: input.balance ?? 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.wallets.set(id, newWallet);
    return { wallet: { ...newWallet }, created: true };
  }


  async findById(id: string): Promise<Wallet | null> {
    const w = this.wallets.get(id);
    return w ? { ...w } : null;
  }

  async findByUserId(userId: string, type?: WalletType): Promise<Wallet | null> {
    const targetType = type || WalletType.CUSTOMER;
    return this.findByUserAndType(userId, targetType);
  }

  async findByUserAndType(userId: string, type: WalletType): Promise<Wallet | null> {
    for (const w of this.wallets.values()) {
      if (w.userId === userId && w.type === type) {
        return { ...w };
      }
    }
    return null;
  }

  async update(id: string, input: Partial<Wallet>): Promise<Wallet | null> {
    const existing = this.wallets.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...input, updatedAt: new Date() };
    this.wallets.set(id, updated);
    return { ...updated };
  }

  async delete(id: string): Promise<boolean> {
    return this.wallets.delete(id);
  }
}

class InMemoryWalletTransactionRepository implements IWalletTransactionRepository {
  private transactions: WalletTransaction[] = [];
  private idCounter = 1;

  async create(input: WalletTransaction): Promise<WalletTransaction> {
    const id = `tx_${this.idCounter++}`;
    const tx: WalletTransaction = {
      ...input,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.transactions.push(tx);
    return { ...tx };
  }

  async findById(id: string): Promise<WalletTransaction | null> {
    const tx = this.transactions.find((t) => t.id === id);
    return tx ? { ...tx } : null;
  }

  async findByWalletId(walletId: string): Promise<WalletTransaction[]> {
    return this.transactions.filter((t) => t.walletId === walletId);
  }

  async findPaginatedByWalletId(
    options: GetWalletTransactionsDto
  ): Promise<PaginatedResult<WalletTransaction>> {
    let filtered = this.transactions.filter((t) => t.walletId === options.walletId);
    if (options.type) filtered = filtered.filter((t) => t.type === options.type);
    if (options.category) filtered = filtered.filter((t) => t.category === options.category);
    if (options.status) filtered = filtered.filter((t) => t.status === options.status);

    const page = Math.max(1, Number(options.page) || 1);
    const limit = Math.max(1, Number(options.limit) || 10);
    const skip = (page - 1) * limit;

    const items = filtered.slice(skip, skip + limit);
    return {
      items,
      totalItems: filtered.length,
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit) || 1,
    };
  }
}

class InMemoryUserRepository implements Partial<IUserRepository> {
  private users: Map<string, User> = new Map();
  private idCounter = 1;


  async findById(id: string): Promise<User | null> {
    const u = this.users.get(id);
    return u ? { ...u } : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email === email) return { ...u };
    }
    return null;
  }

  async create(user: User): Promise<User> {
    const id = `user_${this.idCounter++}`;
    const newUser = new User(
      id,
      user.name,
      user.email,
      user.role,
      user.status,
      user.isVerified,
      user.phone,
      user.password
    );
    this.users.set(id, newUser);
    return newUser;
  }

  async update(id: string, updateData: any): Promise<User | null> {
    const existing = this.users.get(id);
    if (!existing) return null;
    const updated = new User(
      id,
      updateData.name ?? existing.name,
      updateData.email ?? existing.email,
      updateData.role ?? existing.role,
      updateData.status ?? existing.status,
      updateData.isVerified ?? existing.isVerified,
      updateData.phone ?? existing.phone,
      updateData.password ?? existing.password
    );
    this.users.set(id, updated);
    return updated;
  }

  async findAll(): Promise<PaginatedResult<User>> {
    const items = Array.from(this.users.values());
    return { items, totalItems: items.length, page: 1, limit: items.length || 1, totalPages: 1 };
  }

  async findCount(filter?: any): Promise<number> {
    return this.users.size;
  }
  async delete(id: string): Promise<boolean> {
    return this.users.delete(id);
  }
}

class InMemoryProviderRepository implements Partial<IProviderRepository> {
  private providers: Map<string, Provider> = new Map();
  private idCounter = 1;

  async findById(id: string): Promise<Provider | null> {
    const p = this.providers.get(id);
    return p ? { ...p } : null;
  }

  async findByUserId(userId: string): Promise<Provider | null> {
    for (const p of this.providers.values()) {
      if (p.userId === userId) return { ...p };
    }
    return null;
  }

  async create(provider: Provider): Promise<Provider> {
    const id = `provider_${this.idCounter++}`;
    const newProv = new Provider(
      provider.userId,
      provider.businessName,
      provider.contactPerson,
      provider.phone,
      provider.email,
      provider.serviceCategory,
      provider.location,
      provider.serviceRadius,
      provider.status,
      0,
      0,
      0,
      0,
      id
    );
    this.providers.set(id, newProv);
    return newProv;
  }

  async update(id: string, updateData: any): Promise<Provider | null> {
    const existing = this.providers.get(id);
    if (!existing) return null;
    const updated = new Provider(
      existing.userId,
      existing.businessName,
      existing.contactPerson,
      existing.phone,
      existing.email,
      existing.serviceCategory,
      existing.location,
      existing.serviceRadius,
      updateData.status ?? existing.status,
      existing.experience,
      existing.averageRating,
      existing.totalReview,
      existing.completedJobs,
      id
    );
    this.providers.set(id, updated);
    return updated;
  }
}

class InMemoryDocumentRepository implements Partial<IProviderDocumentRepository> {
  private documents: Map<string, any[]> = new Map();

  async findByProviderId(providerId: string): Promise<any[]> {
    return this.documents.get(providerId) || [];
  }

  setDocuments(providerId: string, docs: any[]) {
    this.documents.set(providerId, docs);
  }
}

describe("AtHand Dual Wallet Module Test Suite", () => {
  // Test 1: Customer Registration & Wallet Creation
  test("1. Customer registration creates a CUSTOMER wallet automatically and idempotently", async () => {
    const walletRepo = new InMemoryWalletRepository();
    const userRepo = new InMemoryUserRepository();

    const passwordService = { hash: async (p: string) => `hashed_${p}` };
    const otpService = { generate: async () => "123456", verify: async () => 1, delete: async () => {} };
    const emailService = { sendOTP: async () => {} };
    const tokenService = { generateRegistrationToken: () => "reg_token" };

    const registerUseCase = new RegisterUserUsecase(
      userRepo as any,
      passwordService as any,
      otpService as any,
      emailService as any,
      tokenService as any,
      walletRepo
    );

    const result = await registerUseCase.execute({
      name: "John Customer",
      email: "john@example.com",
      password: "password123",
      phone: "9876543210",
    });

    assert.strictEqual(result.newRegister, true);

    const user = await userRepo.findByEmail("john@example.com");
    assert.ok(user && user.id);

    // Verify CUSTOMER wallet was automatically created
    const customerWallet = await walletRepo.findByUserAndType(user.id, WalletType.CUSTOMER);
    assert.ok(customerWallet);
    assert.strictEqual(customerWallet.type, WalletType.CUSTOMER);
    assert.strictEqual(customerWallet.balance, 0);
    assert.strictEqual(customerWallet.status, WalletStatus.ACTIVE);

    // Idempotency: retry registration / creation does not duplicate
    const createAgain = await walletRepo.create({
      userId: user.id,
      balance: 100, // Should not overwrite
      currency: "INR",
      status: WalletStatus.ACTIVE,
      type: WalletType.CUSTOMER,
    });

    assert.strictEqual(createAgain.created, false);
    assert.strictEqual(createAgain.wallet.id, customerWallet.id);
    assert.strictEqual(createAgain.wallet.balance, 0); // Balance preserved
  });

  // Test 2: Provider Application & Approval Flow
  test("2. Provider wallet lifecycle: PENDING does not create wallet; approval creates PROVIDER wallet", async () => {
    const walletRepo = new InMemoryWalletRepository();
    const userRepo = new InMemoryUserRepository();
    const providerRepo = new InMemoryProviderRepository();
    const docRepo = new InMemoryDocumentRepository();

    // Create user
    const user = await userRepo.create(
      new User("u_prov", "Pro Dave", "dave@example.com", [UserRole.USER, UserRole.PROVIDER], "ACTIVE", true)
    );

    // Provider registers application in DRAFT/PENDING
    const provider = await (providerRepo as any).create(
      new Provider(
        user.id!,
        "Dave Repairs",
        "Dave",
        "9998887771",
        "dave@example.com",
        "Electronics",
        { address: {} as any, coordinates: { type: "Point", coordinates: [0, 0] } },
        15,
        ProviderStatus.PENDING
      )
    );

    // Verify NO provider wallet exists while pending
    const walletWhilePending = await walletRepo.findByUserAndType(user.id!, WalletType.PROVIDER);
    assert.strictEqual(walletWhilePending, null);

    // Admin tries to approve without documents -> should fail
    const updateStatusUseCase = new UpdateProviderStatusUsecase(
      providerRepo as any,
      docRepo as any,
      walletRepo
    );

    await assert.rejects(
      async () => {
        await updateStatusUseCase.execute({ id: provider.id!, status: ProviderStatus.ACTIVE });
      },
      { message: /Cannot approve provider, No documents uploaded/ }
    );

    // Still no wallet created
    assert.strictEqual(await walletRepo.findByUserAndType(user.id!, WalletType.PROVIDER), null);

    // Add approved documents
    docRepo.setDocuments(provider.id!, [
      { id: "doc_1", verificationStatus: DocumentVerificationStatus.APPROVED },
    ]);

    // Admin approves provider
    const approvedProvider = await updateStatusUseCase.execute({
      id: provider.id!,
      status: ProviderStatus.ACTIVE,
    });
    assert.strictEqual(approvedProvider.status, ProviderStatus.ACTIVE);

    // Verify PROVIDER wallet was automatically created
    const providerWallet = await walletRepo.findByUserAndType(user.id!, WalletType.PROVIDER);
    assert.ok(providerWallet);
    assert.strictEqual(providerWallet.type, WalletType.PROVIDER);
    assert.strictEqual(providerWallet.balance, 0);

    // Approval retries do not duplicate or reset
    await updateStatusUseCase.execute({ id: provider.id!, status: ProviderStatus.ACTIVE });
    const providerWalletAfterRetry = await walletRepo.findByUserAndType(user.id!, WalletType.PROVIDER);
    assert.strictEqual(providerWalletAfterRetry?.id, providerWallet.id);
  });

  // Test 3: Dual-Role User & Strict Wallet Independence
  test("3. Dual-role user owns both wallets simultaneously with independent balances", async () => {
    const walletRepo = new InMemoryWalletRepository();
    const txRepo = new InMemoryWalletTransactionRepository();
    const userRepo = new InMemoryUserRepository();
    const providerRepo = new InMemoryProviderRepository();

    const dualUser = await userRepo.create(
      new User("dual_1", "Dual User", "dual@example.com", [UserRole.USER, UserRole.PROVIDER], "ACTIVE", true)
    );

    // Create both wallets
    const { wallet: custWallet } = await walletRepo.create({
      userId: dualUser.id!,
      balance: 1000,
      currency: "INR",
      status: WalletStatus.ACTIVE,
      type: WalletType.CUSTOMER,
    });

    const { wallet: provWallet } = await walletRepo.create({
      userId: dualUser.id!,
      balance: 5000,
      currency: "INR",
      status: WalletStatus.ACTIVE,
      type: WalletType.PROVIDER,
    });

    assert.notStrictEqual(custWallet.id, provWallet.id);
    assert.strictEqual(custWallet.type, WalletType.CUSTOMER);
    assert.strictEqual(provWallet.type, WalletType.PROVIDER);
    assert.strictEqual(custWallet.balance, 1000);
    assert.strictEqual(provWallet.balance, 5000);

    // Perform transaction on Customer Wallet (e.g. Top-up / Payment)
    const createTxUseCase = new CreateWalletTransactionUseCase(walletRepo, txRepo);

    await createTxUseCase.execute({
      userId: dualUser.id!,
      walletId: custWallet.id!,
      amount: 500,
      type: WalletTransactionType.CREDIT,
      category: WalletTransactionCategory.PAYMENT,
      referenceType: WalletTransactionReferenceType.PAYMENT,
      referenceId: "507f191e810c19729de860ea",
      description: "Customer Top-up",
    });

    // Customer balance increased to 1500; Provider balance remains exactly 5000
    const updatedCustWallet = await walletRepo.findById(custWallet.id!);
    const updatedProvWallet = await walletRepo.findById(provWallet.id!);
    assert.strictEqual(updatedCustWallet?.balance, 1500);
    assert.strictEqual(updatedProvWallet?.balance, 5000);

    // Perform transaction on Provider Wallet (e.g. Service Earning)
    await createTxUseCase.execute({
      userId: dualUser.id!,
      walletId: provWallet.id!,
      amount: 2500,
      type: WalletTransactionType.CREDIT,
      category: WalletTransactionCategory.EARNING,
      referenceType: WalletTransactionReferenceType.ORDER,
      referenceId: "507f191e810c19729de860eb",
      description: "Repair Service Fee Earning",
    });

    const finalCustWallet = await walletRepo.findById(custWallet.id!);
    const finalProvWallet = await walletRepo.findById(provWallet.id!);
    assert.strictEqual(finalCustWallet?.balance, 1500);
    assert.strictEqual(finalProvWallet?.balance, 7500);
  });

  // Test 4: Complete Transaction Isolation
  test("4. Transaction isolation: Customer transactions never appear in provider history, and vice versa", async () => {
    const walletRepo = new InMemoryWalletRepository();
    const txRepo = new InMemoryWalletTransactionRepository();
    const userRepo = new InMemoryUserRepository();
    const providerRepo = new InMemoryProviderRepository();

    const dualUser = await userRepo.create(
      new User("dual_2", "Dual Jane", "jane@example.com", [UserRole.USER, UserRole.PROVIDER], "ACTIVE", true)
    );

    const { wallet: custWallet } = await walletRepo.create({
      userId: dualUser.id!,
      balance: 0,
      currency: "INR",
      status: WalletStatus.ACTIVE,
      type: WalletType.CUSTOMER,
    });

    const { wallet: provWallet } = await walletRepo.create({
      userId: dualUser.id!,
      balance: 0,
      currency: "INR",
      status: WalletStatus.ACTIVE,
      type: WalletType.PROVIDER,
    });

    // Customer transaction
    await txRepo.create({
      walletId: custWallet.id!,
      amount: 200,
      balanceAfter: 200,
      type: WalletTransactionType.CREDIT,
      category: WalletTransactionCategory.PAYMENT,
      referenceType: WalletTransactionReferenceType.PAYMENT,
      referenceId: "ref_cust_1",
      description: "Personal Customer Recharge",
      status: WalletTransactionStatus.COMPLETED,
    });

    // Provider transaction
    await txRepo.create({
      walletId: provWallet.id!,
      amount: 1200,
      balanceAfter: 1200,
      type: WalletTransactionType.CREDIT,
      category: WalletTransactionCategory.EARNING,
      referenceType: WalletTransactionReferenceType.ORDER,
      referenceId: "ref_prov_1",
      description: "Provider Order Job Payment",
      status: WalletTransactionStatus.COMPLETED,
    });

    const getTxUseCase = new GetWalletTransactionsUseCase(walletRepo, txRepo);

    // Fetch Customer Transactions
    const custTxs = await getTxUseCase.execute({
      userId: dualUser.id!,
      walletType: WalletType.CUSTOMER,
      roles: [UserRole.USER, UserRole.PROVIDER],
    });

    assert.strictEqual(custTxs.totalItems, 1);
    assert.strictEqual(custTxs.items[0].description, "Personal Customer Recharge");
    assert.strictEqual(custTxs.items[0].walletId, custWallet.id);

    // Fetch Provider Transactions
    const provTxs = await getTxUseCase.execute({
      userId: dualUser.id!,
      walletType: WalletType.PROVIDER,
      roles: [UserRole.USER, UserRole.PROVIDER],
    });

    assert.strictEqual(provTxs.totalItems, 1);
    assert.strictEqual(provTxs.items[0].description, "Provider Order Job Payment");
    assert.strictEqual(provTxs.items[0].walletId, provWallet.id);
  });

  // Test 5: Authorization & Security Checks
  test("5. Authorization: Non-approved users cannot access provider wallet; cross-user tampering is rejected", async () => {
    const walletRepo = new InMemoryWalletRepository();
    const providerRepo = new InMemoryProviderRepository();

    // User A: pure customer (not provider)
    const getProviderWalletUseCase = new GetProviderWalletUseCase(walletRepo, providerRepo as any);

    await assert.rejects(
      async () => {
        await getProviderWalletUseCase.execute({
          userId: "customer_only_user",
          roles: [UserRole.USER],
        });
      },
      { message: /Provider profile not found/ }
    );

    // Provider created but BLOCKED
    await (providerRepo as any).create(
      new Provider(
        "blocked_prov_user",
        "Blocked Tech",
        "Bob",
        "9876543211",
        "bob@example.com",
        "Plumbing",
        { address: {} as any, coordinates: { type: "Point", coordinates: [0, 0] } },
        10,
        ProviderStatus.BLOCKED
      )
    );

    await assert.rejects(
      async () => {
        await getProviderWalletUseCase.execute({
          userId: "blocked_prov_user",
          roles: [UserRole.USER, UserRole.PROVIDER],
        });
      },
      { message: /Provider is not approved yet/ }
    );
  });
});
