import mongoose, { InferSchemaType } from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    description: {
        type: String,
        trim:true
    },
    commissionPercentage: {
        type: Number,
        required:true
    },
    slug: {
        type: String,
        lowercase: true,
        trim:true,
        unique:true
    },
    icon: {
        type:String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE",
        required:true
    }
}, {
    timestamps:true
})

export type CategorySchemaType = InferSchemaType<typeof CategorySchema>
export default mongoose.model("Categories", CategorySchema)