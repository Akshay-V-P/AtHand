import { CategoryStatus } from "../enums/CategoryStatus";

export class Category{
    constructor(
        public readonly name: string,
        public readonly description:string,
        public readonly commissionPercentage: number,
        public readonly slug: string,
        public readonly icon: string,
        public readonly status: CategoryStatus,
        public readonly id?:string,
    ){}
}