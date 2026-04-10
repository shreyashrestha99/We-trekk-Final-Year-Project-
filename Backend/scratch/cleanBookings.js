import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function cleanBookings() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) throw new Error("MONGO_URI is missing from .env");
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    
    console.log('Cleaning bookings collection...');
    const result = await mongoose.connection.collection('bookings').deleteMany({});
    
    console.log(`Successfully deleted ${result.deletedCount} bookings.`);
    process.exit(0);
  } catch (error) {
    console.error('Cleanup failed:', error);
    process.exit(1);
  }
}

cleanBookings();
