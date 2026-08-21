import mongoose, { InferSchemaType } from "mongoose";

const DocumentSchema = new mongoose.Schema({
    providerId:{
        type: mongoose.Types.ObjectId,
        required:true
    },
    documentType: {
        type: String,
        enum:["TECHNICAL CERTIFICATE", "BUSINESS LICENSE", "GOVERNMENT ID FRONT", "GOVERNMENT ID BACK"],
        required: true
    },
    documentKey: {
        type: String,
        required:true
    },
    remarks: {
        type:String
    },
    verificationStatus: {
        type: String,
        enum: ["VERIFIED", "PENDING", "REJECTED"],
        default: "PENDING",
        required:true
    }
}, {
    timestamps:true
})

export type DocumentSchemaType = InferSchemaType<typeof DocumentSchema>

export default mongoose.model("ProviderDocuments", DocumentSchema)