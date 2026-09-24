import mongoose, { InferSchemaType } from "mongoose";

const ProviderServiceSchema = new mongoose.Schema({
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Providers",
        required: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    media: [{
        type: String
    }],
    onSite: {
        type: Boolean,
        default: false
    },
    acceptUrgent: {
        type: Boolean,
        default: false
    },
    instantBooking: {
        type: Boolean,
        default: false
    },
    serviceRadius: {
        type: Number,
        default: 0
    },
    startingPrice: {
        type: Number,
        required: true
    },
    pricingType: {
        type: String,
        enum: ["HOURLY", "FLAT_FEE"],
        required: true
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ["ACTIVE", "INACTIVE", "BLOCKED"],
        default: "ACTIVE"
    }
}, {
    timestamps: true,
    collection: "providerservices"
});

export type ProviderServiceSchemaType = InferSchemaType<typeof ProviderServiceSchema>;
export default mongoose.model("ProviderServices", ProviderServiceSchema);
