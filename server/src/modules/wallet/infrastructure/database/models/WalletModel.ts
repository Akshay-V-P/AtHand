
import { InferSchemaType, Schema, model } from "mongoose";
import { Wallet, WalletStatus, WalletType } from "../../../domain/entities/Wallet";

const walletSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: Object.values(WalletType),
      required: true,
      default: WalletType.CUSTOMER,
    },

    balance: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },

    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(WalletStatus),
      required: true,
      default: WalletStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

walletSchema.index({ userId: 1, type: 1 }, { unique: true });

export type WalletSchemaType = InferSchemaType<typeof WalletModel>;

export const WalletModel = model<Wallet>("Wallet", walletSchema);

