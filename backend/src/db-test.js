const mongoose = require('mongoose');
const dns = require('dns');
const dotenv = require('dotenv');

// Hard-coding the exact fix used in the server
dns.setServers(["8.8.8.8", "8.8.4.4"]);
dotenv.config();

const MONGO_URI = 'mongodb+srv://mediciiAdmin:Medicii%402024@cluster0.ltodggj.mongodb.net/medicii_db?retryWrites=true&w=majority&appName=Cluster0';

async function testConnection() {
  console.log("🔍 Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Success! Connected to MongoDB.");
    
    // Test a simple save
    const TestModel = mongoose.model('ConnectionTest', new mongoose.Schema({ name: String }));
    await TestModel.create({ name: 'Medicii Test ' + new Date().toISOString() });
    console.log("💾 Success! Data saved to database.");
    
    process.exit(0);
  } catch (err) {
    console.error("❌ FAILURE DETECTED:");
    console.error(err);
    process.exit(1);
  }
}

testConnection();
