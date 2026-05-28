import mongoose from "mongoose";
import fs from "fs";
import path from "path";

// Load environment variables for MongoDB connection
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, "utf-8");
  envConfig.split("\n").forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1]] = match[2];
    }
  });
}

async function runBackfill() {
  if (!process.env.MONGODB_URI) {
    console.error("Missing MONGODB_URI in .env.local");
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Import models
  const User = (await import("../models/user")).default;
  const Patient = (await import("../models/Patient")).default;

  const patientUsers = await User.find({ role: "patient" }).lean();
  const patientDocs = await Patient.find({}).lean();

  const docUserIds = new Set(patientDocs.map(doc => doc.userId.toString()));
  
  const missingUsers = patientUsers.filter(user => !docUserIds.has(user._id.toString()));

  console.log("--- Backfill Report ---");
  console.log(`Total Patient Users: ${patientUsers.length}`);
  console.log(`Total Patient Docs: ${patientDocs.length}`);
  console.log(`Missing Patient Docs: ${missingUsers.length}`);

  if (missingUsers.length === 0) {
    console.log("No missing documents. System is consistent.");
    process.exit(0);
  }

  console.log("\nUsers missing Patient documents:");
  missingUsers.forEach(u => {
    console.log(`- ID: ${u._id.toString()}, Name: ${u.name}, Email: ${u.email}`);
  });

  console.log("\nCreating missing Patient documents...");
  const createdIds: string[] = [];

  for (const user of missingUsers) {
    try {
      const newDoc = await Patient.create({ userId: user._id });
      createdIds.push(newDoc._id.toString());
      console.log(`Created Patient document ${newDoc._id.toString()} for User ${user._id.toString()}`);
    } catch (error) {
      console.error(`Failed to create for User ${user._id.toString()}:`, error);
    }
  }

  console.log("\n--- Final Status ---");
  console.log(`Successfully created ${createdIds.length} documents.`);
  const finalDocsCount = await Patient.countDocuments({});
  console.log(`Before count: ${patientDocs.length}`);
  console.log(`After count: ${finalDocsCount}`);

  process.exit(0);
}

runBackfill();
