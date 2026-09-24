import mongoose from 'mongoose';
import ProviderModel from './src/modules/provider/infrastructure/database/models/ProviderModel';
import ProviderServiceModel from './src/modules/provider-service/infrastructure/database/models/ProviderServiceModel';

async function test() {
    try {
        await mongoose.connect('mongodb+srv://akshayvp2004:B1nUvV8QEDxTf9z2@cluster0.aek7n.mongodb.net/at-hand-v1?retryWrites=true&w=majority&appName=Cluster0');
        console.log('connected');

        let provider = await ProviderModel.findOne({ status: "APPROVED" });
        console.log("Approved provider:", provider?.businessName, provider?.location?.coordinates);

        const pipeline = [
            { $limit: 10 },
            { $lookup: { from: 'providerservices', localField: '_id', foreignField: 'providerId', as: 'service' } },
            { $unwind: '$service' }
        ];
        const agg = await ProviderModel.aggregate(pipeline);
        console.log('agg length:', agg.length);
        if (agg.length > 0) {
            console.log('first agg service:', agg[0].service.name);
        } else {
            console.log('no matching services in lookup. verifying collection names...');
            const collections = await mongoose.connection.db?.listCollections().toArray();
            console.log('collections:', collections?.map(c => c.name).filter(n => n.includes('provider')));
        }
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
}
test();
