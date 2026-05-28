import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const JWT_SECRET = "my_super_secret_key";
const MONGODB_URI = "mongodb+srv://medisetuadmin:Med1setu%4012@cluster0.fkat6aq.mongodb.net/?appName=Cluster0";

async function run() {
  await mongoose.connect(MONGODB_URI);
  console.log("Connected to MongoDB.");

  // Get first patient record
  const patient = await mongoose.connection.collection("patients").findOne({});
  if (!patient) {
    console.log("No patients found.");
    process.exit(1);
  }

  const token = jwt.sign(
    { userId: patient.userId.toString(), email: "test@example.com", role: "patient" },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  console.log(`Sending PUT to http://localhost:3000/api/patients/${patient._id.toString()}`);
  
  const payload = {
    dateOfBirth: "1990-01-01T00:00:00.000Z",
    gender: "Male",
    phone: "1234567890",
    address: "123 Test St",
    bloodGroup: "O+"
  };

  const res = await fetch(`http://localhost:3000/api/patients/${patient._id.toString()}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(payload)
  });

  console.log("Response status:", res.status);
  const data = await res.json();
  console.log("Response body:", JSON.stringify(data, null, 2));

  await mongoose.disconnect();
}

run().catch(console.error);
