import mongoose, {InferSchemaType} from "mongoose";
import { ProviderStatus } from "../../../domain/enums/ProviderStatus";

const ProviderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required:true
    },

    businessName: {
        type: String,
        required:true
    },

    contactPerson: {
        type: String,
        required:true
    },

    phone: {
        type: String,
        required:true
    },

    email: {
        type: String,
        required: true,
        unique:true
    },

    serviceCategory: {
        type: mongoose.Types.ObjectId,
        required:true
    },

    experience: {
        type: Number,
        default:0
    },

    status: {
        type: String,
        default: ProviderStatus.PENDING,
        required:true
    },

    location: {
        address: {
            street: String,
            city: String,
            district: String,
            state: String,
            pincode:String
        },
        coordinates: {
            type: {
                type: String,
                enum: ["Point"],
                default:"Point"
            },
            coordinates: {
                type: [Number],
                required:true
            }
        }
    },

    serviceRadius: {
        type: Number,
        required: true,
        default:2
    },

    averageRating: {
        type: Number,
        default:1,
        min: 0,
        max: 5,
    },

    totalReviews: {
        type: Number,
        default:0
    },

    completedJobs: {
        type: Number,
        default:0
    }

}, {
    timestamps:true
})

ProviderSchema.index({
    "location.coordinates":"2dsphere"
})

export type ProviderSchemaType = InferSchemaType<typeof ProviderSchema>

export default mongoose.model<ProviderSchemaType>("Provider", ProviderSchema)