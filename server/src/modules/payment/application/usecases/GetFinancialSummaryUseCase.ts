import {
    ICommissionLedgerRepository,
    PlatformFinancialSummary,
} from "../../domain/interfaces/ICommissionLedgerRepository";

export class GetFinancialSummaryUseCase {
    constructor(private readonly commissionLedgerRepository: ICommissionLedgerRepository) { }

    async execute(startDate?: Date, endDate?: Date): Promise<PlatformFinancialSummary> {
        return await this.commissionLedgerRepository.getFinancialSummary(startDate, endDate);
    }
}
