import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://medisetuadmin:Med1setu%4012@cluster0.fkat6aq.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB.");

  // Get all doctors
  const doctors = await mongoose.connection.collection("users").find({ role: "doctor" }).toArray();
  console.log(`Found ${doctors.length} doctors.`);

  for (const doctor of doctors) {
    console.log(`\n--- Doctor ID: ${doctor._id} (${doctor.name}) ---`);

    // The query the API uses
    const query = {
      doctorId: doctor._id,
      status: { $in: ["Scheduled", "pending", "approved"] }
    };
    
    // Also we need to be careful: does doctorId in appointments use ObjectId or string?
    // Let's check both or use the exact one
    const matchingAppts = await mongoose.connection.collection("appointments").find({
      $or: [
        { doctorId: doctor._id, status: { $in: ["Scheduled", "pending", "approved"] } },
        { doctorId: doctor._id.toString(), status: { $in: ["Scheduled", "pending", "approved"] } }
      ]
    }).toArray();

    console.log(`Matching Appointments Count: ${matchingAppts.length}`);
    
    if (matchingAppts.length > 0) {
      console.log("Matching Appointments:");
      for (const appt of matchingAppts) {
        console.log(` - ID: ${appt._id} | PatientID: ${appt.patientId} | Status: ${appt.status}`);
      }
    }

    // Let's also check ALL appointments for this doctor to see why some might not match
    const allAppts = await mongoose.connection.collection("appointments").find({
      $or: [
        { doctorId: doctor._id },
        { doctorId: doctor._id.toString() }
      ]
    }).toArray();

    console.log(`Total Appointments (any status): ${allAppts.length}`);
    if (allAppts.length > 0) {
      console.log("All Appointments:");
      for (const appt of allAppts) {
        console.log(` - ID: ${appt._id} | PatientID: ${appt.patientId} | Status: ${appt.status}`);
      }
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
