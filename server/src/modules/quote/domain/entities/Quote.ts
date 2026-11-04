import { QuoteStatus } from "../enums/QuoteStatus";

export class Quote {
    constructor(
        public readonly requestId: string,
        public readonly providerId: string,
        public readonly estimatedTotal: number,
        public readonly laborCost: number,
        public readonly partsCost: number,
        public readonly estimatedRepairTime: string,
        public readonly technicalNotes: string,
        public readonly status: QuoteStatus,
        public readonly includeWarrenty: boolean,
        public readonly id?: string,
        public readonly createdAt?: Date,
        public readonly updatedAt?: Date
    ) { }
}
