import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const connectDB = async () => {
  let uri = process.env.MONGODB_URI;
  let memoryServer;

  if (!uri) {
    console.warn('MONGODB_URI not defined. Starting in-memory MongoDB for development.');
    memoryServer = await MongoMemoryServer.create();
    uri = memoryServer.getUri();
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
    console.log(`Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);

    // If a real MongoDB was configured but failed to connect, fall back to in-memory for dev
    if (!memoryServer) {
      try {
        console.warn('Falling back to in-memory MongoDB for development.');
        memoryServer = await MongoMemoryServer.create();
        const fallbackUri = memoryServer.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(`MongoDB (in-memory) connected: ${conn.connection.host}`);
        console.log(`Database: ${conn.connection.name}`);
        return conn;
      } catch (err) {
        console.error(`In-memory MongoDB failed: ${err.message}`);
        if (memoryServer) await memoryServer.stop();
        throw err;
      }
    }

    if (memoryServer) await memoryServer.stop();
    throw error;
  }
};

export default connectDB;
