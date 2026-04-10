import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function verifyBookings() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    
    // We need to populate user_id to see names
    const bookings = await mongoose.connection.collection('bookings').find({}).toArray();
    
    console.log('--- CURRENT BOOKINGS ---');
    if (bookings.length === 0) {
      console.log('No bookings found.');
    } else {
      for (const b of bookings) {
        const user = await mongoose.connection.collection('users').findOne({ _id: b.user_id });
        console.log(`User: ${user?.name || 'Unknown'} | Seats: ${b.seats} | Status: ${b.booking_status} | ID: ${b._id.toString().slice(-6)}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Check failed:', error);
    process.exit(1);
  }
}

verifyBookings();
