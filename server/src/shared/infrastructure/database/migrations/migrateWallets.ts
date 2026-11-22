import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../../../.env") });

async function runMigration() {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017/AtHand";
  console.log(`Connecting to MongoDB at ${mongoUrl}...`);
  await mongoose.connect(mongoUrl);

  const db = mongoose.connection.db;
  if (!db) {
    throw new Error("Failed to connect to database");
  }

  console.log("Checking indexes on 'wallets' collection...");
  const walletCol = db.collection("wallets");
  const existingIndexes = await walletCol.indexes();
  console.log("Existing indexes:", existingIndexes.map((idx) => idx.name));

  const hasOldUniqueUserIdIndex = existingIndexes.some(
    (idx) => idx.name === "userId_1" && idx.unique === true
  );

  if (hasOldUniqueUserIdIndex) {
    console.log("Dropping old unique index 'userId_1'...");
    await walletCol.dropIndex("userId_1");
    console.log("Successfully dropped 'userId_1' index.");
  }

  console.log("Ensuring compound unique index { userId: 1, type: 1 }...");
  await walletCol.createIndex(
    { userId: 1, type: 1 },
    { unique: true, name: "userId_1_type_1" }
  );
  console.log("Compound unique index 'userId_1_type_1' established.");

  // Backfill existing wallets lacking `type`
  const updateResult = await walletCol.updateMany(
    { type: { $exists: false } },
    { $set: { type: "CUSTOMER" } }
  );
  console.log(`Backfilled ${updateResult.modifiedCount} existing wallet(s) with type 'CUSTOMER'.`);

  // Migrate existing users to ensure each has a CUSTOMER wallet
  const usersCol = db.collection("users");
  const users = await usersCol.find().toArray();
  console.log(`Found ${users.length} total users in database.`);

  let customerWalletsCreated = 0;
  for (const user of users) {
    const existing = await walletCol.findOne({
      userId: user._id,
      type: "CUSTOMER",
    });

    if (!existing) {
      await walletCol.insertOne({
        userId: user._id,
        balance: 0,
        currency: "INR",
        status: "ACTIVE",
        type: "CUSTOMER",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      customerWalletsCreated++;
    }
  }
  console.log(`Created ${customerWalletsCreated} new CUSTOMER wallet(s).`);

  // Migrate existing approved providers to ensure each has a PROVIDER wallet
  const providersCol = db.collection("providers");
  const approvedProviders = await providersCol
    .find({ status: { $in: ["ACTIVE", "APPROVED"] } })
    .toArray();
  console.log(`Found ${approvedProviders.length} approved/active provider(s).`);

  let providerWalletsCreated = 0;
  for (const provider of approvedProviders) {
    if (!provider.userId) continue;
    const providerUserId =
      typeof provider.userId === "string"
        ? new mongoose.Types.ObjectId(provider.userId)
        : provider.userId;

    const existing = await walletCol.findOne({
      userId: providerUserId,
      type: "PROVIDER",
    });

    if (!existing) {
      await walletCol.insertOne({
        userId: providerUserId,
        balance: 0,
        currency: "INR",
        status: "ACTIVE",
        type: "PROVIDER",
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      providerWalletsCreated++;
    }
  }
  console.log(`Created ${providerWalletsCreated} new PROVIDER wallet(s).`);

  const finalWallets = await walletCol.find().toArray();
  console.log(`\nMigration completed successfully! Total wallets in DB: ${finalWallets.length}`);
  console.log(
    `Breakdown: ${finalWallets.filter((w) => w.type === "CUSTOMER").length} CUSTOMER, ${
      finalWallets.filter((w) => w.type === "PROVIDER").length
    } PROVIDER.`
  );

  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
