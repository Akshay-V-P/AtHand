export type WalletStatus = 
    | 'ACTIVE'
    | 'BLOCKED';

export type WalletType =
    | 'CUSTOMER'
    | 'PROVIDER';

export type WalletTransactionType =
    | 'DEBIT'
    | 'CREDIT';
    
export interface Wallet {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    status: WalletStatus;
    type: WalletType;
    createdAt: string;
    updatedAt: string;
}
    
export type WalletTransactionCategory =
    | 'PAYMENT'
    | 'REFUND'
    | 'EARNING'
    | 'WITHDRAWAL';

export type WalletTransactionStatus =
    | 'PENDING'
    | 'COMPLETED'
    | 'FAILED'
    | 'REVERSED';

export type WalletTransactionReferenceType =
    | 'ORDER'
    | 'PAYMENT'
    | 'REFUND'
    | 'PAYOUT';

export interface WalletTransaction {
    id?: string;
    walletId: string;
    type: WalletTransactionType;
    category: WalletTransactionCategory;
    amount: number;
    balanceAfter: number;
    status: WalletTransactionStatus;
    referenceType: WalletTransactionReferenceType;
    referenceId: string;
    description: string;
    createdAt?: string;
    updatedAt?: string;
}
