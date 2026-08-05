import mongoose from "mongoose";
import { Provider } from "../../../domain/entities/Provider";

class ProviderMapper{
    static toDomain(data: any): Provider{
        return new Provider(
            data.userId,
            data.businessName,
            data.contactPerson,
            data.phone,
            data.email,
            data.serviceCategory,
            data.location,
            data.serviceRadius,
            data.experience,
            data.averageRating,
            data.status,
            data.totalReview,
            data.completedJobs,
            data._id
        )
    }

    static toMongoose(data: any) {
        return {
            ...data,
            userId: new mongoose.Types.ObjectId(data.userId),
            serviceCategory: new mongoose.Types.ObjectId(data.serviceCategory)
        }
    }
}

export default ProviderMapper