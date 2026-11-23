import {
    CommissionLedgerFilter,
    ICommissionLedgerRepository,
    PaginatedCommissionLedgerResult,
} from "../../domain/interfaces/ICommissionLedgerRepository";

export class GetCommissionLedgerUseCase {
    constructor(private readonly commissionLedgerRepository: ICommissionLedgerRepository) { }

    async execute(filter: CommissionLedgerFilter): Promise<PaginatedCommissionLedgerResult> {
        return await this.commissionLedgerRepository.findAll(filter);
    }
}
