import { describe, test } from "node:test";
import assert from "node:assert";
import { DistributeOrderPaymentUseCase } from "./application/usecases/DistributeOrderPaymentUseCase";
import { PayOrderWithWalletUseCase } from "./application/usecases/PayOrderWithWalletUseCase";
import { PlatformCommissionLedger, PlatformCommissionStatus } from "./domain/entities/PlatformCommissionLedger";
import {
    CommissionLedgerFilter,
    ICommissionLedgerRepository,
    PaginatedCommissionLedgerResult,
    PlatformFinancialSummary,
} from "./domain/interfaces/ICommissionLedgerRepository";
import { IPaymentRepository } from "./domain/interfaces/IPaymentRepository";
import { Payment } from "./domain/entities/Payment";
import { PaymentStatus } from "./domain/enums/PaymentStatus";
import { PaymentPurpose } from "./domain/enums/PaymentPurpose";
import { CommissionCalculator } from "./domain/services/CommissionCalculator";
import { OrderCommissionResolver } from "./domain/services/OrderCommissionResolver";
import { Wallet, WalletStatus, WalletType } from "../wallet/domain/entities/Wallet";
import {
    WalletTransaction,
    WalletTransactionCategory,
    WalletTransactionReferenceType,
    WalletTransactionStatus,
    WalletTransactionType,
} from "../wallet/domain/entities/WalletTransaction";
import { IWalletRepository } from "../wallet/domain/repositories/IWalletRepository";
import { IWalletTransactionRepository } from "../wallet/domain/repositories/IWalletTransactionRepository";
import { OrderStatus } from "../order/domain/enums/OrderStatus";
import { ServiceMode } from "../../shared/enums/ServiceMode";

// In-Memory Ledger Repository for Tests
class InMemoryCommissionLedgerRepository implements ICommissionLedgerRepository {
    private ledgers: Map<string, PlatformCommissionLedger> = new Map();
    private currentId = 1;

    async create(data: Omit<PlatformCommissionLedger, "id">): Promise<PlatformCommissionLedger> {
        // Enforce uniqueness of orderId
        for (const record of this.ledgers.values()) {
            if (record.orderId === data.orderId) {
                const err: any = new Error("E11000 duplicate key error");
                err.code = 11000;
                throw err;
            }
        }

        const id = `ledger_${this.currentId++}`;
        const record: PlatformCommissionLedger = {
            id,
            ...data,
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        this.ledgers.set(id, record);
        return record;
    }

    async findById(id: string): Promise<PlatformCommissionLedger | null> {
        return this.ledgers.get(id) || null;
    }

    async findByOrderId(orderId: string): Promise<PlatformCommissionLedger | null> {
        for (const record of this.ledgers.values()) {
            if (record.orderId === orderId) return record;
        }
        return null;
    }

    async findByPaymentId(paymentId: string): Promise<PlatformCommissionLedger | null> {
        for (const record of this.ledgers.values()) {
            if (record.paymentId === paymentId) return record;
        }
        return null;
    }

    async update(id: string, data: Partial<PlatformCommissionLedger>): Promise<PlatformCommissionLedger | null> {
        const existing = this.ledgers.get(id);
        if (!existing) return null;
        const updated = { ...existing, ...data, updatedAt: new Date() };
        this.ledgers.set(id, updated);
        return updated;
    }

    async findAll(_filter: CommissionLedgerFilter): Promise<PaginatedCommissionLedgerResult> {
        const items = Array.from(this.ledgers.values());
        return { items, total: items.length, page: 1, totalPages: 1 };
    }

    async getFinancialSummary(_startDate?: Date, _endDate?: Date): Promise<PlatformFinancialSummary> {
        let gross = 0;
        let comm = 0;
        let prov = 0;
        let ref = 0;
        let parts = 0;
        let labour = 0;
        let partsComm = 0;
        let labourComm = 0;

        for (const l of this.ledgers.values()) {
            gross += l.grossAmount;
            comm += l.commissionAmount;
            prov += l.providerEarnings;
            ref += l.refundedAmount || 0;
            parts += l.partsAmount || 0;
            labour += l.labourAmount || 0;
            partsComm += l.partsCommissionAmount || 0;
            labourComm += l.labourCommissionAmount || 0;
        }
        return {
            totalGrossAmount: Math.round(gross * 100) / 100,
            totalCommissionAmount: Math.round(comm * 100) / 100,
            totalProviderEarnings: Math.round(prov * 100) / 100,
            totalRefundedAmount: Math.round(ref * 100) / 100,
            totalPartsAmount: Math.round(parts * 100) / 100,
            totalLabourAmount: Math.round(labour * 100) / 100,
            totalPartsCommissionAmount: Math.round(partsComm * 100) / 100,
            totalLabourCommissionAmount: Math.round(labourComm * 100) / 100,
            totalAllocations: this.ledgers.size,
        };
    }
}

// In-Memory Wallet Repository for Tests
class InMemoryWalletRepository implements IWalletRepository {
    private wallets: Map<string, Wallet> = new Map();
    private currentId = 1;

    async create(input: Wallet): Promise<{ wallet: Wallet; created: boolean }> {
        for (const w of this.wallets.values()) {
            if (w.userId === input.userId && w.type === input.type) {
                return { wallet: w, created: false };
            }
        }
        const id = `wallet_${this.currentId++}`;
        const wallet: Wallet = { id, ...input };
        this.wallets.set(id, wallet);
        return { wallet, created: true };
    }

    async findById(id: string): Promise<Wallet | null> {
        return this.wallets.get(id) || null;
    }

    async findByUserId(userId: string, type?: WalletType): Promise<Wallet | null> {
        for (const w of this.wallets.values()) {
            if (w.userId === userId && (!type || w.type === type)) return w;
        }
        return null;
    }

    async findByUserAndType(userId: string, type: WalletType): Promise<Wallet | null> {
        for (const w of this.wallets.values()) {
            if (w.userId === userId && w.type === type) return w;
        }
        return null;
    }

    async update(id: string, input: Partial<Wallet>): Promise<Wallet | null> {
        const existing = this.wallets.get(id);
        if (!existing) return null;
        const updated = { ...existing, ...input };
        this.wallets.set(id, updated);
        return updated;
    }

    async delete(id: string): Promise<boolean> {
        return this.wallets.delete(id);
    }
}

// In-Memory Wallet Transaction Repository
class InMemoryWalletTxRepository implements IWalletTransactionRepository {
    public txs: WalletTransaction[] = [];
    private currentId = 1;

    async create(transaction: WalletTransaction): Promise<WalletTransaction> {
        const id = `tx_${this.currentId++}`;
        const record = { id, ...transaction, createdAt: new Date().toISOString() };
        this.txs.push(record);
        return record;
    }

    async findById(id: string): Promise<WalletTransaction | null> {
        return this.txs.find((t) => t.id === id) || null;
    }

    async findByWalletId(walletId: string): Promise<WalletTransaction[]> {
        return this.txs.filter((t) => t.walletId === walletId);
    }

    async findPaginatedByWalletId(options: any): Promise<any> {
        const filtered = this.txs.filter((t) => t.walletId === options.walletId);
        return { items: filtered, total: filtered.length, page: 1, limit: 10, totalPages: 1 };
    }
}

// In-Memory Payment Repository
class InMemoryPaymentRepo implements IPaymentRepository {
    public payments: Map<string, Payment> = new Map();
    private currentId = 1;

    async create(data: Omit<Payment, "id" | "createdAt" | "updatedAt">): Promise<Payment> {
        const id = `pay_${this.currentId++}`;
        const record: Payment = { id, ...data, createdAt: new Date(), updatedAt: new Date() };
        this.payments.set(id, record);
        return record;
    }

    async findById(id: string): Promise<Payment | null> {
        return this.payments.get(id) || null;
    }

    async findByRazorpayOrderId(orderId: string): Promise<Payment | null> {
        for (const p of this.payments.values()) {
            if (p.razorpayOrderId === orderId) return p;
        }
        return null;
    }

    async findByRazorpayPaymentId(paymentId: string): Promise<Payment | null> {
        for (const p of this.payments.values()) {
            if (p.razorpayPaymentId === paymentId) return p;
        }
        return null;
    }

    async findByReferenceId(referenceId: string): Promise<Payment[]> {
        return Array.from(this.payments.values()).filter((p) => p.referenceId === referenceId);
    }

    async findByUserId(userId: string): Promise<Payment[]> {
        return Array.from(this.payments.values()).filter((p) => p.userId === userId);
    }

    async update(id: string, payment: Partial<Payment>): Promise<Payment | null> {
        const existing = this.payments.get(id);
        if (!existing) return null;
        const updated = { ...existing, ...payment, updatedAt: new Date() };
        this.payments.set(id, updated);
        return updated;
    }
}

describe("AtHand Revised Category-Based Commission Model Test Suite", () => {
    const provUserId = "prov_user_suite";
    const provId = "prov_entity_suite";
    const catId = "cat_test_suite";
    const custUserId = "cust_user_suite";

    const createBasicProviderRepo = () =>
        ({
            findById: async () => ({
                id: provId,
                userId: provUserId,
                serviceCategory: catId,
            }),
        } as any);

    const createBasicCategoryRepo = (commissionPercentage: number = 12) =>
        ({
            findById: async () => ({
                id: catId,
                name: "Auto & Device Repair",
                commissionPercentage,
            }),
        } as any);

    const createBasicServiceRequestRepo = () =>
        ({
            findById: async () => ({
                id: "req_suite",
                categoryId: catId,
            }),
        } as any);

    test("1. Standard Commission Model: 12% category (Labour: ₹1,000, Parts: ₹2,000 -> Total: ₹3,000)", async () => {
        // Labour: 12% on ₹1,000 = ₹120
        // Parts: 6% on ₹2,000 = ₹120
        // Total commission: ₹240
        // Provider earning: ₹2,760
        const calc = CommissionCalculator.calculate({
            partsAmount: 2000,
            labourAmount: 1000,
            categoryCommissionPercentage: 12,
        });

        assert.strictEqual(calc.categoryCommissionPercentage, 12);
        assert.strictEqual(calc.partsCommissionPercentage, 6);
        assert.strictEqual(calc.labourCommissionPercentage, 12);

        assert.strictEqual(calc.partsCommissionAmount, 120);
        assert.strictEqual(calc.labourCommissionAmount, 120);
        assert.strictEqual(calc.totalCommissionAmount, 240);
        assert.strictEqual(calc.platformEarning, 240);
        assert.strictEqual(calc.totalAmount, 3000);
        assert.strictEqual(calc.providerEarning, 2760);

        // Verify end-to-end distribution use case
        const ledgerRepo = new InMemoryCommissionLedgerRepository();
        const walletRepo = new InMemoryWalletRepository();
        const txRepo = new InMemoryWalletTxRepository();
        const paymentRepo = new InMemoryPaymentRepo();

        await walletRepo.create({
            userId: provUserId,
            type: WalletType.PROVIDER,
            balance: 0,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        const orderRepo = {
            findById: async () => ({
                id: "order_std_1",
                orderNumber: "REP-STD-01",
                customerId: custUserId,
                providerId: provId,
                requestId: "req_suite",
                repairEstimate: {
                    partsCost: 2000,
                    laborCost: 1000,
                    totalAmount: 3000,
                    status: "APPROVED",
                },
                finalAmount: 3000,
                status: OrderStatus.WAITING_FOR_PAYMENT,
            }),
        } as any;

        const usecase = new DistributeOrderPaymentUseCase(
            ledgerRepo,
            orderRepo,
            walletRepo,
            txRepo,
            createBasicServiceRequestRepo(),
            createBasicCategoryRepo(12),
            createBasicProviderRepo(),
            undefined,
            paymentRepo
        );

        const res = await usecase.execute({
            orderId: "order_std_1",
            paymentMethod: "RAZORPAY_CARD",
        });

        assert.strictEqual(res.commissionAmount, 240);
        assert.strictEqual(res.providerEarnings, 2760);
        assert.strictEqual(res.alreadyDistributed, false);

        // Verify provider wallet received ONLY net earnings (₹2,760, NOT ₹3,000)
        const provWallet = await walletRepo.findByUserAndType(provUserId, WalletType.PROVIDER);
        assert.strictEqual(provWallet?.balance, 2760);

        // Verify wallet transaction
        const tx = txRepo.txs[0];
        assert.strictEqual(tx.type, WalletTransactionType.CREDIT);
        assert.strictEqual(tx.category, WalletTransactionCategory.EARNING);
        assert.strictEqual(tx.amount, 2760);
        assert.strictEqual(tx.balanceAfter, 2760);

        // Verify ledger record
        const ledger = await ledgerRepo.findByOrderId("order_std_1");
        assert.ok(ledger);
        assert.strictEqual(ledger.grossAmount, 3000);
        assert.strictEqual(ledger.commissionPercentage, 12);
        assert.strictEqual(ledger.partsCommissionPercentage, 6);
        assert.strictEqual(ledger.labourCommissionPercentage, 12);
        assert.strictEqual(ledger.partsAmount, 2000);
        assert.strictEqual(ledger.labourAmount, 1000);
        assert.strictEqual(ledger.partsCommissionAmount, 120);
        assert.strictEqual(ledger.labourCommissionAmount, 120);
        assert.strictEqual(ledger.commissionAmount, 240);
        assert.strictEqual(ledger.providerEarnings, 2760);
    });

    test("2. Parts-Only Amount: Category: 12%, Parts: ₹2,000, Labour: ₹0", async () => {
        // Expected commission: 6% of 2000 = ₹120
        // Expected provider earning: ₹1,880
        const calc = CommissionCalculator.calculate({
            partsAmount: 2000,
            labourAmount: 0,
            categoryCommissionPercentage: 12,
        });

        assert.strictEqual(calc.partsCommissionAmount, 120);
        assert.strictEqual(calc.labourCommissionAmount, 0);
        assert.strictEqual(calc.totalCommissionAmount, 120);
        assert.strictEqual(calc.providerEarning, 1880);
        assert.strictEqual(calc.totalAmount, 2000);

        const ledgerRepo = new InMemoryCommissionLedgerRepository();
        const walletRepo = new InMemoryWalletRepository();
        const txRepo = new InMemoryWalletTxRepository();

        await walletRepo.create({
            userId: provUserId,
            type: WalletType.PROVIDER,
            balance: 100,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        const orderRepo = {
            findById: async () => ({
                id: "order_parts_only",
                orderNumber: "REP-PARTS-01",
                customerId: custUserId,
                providerId: provId,
                requestId: "req_suite",
                repairEstimate: {
                    partsCost: 2000,
                    laborCost: 0,
                    totalAmount: 2000,
                    status: "APPROVED",
                },
                finalAmount: 2000,
                status: OrderStatus.WAITING_FOR_PAYMENT,
            }),
        } as any;

        const usecase = new DistributeOrderPaymentUseCase(
            ledgerRepo,
            orderRepo,
            walletRepo,
            txRepo,
            createBasicServiceRequestRepo(),
            createBasicCategoryRepo(12),
            createBasicProviderRepo()
        );

        const res = await usecase.execute({
            orderId: "order_parts_only",
            paymentMethod: "RAZORPAY_UPI",
        });

        assert.strictEqual(res.commissionAmount, 120);
        assert.strictEqual(res.providerEarnings, 1880);

        const provWallet = await walletRepo.findByUserAndType(provUserId, WalletType.PROVIDER);
        assert.strictEqual(provWallet?.balance, 1980); // 100 + 1880
    });

    test("3. Labour-Only Amount: Category: 12%, Parts: ₹0, Labour: ₹1,000", async () => {
        // Expected commission: 12% of 1000 = ₹120
        // Expected provider earning: ₹880
        const calc = CommissionCalculator.calculate({
            partsAmount: 0,
            labourAmount: 1000,
            categoryCommissionPercentage: 12,
        });

        assert.strictEqual(calc.partsCommissionAmount, 0);
        assert.strictEqual(calc.labourCommissionAmount, 120);
        assert.strictEqual(calc.totalCommissionAmount, 120);
        assert.strictEqual(calc.providerEarning, 880);
        assert.strictEqual(calc.totalAmount, 1000);

        const ledgerRepo = new InMemoryCommissionLedgerRepository();
        const walletRepo = new InMemoryWalletRepository();
        const txRepo = new InMemoryWalletTxRepository();

        await walletRepo.create({
            userId: provUserId,
            type: WalletType.PROVIDER,
            balance: 0,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        const orderRepo = {
            findById: async () => ({
                id: "order_labour_only",
                orderNumber: "REP-LAB-01",
                customerId: custUserId,
                providerId: provId,
                requestId: "req_suite",
                repairEstimate: {
                    partsCost: 0,
                    laborCost: 1000,
                    totalAmount: 1000,
                    status: "APPROVED",
                },
                finalAmount: 1000,
                status: OrderStatus.WAITING_FOR_PAYMENT,
            }),
        } as any;

        const usecase = new DistributeOrderPaymentUseCase(
            ledgerRepo,
            orderRepo,
            walletRepo,
            txRepo,
            createBasicServiceRequestRepo(),
            createBasicCategoryRepo(12),
            createBasicProviderRepo()
        );

        const res = await usecase.execute({
            orderId: "order_labour_only",
            paymentMethod: "ONLINE",
        });

        assert.strictEqual(res.commissionAmount, 120);
        assert.strictEqual(res.providerEarnings, 880);

        const provWallet = await walletRepo.findByUserAndType(provUserId, WalletType.PROVIDER);
        assert.strictEqual(provWallet?.balance, 880);
    });

    test("4. Different Category Percentage: Category 16% (Parts: ₹2,000, Labour: ₹1,000)", async () => {
        // Labour: 16% of 1000 = ₹160
        // Parts: 8% of 2000 = ₹160
        // Total commission: ₹320
        // Expected provider earning: ₹2,680
        const calc = CommissionCalculator.calculate({
            partsAmount: 2000,
            labourAmount: 1000,
            categoryCommissionPercentage: 16,
        });

        assert.strictEqual(calc.categoryCommissionPercentage, 16);
        assert.strictEqual(calc.partsCommissionPercentage, 8);
        assert.strictEqual(calc.labourCommissionPercentage, 16);

        assert.strictEqual(calc.partsCommissionAmount, 160);
        assert.strictEqual(calc.labourCommissionAmount, 160);
        assert.strictEqual(calc.totalCommissionAmount, 320);
        assert.strictEqual(calc.providerEarning, 2680);
        assert.strictEqual(calc.totalAmount, 3000);
    });

    test("5. Provider Manipulation Scenario: Verification of formula when provider alters breakdown", async () => {
        // Original: Parts ₹2,000, Labour ₹1,000 -> Total commission ₹240
        const orig = CommissionCalculator.calculate({
            partsAmount: 2000,
            labourAmount: 1000,
            categoryCommissionPercentage: 12,
        });
        assert.strictEqual(orig.totalCommissionAmount, 240);
        assert.strictEqual(orig.providerEarning, 2760);

        // Modified by provider: Parts ₹2,500, Labour ₹500
        // Parts commission: 6% of 2500 = ₹150
        // Labour commission: 12% of 500 = ₹60
        // Total commission: ₹210
        // Provider earning: ₹2,790
        const mod = CommissionCalculator.calculate({
            partsAmount: 2500,
            labourAmount: 500,
            categoryCommissionPercentage: 12,
        });
        assert.strictEqual(mod.partsCommissionAmount, 150);
        assert.strictEqual(mod.labourCommissionAmount, 60);
        assert.strictEqual(mod.totalCommissionAmount, 210);
        assert.strictEqual(mod.providerEarning, 2790);
        assert.strictEqual(mod.totalAmount, 3000);
    });

    test("6. Idempotency: Processing same payment multiple times does not duplicate earnings or double-credit", async () => {
        const ledgerRepo = new InMemoryCommissionLedgerRepository();
        const walletRepo = new InMemoryWalletRepository();
        const txRepo = new InMemoryWalletTxRepository();

        await walletRepo.create({
            userId: provUserId,
            type: WalletType.PROVIDER,
            balance: 500,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        const orderRepo = {
            findById: async () => ({
                id: "order_idemp_check",
                orderNumber: "REP-IDEMP-01",
                customerId: custUserId,
                providerId: provId,
                requestId: "req_suite",
                repairEstimate: {
                    partsCost: 2000,
                    laborCost: 1000,
                    totalAmount: 3000,
                    status: "APPROVED",
                },
                finalAmount: 3000,
                status: OrderStatus.WAITING_FOR_PAYMENT,
            }),
        } as any;

        const usecase = new DistributeOrderPaymentUseCase(
            ledgerRepo,
            orderRepo,
            walletRepo,
            txRepo,
            createBasicServiceRequestRepo(),
            createBasicCategoryRepo(12),
            createBasicProviderRepo()
        );

        // First delivery (e.g. Razorpay payment verify)
        const first = await usecase.execute({
            orderId: "order_idemp_check",
            paymentMethod: "RAZORPAY_UPI",
        });
        assert.strictEqual(first.alreadyDistributed, false);
        assert.strictEqual(first.providerEarnings, 2760);
        assert.strictEqual(first.commissionAmount, 240);

        let wallet = await walletRepo.findByUserAndType(provUserId, WalletType.PROVIDER);
        assert.strictEqual(wallet?.balance, 3260); // 500 + 2760
        assert.strictEqual(txRepo.txs.length, 1);

        // Second delivery (e.g. Webhook delivery of payment.captured)
        const second = await usecase.execute({
            orderId: "order_idemp_check",
            paymentMethod: "RAZORPAY_UPI",
        });
        assert.strictEqual(second.alreadyDistributed, true);
        assert.strictEqual(second.providerEarnings, 2760);
        assert.strictEqual(second.commissionAmount, 240);

        // Provider wallet and transactions must remain strictly untouched
        wallet = await walletRepo.findByUserAndType(provUserId, WalletType.PROVIDER);
        assert.strictEqual(wallet?.balance, 3260);
        assert.strictEqual(txRepo.txs.length, 1);
    });

    test("7. Customer Wallet Payment: Full debit from customer, net credit to provider, separate platform earning", async () => {
        const ledgerRepo = new InMemoryCommissionLedgerRepository();
        const walletRepo = new InMemoryWalletRepository();
        const txRepo = new InMemoryWalletTxRepository();
        const paymentRepo = new InMemoryPaymentRepo();

        // Customer wallet seeded with ₹5,000
        const custWallet = await walletRepo.create({
            userId: custUserId,
            type: WalletType.CUSTOMER,
            balance: 5000,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        // Provider wallet seeded with ₹0
        await walletRepo.create({
            userId: provUserId,
            type: WalletType.PROVIDER,
            balance: 0,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        const orderData = {
            id: "order_wallet_full",
            orderNumber: "REP-W-100",
            customerId: custUserId,
            providerId: provId,
            requestId: "req_suite",
            repairEstimate: {
                partsCost: 2000,
                laborCost: 1000,
                totalAmount: 3000,
                status: "APPROVED",
            },
            finalAmount: 3000,
            status: OrderStatus.WAITING_FOR_PAYMENT,
        };

        const orderRepo = {
            findById: async () => orderData,
        } as any;

        let orderStatusUpdated = false;
        const processOrderMock = {
            execute: async () => {
                orderStatusUpdated = true;
                return {};
            },
        } as any;

        const distributeUseCase = new DistributeOrderPaymentUseCase(
            ledgerRepo,
            orderRepo,
            walletRepo,
            txRepo,
            createBasicServiceRequestRepo(),
            createBasicCategoryRepo(12),
            createBasicProviderRepo(),
            undefined,
            paymentRepo
        );

        const payWithWalletUseCase = new PayOrderWithWalletUseCase(
            orderRepo,
            walletRepo,
            txRepo,
            paymentRepo,
            distributeUseCase,
            processOrderMock,
            createBasicCategoryRepo(12),
            createBasicServiceRequestRepo(),
            createBasicProviderRepo()
        );

        const result = await payWithWalletUseCase.execute({
            orderId: "order_wallet_full",
            userId: custUserId,
        });

        assert.strictEqual(result.success, true);
        assert.strictEqual(result.amountPaid, 3000); // Full estimate debited
        assert.strictEqual(result.customerBalanceAfter, 2000); // 5000 - 3000
        assert.strictEqual(result.providerEarnings, 2760); // Provider net earning
        assert.strictEqual(result.commissionAmount, 240); // Platform take
        assert.strictEqual(orderStatusUpdated, true);

        // Verify Customer wallet
        const updatedCustWallet = await walletRepo.findByUserAndType(custUserId, WalletType.CUSTOMER);
        assert.strictEqual(updatedCustWallet?.balance, 2000);

        // Verify Provider wallet
        const updatedProvWallet = await walletRepo.findByUserAndType(provUserId, WalletType.PROVIDER);
        assert.strictEqual(updatedProvWallet?.balance, 2760);

        // Verify transactions: exactly 1 customer debit and 1 provider credit
        assert.strictEqual(txRepo.txs.length, 2);
        const custDebit = txRepo.txs.find((t) => t.walletId === custWallet.wallet.id);
        assert.strictEqual(custDebit?.type, WalletTransactionType.DEBIT);
        assert.strictEqual(custDebit?.amount, 3000);
        assert.strictEqual(custDebit?.balanceAfter, 2000);

        const provCredit = txRepo.txs.find((t) => t.type === WalletTransactionType.CREDIT);
        assert.strictEqual(provCredit?.category, WalletTransactionCategory.EARNING);
        assert.strictEqual(provCredit?.amount, 2760);
        assert.strictEqual(provCredit?.balanceAfter, 2760);

        // Verify Platform Commission Ledger
        const ledger = await ledgerRepo.findByOrderId("order_wallet_full");
        assert.ok(ledger);
        assert.strictEqual(ledger.grossAmount, 3000);
        assert.strictEqual(ledger.commissionPercentage, 12);
        assert.strictEqual(ledger.partsCommissionPercentage, 6);
        assert.strictEqual(ledger.labourCommissionPercentage, 12);
        assert.strictEqual(ledger.partsCommissionAmount, 120);
        assert.strictEqual(ledger.labourCommissionAmount, 120);
        assert.strictEqual(ledger.commissionAmount, 240);
        assert.strictEqual(ledger.providerEarnings, 2760);
    });

    test("8. Historical Commission: Admin changing category commission later does not alter historical record", async () => {
        const ledgerRepo = new InMemoryCommissionLedgerRepository();
        const walletRepo = new InMemoryWalletRepository();
        const txRepo = new InMemoryWalletTxRepository();
        const paymentRepo = new InMemoryPaymentRepo();

        let dynamicCategoryPercentage = 12;

        await walletRepo.create({
            userId: provUserId,
            type: WalletType.PROVIDER,
            balance: 0,
            status: WalletStatus.ACTIVE,
            currency: "INR",
        });

        const orderRepo = {
            findById: async () => ({
                id: "order_hist_1",
                orderNumber: "REP-HIST-01",
                customerId: custUserId,
                providerId: provId,
                requestId: "req_suite",
                repairEstimate: {
                    partsCost: 2000,
                    laborCost: 1000,
                    totalAmount: 3000,
                    status: "APPROVED",
                },
                finalAmount: 3000,
                status: OrderStatus.WAITING_FOR_PAYMENT,
            }),
        } as any;

        const categoryRepo = {
            findById: async () => ({
                id: catId,
                name: "Electronics",
                commissionPercentage: dynamicCategoryPercentage,
            }),
        } as any;

        const usecase = new DistributeOrderPaymentUseCase(
            ledgerRepo,
            orderRepo,
            walletRepo,
            txRepo,
            createBasicServiceRequestRepo(),
            categoryRepo,
            createBasicProviderRepo(),
            undefined,
            paymentRepo
        );

        // Settle transaction under 12% category commission
        await usecase.execute({
            orderId: "order_hist_1",
            paymentMethod: "ONLINE",
        });

        // Later, Admin updates category commission to 25%
        dynamicCategoryPercentage = 25;

        // Verify historical record preserves original 12% calculation
        const historical = await ledgerRepo.findByOrderId("order_hist_1");
        assert.ok(historical);
        assert.strictEqual(historical.commissionPercentage, 12);
        assert.strictEqual(historical.partsCommissionPercentage, 6);
        assert.strictEqual(historical.labourCommissionPercentage, 12);
        assert.strictEqual(historical.partsCommissionAmount, 120);
        assert.strictEqual(historical.labourCommissionAmount, 120);
        assert.strictEqual(historical.commissionAmount, 240);
        assert.strictEqual(historical.providerEarnings, 2760);

        // Calling distribution again (e.g. idempotent retry) retains original numbers
        const retry = await usecase.execute({
            orderId: "order_hist_1",
            paymentMethod: "ONLINE",
        });
        assert.strictEqual(retry.alreadyDistributed, true);
        assert.strictEqual(retry.providerEarnings, 2760);
        assert.strictEqual(retry.commissionAmount, 240);
    });

    test("9. Edge Case & Validation: Negative amounts, invalid rates, and missing breakdown rejection", async () => {
        // Negative parts amount
        assert.throws(
            () => {
                CommissionCalculator.calculate({
                    partsAmount: -100,
                    labourAmount: 500,
                    categoryCommissionPercentage: 12,
                });
            },
            { message: "Parts amount must be a non-negative number" }
        );

        // Negative labour amount
        assert.throws(
            () => {
                CommissionCalculator.calculate({
                    partsAmount: 500,
                    labourAmount: -50,
                    categoryCommissionPercentage: 12,
                });
            },
            { message: "Labour amount must be a non-negative number" }
        );

        // Invalid commission percentage (> 100)
        assert.throws(
            () => {
                CommissionCalculator.calculate({
                    partsAmount: 500,
                    labourAmount: 500,
                    categoryCommissionPercentage: 105,
                });
            },
            { message: "Category commission percentage must be between 0 and 100" }
        );

        // Invalid commission percentage (< 0)
        assert.throws(
            () => {
                CommissionCalculator.calculate({
                    partsAmount: 500,
                    labourAmount: 500,
                    categoryCommissionPercentage: -5,
                });
            },
            { message: "Category commission percentage must be between 0 and 100" }
        );

        // Missing breakdown on order: must NOT silently assume either parts or labour
        const orderWithoutBreakdown = {
            id: "order_missing_bd",
            orderNumber: "REP-MISSING",
            customerId: custUserId,
            providerId: provId,
            requestId: "req_suite",
            initialQuoteAmount: 2000,
            finalAmount: 2000,
        } as any;

        await assert.rejects(
            async () => {
                await OrderCommissionResolver.resolve(
                    orderWithoutBreakdown,
                    createBasicCategoryRepo(12),
                    createBasicServiceRequestRepo(),
                    createBasicProviderRepo()
                );
            },
            {
                message: "Cannot calculate commission: Order is missing parts and labour breakdown",
            }
        );

        // Exact paise precision with odd amounts: ₹1,999.99 (Parts: ₹1,333.33, Labour: ₹666.66, 12% category)
        const oddCalc = CommissionCalculator.calculate({
            partsAmount: 1333.33,
            labourAmount: 666.66,
            categoryCommissionPercentage: 12,
        });

        // 133333 paise * 6% = 7999.98 -> 8000 paise = ₹80.00
        // 66666 paise * 12% = 7999.92 -> 8000 paise = ₹80.00
        // Total commission: ₹160.00
        // Total amount: ₹1,999.99
        // Provider earning: 199999 - 16000 = 183999 paise = ₹1,839.99
        assert.strictEqual(oddCalc.partsCommissionAmount, 80);
        assert.strictEqual(oddCalc.labourCommissionAmount, 80);
        assert.strictEqual(oddCalc.totalCommissionAmount, 160);
        assert.strictEqual(oddCalc.providerEarning, 1839.99);
        assert.strictEqual(
            Math.round((oddCalc.providerEarning + oddCalc.totalCommissionAmount) * 100) / 100,
            1999.99
        );
    });
});
