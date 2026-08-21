import mongoose from "mongoose";
import { ProviderDocument } from "../../../domain/entities/ProviderDocument";

export abstract class DocumentMapper{
    static toDomain(data: any): ProviderDocument{
        return new ProviderDocument(
            data.providerId,
            data.documentType,
            data.documentKey,
            data.verificationStatus,
            data.remarks,
            data._id
        )
    }

    static toDomainArray(data: any): ProviderDocument[]{
        return data.map((doc:any) => {
            return new ProviderDocument(
                doc.providerId,
                doc.documentType,
                doc.documentKey,
                doc.verificationStatus,
                doc.remarks,
                doc._id
            )
        })
    }

    static toMongoose(data: any) {
        return {
            ...data,
            providerId: new mongoose.Types.ObjectId(data.providerId)
        }
    }
}