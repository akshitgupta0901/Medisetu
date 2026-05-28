import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://medisetuadmin:Med1setu%4012@cluster0.fkat6aq.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI as string);

  const db = mongoose.connection;

  // Check the appointment schema enum values stored in DB
  // This verifies what status values actually exist vs. what the schema allows
  const allStatuses = await db.collection("appointments").distinct("status");
  console.log("All distinct status values in appointments collection:", allStatuses);

  // Check appointment schema enum from model vs. what's in DB
  const oldStatusAppts = await db.collection("appointments").find({
    status: { $in: ["approved", "pending"] }
  }).toArray();
  console.log("\nAppointments with OLD status values (approved/pending):", oldStatusAppts.length);
  for (const a of oldStatusAppts) {
    console.log(` - _id:${a._id} | doctorId:${a.doctorId} | patientId:${a.patientId} | status:"${a.status}"`);
  }

  // expandStatusFilter result for "Scheduled":
  // returns { $in: ["Scheduled", "pending", "approved"] }
  // This is the actual query used by GET /api/appointments?status=Scheduled
  console.log('\nThe frontend calls: GET /api/appointments?status=Scheduled');
  console.log('expandStatusFilter("Scheduled") returns: { $in: ["Scheduled", "pending", "approved"] }');

  // Verify doctor verification status
  const doctors = await db.collection("doctors").find({}).toArray();
  console.log("\nDoctor profiles in 'doctors' collection:");
  for (const d of doctors) {
    console.log(` - userId:${d.userId} | verificationStatus:${d.verificationStatus} | specialization:${d.specialization}`);
  }

  // Check all appointments with full fields
  const allAppts = await db.collection("appointments").find({}).toArray();
  console.log("\nAll appointments (full view):");
  for (const a of allAppts) {
    console.log(`  _id: ${a._id}`);
    console.log(`    doctorId:  ${a.doctorId}`);
    console.log(`    patientId: ${a.patientId}`);
    console.log(`    status:    "${a.status}"`);
    console.log(`    date:      ${a.appointmentDate}`);
    console.log();
  }

  await mongoose.disconnect();
}

run().catch(console.error);
