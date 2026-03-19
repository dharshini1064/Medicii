import express from "express";
import { AIScheduleController } from "../controllers/AIScheduleController";

const router = express.Router();
const aiScheduleController = new AIScheduleController();

router.post("/schedule", aiScheduleController.generate);
router.post("/schedule/approve", aiScheduleController.approve);

export default router;
