const mongoose = require("mongoose");

async function main() {
  const uri = "mongodb+srv://medisetuadmin:Med1setu%4012@cluster0.fkat6aq.mongodb.net/?appName=Cluster0";
  console.log("Connecting to MongoDB...");
  await mongoose.connect(uri);
  console.log("Connected successfully!");

  // List collections
  const collections = await mongoose.connection.db.listCollections().toArray();
  console.log("Collections in DB:", collections.map(c => c.name));

  // Let's print users
  const users = await mongoose.connection.db.collection("users").find({}).toArray();
  console.log("\n--- Users ---");
  console.log(JSON.stringify(users, null, 2));

  // Let's print patients
  const patients = await mongoose.connection.db.collection("patients").find({}).toArray();
  console.log("\n--- Patients ---");
  console.log(JSON.stringify(patients, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
