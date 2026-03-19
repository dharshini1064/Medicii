import express from "express";
import { AIScheduleController } from "../controllers/AIScheduleController";

const router = express.Router();
const aiScheduleController = new AIScheduleController();

router.post("/schedule", (req, res) => aiScheduleController.generate(req, res));
router.post("/schedule/approve", (req, res) => aiScheduleController.approve(req, res));

export default router;
