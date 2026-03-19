import { Request, Response } from "express";
import { AIService } from "../services/AIService";
import Medication from "../models/Medication";
import Schedule from "../models/Schedule";
import IntakeLog from "../models/IntakeLog";
import mongoose from "mongoose";

const aiService = new AIService();

export class AIScheduleController {
  async generate(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ message: "Prompt is required" });

      const scheduleData = await aiService.generateSchedule(prompt);
      res.json(scheduleData);
    } catch (error) {
      res.status(500).json({ message: "Error generating schedule", error });
    }
  }

  async approve(req: Request, res: Response) {
    try {
      const { draftSchedule, userId } = req.body;
      if (!draftSchedule || !userId) return res.status(400).json({ message: "Missing required data" });

      const uId = new mongoose.Types.ObjectId(userId as string);

      for (const item of draftSchedule) {
        const medName = item.medicine || item.name || "Unknown";

        // 1. Create or update medication
        const medication = await Medication.findOneAndUpdate(
          { name: medName, userId: uId },
          {
            name: medName,
            dosage: item.dosage || "As prescribed",
            unit: item.unit || "mg",
            frequency: item.frequency || "Daily",
            mealTiming: item.mealTiming || "After meal",
            userId: uId,
          },
          { upsert: true, new: true }
        );

        // 2. Create the schedule
        const schedule = new Schedule({
          medicationId: medication._id,
          userId: uId,
          timeOfDay: item.timeOfDay || "08:00",
          daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
          startDate: new Date(),
          active: true
        });
        await schedule.save();

        // 3. Create THE TRACKING MARKER (IntakeLog)
        const timeParts = (item.timeOfDay || "08:00").split(":");
        const dueAt = new Date();
        dueAt.setHours(parseInt(timeParts[0]), parseInt(timeParts[1]), 0, 0);

        const log = new IntakeLog({
          userId: uId,
          scheduleId: schedule._id,
          dueAt: dueAt,
          status: "pending",
          source: "ai"
        });
        await log.save();
      }

      res.status(201).json({ message: "✅ AI suggested schedule approved, saved, and ready for tracking!" });
    } catch (error) {
      console.error("AI Approval Validation Error:", error);
      res.status(500).json({ message: "Database rejected AI save. Check required fields.", error });
    }
  }
}
