export enum PlatformCommissionStatus {
    ALLOCATED = 'ALLOCATED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

export interface PlatformCommissionLedger {
    id?: string;
    orderId: string;
    paymentId?: string;
    providerId: string;
    providerUserId: string;
    categoryId: string;
    categoryName?: string;
    orderNumber?: string;
    paymentMethod: string;
    grossAmount: number;
    commissionPercentage: number;
    commissionAmount: number;
    providerEarnings: number;
    currency: string;
    status: PlatformCommissionStatus;
    refundedAmount?: number;
    partsAmount?: number;
    labourAmount?: number;
    partsCommissionPercentage?: number;
    labourCommissionPercentage?: number;
    partsCommissionAmount?: number;
    labourCommissionAmount?: number;
    createdAt?: Date;
    updatedAt?: Date;
}
