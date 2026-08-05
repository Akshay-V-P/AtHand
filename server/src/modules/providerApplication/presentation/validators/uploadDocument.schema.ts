import {z} from "zod";
import { DocumentType } from "../../domain/entities/ProviderDocument";

export const uploadDocumentSchema = z.object({
    providerId: z.string().min(1, "Provider ID is required"),
    documentType: z.enum(DocumentType, {
        error:"Invalid document type"
    }),
    documentUrl: z.url("Invalid document url")
})