import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://medisetuadmin:Med1setu%4012@cluster0.fkat6aq.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI as string);
  const db = mongoose.connection;

  // 1. Total users with role=patient
  const patientUsers = await db.collection("users").find({ role: "patient" }).toArray();
  console.log(`\n=== USERS with role="patient" ===`);
  console.log(`Count: ${patientUsers.length}`);
  for (const u of patientUsers) {
    console.log(`  userId: ${u._id} | name: ${u.name} | email: ${u.email}`);
  }

  // 2. Total documents in patients collection
  const patientDocs = await db.collection("patients").find({}).toArray();
  console.log(`\n=== PATIENTS collection ===`);
  console.log(`Count: ${patientDocs.length}`);
  for (const p of patientDocs) {
    console.log(`  patientDoc._id: ${p._id} | userId: ${p.userId} | bloodGroup: ${p.bloodGroup}`);
  }

  // 3. Cross-reference: which patient users have NO patient document
  const patientDocUserIds = new Set(patientDocs.map(p => p.userId.toString()));
  const orphanedUsers = patientUsers.filter(u => !patientDocUserIds.has(u._id.toString()));
  console.log(`\n=== Patient Users WITHOUT a Patient document ===`);
  console.log(`Count: ${orphanedUsers.length}`);
  for (const u of orphanedUsers) {
    console.log(`  userId: ${u._id} | name: ${u.name} | email: ${u.email}`);
  }

  // 4. Patient documents whose userId does not map to any user
  const userIds = new Set(patientUsers.map(u => u._id.toString()));
  const orphanedDocs = patientDocs.filter(p => !userIds.has(p.userId.toString()));
  console.log(`\n=== Patient Documents WITHOUT a matching User ===`);
  console.log(`Count: ${orphanedDocs.length}`);
  for (const p of orphanedDocs) {
    console.log(`  patientDoc._id: ${p._id} | userId: ${p.userId}`);
  }

  // 5. Mapping: patient userId -> patientDoc
  console.log(`\n=== Full Mapping: userId -> patientDocId ===`);
  for (const u of patientUsers) {
    const doc = patientDocs.find(p => p.userId.toString() === u._id.toString());
    if (doc) {
      console.log(`  LINKED   | userId: ${u._id} (${u.name}) -> patientDoc: ${doc._id}`);
    } else {
      console.log(`  MISSING  | userId: ${u._id} (${u.name}) -> NO PATIENT DOC`);
    }
  }

  // 6. Check what collections appointments references
  const apptSample = await db.collection("appointments").findOne({});
  console.log(`\n=== Appointment sample document fields ===`);
  if (apptSample) {
    console.log(` Fields present: ${Object.keys(apptSample).join(", ")}`);
    console.log(` patientId field value: ${apptSample.patientId} (references users._id, NOT patients._id)`);
  }

  // 7. Check what collections prescriptions reference
  const prescSample = await db.collection("prescriptions").findOne({});
  console.log(`\n=== Prescription sample document fields ===`);
  if (prescSample) {
    console.log(` Fields present: ${Object.keys(prescSample).join(", ")}`);
    console.log(` patientId field value: ${prescSample.patientId}`);
    console.log(` doctorId field value: ${prescSample.doctorId}`);
  } else {
    console.log(` (no prescriptions exist yet)`);
  }

  // 8. Check transactions for billing
  const transSample = await db.collection("transactions").findOne({});
  console.log(`\n=== Transaction (billing) sample document fields ===`);
  if (transSample) {
    console.log(` Fields present: ${Object.keys(transSample).join(", ")}`);
    console.log(` patientId field value: ${transSample.patientId}`);
  } else {
    console.log(` (no transactions exist yet)`);
  }

  // 9. Registration flow: check if Patient.create was the source for existing docs
  // by comparing createdAt times for user + patient docs
  console.log(`\n=== Created-at timestamps comparison (User vs Patient doc) ===`);
  for (const u of patientUsers) {
    const doc = patientDocs.find(p => p.userId.toString() === u._id.toString());
    if (doc) {
      const userTs = u.createdAt ? new Date(u.createdAt).toISOString() : "N/A";
      const docTs = doc.createdAt ? new Date(doc.createdAt).toISOString() : "N/A";
      const diffMs = doc.createdAt && u.createdAt ? new Date(doc.createdAt).getTime() - new Date(u.createdAt).getTime() : null;
      console.log(`  User: ${u.name}`);
      console.log(`    User created:    ${userTs}`);
      console.log(`    PatDoc created:  ${docTs}`);
      console.log(`    Time diff (ms):  ${diffMs ?? "N/A"} ${diffMs !== null && diffMs < 5000 ? "(same request — created at registration)" : "(created later — profile save)"}`);
    }
  }

  await mongoose.disconnect();
}

run().catch(console.error);
