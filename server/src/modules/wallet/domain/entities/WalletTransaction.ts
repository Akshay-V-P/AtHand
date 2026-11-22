export enum WalletTransactionType{
    CREDIT = "CREDIT",
    DEBIT= "DEBIT"
}

export enum WalletTransactionCategory{
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
    EARNING = 'EARNING',
    WITHDRAWAL = 'WITHDRAWAL'
}

export enum WalletTransactionStatus{
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    FAILED = 'FAILED',
    REVERSED = 'REVERSED'
}

export enum WalletTransactionReferenceType{
    ORDER = 'ORDER',
    PAYMENT = 'PAYMENT',
    REFUND = 'REFUND',
    PAYOUT = 'PAYOUT'
}

export interface WalletTransaction{
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