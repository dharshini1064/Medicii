import { Request, Response } from "express";
import { AIService } from "../services/AIService";
import Medication from "../models/Medication";
import Schedule from "../models/Schedule";

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

      // Only after approval: save medications, schedules, and create reminders
      for (const item of draftSchedule) {
        const medName = item.medicine || item.name || "Unknown";

        // 1. Create medication OR update existing
        const medication = await Medication.findOneAndUpdate(
          { name: medName, userId },
          {
            name: medName,
            dosage: item.dosage || "As prescribed",
            unit: item.unit || "mg",
            frequency: item.frequency || "Daily",
            mealTiming: item.mealTiming || "Anytime",
            userId,
            isActive: true,
          },
          { upsert: true, new: true }
        );

        // 2. Create schedule
        const newSchedule = new Schedule({
          medicationId: medication._id,
          userId,
          timeOfDay: item.timeOfDay || "08:00",
          daysOfWeek: item.daysOfWeek || [0, 1, 2, 3, 4, 5, 6],
          startDate: new Date(),
        });

        await newSchedule.save();
      }

      res.status(201).json({ message: "✅ AI suggested schedule approved and saved!" });
    } catch (error) {
      res.status(500).json({ message: "Error approving schedule", error });
    }
  }
}
