import { Request, Response } from "express";
import Medication from "../models/Medication";
import Schedule from "../models/Schedule";
import IntakeLog from "../models/IntakeLog";
import mongoose from "mongoose";

export class MedicationController {
  async listForUser(req: Request, res: Response) {
    try {
      const { userId } = req.query;
      if (!userId) return res.status(400).json({ message: "userId is required" });
      const uId = new mongoose.Types.ObjectId(userId as string);
      const medications = await Medication.find({ userId: uId });
      res.json(medications);
    } catch (error) { res.status(500).json({ message: "Error listing medications", error }); }
  }

  async create(req: Request, res: Response) {
    try {
      const { userId, name, dosage, unit, frequency, time, mealTiming, notes } = req.body;
      const uId = new mongoose.Types.ObjectId(userId as string);
      
      // 1. Save Medication 
      const medication = new Medication({
        userId: uId, name, dosage, unit, frequency, mealTiming: mealTiming || "After meal", notes, interactions: []
      });
      await medication.save();

      // 2. Create Schedule
      const schedule = new Schedule({
        medicationId: medication._id,
        userId: uId,
        timeOfDay: time || "08:00",
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        startDate: new Date(),
        active: true
      });
      await schedule.save();

      // 3. Generate Today's Tracking Marker
      const timeParts = (time || "08:00").split(":");
      const dueAt = new Date();
      dueAt.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

      const log = new IntakeLog({
        userId: uId,
        scheduleId: schedule._id,
        status: "pending",
        dueAt: dueAt,
        source: "manual"
      });
      await log.save();

      res.status(201).json({ medication, schedule, log });
    } catch (error) {
      console.error("Critical Mongoose Error:", error);
      res.status(500).json({ message: "Database rejected the save. Check User ID format.", error });
    }
  }

  async delete(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const mId = new mongoose.Types.ObjectId(id);
      const schedule = await Schedule.findOne({ medicationId: mId });
      if (schedule) {
        await IntakeLog.deleteMany({ scheduleId: schedule._id });
        await schedule.deleteOne();
      }
      await Medication.findByIdAndDelete(mId);
      res.status(204).send();
    } catch (error) { res.status(500).json({ message: "Error deleting medication", error }); }
  }

  async getOne(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const medication = await Medication.findById(id);
      res.json(medication);
    } catch (error) { res.status(500).json({ error }); }
  }

  async update(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const updates = req.body;
      const mId = new mongoose.Types.ObjectId(id);

      // 1. Update Medication
      const medication = await Medication.findByIdAndUpdate(mId, updates, { new: true });

      // 2. Sync Schedule if status changed
      if (updates.isActive !== undefined) {
         await Schedule.updateOne({ medicationId: mId }, { active: updates.isActive });
      }

      res.json(medication);
    } catch (error) { 
      console.error("Update error:", error);
      res.status(500).json({ message: "Error updating medication", error }); 
    }
  }
}
