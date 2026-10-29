import mongoose, { Connection } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || 'nivesh-ventures';

if (!MONGODB_URI) {
  console.warn('MONGODB_URI not set - database operations will fail');
}

let cached: { conn: Connection | null; promise: Promise<Connection> | null } = { conn: null, promise: null };

export function isDbConnected(): boolean {
  return mongoose.connection.readyState === 1;
}

export async function connectDB(): Promise<Connection | null> {
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  // If using placeholder URI or no URI set, don't attempt connection that hangs or crashes
  if (!MONGODB_URI || MONGODB_URI.includes('username:password@cluster.mongodb.net')) {
    return null;
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        dbName: MONGODB_DB_NAME,
        bufferCommands: false,
        serverSelectionTimeoutMS: 3000,
      })
      .then((mongoose) => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (e) {
    cached.promise = null;
    console.warn('MongoDB connection unavailable, using fallback mock mode:', (e as Error).message);
    return null;
  }
}
