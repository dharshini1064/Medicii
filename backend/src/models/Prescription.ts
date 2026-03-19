import mongoose from "mongoose";

const PrescriptionSchema = new mongoose.Schema({
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  medicines: [{ name: String, dosage: String, frequency: String }],
  notes: String,
  dateIssued: { type: Date, default: Date.now },
  fileUrl: String, // If prescription is an uploaded PDF/image
});

const Prescription = mongoose.model("Prescription", PrescriptionSchema);
export default Prescription;
