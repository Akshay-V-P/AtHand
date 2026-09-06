import mongoose, { InferSchemaType, Schema } from "mongoose";

const CoordinatesSchema = new Schema({
    type: {
        type: String,
        enum: ['Point'],
        required: true
    },
    coordinates: {
        type: [Number],
        required: true
    }
}, { _id: false });

const AddressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
    label: { type: String, required: true },
    houseName: { type: String, required: true },
    area: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pincode: { type: String, required: true },
    coordinates: { type: CoordinatesSchema, required: true },
    isPrimary: { type: Boolean, default: false }
}, {
    timestamps: true
});

// Create geospatial index
AddressSchema.index({ coordinates: "2dsphere" });

export type AddressSchemaType = InferSchemaType<typeof AddressSchema>;
export default mongoose.model("Addresses", AddressSchema);
