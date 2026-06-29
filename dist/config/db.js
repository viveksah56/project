import mongoose from "mongoose";
const connectDB = async () => {
    const mongoUri = process.env.MONGO_URI;
    const mongoDbName = process.env.MONGO_DB_NAME;
    if (!mongoUri) {
        throw new Error("MONGO_URI is not defined");
    }
    const options = mongoDbName ? { dbName: mongoDbName } : {};
    try {
        await mongoose.connect(mongoUri, options);
        console.log(" MongoDB connected Successfully", options);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=db.js.map