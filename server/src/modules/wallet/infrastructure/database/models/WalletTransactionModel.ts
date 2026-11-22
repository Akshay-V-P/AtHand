
import { InferSchemaType, Schema, model, Types } from "mongoose";
import { WalletTransaction, WalletTransactionCategory, WalletTransactionReferenceType, WalletTransactionStatus, WalletTransactionType } from "../../../domain/entities/WalletTransaction";



const walletTransactionSchema = new Schema(
  {
    walletId: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(WalletTransactionType),
      required: true,
    },

    category: {
      type: String,
      enum: Object.values(WalletTransactionCategory),
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: Object.values(WalletTransactionStatus),
      default: WalletTransactionStatus.PENDING,
      required: true,
    },

    referenceType: {
      type: String,
      enum: Object.values(WalletTransactionReferenceType),
      required: true,
    },

    referenceId: {
      type: Schema.Types.ObjectId,
      required: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

walletTransactionSchema.index({
  walletId: 1,
  createdAt: -1,
});

export type WalletTransactionSchemaType = InferSchemaType<typeof WalletTransactionModel>;

export const WalletTransactionModel = model<WalletTransaction>(
  "WalletTransaction",
  walletTransactionSchema
);

