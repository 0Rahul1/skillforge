import mongoose from 'mongoose';

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/skillforge';

    // First try connecting to the configured URI (Atlas or Local)
    try {
      console.log(`📡 Connecting to MongoDB: ${mongoUri}...`);
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 3000 // Timeout fast if local DB isn't running
      });
      console.log(`✅ MongoDB Connected: ${mongoose.connection.host}`);
    } catch (err) {
      // If we are trying to connect to localhost/127.0.0.1 and it fails, start memory server
      if (mongoUri.includes('localhost') || mongoUri.includes('127.0.0.1')) {
        console.log('⚠️  Local MongoDB connection failed. Initializing MongoMemoryServer...');
        
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongod = await MongoMemoryServer.create({ binary: { version: '4.4.15' } });
        const memoryUri = mongod.getUri();
        
        console.log(`📡 Connecting to In-Memory MongoDB: ${memoryUri}`);
        await mongoose.connect(memoryUri);
        console.log('✅ In-Memory MongoDB Connected successfully!');
      } else {
        // If it was a remote URL and it failed, rethrow
        throw err;
      }
    }

    // Auto-seed if the DB has no domains
    await autoSeedIfEmpty();
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

const autoSeedIfEmpty = async () => {
  try {
    const Domain = mongoose.model('Domain');
    const count = await Domain.countDocuments();
    if (count === 0) {
      console.log('🌱 Database is empty. Seeding domains and questions...');
      const { seed } = await import('../utils/seedLargeData.js');
      await seed();
    } else {
      console.log(`📊 Database already has data (${count} domains). Skipping seed.`);
    }
  } catch (err) {
    console.error('⚠️  Auto-seed check failed:', err.message);
  }
};

export default connectDB;
