import mongoose from "mongoose";
import dotenv from "dotenv";
import Medication from "./models/Medication.js";

dotenv.config();

mongoose.connect("mongodb://127.0.0.1:27017/medicine_tracker");

const medications = [
  { name: "Aspirin", interactions: ["Ibuprofen", "Warfarin"], dosage: "100mg", unit: "tablet", frequency: "once daily", mealTiming: "After breakfast", userId: new mongoose.Types.ObjectId() },
  { name: "Ibuprofen", interactions: ["Aspirin", "Prednisone"], dosage: "200mg", unit: "capsule", frequency: "twice daily", mealTiming: "After meals", userId: new mongoose.Types.ObjectId() },
  { name: "Warfarin", interactions: ["Aspirin", "Paracetamol"], dosage: "5mg", unit: "tablet", frequency: "once daily", mealTiming: "Before bed", userId: new mongoose.Types.ObjectId() },
  { name: "Prednisone", interactions: ["Ibuprofen"], dosage: "10mg", unit: "tablet", frequency: "once daily", mealTiming: "In the morning", userId: new mongoose.Types.ObjectId() },
];

const seedDatabase = async () => {
    try {
        await Medication.deleteMany({});
        await Medication.insertMany(medications);
        console.log("✅ Medication seed data added!");
    } catch (error) {
        console.error("❌ Seeding error:", error);
    } finally {
        mongoose.connection.close();
    }
};

seedDatabase();
