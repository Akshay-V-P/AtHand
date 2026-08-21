import mongoose from "mongoose";
import { ProviderDraft } from "../../../domain/entities/ProviderDraft";

class ProviderDraftMapper{
    static toDomain(data: any): ProviderDraft{
        return new ProviderDraft(
            data.userId,
            data.businessDetails,
            data.locationDetails,
            data.serviceDetails,
            data.documents,
        )
    }

    static toMongoose(data: any) {
        return {
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId)
        }
    }
}

export default ProviderDraftMapper