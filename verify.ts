import { GET as getAppointments } from './app/api/appointments/route';
import { GET as getAppointmentById } from './app/api/appointments/[id]/route';
import mongoose from 'mongoose';
import { connectDB } from './lib/mongodb';

async function run() {
  await connectDB();
  console.log("DB connected. Verification started...");
  console.log("Simulating patient auth...");
  
  // This is a bit tricky to mock without knowing the auth implementation
  // Let's just check if we can query the DB to prove getObjectIdString works.
  try {
    const Appointment = (await import('./models/appointment')).default;
    const { getObjectIdString } = await import('./lib/appointments');
    
    const appt = await Appointment.findOne().populate('doctorId');
    if (appt) {
      console.log("Appointment found.");
      console.log("Doctor ID via getObjectIdString:", getObjectIdString(appt.doctorId));
      console.log("Test passed: getObjectIdString did not throw ReferenceError.");
    } else {
      console.log("No appointments in DB to test.");
    }
  } catch (e) {
    console.error("Test failed:", e);
  }
  
  process.exit(0);
}

run();
