import { IBusinessDetails, IDocuments, ILocationDetails, IServiceDetails } from "../../domain/entities/ProviderDraft";

export interface BusinessDetailsDraftDto{
    userId: string;
    businessDetails: IBusinessDetails,
    locationDetails: ILocationDetails,
    serviceDetails?: IServiceDetails,
    documents?:IDocuments[],
}