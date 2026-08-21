import mongoose, { InferSchemaType } from "mongoose";

const ProviderDocumentDraftSchema = new mongoose.Schema(
    {
        providerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Provider",
            required: true,
        },

        documentType: {
            type: String,
            enum: [
                "TECHNICAL CERTIFICATE",
                "BUSINESS LICENSE",
                "GOVERNMENT ID",
            ],
            required: true,
        },

        documentKey: {
            type: String,
            required: true,
        },

        verificationStatus: {
            type: String,
            enum: ["VERIFIED", "PENDING", "REJECTED"],
            default: "PENDING",
            required: true,
        },

        remarks: {
            type: String,
        },
    },
    {
        _id: false,
    }
);

const ProviderDraftSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required:true
    },
    businessDetails: {
        businessName: { type: String},
        contactPerson: { type: String},
        phone: { type: String},
        email: { type: String},
    },
    locationDetails: {
        address: {
            street: { type: String},
            city: { type: String},
            district: { type: String },
            state: { type: String},
            pincode: { type: String },
        },
        coordinates: {
            type: { type: String, enum: ["Point"], default: "Point"},
            coordinates:{type:[Number]}
        }
    },
    serviceDetails: {
        serviceCategory: { type: mongoose.Types.ObjectId},
        serviceRadius: { type: Number},
    },
    documents: {
        type: [ProviderDocumentDraftSchema],
        default:[]
    }
}, {
    timestamps:true
})

export type ProviderDraftSchemaType = InferSchemaType<typeof ProviderDraftSchema>
export default mongoose.model("ProviderDraft", ProviderDraftSchema)