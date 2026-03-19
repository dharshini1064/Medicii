import cron from "node-cron";
import Schedule from "../models/Schedule";
import IntakeLog from "../models/IntakeLog";
import User from "../models/User";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const initReminderJob = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const currentTime = now.toTimeString().substring(0, 5); // "HH:MM"
    const currentDay = now.getDay();

    try {
      // 1. Find schedules matching current time and day
      const schedules = await Schedule.find({
        timeOfDay: currentTime,
        daysOfWeek: currentDay,
      }).populate("medicationId");

      for (const schedule of schedules) {
        // Create a pending intake log
        const log = new IntakeLog({
          scheduleId: schedule._id,
          userId: schedule.userId,
          dueAt: now,
          status: "pending",
          source: "automated",
        });
        await log.save();

        // 3. Trigger initial notification (Email)
        const user = await User.findById(schedule.userId);
        if (user) {
          await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: user.email,
            subject: "💊 Medication Reminder",
            text: `Hi ${user.name}, it's time to take your medication: ${ (schedule.medicationId as any).name }.`,
          });
        }
      }

      // AUTO-MISS LOGIC REMOVED:
      // Allow user to mark doses taken even if they are late.
      /*
      const thirtyMinsAgo = new Date(Date.now() - 30 * 60 * 1000);
      await IntakeLog.updateMany(
        {
          status: "pending",
          dueAt: { $lte: thirtyMinsAgo },
        },
        { status: "missed" }
      );
      */

    } catch (error) {
      console.error("Error in reminder job:", error);
    }
  });
};
