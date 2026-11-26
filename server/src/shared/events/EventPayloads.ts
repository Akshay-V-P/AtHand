export interface WalletCreditedEvent {
    userId: string;
    amount: number;
    transactionId: string;
    balanceAfter: number;
}