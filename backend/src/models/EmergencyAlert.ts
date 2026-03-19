
import mongoose from "mongoose";

const EmergencySchema = new mongoose.Schema({
  userEmail: String,
  emergencyContacts: [String], // List of emergency emails
  message: String,
  timestamp: { type: Date, default: Date.now },
});

const EmergencyAlert = mongoose.model("EmergencyAlert", EmergencySchema);
export default EmergencyAlert;
