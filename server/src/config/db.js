import mongoose from "mongoose";

export async function connectDB(uri) {
  if (!uri) {
    console.warn("[db] MONGODB_URI is not set. Messages will be emailed/logged but not stored.");
    return false;
  }
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 8000 });
  console.log(`[db] connected to ${mongoose.connection.name}`);
  return true;
}

export const isDBReady = () => mongoose.connection.readyState === 1;
