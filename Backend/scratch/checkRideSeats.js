import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

async function checkRideSeats() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    
    const bookings = await mongoose.connection.collection('bookings').find({ 
      ride_id: { $exists: true },
      booking_status: { $ne: 'Cancelled' }
    }).toArray();
    
    console.log('--- ACTIVE RIDE BOOKINGS ---');
    if (bookings.length === 0) {
      console.log('No active ride bookings found.');
    } else {
      for (const b of bookings) {
        console.log(`Booking ID: ${b._id.toString().slice(-6)} | Seats: ${b.seats} | Seat Numbers: [${b.seat_numbers?.join(', ') || 'NONE'}] | Status: ${b.booking_status}`);
      }
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Check failed:', error);
    process.exit(1);
  }
}

checkRideSeats();
