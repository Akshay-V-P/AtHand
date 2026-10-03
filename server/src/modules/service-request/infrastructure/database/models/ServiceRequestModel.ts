import mongoose, { InferSchemaType } from "mongoose";

const AddressSchema = new mongoose.Schema({
    houseName: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, { _id: false });

const ServiceRequestSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
        index: true
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Categories",
        required: true
    },
    address: {
        type: AddressSchema,
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    urgency: {
        type: String,
        enum: ["LOW", "NORMAL", "HIGH", "EMERGENCY"],
        default: "NORMAL"
    },
    onSite: {
        type: Boolean,
        default: true
    },
    media: [{
        type: String
    }],
    productBrand: {
        type: String
    },
    productModel: {
        type: String
    },
    status: {
        type: String,
        enum: ["OPEN", "QUOTING", "QUOTE_ACCEPTED", "IN_PROGRESS", "COMPLETED", "CANCELLED"],
        default: "OPEN",
        index: true
    },
    preferredDate: {
        type: Date
    },
    preferredTimeSlot: {
        type: String
    }
}, {
    timestamps: true,
    collection: "servicerequests"
});

export type ServiceRequestSchemaType = InferSchemaType<typeof ServiceRequestSchema>;

ServiceRequestSchema.index({ "address.coordinates": "2dsphere" });

export default mongoose.model("ServiceRequests", ServiceRequestSchema);
