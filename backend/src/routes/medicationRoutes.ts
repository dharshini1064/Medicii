import express from "express";
import { MedicationController } from "../controllers/MedicationController";

const router = express.Router();
const medicationController = new MedicationController();

router.get("/", medicationController.listForUser);
router.post("/", medicationController.create);
router.get("/:id", medicationController.getOne);
router.put("/:id", medicationController.update);
router.delete("/:id", medicationController.delete);

export default router;
