const mongoose = require("mongoose");
// Import the model
const LiveConsultation = require("./models/live-consultation").default;
async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const count = await mongoose.model("LiveConsultation").countDocuments();
  console.log("Count:", count);
  process.exit();
}
main();
