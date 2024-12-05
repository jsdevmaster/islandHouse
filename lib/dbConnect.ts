import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

let cachedConnection: typeof mongoose | null = null;
let connectionPromise: Promise<typeof mongoose> | null = null;

async function dbConnect(): Promise<typeof mongoose> {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!connectionPromise) {
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      family: 4
    };

    try {
      connectionPromise = mongoose.connect(MONGODB_URI, opts);
      cachedConnection = await connectionPromise;
      console.log('MongoDB connected successfully');
      return cachedConnection;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      connectionPromise = null;
      cachedConnection = null;
      throw new Error('Failed to connect to MongoDB');
    }
  }

  try {
    cachedConnection = await connectionPromise;
    return cachedConnection;
  } catch (error) {
    connectionPromise = null;
    cachedConnection = null;
    throw error;
  }
}

export default dbConnect;