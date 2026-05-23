import mongoose from "mongoose";
import LiveConsultation from "./models/live-consultation";
import { connectDB } from "./lib/mongodb";

async function check() {
  await connectDB();
  const count = await LiveConsultation.countDocuments();
  console.log("Total Count:", count);
}
check();
