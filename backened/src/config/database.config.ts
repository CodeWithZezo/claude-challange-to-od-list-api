import mongoose from 'mongoose';

const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/task_managemnt_system';

export async function connectDatabase(): Promise<void> {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log('✅ MongoDB connected');

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('📴 MongoDB disconnected');
  } catch (error) {
    console.error('❌ MongoDB disconnect error:', error);
  }
}
