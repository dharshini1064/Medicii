import mongoose, { Schema, Document } from "mongoose";

export type LogStatus = "taken" | "missed" | "skipped" | "pending";

export interface IIntakeLog extends Document {
  scheduleId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  dueAt: Date;
  loggedAt?: Date;
  status: LogStatus;
  source: string; // "automated" | "manual"
}

const IntakeLogSchema = new Schema<IIntakeLog>(
  {
    scheduleId: { type: Schema.Types.ObjectId, ref: "Schedule", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    dueAt: { type: Date, required: true },
    loggedAt: { type: Date },
    status: {
      type: String,
      enum: ["taken", "missed", "skipped", "pending"],
      required: true,
      default: "pending",
    },
    source: { type: String, required: true },
  },
  { timestamps: true }
);

const IntakeLog = mongoose.model<IIntakeLog>("IntakeLog", IntakeLogSchema);
export default IntakeLog;
