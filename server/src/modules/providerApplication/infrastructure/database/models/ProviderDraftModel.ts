import mongoose, { InferSchemaType } from "mongoose";

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
        type:[String]
    }
}, {
    timestamps:true
})

export type ProviderDraftSchemaType = InferSchemaType<typeof ProviderDraftSchema>
export default mongoose.model("ProviderDraft", ProviderDraftSchema)