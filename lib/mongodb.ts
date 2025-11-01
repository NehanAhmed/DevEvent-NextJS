import mongoose from 'mongoose';

// Define the MongoDB connection string type
const MONGODB_URI = process.env.MONGODB_URI;

// Validate that the MongoDB URI is defined
if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  );
}

// Define the cached connection type
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Extend the global object to include the mongoose cache
declare global {
  var mongoose: MongooseCache | undefined;
}

// Initialize the cache object to prevent multiple connections in development
// In development, Next.js clears the Node.js cache on hot-reload, which can
// cause multiple database connections. Using global ensures the connection
// persists across hot-reloads.
let cached: MongooseCache = global.mongoose || { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

/**
 * Establishes a connection to MongoDB using Mongoose
 * Caches the connection to prevent creating multiple connections in serverless environments
 * @returns Promise that resolves to the Mongoose instance
 */
async function connectDB(): Promise<typeof mongoose> {
  // Return existing connection if available
  if (cached.conn) {
    return cached.conn;
  }

  // Create a new connection if no promise exists
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable buffering to fail fast in serverless environments
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Await the connection and cache it
    cached.conn = await cached.promise;
  } catch (e) {
    // Reset the promise on error so next call attempts a fresh connection
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
