export enum WalletStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED",
}

export enum WalletType {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
}

export interface Wallet {
  id?: string;
  balance: number;
  userId: string;
  currency: string;
  status: WalletStatus;
  type: WalletType;
  createdAt?: Date;
  updatedAt?: Date;
}

