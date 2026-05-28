const mongoose = require("mongoose");
const Patient = require("../models/Patient").default;
const User = require("../models/user").default;

async function main() {
  const uri = "mongodb+srv://medisetuadmin:Med1setu%4012@cluster0.fkat6aq.mongodb.net/?appName=Cluster0";
  console.log("Connecting...");
  await mongoose.connect(uri);
  console.log("Connected!");

  // Use Aksh's record (6a1207928cedd0b479f17a23)
  const id = "6a1207928cedd0b479f17a23";
  let record = await Patient.findById(id).populate({ path: "userId", select: "name email role" });
  console.log("Record BEFORE modification:", JSON.stringify(record, null, 2));

  // Simulate payload
  const body = {
    bloodGroup: "O+",
    allergies: ["Peanuts", "Dust"],
    dateOfBirth: "1995-10-15",
    gender: "Male",
    phone: "1234567890",
    address: "123 Main St, New York",
    emergencyContact: {
      name: "Emergency Name",
      relationship: "Spouse",
      phone: "+1-555-0199"
    },
    medicalHistory: [
      { condition: "Asthma", status: "active", notes: "Mild symptoms" }
    ],
    medications: [
      { name: "Albuterol", dosage: "2 puffs", frequency: "As needed" }
    ]
  };

  // Map values
  if (body.bloodGroup) record.bloodGroup = body.bloodGroup;
  if (body.allergies) record.allergies = body.allergies;
  
  // mapMedicalHistoryForDb equivalent
  record.medicalHistory = body.medicalHistory.map((e) => ({
    condition: e.condition.trim(),
    diagnosedDate: e.diagnosedDate ? new Date(e.diagnosedDate) : undefined,
    status: e.status,
    notes: e.notes,
  }));

  // mapMedicationsForDb equivalent
  record.medications = body.medications.map((m) => ({
    name: m.name.trim(),
    dosage: m.dosage.trim(),
    frequency: m.frequency.trim(),
    startDate: m.startDate ? new Date(m.startDate) : undefined,
    endDate: m.endDate ? new Date(m.endDate) : undefined,
    prescribedBy: m.prescribedBy,
  }));

  if (body.emergencyContact) record.emergencyContact = body.emergencyContact;
  if (body.dateOfBirth) record.dateOfBirth = new Date(body.dateOfBirth);
  if (body.gender !== undefined) record.gender = body.gender;
  if (body.phone !== undefined) record.phone = body.phone;
  if (body.address !== undefined) record.address = body.address;

  console.log("Saving record...");
  await record.save();
  console.log("Record saved!");

  // Query database directly to see what actually got written
  const directObj = await mongoose.connection.db.collection("patients").findOne({ _id: new mongoose.Types.ObjectId(id) });
  console.log("Direct MongoDB Doc AFTER save:", JSON.stringify(directObj, null, 2));

  // Reload via Mongoose model findById
  const reloaded = await Patient.findById(id).populate({ path: "userId", select: "name email role" });
  console.log("Mongoose Reloaded Record AFTER save:", JSON.stringify(reloaded, null, 2));

  process.exit(0);
}

main().catch(err => {
  console.error("Error:", err);
  process.exit(1);
});
