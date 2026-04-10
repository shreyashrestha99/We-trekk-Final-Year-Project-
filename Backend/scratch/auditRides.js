import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function auditRides() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    
    const rides = await mongoose.connection.collection('rides').find({}).toArray();
    
    console.log('--- RIDE AUDIT ---');
    for (const r of rides) {
       // Also check bookings for this ride
       const bookings = await mongoose.connection.collection('bookings').find({ 
         ride_id: r._id,
         booking_status: { $ne: 'Cancelled' }
       }).toArray();
       
       const actualBookedSeats = bookings.flatMap(b => b.seat_numbers || []);
       
       console.log(`Ride: ${r.ride_name} | Avail: ${r.available_seats} | Model Booked: [${r.booked_seats?.join(', ') || ''}] | Actual Bookings: [${actualBookedSeats.join(', ')}]`);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Audit failed:', error);
    process.exit(1);
  }
}

auditRides();
