import mongoose from 'mongoose';

export const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/octofit_db';

export async function connectDatabase(): Promise<void> {
  await mongoose.connect(MONGO_URI, { dbName: 'octofit_db' });
}
