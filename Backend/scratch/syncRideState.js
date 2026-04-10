import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function syncRideState() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    
    // Reset ALL rides to have zero booked_seats (we will rely on dynamic calculation now)
    const result = await mongoose.connection.collection('rides').updateMany(
      {},
      { $set: { booked_seats: [] } }
    );
    
    console.log(`Successfully reset seat state for ${result.modifiedCount} rides.`);
    
    // Now re-apply the actual bookings if any
    const bookings = await mongoose.connection.collection('bookings').find({ 
      ride_id: { $exists: true },
      booking_status: { $ne: 'Cancelled' }
    }).toArray();
    
    for (const b of bookings) {
       await mongoose.connection.collection('rides').updateOne(
         { _id: b.ride_id },
         { $push: { booked_seats: { $each: b.seat_numbers } } }
       );
    }
    
    console.log('Final Database Sync Complete.');
    process.exit(0);
  } catch (error) {
    console.error('Sync failed:', error);
    process.exit(1);
  }
}

syncRideState();
