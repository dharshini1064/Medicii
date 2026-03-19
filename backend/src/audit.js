const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const MONGO_URI = 'mongodb+srv://mediciiAdmin:Medicii%402024@cluster0.ltodggj.mongodb.net/medicii_db?retryWrites=true&w=majority&appName=Cluster0';

async function auditData() {
  await mongoose.connect(MONGO_URI);
  console.log("🔍 Starting Data Audit...");
  
  const User = mongoose.connection.collection('users');
  const Medication = mongoose.connection.collection('medications');
  const Schedule = mongoose.connection.collection('schedules');
  const IntakeLog = mongoose.connection.collection('intakelogs');

  const medsCount = await Medication.countDocuments();
  const logsCount = await IntakeLog.countDocuments();
  console.log(`📊 Statistics: ${medsCount} total medications, ${logsCount} intake logs.`);

  // Find all medicines that might be "orphan" (missing names or owners)
  const orphans = await Medication.find({ name: { $exists: false } }).toArray();
  console.log(`⚠️ Orphans found: ${orphans.length}`);

  // Print the last 5 medications to see who they belong to
  const lastMeds = await Medication.find().sort({ _id: -1 }).limit(5).toArray();
  console.log("💊 Last 5 Medications in DB:");
  lastMeds.forEach(m => console.log(`- ${m.name} (Owned by: ${m.userId})`));

  process.exit(0);
}

auditData();
