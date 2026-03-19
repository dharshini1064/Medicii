import mongoose, { Schema, Document } from "mongoose";

export interface ISchedule extends Document {
  medicationId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  timeOfDay: string; // "08:00"
  daysOfWeek: number[]; // [0, 1, 2, 3, 4, 5, 6] for Sun-Sat
  startDate: Date;
  endDate?: Date;
}

const ScheduleSchema = new Schema<ISchedule>(
  {
    medicationId: { type: Schema.Types.ObjectId, ref: "Medication", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    timeOfDay: { type: String, required: true },
    daysOfWeek: [{ type: Number, required: true }],
    startDate: { type: Date, required: true },
    endDate: { type: Date },
  },
  { timestamps: true }
);

const Schedule = mongoose.model<ISchedule>("Schedule", ScheduleSchema);
export default Schedule;
