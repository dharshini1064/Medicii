import mongoose, { Schema, Document } from "mongoose";

export interface IMedication extends Document {
  name: string;
  dosage: string;
  unit: string;
  frequency: string;
  mealTiming: string;
  stockCount: number;
  notes?: string;
  isActive: boolean;
  userId: mongoose.Types.ObjectId;
  interactions: string[];
}

const MedicationSchema = new Schema<IMedication>(
  {
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    unit: { type: String, required: true },
    frequency: { type: String, required: true },
    mealTiming: { type: String, required: true },
    stockCount: { type: Number, default: 0 },
    notes: { type: String },
    isActive: { type: Boolean, default: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    interactions: [{ type: String }],
  },
  { timestamps: true }
);

const Medication = mongoose.model<IMedication>("Medication", MedicationSchema);
export default Medication;
