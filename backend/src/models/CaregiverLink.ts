import mongoose, { Schema, Document } from "mongoose";

export interface ICaregiverLink extends Document {
  patient_id: mongoose.Types.ObjectId;
  caregiver_id: mongoose.Types.ObjectId;
  permission: "view" | "manage";
}

const CaregiverLinkSchema = new Schema<ICaregiverLink>(
  {
    patient_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    caregiver_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    permission: { type: String, enum: ["view", "manage"], default: "view" },
  },
  { timestamps: true }
);

const CaregiverLink = mongoose.model<ICaregiverLink>("CaregiverLink", CaregiverLinkSchema);
export default CaregiverLink;
