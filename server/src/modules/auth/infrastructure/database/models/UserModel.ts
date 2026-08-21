import  mongoose, { InferSchemaType }  from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    phone: {
        type:String
    },
    password: {
        type: String,
        required: function () {
            return !this.googleId
        }
    },
    role: {
        type: [String],
        enum: ["USER", "PROVIDER", "ADMIN"],
        default: ["USER"],
        required:true
    },
    googleId: {
        type: String
    },
    status: {
        type: String,
        enum: ["ACTIVE", "BLOCKED"],
        default: "ACTIVE",
        required:true
    },

    profilePhotoUrl: {
        type: String
    },

    isVerified: {
        type: Boolean,
        default: false,
        required:true
    }
})

export type UserSchemaType = InferSchemaType<typeof UserSchema>

export default mongoose.model<UserSchemaType>("User", UserSchema)