import { BadRequestError } from "../../../../shared/errors/BadRequestError";

export interface CommissionCalculationInput {
    partsAmount: number;
    labourAmount: number;
    categoryCommissionPercentage: number;
}

export interface PaymentBreakdown {
    partsAmount: number;
    labourAmount: number;
    totalAmount: number;

    categoryCommissionPercentage: number;
    partsCommissionPercentage: number;
    labourCommissionPercentage: number;

    partsCommissionAmount: number;
    labourCommissionAmount: number;

    totalCommissionAmount: number;
    providerEarning: number;
    platformEarning: number;
}

export class CommissionCalculator {
    /**
     * Derives parts commission percentage as half of category commission.
     * E.g. category 12% -> parts 6%
     */
    public static derivePartsCommissionRate(categoryCommissionPercentage: number): number {
        return categoryCommissionPercentage / 2;
    }

    /**
     * Calculates the platform commission and provider net earning
     * using exact integer paise arithmetic to avoid floating-point issues.
     *
     * Rules:
     * - Labour commission rate = category commission % (100%)
     * - Parts commission rate  = category commission % / 2 (50%)
     * - Customer pays: partsAmount + labourAmount
     * - AtHand receives: partsCommission + labourCommission
     * - Provider receives: customerPayment - totalCommission (net earning only)
     */
    public static calculate(input: CommissionCalculationInput): PaymentBreakdown {
        const { partsAmount, labourAmount, categoryCommissionPercentage } = input;

        if (
            typeof partsAmount !== "number" ||
            isNaN(partsAmount) ||
            !isFinite(partsAmount) ||
            partsAmount < 0
        ) {
            throw new BadRequestError("Parts amount must be a non-negative number");
        }

        if (
            typeof labourAmount !== "number" ||
            isNaN(labourAmount) ||
            !isFinite(labourAmount) ||
            labourAmount < 0
        ) {
            throw new BadRequestError("Labour amount must be a non-negative number");
        }

        if (
            typeof categoryCommissionPercentage !== "number" ||
            isNaN(categoryCommissionPercentage) ||
            !isFinite(categoryCommissionPercentage) ||
            categoryCommissionPercentage < 0 ||
            categoryCommissionPercentage > 100
        ) {
            throw new BadRequestError("Category commission percentage must be between 0 and 100");
        }

        const labourCommissionPercentage = categoryCommissionPercentage;
        const partsCommissionPercentage = categoryCommissionPercentage / 2;

        const partsPaise = Math.round(partsAmount * 100);
        const labourPaise = Math.round(labourAmount * 100);
        const totalPaise = partsPaise + labourPaise;

        if (totalPaise <= 0) {
            throw new BadRequestError("Total amount must be greater than zero");
        }

        const partsCommissionPaise = Math.round((partsPaise * partsCommissionPercentage) / 100);
        const labourCommissionPaise = Math.round((labourPaise * labourCommissionPercentage) / 100);
        const totalCommissionPaise = partsCommissionPaise + labourCommissionPaise;

        const providerEarningPaise = totalPaise - totalCommissionPaise;

        return {
            partsAmount: partsPaise / 100,
            labourAmount: labourPaise / 100,
            totalAmount: totalPaise / 100,

            categoryCommissionPercentage,
            partsCommissionPercentage,
            labourCommissionPercentage,

            partsCommissionAmount: partsCommissionPaise / 100,
            labourCommissionAmount: labourCommissionPaise / 100,

            totalCommissionAmount: totalCommissionPaise / 100,
            providerEarning: providerEarningPaise / 100,
            platformEarning: totalCommissionPaise / 100,
        };
    }
}
